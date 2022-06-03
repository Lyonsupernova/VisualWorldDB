
export function drawBoundingBox(id, coords, color, parent) {
    const processedCoords = processCoords(coords)
    
    const boundingBox = document.createElement('div')
    boundingBox.addEventListener('click', (event) => {
       boundingBox.classList.toggle('selected')
    })
   
    boundingBox.setAttribute('class', 'bounding-box ' + id);
    boundingBox.style.borderColor = color
    boundingBox.style.left = processedCoords.topLeft.x + "px"
    boundingBox.style.top = processedCoords.topLeft.y + "px"
    boundingBox.style.width = (processedCoords.topRight.x - processedCoords.topLeft.x) + "px"
    boundingBox.style.height = (processedCoords.bottomRight.y - processedCoords.topRight.y) + "px"
   
    parent.appendChild(boundingBox)
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
   