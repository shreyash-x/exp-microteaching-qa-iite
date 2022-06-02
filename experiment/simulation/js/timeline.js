const createTimeline = (num_stages) => {
    const progressBar = document.getElementById('progress-bar');
    progressBar.innerHTML = '';
    for (let i = 1; i < num_stages; i++) {
        const element = `<div id="stage-${i}" class="stage is-flex is-flex-direction-row">
                            <div class="timeline-stage has-text-centered mt-2">S${i}</div>
                            <hr class="progress-bar-line">
                        </div>`
        progressBar.innerHTML += element;
    }
    // for final stage
    const element = `<div id="stage-${num_stages}" class="stage is-flex is-flex-direction-row final-stage">
                        <div class="timeline-stage has-text-centered mt-2">S${num_stages}</div>
                    </div>`
    progressBar.innerHTML += element;
}


const handleStages = () => {
    const stages = document.getElementsByClassName('stage');
    let el = stages[0].getElementsByClassName('timeline-stage')[0];
    if (!el.classList.contains('is-in-progress')) {
        el.classList.add('is-in-progress');
    }
    for (let i = 0; i < stages.length; i++) {
        stages[i].style.cursor = 'pointer';
        stages[i].addEventListener('click', () => {
            // make all stages before i green
            for (let j = 0; j < i; j++) {
                const element = stages[j];
                const children = element.children;
                for (let j = 0; j < children.length; j++) {
                    const child = children[j];
                    if (!child.classList.contains('is-filled')) {
                        child.classList.add('is-filled');
                    }
                    if(child.classList.contains('is-in-progress')) {
                        child.classList.remove('is-in-progress');
                    }
                }
            }
            // make all stages from i white
            for (let j = i; j < stages.length; j++) {
                const element = stages[j];
                const children = element.children;
                for (let j = 0; j < children.length; j++) {
                    const child = children[j];
                    if (child.classList.contains('is-filled')) {
                        child.classList.remove('is-filled');
                    }
                    if(child.classList.contains('is-in-progress')) {
                        child.classList.remove('is-in-progress');
                    }
                }
            }
            let el = stages[i].getElementsByClassName('timeline-stage')[0];
            if (!el.classList.contains('is-in-progress')) {
                el.classList.add('is-in-progress');
            }


            window.currentScene = i;
            moveToStage(i);
        });
    }
}