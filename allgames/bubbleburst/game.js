let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let color = ["#F5FF25", "#B625FF", "#FF2560", "#FF8125"];
let loop;
let balls;
let pause = document.getElementById("pause");
let resume;
let restart;
let start;
let index = 0;
let indexGaun;
let count;
let timer;
let s;
let speed;
let time = 5;
let genspeed;
let initballs;
let score;
let beginGame;
let m;
let snap = new Audio("Snap.mp3");
let area;
let scoretimer;
let freeze;
let felicis;
let i;
let gen;
let genGaun;
let truth;
let rem;
let fel;
let gameOver = 0;
let overlay = document.getElementById('overlay');
let feliximg = document.getElementById("felix");
//window event listeners
window.onresize = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    box.style.width = window.innerWidth;
    box.style.height = window.innerHeight;
    clearInterval(loop);
    clearInterval(timer);
    clearInterval(beginGame);
    clearInterval(scoretimer);
    if (typeof (start) != 'undefined' && start != null) {
        start.remove();
    }
    if (typeof (begin) != 'undefined' && begin != null) {
        begin.remove();
    }
    if (typeof (score) != 'undefined' && score != null) {
        score.remove();
    }
    truth = false;
    box.style.display = "block";
    clearTimeout(gen);
    setup();
    init();
};
window.onload = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    clearTimeout(gen);
    setup();
};
let mouse = {
    x: undefined,
    y: undefined
};
window.addEventListener("click", function (e) {
    mouse.x = e.x;
    mouse.y = e.y;
})

feliximg.addEventListener("click", felixact);

//---------------------X---------------------//

//functions used for manipulating vectors and other general math
function mag(ball) {
    return (Math.sqrt((ball.vx * ball.vx) + (ball.vy * ball.vy)));
}
function angle(ball) {
    return (Math.atan2(ball.vy, ball.vx));
}
function dist(x1, y1, x2, y2) {
    let dx = x1 - x2;
    let dy = y1 - y2;
    return (Math.sqrt((dx * dx) + (dy * dy)));
}
function rand(min, max) {
    return (Math.random() * (max - min + 1) + min);
};
//---------------------X---------------------//

//very beginning of the game
function init() {
    m = 3;
    window.removeEventListener("click", clicked)
    const myH1 = document.createElement('div');
    document.body.appendChild(myH1);
    myH1.setAttribute("id", "countdown");
    begin = document.getElementById('countdown');
    pause.style.display = "none";
}
//countdown to launch game
function startCount() {
    canvas.removeEventListener("click", startCount)
    if (m === 3) {
        begin.style.fontSize = "200px"
        beginGame = setInterval(function () {

            begin.innerHTML = m;
            m--;
            if (m < 0) {
                clearInterval(beginGame);
                begin.remove();
                pause.style.display = "block";
                feliximg.style.display = "block";
                Felix();
                truth = true;
                window.addEventListener("click", clicked);
                scoreDis();
                genBubble();
            }
        }, 1000);

    }
}

