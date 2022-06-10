let info;
let replayJSON;

// click on next button to move to next stage when waiting for click
const nextButton = document.getElementById('next-button');
nextButton.addEventListener('click', () => {
    nextScene();
    nextButton.setAttribute('hidden', 'hidden');
});




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


const startSimulation = (story) => {
    const scene = story[window.currentScene];
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


const init = (data) => {
    replayJSON = data;
    num_stages = data.data.num_stages;
    info = data.data.story;
    const story = data.data.story;
    // console.log(story);

    createTimeline(num_stages);
    handleStages();
    for (let i = 0; i < num_stages; i++) {
        stagewiseMarks.push(0);
    }

    const title = document.getElementById('title');
    const audience = document.getElementById('audience');
    const subject = document.getElementById('subject');
    const topic = document.getElementById('topic');

    title.innerHTML = data.data.title;
    audience.innerHTML = data.data.target_audience;
    subject.innerHTML = data.data.subject;
    topic.innerHTML = data.data.topic;

    const startExperiment = document.getElementById('startexp');
    startExperiment.addEventListener('click', () => {
        startSimulation(story);
        const modal = document.getElementsByClassName('modal')[0];
        modal.classList.toggle('show-modal');
    })

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

const renderGreeting = (scene) => {
    allStudentsSitDown();
    const teachersBox = document.getElementById('teachers-box');
    const messageBox = `<div class="message-box arrow-bottom">${scene.greeting_text}</div>`;
    teachersBox.innerHTML = messageBox;
    setTimeout(() => {
        allStudentsReply(scene.student_reply);
        nextButton.removeAttribute('hidden');
    }, 2000);
}

const allStudentsReply = (text) => {
    const studentIDs = [1, 2, 4, 5, 7];
    studentIDs.forEach(id => {
        const student = document.getElementById(`student-${id}`);
        studentAnswer(student.id, text);
    });
}

const renderLessonQuestion = (scene) => {
    allStudentsSitDown();
    const teachersBox = document.getElementById('teachers-box');
    const messageBox = `<div class="message-box arrow-bottom">${scene.options[0].text}</div>`;
    teachersBox.innerHTML = messageBox;
    askAnswers(scene);
}

const renderTeacherDialog = (scene) => {
    allStudentsSitDown();
    // console.log(scene.text);
    const teachersBox = document.getElementById('teachers-box');
    const messageBox = `<div class="message-box arrow-bottom">${scene.text}</div>`;
    teachersBox.innerHTML = messageBox;
    setTimeout(() => {
        nextButton.removeAttribute('hidden');
    }, 2000);

}



const showStage = () => {
    const stage = document.getElementById(`stage-${window.currentScene}`);
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


const selectOption = (event) => {
    const scene = info[window.currentScene];
    const text = event.target.innerHTML;
    const id = parseInt(event.target.id.split('-')[1], 10);
    replayJSON.data.story[window.currentScene].option_selected = id;
    const messageBox = `<div class="message-box arrow-bottom">${text}</div>`
    const teachersBox = document.getElementById('teachers-box');
    teachersBox.innerHTML = messageBox;
    evaluateOption(id, scene.options);
    askAnswer(id, scene);
}



const evaluateOption = (id, options) => {

    for (let i = 0; i < options.length; i++) {
        if (options[i].id === id) {
            marks += options[i].marks;
            break;
        }
    }


}

const askAnswers = (scene) => {
    const students = document.getElementsByClassName('student');
    const answers = scene.answers;
    const numAnswers = answers.length;
    let studentIDS = [];
    // select random students
    while (studentIDS.length < numAnswers) {
        const random = Math.floor(Math.random() * students.length);
        if (!studentIDS.includes(random)) {
            studentIDS.push(random);
        }
    }
    // ask students
    let ansID = 0;
    studentIDS.forEach(rid => {
        const student = students[rid];
        student.className = 'student is-raising-hand';
        const answer = answers[ansID].text;
        const response = answers[ansID].response;
        ansID++;
        student.onclick = () => {
            clearDialogCloud();
            clearTeachersBox();
            putHandDown(student.id);
            // console.log(answer);
            // get coordinates of top right corner of student
            studentAnswer(student.id, answer);
            // allStudentsSitDown();
            // console.log(response);
            showResponse(response);
        }
    });
}

const putHandDown = (studentID) => {
    const student = document.getElementById(studentID);
    student.className = 'student is-sitting';
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
        if (id === answerText[i].id) {
            answer = answerText[i].text;
            break;
        }

    }
    student.onclick = () => {
        // console.log(answer);
        // get coordinates of top right corner of student
        studentAnswer(student.id, answer);
        // allStudentsSitDown();
        showResponses(scene);
    }
}

const studentAnswer = (id, text) => {
    const student = document.getElementById(id);
    const studentCoords = student.getBoundingClientRect();
    const top = studentCoords.top;
    const left = studentCoords.left;
    const width = studentCoords.width;
    // console.log(studentCoords);
    insertDialogCloud(text, left, top, id, width);
}


const insertDialogCloud = (text, left, top, id, width) => {
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

const allStudentsSitDown = () => {
    // make all students sit down
    const students = document.getElementsByClassName('student');
    for (let i = 0; i < students.length; i++) {
        students[i].className = 'student is-sitting';
    }
}

const checkIfAllStudentsSitting = () => {
    const students = document.getElementsByClassName('student');
    let allSitting = true;
    for (let i = 0; i < students.length; i++) {
        if (students[i].className !== 'student is-sitting') {
            allSitting = false;
            break;
        }
    }
    return allSitting;
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

const showResponse = (response) => {
    const teachersBox = document.getElementById('teachers-box');
    const messageBox = `<div class="message-box arrow-bottom">${response}</div>`;
    teachersBox.innerHTML = messageBox;
    if(checkIfAllStudentsSitting()){
        nextButton.removeAttribute('hidden');
    }
}

const selectResponse = (event) => {
    const scene = info[window.currentScene];
    const id = parseInt(event.target.id.split('-')[1], 10);
    replayJSON.data.story[window.currentScene].response_selected = id;
    const text = event.target.innerHTML;
    const messageBox = `<div class="message-box arrow-bottom">${text}</div>`
    const teachersBox = document.getElementById('teachers-box');
    teachersBox.innerHTML = messageBox;
    evaluateOption(id, scene.responses);
    allStudentsSitDown();
    nextButton.removeAttribute('hidden');
}

const clearDialogCloud = () => {
    const dialogBox = document.querySelectorAll('.box');
    // remove all dialog boxes
    dialogBox.forEach(box => {
        box.remove();
    });
}

const clearTeachersBox = () => {
    const teachersBox = document.getElementById('teachers-box');
    teachersBox.innerHTML = '';
}


const nextScene = () => {
    clearTeachersBox();
    clearDialogCloud();
    window.currentScene++;
    stagewiseMarks[window.currentScene - 1] = marks;
    marks = 0;
    moveToStage(window.currentScene);
}

const setCurrentStage = (stage) => {
    const el = document.getElementById(`stage-${stage + 1}`).getElementsByClassName('timeline-stage')[0];
    if (!el.classList.contains('is-in-progress')) {
        el.classList.add('is-in-progress');
    }
}


const moveToStage = (stage) => {
    if (window.currentScene !== 0) {
        showStage();
    }
    if (stage < info.length) {
        const scene = info[stage];
        setCurrentStage(stage);
        // show stage
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
        downloadObjectAsJson(replayJSON, 'replay');
    }
}


window.selectResponse = selectResponse;
window.selectOption = selectOption;



function downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}