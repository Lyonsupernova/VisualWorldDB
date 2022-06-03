import { objectNumberMapping } from "./index.js"

export function showBuildingPredicateAndPopulateBoundingBoxOption() {
    const buildPredicateSelection = document.getElementById('build-predicate')
    buildPredicateSelection.style.display = 'block'
  
    console.log("keys: ", Array.from(objectNumberMapping.keys()))
    const objectSelectionOptions = Array.from(objectNumberMapping.keys()).map(objectID => {
      let option = document.createElement('option')
      option.value = objectID
      option.innerText = objectID
      return option;
    })
  
    const objectOneSelect = document.getElementById('object-1-select');
    objectOneSelect.innerHTML = ""
    const objectTwoSelect = document.getElementById('object-2-select');
    objectTwoSelect.innerHTML = ""
    
    for (let i = 0; i < objectSelectionOptions.length; i++) {
        objectOneSelect.appendChild(objectSelectionOptions[i])
     }

     const optionCopy = Array.from(objectNumberMapping.keys()).map(objectID => {
       let option = document.createElement('option')
       option.value = objectID
       option.innerText = objectID
       return option;
     })
     for (let i = 0; i < optionCopy.length; i++) {
        objectTwoSelect.appendChild(optionCopy[i])
     }
  
    objectOneSelect.addEventListener('change', (event) => {
      console.log('selection changed!')
      const boxes = [...document.getElementsByClassName(event.target.value)]
      boxes.forEach(box => {
        box.classList.add('selected')
      })
    })

  
    objectTwoSelect.addEventListener('change', (event) => {
      console.log('selection changed!, id: ' + event.target.value)
      const boxes = [...document.getElementsByClassName(event.target.value)]
      console.log('boxes: ', boxes)
      boxes.forEach(box => {
        box.classList.add('selected')
      })
    })
  }
  