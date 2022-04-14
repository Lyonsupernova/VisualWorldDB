import {VideoFrame} from "./VideoFrame.js"

// const FRAMES = [10, 20, 50]

// var tupleList = [("video-1", 10), ("video-3", 40)]
// // [(v1,10),(V2, 9), (V1, 5)]
// let container = document.getElementById("capture-results")
// let captureBtn = document.getElementById('capture-btn')

// var video = new VideoFrame({id: "video"})
// var videoEle = document.getElementById('video');
// //videoEle.currentFrame = 0; 

// captureBtn.addEventListener('click', () => {
//   seekToFrame()
// })

// videoEle.addEventListener("seeked", () => {
//   capture(container)
//   seekToFrame()
// })

// function seekToFrame() {
//   if (FRAMES.length > 0) {
//     video.seekTo({frame: FRAMES.shift()})
//   }
// }

// function capture(container) {
//   var canvas = document.createElement('canvas');  
//   canvas.width = videoEle.videoWidth; // 480
//   canvas.height = videoEle.videoHeight; // 320 
//   console.log(videoEle.videoWidth)
//   console.log(videoEle.videoHeight)

//   /** Code to merge image **/
//   /** For instance, if I want to merge a play image on center of existing image **/
//   canvas.getContext('2d').drawImage(videoEle, 0, 0, videoEle.videoWidth, videoEle.videoHeight);
//   container.appendChild(canvas)
//   /** End **/
// }

const VIDEO_FILE_DIRECTORY = './data/video_00000-01000/'
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

  const VIDEO_NAME_DATA = [
    {video: "v1", name: "video_01000.mp4"}, 
    {video: "v2", name: "video_01001.mp4"},
    {video: "v3", name: "video_01002.mp4"},
    {video: "v4", name: "video_01003.mp4"}]

async function fetchData() {
   try {
    //fetch data
   } catch (err) {
     console.log(err)
   }
}

function insertFrameBox(videoFrameData) {
  const frameBoxOuterContainer = document.getElementById("frame-box-outer-container");
  frameBoxOuterContainer.innerHTML = "";

  videoFrameData.forEach(data => {
    const frameBoxContainer = createFrameBox(data.video, data.frame);
    frameBoxOuterContainer.appendChild(frameBoxContainer);
  })

}

function createFrameBox(videoId, frameNumber) {
  const frameBoxContainer = document.createElement('div');
  frameBoxContainer.setAttribute("class", "frame-box-container")
  
  const frameBoxHeader = document.createElement("h1");
  frameBoxHeader.setAttribute("class", "frame-box-header");
  frameBoxHeader.innerText = "Video " + videoId + ", Frame " + frameNumber;

  const frameImg = document.createElement("img");
  frameImg.setAttribute("src", "./frame-data" + "/" + videoId + ".png");
  frameImg.setAttribute("alt", "video frame");

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
    videoEle.setAttribute("src", VIDEO_FILE_DIRECTORY + data.name);
    videoEle.setAttribute("class", "video-player");
    videoEle.setAttribute("controls", true);
    videoContainer.appendChild(videoEle);
  })
}

const fetchDataBtn = document.getElementById("fetch-data-btn");
fetchDataBtn.addEventListener("click", () => {
  fetchData()
  insertFrameBox(VIDEO_AND_FRAME_MOCK_DATA)
  insertVideoPlayer(VIDEO_NAME_DATA)
})

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


