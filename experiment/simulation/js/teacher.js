import { info } from "./main.js";
import { addMessageBox, clearTeachersBox, evaluateOption } from "./scene-utilities.js";
import { allStudentsSitDown, checkIfAllStudentsSitting, askAnswerSingle } from "./students.js";

// Teachers Box features
const nextButton = document.getElementById('next-button');
// 1. Select a question from teachers box
const selectOption = (event) => {
    const scene = info[window.currentScene];
    const text = event.target.innerHTML;
    const id = parseInt(event.target.id.split('-')[1], 10);
    //replayJSON.data.story[window.currentScene].option_selected = id;
    addMessageBox(text);
    evaluateOption(id, scene.options);
    askAnswerSingle(scene);
}

// 2. Select a response from teachers box
const selectResponse = (event) => {
    const scene = info[window.currentScene];
    const text = event.target.innerHTML;
    const id = parseInt(event.target.id.split('-')[1], 10);
    //replayJSON.data.story[window.currentScene].response_selected = id;
    addMessageBox(text);
    evaluateOption(id, scene.responses);
    allStudentsSitDown();
    nextButton.classList.remove('hidden');
}

// 3. Display options in teachers box
export const showResponsesMultiple = (scene) => {
    const teachersBox = document.getElementById('teachers-box');
    clearTeachersBox();
    scene.responses.forEach(response => {
        const question = `<div id="option-${response.id}" class="option-card grow" onclick="selectResponse(event)">${response.text}</div>`;
        teachersBox.innerHTML += question;
        // console.log(el);
    });
    handleOptionCards();
}

// 4. Display single message/option in teachers box
export const displayTeacherMessage = (response) => {
    addMessageBox(response);
    if (checkIfAllStudentsSitting()) {
        nextButton.classList.remove('hidden');
    }
}

export const handleOptionCards = () => {
    const options = document.getElementsByClassName('option-card');
    for (let i = 0; i < options.length; i++) {
        options[i].addEventListener('mouseover', () => {
            if(document.getElementsByClassName('big-option-card').length !== 0) {
                return;
            }
            // for (let j = 0; j < options.length; j++) {
            //     if (j !== i) {
            //         options[j].setAttribute('hidden', 'hidden');
            //     }
            // }
            options[i].className = 'big-option-card';

            const bigBox = document.getElementsByClassName('big-option-card')[0];
            bigBox.addEventListener('mouseout', () => {
                for (let j = 0; j < options.length; j++) {
                    options[j].removeAttribute('hidden');
                }
                bigBox.className = 'option-card';
            });
        });
    }
}




window.selectResponse = selectResponse;
window.selectOption = selectOption;
