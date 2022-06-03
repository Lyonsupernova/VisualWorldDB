import { VIDEO_FILE_DIRECTORY } from "./utils.js";

export default function insertVideoPlayer(videoNameData) {
    const videoContainer = document.getElementById("offcanvas-body")
    videoContainer.innerHTML = "";
    videoNameData.forEach(data => {
      const videoEle = document.createElement("video")
      videoEle.setAttribute("src", VIDEO_FILE_DIRECTORY +  data);
      videoEle.setAttribute("class", "video-player");
      videoEle.setAttribute("controls", true);
      videoContainer.appendChild(videoEle);
    })

  console.log('here, finish insert video player')
  }
  