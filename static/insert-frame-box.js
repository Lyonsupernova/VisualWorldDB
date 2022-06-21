import { VideoFrame } from './VideoFrame.js'
import { drawBoundingBox } from "./bounding-box.js";
import { objectNumberMapping, videoNameSet } from "./index.js";
import { VIDEO_FILE_DIRECTORY } from "./utils.js";
import createAnnotationBlock from './create-annotation-block.js';

export function insertFrameBox(videoFrameData) {
    const frameBoxOuterContainer = document.getElementById("frame-box-outer-container");
    frameBoxOuterContainer.innerHTML = "";
  
    const videoName = videoFrameData.video_id
    videoNameSet.add(videoName)
    

    videoFrameData.bounding_box.forEach((box_data_arr, index)=> {
      box_data_arr.forEach(box_data => {
        const objectID = box_data.color + '-' + box_data.material + '-' + box_data.shape
        box_data['id'] = objectID;
        if(!objectNumberMapping.has(objectID)) {
          objectNumberMapping.set(objectID, objectNumberMapping.size + 1)
        }
      })

      const frameBoxContainer = createFrameBox(videoName, videoFrameData.frame_id[index], box_data_arr);
      frameBoxOuterContainer.appendChild(frameBoxContainer);
    })


  console.log('here, finish insert frame box')
  }

function createFrameBox(videoId, frameNumber, boundingBoxData) {
    const frameBoxContainer = document.createElement('div');
    frameBoxContainer.setAttribute("class", "frame-box-container")
    
    const frameBoxHeader = document.createElement("h1");
    frameBoxHeader.setAttribute("class", "frame-box-header");
    frameBoxHeader.innerText = "Video " + videoId + ", Frame " + frameNumber;


    const frameImg = drawImageByFrame(videoId, frameNumber, boundingBoxData)
    const boundBoxOptions = boundingBoxData.forEach(data => {
      const option = document.createElement('option')
    })

    createAnnotationBlock(frameBoxContainer, frameNumber)


    const addAnnotationBlockBtn = document.createElement('button')
    addAnnotationBlockBtn.setAttribute('class', 'btn btn-primary')
    addAnnotationBlockBtn.innerText = 'Add annotation'
    addAnnotationBlockBtn.addEventListener('click', (event) => {

    frameBoxContainer.appendChild(createAnnotationBlock(frameNumber))
    })
  
    frameBoxContainer.appendChild(frameBoxHeader)
    frameBoxContainer.appendChild(frameImg)
    frameBoxContainer.appendChild(addAnnotationBlockBtn)
  
    return frameBoxContainer;
}

function drawImageByFrame(videoName, frameNumber, bounding_box_data) {
    console.log("frame #: ", frameNumber)
    const video = document.createElement('video')
    video.setAttribute('src', VIDEO_FILE_DIRECTORY + videoName)
    video.setAttribute('id', "video-box")
  
    var videoFrame = new VideoFrame() // no param passed here, since we don't need to manipulate video elemtn in VideoFrame object. 
    const canvasContainer = document.createElement('div')
    canvasContainer.setAttribute('class', 'canvas-container')
    var canvas = document.createElement('canvas');  
    
    video.addEventListener("seeked", () => {
      canvas.width = video.videoWidth; // 480px
      canvas.height = video.videoHeight; // 320px 
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
  
      bounding_box_data.forEach(box_data => {
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
        
        drawBoundingBox(box_data.id, coord, box_data.color, canvasContainer)
      })
    })
  
    // handle seeking forward 
    const SMPTE = videoFrame.toSMPTE(frameNumber);
    const seekTime = ((videoFrame.toMilliseconds(SMPTE) / 1000) + 0.001);
    video.currentTime = seekTime
    canvasContainer.appendChild(canvas)
    return canvasContainer
}