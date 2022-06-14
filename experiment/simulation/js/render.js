import { allStudentsReply, askAnswerMultiple } from "./students.js";

// Render scenes
const nextButton = document.getElementById('next-button');
// 1. Evaluation Question
export const renderEvaluationQuestion = (scene) => {
    const teachersBox = document.getElementById('teachers-box');
    teachersBox.innerHTML = '';
    scene.options.forEach(option => {
        const question = `<div id="option-${option.id}" class="option-card" onclick="selectOption(event)">${option.text}</div>`;
        teachersBox.innerHTML += question;
    });
}
// 2. Greeting
export const renderGreeting = (scene) => {
    const teachersBox = document.getElementById('teachers-box');
    const messageBox = `<div class="message-box arrow-bottom">${scene.greeting_text}</div>`;
    teachersBox.innerHTML = messageBox;
    setTimeout(() => {
        allStudentsReply(scene.student_reply);
        nextButton.removeAttribute('hidden');
    }, 2000);
}
// 3. Lesson Question
export const renderLessonQuestion = (scene) => {
    const teachersBox = document.getElementById('teachers-box');
    const messageBox = `<div class="message-box arrow-bottom">${scene.options[0].text}</div>`;
    teachersBox.innerHTML = messageBox;
    askAnswerMultiple(scene);
}
// 4. Teacher Dialog
export const renderTeacherDialog = (scene) => {
    const teachersBox = document.getElementById('teachers-box');
    const messageBox = `<div class="message-box arrow-bottom">${scene.text}</div>`;
    teachersBox.innerHTML = messageBox;
    setTimeout(() => {
        nextButton.removeAttribute('hidden');
    }, 2000);
    
}