//balls class defines all properties and behaviours of a ball
class Ball {
    constructor(x, y, vx, vy, radius, k) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.k = k;
        this.color = "#fff";
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        ctx.lineWidth = canvas.width / 300;
        ctx.strokeStyle = this.color;
        ctx.stroke();
    };
    update() {
        for (let i = 0; i < balls.length; i++) {
            if (dist(this.x, this.y, balls[i].x, balls[i].y) <= this.radius + balls[i].radius) {
                if (this !== balls[i])
                    collisionCheck(this, balls[i]);
            }
        }
        if (this.x + this.radius >= innerWidth || this.x - this.radius <= 0) {
            this.vx = -this.vx;
        }
        if (this.y + this.radius >= innerHeight || this.y - this.radius <= 0) {
            this.vy = -this.vy;
        }
        this.x += this.vx;
        this.y += this.vy;
        this.draw();
    };
    burst() {
        window.addEventListener('click', clicked);

        if (dist(mouse.x, mouse.y, this.x, this.y) <= this.radius) {
            sound.play();
            for (let i = balls.length - 1; i >= 0; i--) {
                if (balls[i].k === 1 && this === balls[i]) {
                    this.clicks++;
                    if (this.clicks === 5) {
                        balls.splice(i, 1);
                    }
                }
                else if (this === balls[i]) {
                    if (felicis !== 0) {
                        this.color = "red";
                        this.draw();
                    }
                    balls.splice(i, 1);
                }
            }
        }
    }
}
//sprite class creates new sprite animations when constructed
class Sprite extends Ball {
    constructor(x, y, vx, vy, radius, k) {
        super(x, y, vx, vy, radius, k);
        this.cols = 4;
        this.rows = 2;
        this.maxF = this.cols * this.rows - 1;
        this.currF = 0;
        this.image = new Image();
        this.image.src = "balls.png";
        this.frameWidth = this.image.width / this.cols;
        this.frameHeight = this.image.height / this.rows;
        this.colorchange = 0;
        this.k = k;
        this.clicks = 0;
    }
    draw() {
        let column = this.currF % this.cols; //cycles back to the start
        let row = Math.floor(this.currF / this.cols); // row 1 : 0.....row 2: 1
        ctx.drawImage(this.image, column * this.frameWidth, row * this.frameHeight, this.frameWidth, this.frameHeight, this.x, this.y, this.radius, this.radius);
    }
    update() {
        this.currF++;
        //reset and start from the first sprite
        if (this.currF > this.maxF) {
            this.currF = 0;
        }
        for (let i = 0; i < balls.length; i++) {
            if (dist(this.x, this.y, balls[i].x, balls[i].y) <= this.radius + balls[i].radius) {
                if (this !== balls[i])
                    collisionCheck(this, balls[i]);
            }
        }
        if (this.x + this.radius >= innerWidth || this.x - this.radius <= 0) {
            this.vx = -this.vx;
        }
        if (this.y + this.radius >= innerHeight || this.y - this.radius <= 0) {
            this.vy = -this.vy;
        }
        this.x += this.vx;
        this.y += this.vy;
        this.draw();
    }
}
class Gauntlet extends Ball {
    constructor(x, y, vx, vy, radius) {
        super(x, y, vx, vy, radius);
        this.image = new Image();
        this.image.src = "gauntlet.png";
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.radius, this.radius);
    }
    burst() {
        window.addEventListener('click', clicked)
        if(felicis===0)
        {
            if (dist(mouse.x, mouse.y, this.x, this.y) <= this.radius) {
                snap.play();
                this.image.src = " ";
                for (let i = balls.length / 2; i >= 0; i--)
                    balls.splice(i, 1);
            }
        }

    }
}

//used to setup the game objects and variables
function setup() {
    balls = new Array();
    m = 3;
    s = 0;
    indexGaun = 0;
    rem = 2;
    felicis = 0;
    pause.style.display = "none";
    feliximg.style.display = "none";
    if (typeof (fel) != 'undefined' && fel != null)
        fel.innerHTML = ""
    count = 0;
    gameOver = 0;
    index = 1;
    time = 6;
    //checks for the type of device
    if (canvas.width < canvas.height) {
        initballs = 30;
        genspeed = 1100;
        genGaunSpeed = 15000;
        speed = 420;
    }
    else {
        initballs = 40;
        genspeed = 1000;
        genGaunSpeed = 20000;
        speed = 400;
    }
    //initial bubbles
    for (let i = 0; i < initballs; i++) {
        createBubbles(0, i);
    }

    if (typeof (gauntlet) != 'undefined' && gauntlet != null) {
        gauntlet.image.src = "";
    }
    if (typeof (restart) != 'undefined' && restart != null) {
        overlay.style.display = "none";
        restart.remove();
    }
    if (typeof (resume) != 'undefined' && resume != null) {
        resume.remove();
    }
    pause.addEventListener('click', pauseGame);
    clearInterval(loop)
    play();
}
let gauntlet;
function createBubbles(k, i = 1) {

    let r = rand(Math.max(canvas.width * 0.01, 20), Math.min(canvas.width * 0.1, 70));
    let x = rand(r, (canvas.width - r));
    let y = rand(r, (canvas.height - r));
    let dx = rand(-2, 2) * 0.1;
    let dy = rand(-2, 2) * 0.1;
    if (i != 0) {
        for (let j = 0; j < balls.length; j++) {
            if (dist(x, y, balls[j].x, balls[j].y) < r + balls[j].radius) {
                x = rand(r, (canvas.width - r));
                y = rand(r, (canvas.height - r));
                j = -1;
            }
        }
    }
    if (k === 0)
        balls.push(new Ball(x, y, dx, dy, r, k));
    else
        balls.push(new Sprite(x, y, dx, dy, r, k));


}


