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
    for(let i = 0; i < videoDataResponseJson.length; i++) {
      const videoName = videoDataResponseJson[i].video
      const frameNum = videoDataResponseJson[i].frame
      const videoId = videoDataResponseJson[i].video.charAt(videoName.length - 5)
      const boundingBoxDataResponse = await fetch(`/box/${videoId}/${frameNum}`)
      let boundingBoxDataResponseJson = await boundingBoxDataResponse.json()
      boundingBoxDataResponseJson = boundingBoxDataResponseJson.replaceAll(`'`, `"`)
      boundingBoxDataResponseJson = JSON.parse(boundingBoxDataResponseJson)
      videoDataResponseJson[i]["bounding_box_data"] = boundingBoxDataResponseJson
    }
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
    const frameBoxContainer = createFrameBox(data.video, data.frame, data.bounding_box_data);
    frameBoxOuterContainer.appendChild(frameBoxContainer);
  })
}

function drawImageByFrame(videoName, frameNumber, bounding_box_data) {
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
    bounding_box_data.forEach(box_data => {
      console.log("box data: ", box_data)
      const coord = {
        topLeft: {
          x: box_data.lt[0],
          y: box_data.lt[1]
        },
        bottomRight: {
          x: box_data.rb[0],
          y: box_data.rb[1]
        }
      }
      
      console.log("coord data: ", coord)
      drawBoundingBox(coord, ctx, box_data.color)
    })
  })

  // handle seeking forward 
  const SMPTE = videoFrame.toSMPTE(frameNumber);
  const seekTime = ((videoFrame.toMilliseconds(SMPTE) / 1000) + 0.001);
  video.currentTime = seekTime
  return canvas
}

const COORD_PLACEHOLDER = {
  topLeft: {
    x: 200,
    y: 200
  },
  bottomRight: {
    x: 250,
    y: 250
  }
}

const COLOR_PLACEHOLDER = '#ffff24'

function drawBoundingBox(coords, canvasCtx, color) {
 const processedCoords = processCoords(coords)
 console.log("processed coords: ", processedCoords)

 canvasCtx.lineWidth = 2;
 canvasCtx.strokeStyle = color;
 canvasCtx.beginPath()
 canvasCtx.moveTo(coords.topLeft.x, coords.topLeft.y)
 canvasCtx.lineTo(coords.topRight.x, coords.topRight.y)
 canvasCtx.stroke();
 canvasCtx.lineTo(coords.bottomRight.x, coords.bottomRight.y)
 canvasCtx.stroke();
 canvasCtx.lineTo(coords.bottomLeft.x, coords.bottomLeft.y)
 canvasCtx.stroke();
 canvasCtx.lineTo(coords.topLeft.x, coords.topLeft.y)
 canvasCtx.stroke();
}


function processCoords(coords) {
  const topRight = {
    x: coords.bottomRight.x,
    y: coords.topLeft.y
  }

  const bottomLeft = {
    x: coords.topLeft.x,
    y: coords.bottomRight.y
  }
  coords.topRight = topRight
  coords.bottomLeft = bottomLeft
  return coords
}

function createFrameBox(videoId, frameNumber, boundingBoxData) {
  const frameBoxContainer = document.createElement('div');
  frameBoxContainer.setAttribute("class", "frame-box-container")
  
  const frameBoxHeader = document.createElement("h1");
  frameBoxHeader.setAttribute("class", "frame-box-header");
  frameBoxHeader.innerText = "Video " + videoId + ", Frame " + frameNumber;

  // const frameImg = document.createElement("img");
  // frameImg.setAttribute("src", "static/frame-data" + "/" + videoId + ".png");
  // frameImg.setAttribute("alt", "video frame");

  const frameImg = drawImageByFrame(videoId, frameNumber, boundingBoxData)
  
  const annotationToolsContainer = document.createElement('div');
  annotationToolsContainer.setAttribute("class", "annotation-tools-container");

  const annotationHeader = document.createElement("h1");
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

const getVideoSegmentBtn = document.getElementById("get-video-segment-btn");
getVideoSegmentBtn.addEventListener("click", async () => {
  const time1 = toTime(24, video)
  const time2 = toTime(54, video)

  const getVideoSegmentResponse = await fetch(`/extract-segment/0/${time1}/${time2}`)
  console.log(getVideoSegmentResponse)
})

const toTime = (frames, video) =>  {
 var time = (typeof frames !== 'number' ? video.currentTime : frames), frameRate = 24;
 var dt = (new Date()), format = 'hh:mm:ss' + (typeof frames === 'number' ? ':ff' : '');
 dt.setHours(0); dt.setMinutes(0); dt.setSeconds(0); dt.setMilliseconds(time * 1000);
 function wrap(n) { return ((n < 10) ? '0' + n : n); }
 return format.replace(/hh|mm|ss|ff/g, function(format) {
  switch (format) {
   case "hh": return wrap(dt.getHours() < 13 ? dt.getHours() : (dt.getHours() - 12));
   case "mm": return wrap(dt.getMinutes());
   case "ss": return wrap(dt.getSeconds());
   case "ff": return wrap(Math.floor(((time % 1) * frameRate)));
  }
 });
};