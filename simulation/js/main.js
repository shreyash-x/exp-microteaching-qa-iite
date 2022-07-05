import {createTimeline, handleStages} from './timeline.js';
import {startSimulation} from './scene-utilities.js';

window.currentScene = 0;
export let info;
export const stagewiseMarks = {};
let replayJSON;

// load data
fetch('./SI.json')
    .then(response => response.json())
    .then(data => {
        init(data);
    })
    .catch(error => console.log(error));

// Initialize the simulation
const init = (data) => {
    replayJSON = data;
    const stages = data.data.stages;
    const num_stages = Object.keys(stages).length;
    info = data.data.story;
    const story = data.data.story;
    // console.log(story);
    const max_marks = data.data.max_marks;
    createTimeline(num_stages, stages);
    handleStages();
    for (let stage in max_marks) {
        stagewiseMarks[stage] = 0;
    }
    // console.log(stagewiseMarks);

    const title = document.getElementById('title');
    const audience = document.getElementById('audience');
    const subject = document.getElementById('subject');
    const topic = document.getElementById('topic');
    const prerequisites = document.getElementById('prerequisites');
    const resources = document.getElementById('resources');

    let dat = "";
    for(let prereq in data.data.prerequisites) {
        dat += `<li>${data.data.prerequisites[prereq]}</li>`;
    }
    prerequisites.innerHTML = dat;

    dat = "";
    for(let res in data.data.learning_resources) {
        if (res == data.data.learning_resources.length - 1) {
            dat += `${data.data.learning_resources[res]}`;
        }
        else {
        dat += `${data.data.learning_resources[res]}, `;
        }
    }
    resources.innerHTML = dat;

    title.innerHTML = data.data.title;
    audience.innerHTML = data.data.target_audience;
    subject.innerHTML = data.data.subject;
    topic.innerHTML = data.data.topic;

    const startExperiment = document.getElementById('startexp');
    startExperiment.addEventListener('click', () => {
        startSimulation(story,max_marks);
        const modal = document.getElementsByClassName('modal')[0];
        modal.classList.toggle('show-modal');
    })

}















