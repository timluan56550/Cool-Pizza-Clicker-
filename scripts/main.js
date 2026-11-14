
let score=100000000;
let amountPerClick=1;
let combo=0;
let multiplier=1;
let isComboLocked=false;
let critChance=0;
let slicesEaten=0;
let pizzasEaten=0;
let isCooldown=false;
let trackNumber=0;
let backgroundMusic=new Audio();
let bonusPizza=4;
let multiplierGrowth=1;
let critGainMultiplier=1;
let critMultiplier=1;
let powerGain=1;
let amountPerClickBase=1;
let currentPage="upgrades";
let currentRebirthIndex=0;

backgroundMusic.volume=0.07;
const pizzaImage=document.getElementById("pizza")
const targetImage=document.getElementById("target")
const scoreDisplay=document.getElementById("score")
const comboDisplay=document.getElementById("combo")
const multiplierDisplay=document.getElementById("multiplier")
const lockCombo=document.getElementById("lockCombo");
const popupStack = document.getElementById("popup-Stack")
// upgrade stuff
//dont undersatnd why this didnt work
//const upgradeList=require('./upgrades.js')
//i got it to work

const info=document.getElementById("upgrade-info")
const closedNotepad=document.getElementById("notepad-closed")
const closeButtonNotepad=document.getElementById("closeNotepadButton")
const openNotepadContainer=document.getElementById("notepad-open-container")
//audio - got them from zapsplat.com
const click=new Audio("audio/sound/click.mp3");
const hoverOver=new Audio("audio/sound/hoverOver.mp3");
const clickPizza=new Audio("audio/sound/clickPizza.mp3");
const finishPizza=new Audio("audio/sound/finishPizza.mp3");
const openNotepad=new Audio("audio/sound/openNotepad.mp3");

const nextPageButton=document.getElementById("nextPageButton");
const upgradeGrid=document.getElementById("upgrade-grid");
const rebirthGrid=document.getElementById("rebirth-grid");



//let the audio play multiple times overlapping
function soundClick(){
cloneSound=click.cloneNode();
cloneSound.volume=0.1;
cloneSound.play();
}
function soundHoverOver(){
cloneHoverOver=hoverOver.cloneNode();
cloneHoverOver.volume=0.1;

cloneHoverOver.play();
}
function soundClickPizza(){
clonePizza=clickPizza.cloneNode();
clonePizza.volume=0.03;
clonePizza.play();
}

function soundFinishPizza(a){
cloneFinishPizza=finishPizza.cloneNode();
cloneFinishPizza.volume=0.02;
cloneFinishPizza.playbackRate=a;
cloneFinishPizza.play();
}
function soundOpenNotepad(a){
cloneNotepad=openNotepad.cloneNode();
cloneNotepad.volume=0.05;
cloneNotepad.playbackRate=a;
cloneNotepad.play();
}


nextPageButton.addEventListener("click",()=>{
    soundOpenNotepad(1.5);
    if(currentPage==="upgrades"){
        currentPage="rebirths";
        upgradeGrid.style.display="none";
        rebirthGrid.style.display="flex";
        nextPageButton.textContent="Switch to Upgrades";
        openRebirth();

    }else{
        currentPage="upgrades";
        upgradeGrid.style.display="flex";
        rebirthGrid.style.display="none";
        nextPageButton.textContent="Switch to Rebirths";
        openUpgrade();
    }
})



function openRebirth(){
    const grid=document.getElementById("rebirth-grid");
    //reset
    grid.innerHTML="";
const currentRebirth=rebirthList[currentRebirthIndex]


    const rebirthButton=document.createElement("div");

    rebirthButton.className="rebirth-button";
    rebirthButton.innerHTML=
    "<b>"+currentRebirth.title+"</b>"+
    "<span> Cost: "+ currentRebirth.price + "</span>" +
   "<span> Milestone: "+Number(currentRebirthIndex+1)+"</span>"
    rebirthButton.addEventListener("click",()=>{
        if(score>=currentRebirth.price){
            soundClick();

            const confirm=("Are you sure you want to rebirth? This will reset your score and upgrades.")
            if(!confirm){
                console.log("cancel")
                return;
            }
            
           rebirth();
           currentRebirth.effect();
            currentRebirthIndex+=1
            updateUI();
            openRebirth();
        }else{
            alert("You do not have enough score to rebirth.")
        }
    })
rebirthButton.addEventListener("mouseenter",()=>{
    info.style.display="block";
    soundHoverOver();
    info.innerHTML=
    "<span>" + currentRebirth.info + "</span>"
     })
rebirthButton.addEventListener("mouseleave", ()=>{
    info.style.display="none";
    })
    grid.appendChild(rebirthButton);
}

