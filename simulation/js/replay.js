// Needs to be refined and fixed.
// Will work on this once done with adding all scenes.

let info;
let replay;

fetch('./replay.json')
    .then(response => response.json())
    .then(data => {
        init(data);
    })
    .catch(error => console.log(error));


window.currentScene = 0;

let marks = 0;
let num_stages = 0;
const stagewiseMarks = [];



const init = (data) => {
    num_stages = data.data.num_stages;
    info = data.data.story;
    const story = data.data.story;
    // console.log(story);

    createTimeline(num_stages);
    for (let i = 0; i < num_stages; i++) {
        stagewiseMarks.push(0);
    }

    // const scene = story[window.currentScene];
    replay = makeReplay();
    runReplay();

}

const makeReplay = () => {
    let replay = [];
    const story = info;
    for(let i = 0; i < story.length; i++) {
        if(story[i].type === 'question') {
            replay.push(renderEvaluationQuestion,selectOption,askAnswer,showResponses,selectResponse,nextScene);
        }
    }

    return replay;

}

window.replaystage = 0;
const runReplay = () => {
    if (window.currentScene !== 0) {
        showStage();
    }
    console.log(replay);
    if(window.currentScene < info.length) {
        replay[window.replaystage]();
    }
    else {
        let finalMarks = 0;
        stagewiseMarks.forEach(mark => {
            finalMarks += mark;
        });
        console.log(stagewiseMarks);
        document.getElementById('teachers-box').innerHTML = `<div class="message-box arrow-bottom">You have completed the quiz. Your score is ${finalMarks}</div>`;
        
        const nextButton = document.getElementById('next-button');
        // delete next button
        nextButton.remove();

    }
    window.replaystage++;
}

document.getElementById('next-button').addEventListener('click', () => {
    runReplay();
});

    
    


const renderEvaluationQuestion = () => {
    setCurrentStage(window.currentScene);
    const scene = info[window.currentScene];
    const teachersBox = document.getElementById('teachers-box');
    teachersBox.innerHTML = '';
    scene.options.forEach(option => {
        const question = `<div id="option-${option.id}" class="option-card">${option.text}</div>`;
        teachersBox.innerHTML += question;
        // console.log(el);
    });


    // make all students sit down
    allStudentsSitDown();
    // const progressBar = document.getElementById('progress-bar');
    // progressBar.innerHTML = `Scene ${window.currentScene + 1}`;
}


const showStage = () => {
    const stage = document.getElementById(`stage-${window.currentScene}`);
    console.log(stage);
    const children = stage.children;
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (!child.classList.contains('is-filled')) {
            child.classList.add('is-filled');
        }
        if (child.classList.contains('is-in-progress')) {
            child.classList.remove('is-in-progress');
        }
    }
}

const setCurrentStage = (stage) => {
    const el = document.getElementById(`stage-${stage+1}`).getElementsByClassName('timeline-stage')[0];
    if(!el.classList.contains('is-in-progress')) {
        el.classList.add('is-in-progress');
    }
} 


const selectOption = () => {
    const scene = info[window.currentScene];
    const id = scene.option_selected;
    const text = document.getElementById(`option-${id}`).innerHTML;
    const messageBox = `<div class="message-box arrow-bottom">${text}</div>`
    const teachersBox = document.getElementById('teachers-box');
    teachersBox.innerHTML = messageBox;
    evaluateOption(id, scene.options);
}



const evaluateOption = (id, options) => {

    for (let i = 0; i < options.length; i++) {
        if (options[i].id === id) {
            marks += options[i].marks;
            break;
        }
    }


}


const askAnswer = () => {
    console.log('ask answer');
    const scene = info[window.currentScene];
    const id = scene.option_selected;
    const students = document.getElementsByClassName('student');
    // select random student
    const random = Math.floor(Math.random() * students.length);
    const student = students[random];
    student.className = 'student is-raising-hand';
    const answerText = scene.answerText;
    let answer = "aa";
    for (let i = 0; i < answerText.length; i++) {
        if (id == answerText[i].id) {
            answer = answerText[i].text;
            break;
        }

    }

    // get coordinates of top right corner of student
    const studentCoords = student.getBoundingClientRect();
    const top = studentCoords.top;
    const left = studentCoords.left;
    const width = studentCoords.width;
    insertDialogCloud(answer, left, top, student.id, width);
    // allStudentsSitDown();

}

const insertDialogCloud = (text, left, top, id, width) => {
    const dialogBox = document.createElement('div');
    const pageWidth = document.documentElement.clientWidth;
    const boxWidth = pageWidth * 0.15;
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

const allStudentsSitDown = () => {
    // make all students sit down
    const students = document.getElementsByClassName('student');
    for (let i = 0; i < students.length; i++) {
        students[i].className = 'student is-sitting';
    }
}

const showResponses = () => {
    const scene = info[window.currentScene];
    const teachersBox = document.getElementById('teachers-box');
    teachersBox.innerHTML = '';
    scene.responses.forEach(response => {
        const question = `<div id="option-${response.id}" class="option-card">${response.text}</div>`;
        teachersBox.innerHTML += question;
        // console.log(el);
    });
}

const selectResponse = () => {
    const scene = info[window.currentScene];
    const id = scene.response_selected;
    const text = document.getElementById(`option-${id}`).innerHTML;
    const messageBox = `<div class="message-box arrow-bottom">${text}</div>`
    const teachersBox = document.getElementById('teachers-box');
    teachersBox.innerHTML = messageBox;
    evaluateOption(id, scene.responses);
    allStudentsSitDown();
}

const clearDialogCloud = () => {
    const dialogBox = document.getElementsByClassName('box');
    for (let i = 0; i < dialogBox.length; i++) {
        dialogBox[i].remove();
    }
}


const nextScene = () => {
    clearDialogCloud();
    window.currentScene++;
    stagewiseMarks[window.currentScene - 1] = marks;
    marks = 0;
}

const moveToStage = (stage) => {
    
}


window.selectResponse = selectResponse;
window.selectOption = selectOption;