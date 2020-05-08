// https://caiorss.github.io/bookmarklet-maker/
const VISUAL_TIMER_CLASSNAME = "visual-timer";

const circle_arc = {
    center_x : 50, 
    center_y: 50, 
    radius: 50,
    angle_start: 0
}

// https://stackoverflow.com/questions/48941773/how-to-automatically-run-custom-javascript-code-when-loading-a-webpage
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations

function trace_timer_circle(proportion, canvas_elem, color) {
    var ctx = canvas_elem.getContext("2d");

    ctx.beginPath();
    ctx.arc(circle_arc.center_x, circle_arc.center_y, circle_arc.radius, 
        circle_arc.angle_start, (2 * Math.PI) * proportion);
    ctx.lineTo(circle_arc.center_x, circle_arc.center_y);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}
// Use: context.clearRect(0, 0, canvas.width, canvas.height);
function update_timer() {
    if (!this.pause_object.is_pause) {
        var elapsed_time = (Date.now() - this.time_start - this.pause_object.time_spent_in_pause);
        var time_left = 1 - (elapsed_time / (this.duration * 1000));
        var ctx = this.canvas_elem.getContext("2d");
        ctx.clearRect(0, 0, this.canvas_elem.width, this.canvas_elem.height);
        if (time_left >= 0) {   
            trace_timer_circle(
                time_left,
                this.canvas_elem,
                this.color
            )
        }
        else {
            clearInterval(this.pause_object.interval);
        }
    }
}

function toggle_pause_timer() {
    if (!this.is_pause) {
        this.start_pause = Date.now();
        this.is_pause = true;
    }
    else {
        this.time_spent_in_pause += Date.now() - this.start_pause;
        this.is_pause = false;
    }
}

function create_visual_timer() {
    var canvas_elem = document.createElement('canvas');
    // var title_elem = document.createElement('h2');
    var pause_button = document.createElement('div');
    var container = document.createElement('div');
    var color = document.querySelector('#id_color').value;
    var body_elem = document.querySelector('body');
    var first_timer = document.querySelector('.' + VISUAL_TIMER_CLASSNAME);

    container.classList = [VISUAL_TIMER_CLASSNAME];
    canvas_elem.width = 100;
    canvas_elem.height = 100;
    //title_elem.textContent = document.querySelector('#id_timer_name').value;
    pause_button.textContent = 'Pause';

    var pause_object = {
        is_pause: false,
        time_spent_in_pause: 0
    };
    pause_button.addEventListener('click', toggle_pause_timer.bind(pause_object));

    const duration = document.querySelector('#id_duration_minutes').value * 60;
        // + document.querySelector('#id_duration_seconds').value;
    
    trace_timer_circle(1.0, canvas_elem);
    
    pause_object.interval = setInterval(update_timer.bind({
        time_start: Date.now(),
        duration: duration,
        canvas_elem: canvas_elem,
        color: color,
        pause_object: pause_object
    }), 50);

    // container.append(title_elem);
    container.append(canvas_elem);
    container.append(pause_button);

    if (first_timer !== null) {
        body_elem.insertBefore(container, first_timer);
    }
    else {
        body_elem.append(container);
    }
}

function bind_click_create_button() {
    button_elem = document.querySelector('.create_timer_button');
    button_elem.addEventListener('click', create_visual_timer); 
}

function create_form() {
    const container = document.createElement('div');
    container.classList = "visual-timer-form";

    const labelColor = document.createElement('label');
    labelColor.for = "id_color";
    labelColor.textContent = "Color:";

    const selectColor = document.createElement('select');
    selectColor.name = "color";
    selectColor.id = "id_color";

    const redOptionElem = document.createElement('option');
    redOptionElem.textContent = "red";
    const greenOptionElem = document.createElement('option');
    greenOptionElem.textContent = "green";
    const blueOptionElem = document.createElement('option');
    blueOptionElem.textContent = "blue";

    selectColor.append(redOptionElem);
    selectColor.append(greenOptionElem);
    selectColor.append(blueOptionElem);

    const labelMinutes = document.createElement('label');
    labelMinutes.for = "id_duration_minutes";
    labelMinutes.textContent = "Minutes:";

    const inputMinutes = document.createElement('input');
    inputMinutes.type = "number";
    inputMinutes.name = "duration_minutes";
    inputMinutes.id = "id_duration_minutes";
    inputMinutes.min = "0";

    labelMinutes.append(inputMinutes);
    labelColor.append(selectColor);

    const createButton = document.createElement('button');
    createButton.classList = "create_timer_button";
    createButton.textContent = "Create";

    container.append(labelColor);
    container.append(labelMinutes);
    container.append(createButton);


    const bodyElem = document.querySelector('body');
    bodyElem.append(container);
}

create_form();
bind_click_create_button();