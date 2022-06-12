import { info, stagewiseMarks} from "./main.js";
import { allStudentsSitDown } from "./students.js";
import { renderGreeting, renderQuestion, renderLessonQuestion, renderTeacherDialog } from "./render.js";
import { showStage, setCurrentStage } from "./timeline.js";

// Scene Utilities
let marks = 0;


// click on next button to move to next stage
const nextButton = document.getElementById('next-button');
nextButton.addEventListener('click', () => {
    nextScene();
    nextButton.setAttribute('hidden', 'hidden');
});

// 1. Insert dialog cloud
export const insertDialogCloud = (text, left, top, id, width) => {
    const dialogBox = document.createElement('div');
    const pageWidth = document.documentElement.clientWidth;
    const boxWidth = pageWidth * 0.15;
    dialogBox.style.position = 'absolute';
    dialogBox.style.width = boxWidth + 'px';
    if (id === 'student-4' || id === 'student-7') {
        // get page width
        dialogBox.style.left = `${left - boxWidth}px`;
        dialogBox.className = 'box arrow-right';
    }
    else {
        left = left + width;
        dialogBox.style.left = left + 'px';
        dialogBox.className = 'box arrow-left';
    }
    dialogBox.style.top = top + 'px';
    dialogBox.innerHTML = text;
    document.body.appendChild(dialogBox);
}

// 2. Clear dialog cloud
export const clearDialogCloud = () => {
    const dialogBox = document.querySelectorAll('.box');
    // remove all dialog boxes
    dialogBox.forEach(box => {
        box.remove();
    });
}

// 3. Add message box in teachers box
export const addMessageBox = (text) => {
    const teachersBox = document.getElementById('teachers-box');
    const messageBox = `<div class="message-box arrow-bottom">${text}</div>`;
    teachersBox.innerHTML = messageBox;
}

// 4. Clear teachers box
export const clearTeachersBox = () => {
    const teachersBox = document.getElementById('teachers-box');
    teachersBox.innerHTML = '';
}

// 5. Evaluate option
export const evaluateOption = (id, options) => {

    for (let i = 0; i < options.length; i++) {
        if (options[i].id === id) {
            marks += options[i].marks;
            break;
        }
    }
}

// 6. Render first scene
export const startSimulation = (story) => {
    const scene = story[window.currentScene];
    // make all students sit down
    allStudentsSitDown();
    if (scene.type === 'question') {
        renderQuestion(scene);
    }
    else if (scene.type === 'greeting') {
        renderGreeting(scene);
    }
    else if (scene.type === 'lesson-question') {
        renderLessonQuestion(scene);
    }
    else if (scene.type === 'teacher-dialog') {
        renderTeacherDialog(scene);
    }

}

// 7. Move to next scene
const nextScene = () => {
    clearTeachersBox();
    clearDialogCloud();
    window.currentScene++;
    stagewiseMarks[window.currentScene - 1] = marks;
    marks = 0;
    moveToStage(window.currentScene);
}

// 8. Move to a particular stage
export const moveToStage = (stage) => {
    if (window.currentScene !== 0) {
        showStage();
    }
    if (stage < info.length) {
        const scene = info[stage];
        setCurrentStage(stage);
        // make all students sit down
        allStudentsSitDown();
        if (scene.type === 'question') {
            renderQuestion(scene);
        }
        else if(scene.type === 'greeting'){
            renderGreeting(scene);
        }
        else if(scene.type === 'lesson-question'){
            renderLessonQuestion(scene);
        }
        else if(scene.type === 'teacher-dialog'){
            renderTeacherDialog(scene);
        }

    }
    else {
        let finalMarks = 0;
        stagewiseMarks.forEach(mark => {
            finalMarks += mark;
        });
        console.log(stagewiseMarks);
        document.getElementById('teachers-box').innerHTML = `<div class="message-box arrow-bottom">You have completed the quiz. Your score is ${finalMarks}</div>`;
        // downloadObjectAsJson(replayJSON, 'replay');
    }
}

// 9. Feature for downloading JSON file
function downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}