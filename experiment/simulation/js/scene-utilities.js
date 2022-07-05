import { info, stagewiseMarks} from "./main.js";
import { allStudentsSitDown } from "./students.js";
import { renderGreeting, renderEvaluationQuestion, renderLessonQuestion, renderTeacherDialog } from "./render.js";
import { showStage, setCurrentStage, updateStageProgress } from "./timeline.js";

// Scene Utilities
let marks = 0;
let cur_stage = 0;
let cur_type = "";
let max_marks = {}


// click on next button to move to next stage
const nextButton = document.getElementById('next-button');
nextButton.addEventListener('click', () => {
    nextScene();
    nextButton.classList.add('hidden');
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
export const startSimulation = (story,marks_dict) => {
    cur_stage = 0;
    const scene = story[window.currentScene];
    max_marks = marks_dict;
    const cur_type = scene.type;
    // make all students sit down
    allStudentsSitDown();
    if (scene.type === 'evaluation-question') {
        renderEvaluationQuestion(scene);
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
    const stageType = info[window.currentScene - 1].type;
    if(stageType in stagewiseMarks)
        stagewiseMarks[stageType] += marks;
    marks = 0;
    moveToStage(window.currentScene);
}

// 8. Move to a particular stage
export const moveToStage = (stage) => {
    // if (window.currentScene !== 0) {
    //     showStage();
    // }
    if (stage < info.length) {
        const scene = info[stage];
        const new_stage = scene.stage_no;
        // console.log(cur_stage);
        if(cur_type !== "teacher-dialog")
            updateStageProgress(cur_stage+1);

        if (new_stage !== cur_stage) {
            showStage(new_stage);
            setCurrentStage(new_stage);
            cur_stage = new_stage;
        }
        if(stage === info.length - 1) {
            showStage(cur_stage + 1);
        }
        cur_type = scene.type;


        // make all students sit down
        allStudentsSitDown();
        if (scene.type === 'evaluation-question') {
            renderEvaluationQuestion(scene);
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
    else {
        let finalMarks = 0;
        let finalMaxMarks = 0;
        for (let key in stagewiseMarks) {
            finalMarks += stagewiseMarks[key];
            finalMaxMarks += max_marks[key];
        }
        stagewiseMarks['Total'] = finalMarks;
        max_marks['Total'] = finalMaxMarks;
        console.log(stagewiseMarks);
        document.getElementById('teachers-box').innerHTML = `<div class="message-box arrow-bottom">You have completed the quiz. Your score is ${finalMarks}</div>`;
        generateScorecard();
        // downloadObjectAsJson(replayJSON, 'replay');
    }
}



const generateScorecard = () => {
    const sectionNames = {
        "greeting": "Greeting",
        "lesson-question": "Lesson Question",
        "teacher-dialog": "Teacher Dialog",
        "evaluation-question": "Evaluation Question",
        "Total": "Total"
    }


    const table = `<div class="v-instruction-title has-text-centered mb-5">Results</div>
            <div class="v-table-wrap">
                <table class="table is-bordered is-fullwidth v-table-primary">
                <thead>
                    <tr>
                    <th>SNo.</th>
                    <th>Section Name</th>
                    <th>Marks obtained</th>
                    <th>Maximum marks</th>
                    </tr>
                </thead>
                <tbody id="scorecard-body">
                </tbody>
                </table>
            </div>`
    document.getElementById('dialog-box').innerHTML = table;
    let num = 1;
    for (let key in stagewiseMarks) {
        if (max_marks[key] !== 0) {
            const row = `<tr>
            <th>${num}</th>
            <th>${sectionNames[key]}</th>
            <td>${stagewiseMarks[key]}</td>
            <td>${max_marks[key]}</td>
        </tr>`
            document.getElementById('scorecard-body').innerHTML += row;
            num++;
        }
    }
    const modal = document.getElementsByClassName('modal')[0];
    modal.classList.toggle('show-modal');
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