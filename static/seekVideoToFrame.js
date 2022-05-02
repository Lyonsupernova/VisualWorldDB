const FRAMES = [10, 20, 50]

var tupleList = [("video-1", 10), ("video-3", 40)]
// [(v1,10),(V2, 9), (V1, 5)]
let container = document.getElementById("capture-results")
let captureBtn = document.getElementById('capture-btn')

var videoFrame = new VideoFrame({id: "video"})
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
    videoFrame.seekTo({frame: FRAMES.shift()})
  }
}

function capture(container) {
  var canvas = document.createElement('canvas');  
  canvas.width = videoEle.videoWidth; // 480
  canvas.height = videoEle.videoHeight; // 320 
  console.log(videoEle.videoWidth)
  console.log(videoEle.videoHeight)
}
