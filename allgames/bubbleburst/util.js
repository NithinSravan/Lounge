let playgame=document.getElementById("play");
let inst=document.getElementById("inst");
let box=document.getElementById("box");
let instruct=document.getElementById("instructions");
let Close=document.getElementById("close");
let sound = new Audio("button.wav");
//homepage functionalities
playgame.addEventListener("click",function(){
    sound.play();
    box.style.display="none";
    init();
    startCount();
})
inst.addEventListener("click",function(){
    instruct.style.display="block";
})
Close.addEventListener("click",function(){
    instruct.style.display="none";
})

//functions that manipulates in-game button functionalities
function restartButton() {
    overlay.style.display = "block";
    const rest = document.createElement('img');
    document.body.appendChild(rest);
    rest.setAttribute("id", "restart");
    restart = document.getElementById("restart");
    restart.src = "restart.svg";
    restart.addEventListener('click', function (e) {
        e.stopPropagation();
        restartGame();
    });
}
function pauseGame() {
    sound.play();
    window.removeEventListener("click",clicked)
    overlay.style.display = "block";
    //resume
    const res = document.createElement('img');
    document.body.appendChild(res);
    res.setAttribute("id", "resume");
    resume = document.getElementById("resume");
    resume.src = "play.svg";
    resume.addEventListener('click', function (e) {
        e.stopPropagation();
        resumeGame();
    });
    pause.removeEventListener('click', pauseGame);
    //restart
    restartButton();
    if(felicis!==0)
    {
        clearInterval(freeze)
    }
    clearInterval(loop);
    clearInterval(timer);
    clearInterval(scoretimer)
    truth=false;
    
}
function resumeGame() {
    sound.play();
    window.addEventListener("click",clicked)
    overlay.style.display = "none";
    resume.parentNode.removeChild(resume);
    restart.parentNode.removeChild(restart);
    pause.addEventListener('click', pauseGame);
    clearInterval(loop);
    play();
    truth=true;
    scoreDis();
    genBubble();
    if(count!==0)
    countDown();
    if(felicis!==0)
    felixTime();
}
function restartGame() {
    sound.play();
if(!gameOver)
  {
    resume.parentNode.removeChild(resume);

  }  
  else 
  start.remove();
if(count===1)
start.remove();
if (typeof (score) != 'undefined' && score != null) {
    score.remove();
}
if(felicis!==0)
{
    feliximg.addEventListener("click",felixact)
}
clearInterval(scoretimer);
box.style.display="block";
overlay.style.display = "none";
restart.parentNode.removeChild(restart);
ctx.clearRect(0, 0, innerWidth, innerHeight);
clearInterval(loop);
truth=false;
clearTimeout(gen);
clearTimeout(genGaun);
init();
setup();
}