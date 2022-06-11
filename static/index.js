import { insertFrameBox } from "./insert-frame-box.js"
import insertVideoPlayer from "./insert-video-player.js"
import { DATASET_OPTIONS, DATASET_TO_VIDEO_NAME, VIDEONAME_TO_ID } from "./utils.js"

const SAMPLE_FRAME_MOCK = [10, 29, 69]
let VIDEO_NAME = null;

export const videoNameSet = new Set()
export const objectNumberMapping = new Map()

populateDataSetSelection(DATASET_OPTIONS)
populateVideoSelection('dataset_1')

const fetchDataBtn = document.getElementById("fetch-data-btn");
fetchDataBtn.addEventListener("click", async () => {
  const videoNameAndFramedata = await fetchData()
  console.log("fetched data: ", videoNameAndFramedata)
  insertFrameBox(videoNameAndFramedata)
  insertVideoPlayer(Array.from(videoNameSet))
})

async function fetchData() {
  objectNumberMapping.clear()

  
  const datasetselectEle = document.getElementById("dataset-selection")
  const dataSetName = datasetselectEle.options[datasetselectEle.selectedIndex].value
  console.log('name: ', dataSetName)

  const videoSelectEle = document.getElementById("video-selection")
  const videoName_ = videoSelectEle.options[videoSelectEle.selectedIndex].value
  console.log('name: ', videoName_)


   try {
    const videoDataResponse = await fetch(`/fetch-video/${dataSetName}/${videoName_}`)
    const videoDataResponseJson = await videoDataResponse.json()
    console.log("video data response: ", videoDataResponseJson)
    const boundingBoxData = []
    VIDEO_NAME = videoName_
    const videoId = VIDEONAME_TO_ID.get(videoName_)
    for(let i = 0; i < videoDataResponseJson.frame_id.length; i++) {
      const frameNum = videoDataResponseJson.frame_id[i];
      // const videoId = processedVideoDataResponse[i].video.charAt(videoName.length - 5)
      const boundingBoxDataResponse = await fetch(`/box/${dataSetName}/${videoId}/${frameNum}`)
      let boundingBoxDataResponseJson = await boundingBoxDataResponse.json()
      boundingBoxDataResponseJson = boundingBoxDataResponseJson.replaceAll(`'`, `"`)
      boundingBoxDataResponseJson = JSON.parse(boundingBoxDataResponseJson)
      boundingBoxData[i] = boundingBoxDataResponseJson
    }

    videoDataResponseJson['bounding_box'] = boundingBoxData


    return videoDataResponseJson 
   } catch (err) {
     console.log(err)
   }
}

// const submitAnnotationBtn = document.getElementById("submit-annotation-btn");
// submitAnnotationBtn.addEventListener("click", () => {

//   /*
//     We do not want to iterate the annotation result array when adding every set of valeues for a given annotation attribute. 
//     Solution: Since all attributes have a same length of result (becase our video data stays same) we can arbitrarily 
//               pick one attrbute, do Array.forEach(ele, key), and use that key to access corrosponding value of other attribute. 

//   */


// const getVideoSegmentBtn = document.getElementById("get-video-segment-btn");
// getVideoSegmentBtn.addEventListener("click", async () => {
//   const time1 = toTime(24, video)
//   const time2 = toTime(54, video)

//   const getVideoSegmentResponse = await fetch(`/extract-segment/0/${time1}/${time2}`)
//   console.log(getVideoSegmentResponse)
// })

function populateDataSetSelection(options) {
  const dataSelectEle = document.getElementById('dataset-selection');
  dataSelectEle.addEventListener('change', event => {
    populateVideoSelection(event.target.value)
  })

  const optionsEles = options.map(name => {
    const optionsEle = document.createElement('option');
    optionsEle.innerText = name;
    optionsEle.setAttribute('value', name)
    return optionsEle
  })
  optionsEles.forEach(option => {
    dataSelectEle.appendChild(option)
  })

}

function populateVideoSelection(dataset) {
  
  const videoNames = DATASET_TO_VIDEO_NAME.get(dataset);

  const dataSelectEle = document.getElementById('video-selection');

  const optionsEles = videoNames.map(name => {
    const optionsEle = document.createElement('option');
    optionsEle.innerText = name;
    optionsEle.setAttribute('value', name)
    return optionsEle
  })
  optionsEles.forEach(option => {
    dataSelectEle.appendChild(option)
  })
}

const submitBtn = document.getElementById('submit-annotation-btn')
submitBtn.addEventListener('click', () => {
  let annotationResult = {
    video_id: VIDEO_NAME,
    annotation: {

    }
  }
  let annotationContainers = document.getElementsByClassName('anno-block-container')
  console.log(annotationContainers)
  Array.from(annotationContainers).forEach(container => {
    const frameNum = container.attributes.getNamedItem('frame-num').value
   
    let obj1 = container.getElementsByClassName('object-1-select')
    let obj1Value = Array.from(obj1)[0].value
    let obj2 = container.getElementsByClassName('object-2-select')
    let obj2Value = Array.from(obj2)[0].value
    let predicateEle = container.getElementsByClassName('select-predicate')
    let predicateValue = Array.from(predicateEle)[0].value

    let annotationEle = container.getElementsByClassName('annotation-select')
    let annotationVal = Array.from(annotationEle)[0].value
    console.log('obj1 value: ', obj1Value)
    console.log('obj2 value: ', obj2Value)
    console.log('pred value: ', predicateValue)
    console.log('anno value: ', annotationVal)

    let annotationObj = {
      predicate: predicateValue,
      object1: obj1Value,
      object2: obj2Value,
      annotation: annotationVal
    }

    if (annotationResult.annotation[frameNum] === undefined) {
      annotationResult.annotation[frameNum] = [];
    } 
    annotationResult.annotation[frameNum].push(annotationObj)

  })

  console.log(annotationResult)
})
