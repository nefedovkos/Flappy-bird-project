let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

//Variables
let birdImageChose =0;
let birdX = 50;
let birdY = 150;
let periodWings = 0;
let frames =0;
let gravity = 1;
let jumpUp = 20;
let speed = 1;
let backgroundBottomX = 0;
let backgroundBottomY = canvas.offsetHeight - 108;
let gap = 80;
let pipeUpHeight = 284;
let pipeWidth = 52;
let birdWidth = 34;
let birdHeight = 24;
let score = 0;
let bestScore = parseInt(localStorage.getItem("bestScore")) || 0;
let birdFlightFrame = 0;


//Load images
let background = new Image();
background.src = "images/background.png";
let backgroundBottom = new Image();
backgroundBottom.src = "images/backgroundBottom.png";
let pipeUP = new Image();
pipeUP.src = "images/pipeUP.png";
let pipeBottom = new Image();
pipeBottom.src = "images/pipeBottom.png";

let bird0 = new Image();
bird0.src = "images/bird0.png";
let bird1 = new Image();
bird1.src = "images/bird1.png";
let bird2 = new Image();
bird2.src = "images/bird2.png";
let bird3 = new Image();
bird3.src = "images/bird3.png";

let bird0_25 = new Image();
bird0_25.src = "images/bird0_25.png";
let bird1_25 = new Image();
bird1_25.src = "images/bird1_25.png";
let bird2_25 = new Image();
bird2_25.src = "images/bird2_25.png";
let bird3_25 = new Image();
bird3_25.src = "images/bird3_25.png";

let bird0_90 = new Image();
bird0_90.src = "images/bird0_90.png";
let bird1_90 = new Image();
bird1_90.src = "images/bird1_90.png";
let bird2_90 = new Image();
bird2_90.src = "images/bird2_90.png";
let bird3_90 = new Image();
bird3_90.src = "images/bird3_90.png";

let bird = new Image();
bird.src = "images/bird0.png";
let flappyBird = new Image();
flappyBird.src = "images/flappyBird.png";
let scoreOver = new Image();
scoreOver.src = "images/scoreOver.png";
let restartBtn = new Image();
restartBtn.src = "images/restartBtn.png";
let shareBtn = new Image();
shareBtn.src = "images/shareBtn.png";


