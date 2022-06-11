import { objectNumberMapping } from "./index.js"

export default function createAnnotationBlock(frameNum) {
    const annotatioOptions = ['far', 'near']

    const annotationContainer = document.createElement('div')
    annotationContainer.setAttribute('class', `anno-block-container frame-${frameNum}`)
    annotationContainer.setAttribute('frame-num', `${frameNum}`)
    const selectPredicateHeading = document.createElement('h7')
    selectPredicateHeading.innerText = 'Select Predicate'

    const predicateSelect = document.createElement('select')
    predicateSelect.setAttribute('class', 'select-predicate')

    const predicateOptionText = "Relationship"
    const predicateOption = document.createElement("option")
    predicateOption.innerText = predicateOptionText;
    predicateOption.setAttribute('value', predicateOptionText)
    predicateSelect.appendChild(predicateOption)

    const object1SelectContainer = document.createElement('div')
    const object1SelectHeading = document.createElement('h7')
    object1SelectHeading.innerText = 'Object #1'
    const object1Select = document.createElement('select')
    object1Select.setAttribute('class', `object-1-select frame-${frameNum}`)

    Array.from(objectNumberMapping.keys()).map(objectID => {
        let option = document.createElement('option')
        option.value = objectID
        option.innerText = objectID
        object1Select.appendChild(option);
    })
    object1SelectContainer.appendChild(object1SelectHeading)
    object1SelectContainer.appendChild(object1Select)


    const object2SelectContainer = document.createElement('div')
    const object2SelectHeading = document.createElement('h7')
    object2SelectHeading.innerText = 'Object #2'
    const object2Select = document.createElement('select')
    object2Select.setAttribute('class', `object-2-select frame-${frameNum}`)
    Array.from(objectNumberMapping.keys()).map(objectID => {
        let option = document.createElement('option')
        option.value = objectID
        option.innerText = objectID
        object2Select.appendChild(option);
    })
    object2SelectContainer.appendChild(object2SelectHeading)
    object2SelectContainer.appendChild(object2Select)

    const AnnotationSelectContainer = document.createElement('div')
    const AnnotationSelectHeading = document.createElement('h7')
    AnnotationSelectHeading.innerText = 'Annotation'
    const annotationSelect = document.createElement('select')
    annotationSelect.setAttribute('class', `annotation-select frame-${frameNum}`)
    annotatioOptions.forEach(option => {
        const optionEle = document.createElement('option')
        optionEle.innerText = option
        optionEle.setAttribute('value', option)
        annotationSelect.appendChild(optionEle)
    })

    AnnotationSelectContainer.appendChild(AnnotationSelectHeading)
    AnnotationSelectContainer.appendChild(annotationSelect)

    annotationContainer.appendChild(selectPredicateHeading)
    annotationContainer.appendChild(predicateSelect)
    annotationContainer.appendChild(object1SelectContainer)
    annotationContainer.appendChild(object2SelectContainer)
    annotationContainer.appendChild(AnnotationSelectContainer)

    return annotationContainer

}