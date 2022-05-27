let info;

fetch('./data.json')
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

    const scene = story[window.currentScene];
    if (scene.type === 'question') {
        renderQuestion(scene);
    }

}


const renderQuestion = (scene) => {
    const teachersBox = document.getElementById('teachers-box');
    teachersBox.innerHTML = '';
    scene.options.forEach(option => {
        const question = `<div id="option-${option.id}" class="option-card" onclick="selectOption(event)">${option.text}</div>`;
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
    const children = stage.children;
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (!child.classList.contains('is-filled')) {
            child.classList.add('is-filled');
        }
    }
}


const selectOption = (event) => {
    const scene = info[window.currentScene];
    const text = event.target.innerHTML;
    const id = event.target.id.split('-')[1];
    const messageBox = `<div class="message-box arrow-bottom">${text}</div>`
    const teachersBox = document.getElementById('teachers-box');
    teachersBox.innerHTML = messageBox;
    evaluateOption(text, scene.options);
    askAnswer(id, scene);
}



const evaluateOption = (text, options) => {

    for (let i = 0; i < options.length; i++) {
        if (options[i].text === text) {
            marks += options[i].marks;
            break;
        }
    }


}


const askAnswer = (id, scene) => {
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
    student.onclick = () => {
        console.log(answer);
        // get coordinates of top right corner of student
        const studentCoords = student.getBoundingClientRect();
        const top = studentCoords.top;
        const left = studentCoords.left;
        const width = studentCoords.width;
        console.log(studentCoords);
        insertDialogCloud(answer, left, top, student.id, width);
        // allStudentsSitDown();
        showResponses(scene);
    }
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

const showResponses = (scene) => {
    const teachersBox = document.getElementById('teachers-box');
    teachersBox.innerHTML = '';
    scene.responses.forEach(response => {
        const question = `<div id="option-${response.id}" class="option-card" onclick="selectResponse(event)">${response.text}</div>`;
        teachersBox.innerHTML += question;
        // console.log(el);
    });
}

const selectResponse = (event) => {
    const scene = info[window.currentScene];
    const text = event.target.innerHTML;
    const messageBox = `<div class="message-box arrow-bottom">${text}</div>`
    const teachersBox = document.getElementById('teachers-box');
    teachersBox.innerHTML = messageBox;
    evaluateOption(text, scene.responses);
    allStudentsSitDown();
    setTimeout(() => {
        clearDialogCloud();
        window.currentScene++;
        nextScene(window.currentScene);
    }, 2000);
}

const clearDialogCloud = () => {
    const dialogBox = document.getElementsByClassName('box');
    for (let i = 0; i < dialogBox.length; i++) {
        dialogBox[i].remove();
    }
}


const nextScene = (stage) => {
    stagewiseMarks[stage-1] = marks;
    marks = 0;
    moveToStage(stage);
}

const moveToStage = (stage) => {
    if (window.currentScene !== 0) {
        showStage();
    }
    if (stage < info.length) {
        const scene = info[stage];
        // show stage
        if (scene.type === 'question') {
            renderQuestion(scene);
        }
    }
    else {
        let finalMarks = 0;
        stagewiseMarks.forEach(mark => {
            finalMarks += mark;
        });
        console.log(stagewiseMarks);
        document.getElementById('teachers-box').innerHTML = `<div class="message-box arrow-bottom">You have completed the quiz. Your score is ${finalMarks}</div>`;
    }
}


window.selectResponse = selectResponse;
window.selectOption = selectOption;