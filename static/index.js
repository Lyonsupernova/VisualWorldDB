import {VideoFrame} from "./VideoFrame.js"

const VIDEO_FILE_DIRECTORY = './static/video/'
const VIDEO_AND_FRAME_MOCK_DATA = [
  {video: "v1", frame: 23}, 
  {video: "v3", frame: 19},
  {video: "v1", frame: 3},
  {video: "v4", frame: 34},
  {video: "v2", frame: 184}, 
  {video: "v3", frame: 34}, 
  {video: "v1", frame: 93}, 
  {video: "v4", frame: 32}, 
  {video: "v2", frame: 79}]

const videoNameSet = new Set()

const rectangles = [
  {topLeft: 74, bottomRight: 66.89999389648438, width: 80.5, height: 71}
];

async function fetchData() {
   try {
    const videoDataResponse = await fetch('/fetch-video')
    const videoDataResponseJson = await videoDataResponse.json()
    console.log("video data response: ", videoDataResponseJson)
    return videoDataResponseJson
   } catch (err) {
     console.log(err)
   }
}

function insertFrameBox(videoFrameData) {
  const frameBoxOuterContainer = document.getElementById("frame-box-outer-container");
  frameBoxOuterContainer.innerHTML = "";

  videoFrameData.forEach(data => {
    videoNameSet.add(data.video)
    const frameBoxContainer = createFrameBox(data.video, data.frame);
    frameBoxOuterContainer.appendChild(frameBoxContainer);
  })
}

function drawImageByFrame(videoName, frameNumber, parent) {
  console.log("frame #: ", frameNumber)
  const video = document.createElement('video')
  video.setAttribute('src', VIDEO_FILE_DIRECTORY + videoName)
  video.setAttribute('id', "video-box")
  var videoFrame = new VideoFrame() // no param passed here, since we don't need to manipulate video elemtn in VideoFrame object. 
  var canvas = document.createElement('canvas');  
  
  video.addEventListener("seeked", () => {
    canvas.width = video.videoWidth; // 480
    canvas.height = video.videoHeight; // 320 
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  })

  // handle seeking forward 
  const SMPTE = videoFrame.toSMPTE(frameNumber);
  const seekTime = ((videoFrame.toMilliseconds(SMPTE) / 1000) + 0.001);
  video.currentTime = seekTime
  return canvas
}

function createFrameBox(videoId, frameNumber) {
  const frameBoxContainer = document.createElement('div');
  frameBoxContainer.setAttribute("class", "frame-box-container")
  
  const frameBoxHeader = document.createElement("h1");
  frameBoxHeader.setAttribute("class", "frame-box-header");
  frameBoxHeader.innerText = "Video " + videoId + ", Frame " + frameNumber;

  // const frameImg = document.createElement("img");
  // frameImg.setAttribute("src", "static/frame-data" + "/" + videoId + ".png");
  // frameImg.setAttribute("alt", "video frame");


  const frameImg = drawImageByFrame(videoId, frameNumber, frameBoxContainer)
  
  const annotationToolsContainer = document.createElement('div');
  annotationToolsContainer.setAttribute("class", "annotation-tools-container");

  const annotationHeader = document.createElement("h2");
  annotationHeader.setAttribute("class", "annotation-header");
  annotationHeader.innerText = "Annotation:";

  const positiveAndNegativeSelectionEle = document.createElement("select")
  positiveAndNegativeSelectionEle.setAttribute("id", "binary-selection");
  positiveAndNegativeSelectionEle.setAttribute("class", "binary-selection");

  const positiveOption = document.createElement("option")
  positiveOption.setAttribute("value", "positive")
  positiveOption.innerText = "Positive";

  const negativeOption = document.createElement("option")
  negativeOption.setAttribute("value", "negative")
  negativeOption.innerText = "Negative";

  positiveAndNegativeSelectionEle.appendChild(positiveOption);
  positiveAndNegativeSelectionEle.appendChild(negativeOption);

  annotationToolsContainer.appendChild(annotationHeader);
  annotationToolsContainer.appendChild(positiveAndNegativeSelectionEle);

  frameBoxContainer.appendChild(frameBoxHeader)
  frameBoxContainer.appendChild(frameImg)
  frameBoxContainer.appendChild(annotationToolsContainer)

  return frameBoxContainer;
}

function insertVideoPlayer(videoNameData) {
  const videoContainer = document.getElementById("offcanvas-body")
  videoContainer.innerHTML = "";
  videoNameData.forEach(data => {
    const videoEle = document.createElement("video")
    videoEle.setAttribute("src", VIDEO_FILE_DIRECTORY +  data);
    videoEle.setAttribute("class", "video-player");
    videoEle.setAttribute("controls", true);
    videoContainer.appendChild(videoEle);
  })
}


const submitAnnotationBtn = document.getElementById("submit-annotation-btn");
submitAnnotationBtn.addEventListener("click", () => {

  /*
    We do not want to iterate the annotation result array when adding every set of valeues for a given annotation attribute. 
    Solution: Since all attributes have a same length of result (becase our video data stays same) we can arbitrarily 
              pick one attrbute, do Array.forEach(ele, key), and use that key to access corrosponding value of other attribute. 

  */

  const annotationResult = Array.from(VIDEO_AND_FRAME_MOCK_DATA);
  const selectionEles = document.getElementsByClassName("binary-selection");
  Array.from(selectionEles).forEach((e, key) => {
    annotationResult[key]["binary"] = e.value;
  })
  console.log(annotationResult);
})


const fetchDataBtn = document.getElementById("fetch-data-btn");
fetchDataBtn.addEventListener("click", async () => {
  const videoNameAndFramedata = await fetchData()
  console.log("fetched data: ", videoNameAndFramedata)
  insertFrameBox(videoNameAndFramedata)
  insertVideoPlayer(Array.from(videoNameSet))
})