//the master function where the whole game runs...at almost 60FPS
function play() {
    loop = setInterval(function () {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < balls.length; i++) {
            balls[i].update();
        }
        if (typeof (gauntlet) != 'undefined' && gauntlet != null) {
            gauntlet.update();
        }
        if (m === -1) {
            areaCheck();
        }

    }, 16);
}
//fired when clicked on window
function clicked() {
    window.removeEventListener('click', clicked)
    for (let i = balls.length - 1; i >= 0; i--) {
        balls[i].burst();
    }
    if (typeof (gauntlet) != 'undefined' && gauntlet != null) {
        gauntlet.burst();
    }
}
//compares the area of balls and the canvas
function areaCheck() {
    area = 0;
    for (let i = 0; i < balls.length; i++) {
        area += (Math.PI * balls[i].radius * balls[i].radius);
    }
    if (count !== 0) {
        if (area < 0.3 * (canvas.width * canvas.height)) {
            start.remove();
            clearInterval(timer)
            count = 0;

        }
    }
    if (area >= 0.2 * (canvas.width * canvas.height)) {
        if (count === 0) {
            count++;
            time = 6;
            countDown();
        }
    }
}
//tick tick tick the game's gonna end in 5...4...3...2...1!!
function countDown() {
    const myDiv = document.createElement('div');
    document.body.appendChild(myDiv);
    myDiv.setAttribute("id", "countdown");
    start = document.getElementById('countdown');
    start.style.fontFamily = "Arial"
    start.style.color = "rgb(245, 94, 83)";
    let Size = Math.min(canvas.width * 0.1, canvas.height * 0.1);
    start.style.fontSize = `${Size}px`;
    timer = setInterval(function () {
        if (time > 5)
            start.innerHTML = "Hurry!";
        else
            start.innerHTML = time;
        time--;
        if (time < 0) {
            clearInterval(timer);
            clearInterval(loop);
            clearTimeout(gen);
            clearInterval(scoretimer);
            gameOver = 1;
            best();
            count = 0;
            restartButton();
        }
    }, 1000);
}
//uses 2D oblique collision formula to detect collision between balls
function collisionCheck(ball, otherball) {
    let dx = (otherball.x - ball.x);
    let dy = (otherball.y - ball.y);

    if ((dx * (ball.vx - otherball.vx) + dy * (ball.vy - otherball.vy)) >= 0) {
        let phi = Math.abs(Math.atan2(dy, dx));
        const magBall = mag(ball);
        const magOther = mag(otherball);
        const angleBall = angle(ball);
        const angleOther = angle(otherball)
        ball.vx = magOther * Math.cos(angleOther - phi) * Math.cos(phi) + magBall * Math.sin(angleBall - phi) * Math.cos(phi + (Math.PI / 2));
        ball.vy = magOther * Math.cos(angleOther - phi) * Math.sin(phi) + magBall * Math.sin(angleBall - phi) * Math.sin(phi + (Math.PI / 2));
        otherball.vx = magBall * Math.cos(angleBall - phi) * Math.cos(phi) + magOther * Math.sin(angleOther - phi) * Math.cos(phi + (Math.PI / 2));
        otherball.vy = magBall * Math.cos(angleBall - phi) * Math.sin(phi) + magOther * Math.sin(angleOther - phi) * Math.sin(phi + (Math.PI / 2));

    }


}
//display score at all times
function scoreDis() {
    const myDiv = document.createElement('div');
    document.body.appendChild(myDiv);
    myDiv.setAttribute("id", "score");
    score = document.getElementById('score');
    let Size = Math.min(canvas.width * 0.1, canvas.height * 0.1);
    score.style.fontSize = `${Size}px`;
    score.style.fontFamily = "Arial";
    scoretimer = setInterval(function () {
        s++;
        score.innerHTML = s;
    }, 1000)
}
//best score finder
function best() {
  parent.postMessage({score:s,gamename:"BubbleBurst"},"*")
}
//generates bubbles after game is fired. Pace of generation increases with time linearly
function genBubble() {
    let decide = 0;

    if (index % 5 === 0)
        decide = Math.floor(rand(0, 1));

    if (truth) {
        if (genspeed > 500)
            genspeed -= index * 10;
        else
            genspeed = speed;
        createBubbles(decide);
        index++;
        if (index === 20)
            genGauntlet();
        //increases speed of bubbles for every 5th bubble created
        if (index % 5 === 0) {
            for (let i = 0; i < balls.length; i++) {
                balls[i].dx = rand(-(index * 0.2 + 2), (index * 0.2 + 2)) * 0.5;
                balls[i].dy = rand(-(index * 0.2 + 2), (index * 0.2 + 2)) * 0.5;
            }
        }
        gen = setTimeout(genBubble, genspeed)
    }
    else
        clearTimeout(gen)
}
//gauntlet spawner
function genGauntlet() {
    if (truth) {
        if (genGaunSpeed > 10000)
            genGaunSpeed -= indexGaun * 100;
        else
            genGaunSpeed = 10000;
        indexGaun++;
        let r = Math.min(canvas.width * 0.1, 70);
        let x = rand(r, (canvas.width - r));
        let y = rand(r, (canvas.height - r));
        let dx = rand(-2, 2) * 0.1;
        let dy = rand(-2, 2) * 0.1;
        gauntlet = new Gauntlet(x, y, dx, dy, r);
        genGaun = setTimeout(genGauntlet, genGaunSpeed);
    }
    else
        clearTimeout(genGaun)
}
//functions related to felix-felicis
function Felix() {
    const Div = document.createElement('div');
    document.body.appendChild(Div);
    Div.setAttribute("id", "fel");
    fel = document.getElementById('fel');
    let Size = Math.min(canvas.width * 0.06, canvas.height * 0.06);
    fel.style.fontSize = `${Size}px`;
    fel.style.fontFamily = "Arial"
    if (rem === 0)
        feliximg.style.opacity = 0.4;
    else
        feliximg.style.opacity = 1;
    fel.innerHTML = `x${rem}`;
}
function felixact(){
    feliximg.removeEventListener("click",felixact);
    felicis = 1;
    if (rem > 0) {
        rem--;
         i= 5;
         felixTime()
        Felix();
    }
}
function felixTime(){
    freeze = setInterval(function () {
        if (i > 0) {
            clearInterval(loop);
            clearInterval(timer);
            clearInterval(scoretimer)
            truth = false;
            i--;
        }
        else {
            play();
            truth = true;
            feliximg.addEventListener("click",felixact);
            scoreDis();
            genBubble();
            if (count !== 0)
                countDown();
            felicis = 0;
            clearInterval(freeze);
        }

    }, 1000)
}
