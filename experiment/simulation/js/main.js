import {createTimeline, handleStages} from './timeline.js';
import {startSimulation} from './scene-utilities.js';

window.currentScene = 0;
export let info;
export const stagewiseMarks = [];
let replayJSON;
let num_stages = 0;

// load data
fetch('./extra1.json')
    .then(response => response.json())
    .then(data => {
        init(data);
    })
    .catch(error => console.log(error));

// Initialize the simulation
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















