import {VideoFrame} from "./VideoFrame.js"

const FRAMES = [10, 20, 50]

var tupleList = [("video-1", 10), ("video-3", 40)]
// [(v1,10),(V2, 9), (V1, 5)]
let container = document.getElementById("capture-results")
let captureBtn = document.getElementById('capture-btn')

var video = new VideoFrame({id: "video"})
var videoEle = document.getElementById('video');
//videoEle.currentFrame = 0; 

captureBtn.addEventListener('click', () => {
  seekToFrame()
})

videoEle.addEventListener("seeked", () => {
  capture(container)
  seekToFrame()
})

function seekToFrame() {
  if (FRAMES.length > 0) {
    video.seekTo({frame: FRAMES.shift()})
  }
}

function capture(container) {
  var canvas = document.createElement('canvas');  
  canvas.width = videoEle.videoWidth;
  canvas.height = videoEle.videoHeight;

  /** Code to merge image **/
  /** For instance, if I want to merge a play image on center of existing image **/
  canvas.getContext('2d').drawImage(videoEle, 0, 0, videoEle.videoWidth, videoEle.videoHeight);
  container.appendChild(canvas)
  /** End **/
}