function rebirth(){
     score=0;
            amountPerClick=1;
            combo=0;
            multiplier=1;
            isComboLocked=false;
            critChance=0;
            slicesEaten=0;
            pizzasEaten=0;
            isCooldown=false;
            trackNumber=0;
            bonusPizza=4;
            multiplierGrowth=1;
            critGainMultiplier=1;
            critMultiplier=1;
            powerGain=1;
            amountPerClickBase=1;
            upgradeList.forEach(upgrade=>{
                upgrade.currentCount=0;
                upgrade.price=upgrade.basePrice;
            })
            document.getElementById("comboText").style.display="none"
            clearInterval(autoclick)
            targetImage.style.display="none"
            lockCombo.style.display="none"
            
}
//this actualy turns th list into a lsit of upgrade when you open the nnotepad
function openUpgrade(){
const grid=document.getElementById("upgrade-grid");
//clear everything so stuff dont duplicate
grid.innerHTML=""
//does this for every upgrade in the list

upgradeList.forEach(upgrade=>{
//if you have unlcoekd the upgrade, checker

if(!upgrade.required()){

    return;
}

const maxed=upgrade.currentCount>=upgrade.maxCount;
//be able to customize the box 
const upgradeButton=document.createElement("div");
//start to use more `${} isntead of + this check if maxed is true or not and will give an output of maxed or nothing
upgradeButton.className=`upgrade-button ${maxed ? 'maxed' : ''}`;
// make html and css for each item in the list without having to do it manually shows the title, price, etc
upgradeButton.innerHTML=  
"<b>"+upgrade.title+"</b>"+
"<span> Cost: "+ upgrade.price + "</span>" +
"<span> Level: "+ upgrade.currentCount + "/" + upgrade.maxCount+ "</span>"
//when you click the upgrade
upgradeButton.addEventListener("click", ()=>{
if(maxed)
    return;

if(score>= upgrade.price){
    soundClick();
    //confirms the last upgrade
if(upgrade.id==="12"){
    const confirmEndGame=confirm("Do you want to beat the game and become a PIZZA MASTER?")
    if(!confirmEndGame){
        console.log("cancel")
        return;
    }
    

}
//remove pizzas based on price
score-=upgrade.price;
//increase the count
upgrade.currentCount+=1;
//increase price
upgrade.price=Math.floor(upgrade.price*upgrade.growth);
//does the effect
upgrade.effect();
//update the ui;
updateUI();
//refreshed teh panel 
openUpgrade();

}


})
//hover over teh upgrade
upgradeButton.addEventListener("mouseenter",()=>{
if(!info)return;
info.style.display="block";
soundHoverOver();
//allows you to see inside basically
info.innerHTML=
"<span>" + upgrade.info + "</span>"
 })

//not hovering over
upgradeButton.addEventListener("mouseleave", ()=>{
if(!info) return;
info.style.display="none";


});
//adds teh button to the html/grid
grid.appendChild(upgradeButton);
});
}


//music
const playlist=[
      {title:"Midnight Mellow", src:"audio/music/midnight-mellow.mp3"},

    {title:"After Hours Session", src:"audio/music/after-hours-session.mp3"},
  {title: "Velvet Echoes", src:"audio/music/velvet-echoes.mp3"}
];
//playing teh song
function playSong(a){
trackNumber=a;
//finds the song in the playlist
backgroundMusic.src=playlist[trackNumber].src;
backgroundMusic.volume=0.03;
backgroundMusic.play();

}
//playes the next track
backgroundMusic.addEventListener('ended',()=>{
    //adds 1 the track number and fidn the remainder of tracknumber/total. if it 0 it knows its at the end and loops back
trackNumber=(trackNumber+1)%playlist.length;
playSong(trackNumber);

})
//need to click to start the music
document.addEventListener('click', ()=>{
if(backgroundMusic.paused && backgroundMusic.src===""){
    playSong(0);
}
},{once:true});



// open/close the notepad
closedNotepad.addEventListener('click',()=>{
closedNotepad.style.display='none';
openNotepadContainer.style.display='block';
closeButtonNotepad.style.display='block';
//debug test
console.log("you have opened the notepad");
soundOpenNotepad(1.5);
openUpgrade();
});

closeButtonNotepad.addEventListener('click',()=>{
openNotepadContainer.style.display='none';
closeButtonNotepad.style.display='none';
closedNotepad.style.display='block';
soundOpenNotepad(2);
});

