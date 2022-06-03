import { insertFrameBox } from "./insert-frame-box.js"
import insertVideoPlayer from "./insert-video-player.js"
import { showBuildingPredicateAndPopulateBoundingBoxOption } from "./show-building-predicate-menu.js"

const SAMPLE_FRAME_MOCK = [10, 29, 69]

export const videoNameSet = new Set()
export const objectNumberMapping = new Map()

const fetchDataBtn = document.getElementById("fetch-data-btn");
fetchDataBtn.addEventListener("click", async () => {
  const videoNameAndFramedata = await fetchData()
  console.log("fetched data: ", videoNameAndFramedata)
  insertFrameBox(videoNameAndFramedata)
  insertVideoPlayer(Array.from(videoNameSet))

  console.log('here, after insert frameboxes and video player')
  showBuildingPredicateAndPopulateBoundingBoxOption()
})

async function fetchData() {
  objectNumberMapping.clear()
   try {
    const videoDataResponse = await fetch('/fetch-video')
    const videoDataResponseJson = await videoDataResponse.json()
    console.log("video data response: ", videoDataResponseJson)

    // sort by frame number and only pick one video
    const processedVideoDataResponse = videoDataResponseJson.filter((video) => {
      return video.video === videoDataResponseJson[0].video
    }).sort((a, b) => {
      return a.frame - b.frame
    })

    for(let i = 0; i < processedVideoDataResponse.length; i++) {
      const videoName = processedVideoDataResponse[i].video
      const frameNum = processedVideoDataResponse[i].frame
      const videoId = processedVideoDataResponse[i].video.charAt(videoName.length - 5)
      const boundingBoxDataResponse = await fetch(`/box/${videoId}/${frameNum}`)
      let boundingBoxDataResponseJson = await boundingBoxDataResponse.json()
      boundingBoxDataResponseJson = boundingBoxDataResponseJson.replaceAll(`'`, `"`)
      boundingBoxDataResponseJson = JSON.parse(boundingBoxDataResponseJson)
      processedVideoDataResponse[i]["bounding_box_data"] = boundingBoxDataResponseJson
    }



    return processedVideoDataResponse 
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

//   const annotationResult = Array.from(VIDEO_AND_FRAME_MOCK_DATA);
//   const selectionEles = document.getElementsByClassName("binary-selection");
//   Array.from(selectionEles).forEach((e, key) => {
//     annotationResult[key]["binary"] = e.value;
//   })
//   console.log(annotationResult);
// })

// const getVideoSegmentBtn = document.getElementById("get-video-segment-btn");
// getVideoSegmentBtn.addEventListener("click", async () => {
//   const time1 = toTime(24, video)
//   const time2 = toTime(54, video)

//   const getVideoSegmentResponse = await fetch(`/extract-segment/0/${time1}/${time2}`)
//   console.log(getVideoSegmentResponse)
// })
