//Variables
let pairs = 6;
let cards =[];

let flipCount = 0;
let firstCard = null;
let secondCard = null;

let startTime;
let isRunning = false;
let correctCount = 0;
let timeoutId;


//Functon to add cards under #stage
function createPareCards(){
let i;
let card;
for(i = 1; i <= pairs; i++){
cards.push(createCard(i));
cards.push(createCard(i));
}
while(cards.length){
    card = cards.splice(Math.floor(Math.random()*cards.length),1)[0];
    document.getElementById('stage').appendChild(card);
    }
}

//function to create cards
function createCard(num){
    let container;
    let card;
    let inner;

    inner =`<div class="card-front card-value"> ${num}</div>
    <div class="card-back">?</div>`;

    card= document.createElement('div');
    card.innerHTML = inner;
    card.className = 'card';

//calling flipCard function
    card.addEventListener('click', function(){
    flipCard(this);
    // Flip sound
        startSound.flip();
    if(isRunning === true){
        return;
    }
    isRunning = true;
    startTime = Date.now();
    document.getElementById('restart').className = '';

//call runTimer
    runTimer();
});

    container = document.createElement('div');
    container.appendChild(card);
    container.className = 'card-container';

    return container;
}

//calling createPareCard function.
createPareCards();

//function to Preventing opening more than 2 cards.
function flipCard(card){
    if(firstCard !== null && secondCard !== null){
        return;
    }
    if(card.className.indexOf('open') !== -1){
        return;
    }
//add open class next to card class
        card.className = ('card open');
        flipCount++;
        document.getElementById("flip").innerHTML = flipCount;
        document.getElementById("f-flip").innerHTML = flipCount;

    if(flipCount %2 === 1){
        firstCard = card;
    }else{
        secondCard = card;
//calling check function.
        secondCard.addEventListener('transitionend', check);
  }
}

//function to check the match
function check(){
if(firstCard.children[0].textContent !== secondCard.children[0].textContent){
firstCard.className = 'card';
secondCard.className = 'card';
}else{
    correctCount++;

    if(correctCount === pairs){
//stop timer when all matched.
    clearTimeout(timeoutId);

//victory music 
    startSound.stopBGMusic();
    startSound.victory();    

//Show "Finished" overlay
    function finished(){
        document.getElementById('finished').classList.add('visible');
     }
    finished();
    } 
}
secondCard.removeEventListener('transitionend', check);
firstCard = null;
secondCard = null;
}

//function to start timer
function runTimer(){
      //change text of 0.00 
document.getElementById('score').textContent = ((Date.now() - startTime) / 1000).toFixed(2);
document.getElementById('f-score').textContent = ((Date.now() - startTime) / 1000).toFixed(2);
      //start running timer
timeoutId = setTimeout(function(){
    runTimer();
},10);
}

//Restart
document.getElementById('restart').addEventListener('click', reload);

//Game start again
document.getElementById('finished').addEventListener('click', reload);

function reload() {
    document.location.reload();
  }

//Ready functon
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            //start background music
            startSound.starBGMusic();
        });
    });
   
}

//AudioController class
class AudioController{
    constructor(){
        this.flipSound = new Audio('./sounds/flip.mp3');
        this.victorySound = new Audio('./sounds/victory.mp3');
        this.backgroundSound = new Audio('./sounds/background.mp3');
        this.backgroundSound.loop = true;
        this.backgroundSound.volume = 0.5;
    }

    starBGMusic(){
        this.backgroundSound.play();
    }
    stopBGMusic(){
        this.backgroundSound.pause();
        this.backgroundSound.currentTime = 0;
    }
    flip(){
        this.flipSound.play();
    }
    victory(){
        // this.stopBGMusic();
        this.victorySound.play();
    }
    
}

let startSound = new AudioController();