//move target
function moveTarget(){
//finds the pizza size
const pizzaWidth=pizzaImage.clientWidth>0?pizzaImage.clientWidth: 300;
const pizzaHeight=pizzaImage.clientHeight>0?pizzaImage.clientHeight: 300;
//finds the target size
const targetWidth=targetImage.clientWidth>0?targetImage.clientWidth:40;
const targetHeight=targetImage.clientHeight>0?targetImage.clientHeight:40;
//finds the maximun areait can move
const maxX = pizzaWidth - targetWidth;
const maxY = pizzaHeight - targetHeight;
//finds a random positotn
const randomX = Math.random() * maxX;
const randomY = Math.random() * maxY;
//moves there
targetImage.style.top=randomY+"px";
targetImage.style.left=randomX+"px";


}
//satisfying screen shake
function screenShake(){
const container= document.getElementById("pizzaStuff");
container.classList.remove("shake");
void container.offsetWidth;
container.classList.add("shake");
 setTimeout(()=>{
container.classList.remove("shake");

 },150 );
}

//combo lock
lockCombo.addEventListener("click",function(){
isComboLocked=!isComboLocked;
if (isComboLocked){
    lockCombo.src="images/locked.png";
} else {
    lockCombo.src="images/unlock.png";
}

})


//clicking the pizza
pizzaImage.addEventListener("click", function(e) {

if(isCooldown){
    return;
}
soundClickPizza();
//check if it reset
if(!isComboLocked) {
    combo=0;
multiplier=1;
}
//crit
const isCrit=Math.random()<critChance;
if(isCrit){
 critMultiplier =4*critGainMultiplier;
}else{
 critMultiplier=1;
}
slicesEaten+=1;
//calculate the gain
let gain=(amountPerClickBase*amountPerClick*multiplier*critMultiplier)**powerGain;


let slicesRemaining =8-slicesEaten;
pizzaImage.src=`images/pizza/pizza${slicesRemaining}.png`
//8 slices
if(slicesEaten>=8){
gain*= bonusPizza/(amountPerClick*amountPerClickBase);
soundFinishPizza(0.8);
pizzasEaten+=1;
slicesEaten=0;
isCooldown=true;
spawnFloatingText("✨PIZZA FORMED!✨",0,-30,true,"centered");


//cooldown for regen
setTimeout(()=>{

    pizzaImage.src ="images/pizza/pizza8.png";
    isCooldown=false;
},400);
screenShake();
}
if(isCrit){

spawnPopupStack("+"+gain.toFixed(1), "crit");
screenShake();
}else{
  spawnPopupStack("+" + gain.toFixed(1));

}
score+=gain;
updateUI();
});

//popuptext on the right side
function spawnPopupStack(text, type="normal"){
    const popup=document.createElement("div");
    if(type==="crit"){
            popup.className="stackedPopup crit";

    }else{
    popup.className="stackedPopup";
    }
    
    popupStack.appendChild(popup)
    popup.textContent=text;
    setTimeout(() => {
        popup.remove();
    }, 1000);
}



//popup text

function spawnFloatingText(text, x,y, isSpecial=false, customStyle=""){
const popup=document.createElement("div");
popup.className = "popup-text" + (isSpecial ? " crit" : "") +(customStyle?" "+customStyle:"");
popup.textContent=text;

if(customStyle.includes("centered")||(customStyle.includes("stationary-combo"))){
    popup.style.top=y+"px"

}else{
popup.style.left=x+"px"
popup.style.top=y+"px"
}
document.getElementById("pizzaStuff").appendChild(popup);
setTimeout(()=>{
popup.remove();
},1000);
}


//the target
targetImage.addEventListener("click", function(e) {
e.stopPropagation();
if(!isComboLocked){
    combo+=1;
multiplier=1+Math.log(1+combo*0.1*multiplierGrowth);

const gain=(amountPerClickBase*amountPerClick*multiplier*critMultiplier*3)**powerGain
score+=gain;
const localX=targetImage.offsetLeft+e.offsetX;
const localY=targetImage.offsetTop+e.offsetY;

spawnPopupStack("+"+gain.toFixed(1));
const bottomY =pizzaImage.clientHeight+10;

spawnFloatingText("Combo x" + combo, 0, bottomY, false, "stationary-combo");
moveTarget();
updateUI();
}
})
//updates the ui like pizza score and other stuff
function updateUI(){
scoreDisplay.textContent=score.toFixed(1);
comboDisplay.textContent=combo;
multiplierDisplay.textContent=multiplier.toFixed(2);



}
