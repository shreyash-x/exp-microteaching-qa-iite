import { insertDialogCloud, clearDialogCloud, clearTeachersBox } from "./scene-utilities.js";
import { displayTeacherMessage, showResponsesMultiple } from "./teacher.js";

// Student features
// 1. Put hand down
const putHandDown = (studentID) => {
    const student = document.getElementById(studentID);
    student.className = 'student is-sitting';
}

// 2. Make all students sit down
export const allStudentsSitDown = () => {
    // make all students sit down
    const students = document.getElementsByClassName('student');
    for (let i = 0; i < students.length; i++) {
        students[i].className = 'student is-sitting';
    }
}

// 3. Check if all students have answered and are sitting
export const checkIfAllStudentsSitting = () => {
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

// 4. Reply in unison
export const allStudentsReply = (text) => {
    const studentIDs = [1, 2, 4, 5, 7];
    studentIDs.forEach(id => {
        const student = document.getElementById(`student-${id}`);
        displayAnswer(student.id, text);
    });
}

// 5. Ask multiple students for answer
export const askAnswerMultiple = (scene) => {
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
            displayAnswer(student.id, answer);
            // allStudentsSitDown();
            // console.log(response);
            displayTeacherMessage(response);
        }
    });
}

// 6. Ask a single student for answer
export const askAnswerSingle = (id, scene) => {
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
        displayAnswer(student.id, answer);
        // allStudentsSitDown();
        showResponsesMultiple(scene);
    }
}

// 7. Show answer in dialog cloud
const displayAnswer = (id, text) => {
    const student = document.getElementById(id);
    const studentCoords = student.getBoundingClientRect();
    const top = studentCoords.top;
    const left = studentCoords.left;
    const width = studentCoords.width;
    // console.log(studentCoords);
    insertDialogCloud(text, left, top, id, width);
}