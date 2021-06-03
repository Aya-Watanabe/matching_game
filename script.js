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

createPareCards();

function createPareCards(){ //add cards under #stage
let i;
let card;
for(i = 1; i <= pairs; i++){
cards.push(createCard(i));
cards.push(createCard(i));
}
while(cards.length){ //Allocat different number of pares to cards
    card = cards.splice(Math.floor(Math.random()*cards.length),1)[0];
    document.getElementById('stage').appendChild(card);
    }
}

//function to create a card
function createCard(num){
    let container;
    let card;
    let inner;

    inner =`<div class="card-front card-value"> ${num}</div>
    <div class="card-back">?</div>`;

    card= document.createElement('div');
    card.innerHTML = inner;
    card.className = 'card';

    //calling flipCard function and flip sound for each card, and disabling restart btn, starting timer.
    card.addEventListener('click', function(){
        flipCard(this);
        startSound.flip();// Flip sound

        if(isRunning === true){
            return;
        }

        isRunning = true;
        startTime = Date.now();
        document.getElementById('restart').className = ''; //disabling restart btn

        runTimer();//Starting timer
    });

    container = document.createElement('div');
    container.appendChild(card);
    container.className = 'card-container';

    return container;
}

//function to Preventing opening more than 2 cards.
function flipCard(card){
    if(firstCard !== null && secondCard !== null){
        return; 
    }
    if(card.className.indexOf('open') !== -1){
        return;
    }
        card.className = ('card open');//add open class next to card class
        flipCount++;
        document.getElementById("flip").innerHTML = flipCount;
        document.getElementById("f-flip").innerHTML = flipCount;

    if(flipCount %2 === 1){
        firstCard = card;
    }else{
        secondCard = card;
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

        if(correctCount === pairs){ //when all matched.

        clearTimeout(timeoutId); //stop timer

        startSound.stopBGMusic(); //stop bk music 
        startSound.victory();  //victory music 

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

function runTimer(){
      
document.getElementById('score').textContent = ((Date.now() - startTime) / 1000).toFixed(2);//change text of 0.00 
document.getElementById('f-score').textContent = ((Date.now() - startTime) / 1000).toFixed(2);//change text of 0.00 

//start running timer
timeoutId = setTimeout(function(){
        runTimer();
    },10);
}

//Run reload function when overlay is clicked
document.getElementById('restart').addEventListener('click', reload);
document.getElementById('finished').addEventListener('click', reload);

function reload() {
    document.location.reload();
  }

//Run ready function when loaded
if (document.readyState == 'loading') {
        document.addEventListener('DOMContentLoaded', ready)
    } else {
    ready();
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => { //when overlay is clicked
            overlay.classList.remove('visible'); //remove overlay
            startSound.starBGMusic();//start background music
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