//pipes
let pipes = [];
pipes [0] = {
    x:290,
    y:0
}
//bird
function birdFly(birdImageChose) {
    //if(state.current == state.ready);
    if(birdFlightFrame < 10 && state.current != state.ready){
        if (birdImageChose == 0) bird = bird0_25;
        if (birdImageChose == 1) bird = bird1_25;
        if (birdImageChose == 2) bird = bird2_25;
        if (birdImageChose == 3) bird = bird3_25;
    } else if(birdFlightFrame > 30 && state.current != state.ready){
        if (birdImageChose == 0) bird = bird0_90;
        if (birdImageChose == 1) bird = bird1_90;
        if (birdImageChose == 2) bird = bird2_90;
        if (birdImageChose == 3) bird = bird3_90;
    } else {
        if (birdImageChose == 0) bird = bird0;
        if (birdImageChose == 1) bird = bird1;
        if (birdImageChose == 2) bird = bird2;
        if (birdImageChose == 3) bird = bird3;
    }
}
function flyUp(){
    birdY-=jumpUp;
    if(state.current != state.over)
        birdFlightFrame=0;
}
//Game state
let state = {
    current: 0,
    ready: 0,
    game:1,
    over:2
}
function moveBottom(){
    backgroundBottomX-=speed;
    if(backgroundBottomX<-50)
        backgroundBottomX=0;
}
//Control states
document.addEventListener("click",function (event) {
    switch(state.current){
        case state.ready:
            state.current=state.game;
            break;
        case state.game:
            birdX=50;
            flyUp();
            break;
        case state.over:
            let rect = canvas.getBoundingClientRect();
            let clickX = event.clientX - rect.left;
            let clickY = event.clientY - rect.top;
            //check if click on reset button
            if(clickX >= 54 && clickX <= 134 && clickY >= 230 && clickY <= 258){
                state.current=state.ready;
                score=0;
                pipes=[];
                pipes [0] = {
                    x:290,
                    y:0
                }
            }
            //check if click share
            if(clickX >= 154 && clickX <= 234 && clickY >= 230 && clickY <= 258){
                alert("Sorry this option not working now, choose RESTART!!!");
            }
            break;
    }
})
// Draw
function draw() {
    //clear canvas
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    context.drawImage(background, 0, 0);
    context.drawImage(backgroundBottom, backgroundBottomX, backgroundBottomY);
    birdFly(birdImageChose);
    if(state.current != state.over)
        context.drawImage(bird, birdX, birdY);

    if (state.current == state.ready) {
        context.drawImage(flappyBird, 50, 50);
        periodWings = 10;
        birdY = 150;
        moveBottom();
    }
    if (state.current == state.game) {
        birdY += gravity;
        periodWings = 5;
        moveBottom();
        document.addEventListener("click", flyUp);
        document.addEventListener("keydown", flyUp);
        for (let i = 0; i < pipes.length; i++) {
            context.drawImage(pipeUP,pipes[i].x,pipes[i].y);
            context.drawImage(pipeBottom,pipes[i].x,pipes[i].y+gap+pipeUpHeight);
            context.drawImage(backgroundBottom, backgroundBottomX, backgroundBottomY);
            pipes[i].x -= speed;
            //remove pipe
            if(pipes[i].x<-52){
                pipes.shift();
                //Score
                score++;
                bestScore=Math.max(score,bestScore);
                localStorage.setItem("bestScore",bestScore);
            }
            //Collision
            //Bottom background
            if (birdY + birdHeight >= canvas.offsetHeight - 108) {
                birdY = canvas.offsetHeight - 108 - bird.height;
                state.current = state.over;
                let jumpUp = 0;
                let speed = 0;
                birdX+=10;
                birdY+=10;
            }
            //Upper & bottom pipes
            if(birdX+birdWidth >= pipes[i].x  && birdX < pipes[i].x + pipeWidth
                && ((birdY + birdHeight > pipes[i].y && birdY < pipes[i].y + pipeUpHeight)
                ||  (birdY + birdHeight > pipes[i].y+gap+pipeUpHeight ))){
                state.current = state.over;
                birdX+=10;               
            }
            if(pipes[i].x==50){
                pipes.push({
                    x: canvas.width,
                    y: Math.floor(Math.random() * pipeUpHeight) - pipeUpHeight});
            }
        }
        context.fillStyle = "#fff";
        context.strokeStyle = "#000" ;
        context.lineWidth = 4;
        context.font = "40px verdana";
        context.strokeText(score,canvas.width/2-25, 50);
        context.fillText(score,canvas.width/2-25, 50);
    }
    if (state.current == state.over) {
        context.drawImage(pipeUP,pipes[0].x,pipes[0].y);
        context.drawImage(pipeBottom,pipes[0].x,pipes[0].y+gap+pipeUpHeight);
        context.drawImage(backgroundBottom, backgroundBottomX, backgroundBottomY);
        birdY+=gravity;
        if(birdY >= backgroundBottomY-birdHeight-10)
             birdY=backgroundBottomY-birdHeight-10;
        context.drawImage(bird, birdX, birdY);
        context.drawImage(scoreOver, 98, 70);
        context.fillStyle = "#fff";
        context.strokeStyle = "#000" ;
        context.lineWidth = 4;
        context.font = "30px verdana";
        context.strokeText(score,143, 125);
        context.fillText(score,143, 125);
        context.strokeText(bestScore,143, 170);
        context.fillText(bestScore,143, 170);
        context.drawImage(restartBtn, 54, 230);
        context.drawImage(shareBtn, 154, 230);
    }
}
// Update
function update(){
    frames++;
    if(frames%periodWings == 0){
        birdImageChose++;
        birdImageChose%=4;
        birdFlightFrame++;
        birdFly(birdImageChose);
    }
}
//Loop
function loop(){
    update();
    draw();
    requestAnimationFrame(loop);
}
loop();