const refreshPizzaButton=document.getElementById("refresh")

const pizzaImages=[
    "images/pizza/pizza8.png", "images/pizza/pizza7.png", "images/pizza/pizza6.png",
    "images/pizza/pizza5.png", "images/pizza/pizza4.png", "images/pizza/pizza3.png",
    "images/pizza/pizza2.png", "images/pizza/pizza1.png", "images/pizza/pizza0.png"
]
const permImage= pizzaImages.map(src=>{
    const img=new Image();
    img.src=src;
    return img;
})
    const imgArray=pizzaImages
let refreshing=""
let refreshing2=""
let timeRefresh=0
refreshPizzaButton.addEventListener("click",()=>{
soundClick()
clearInterval(refreshing)
clearTimeout(refreshing2)
    refreshing =setInterval(() => {
        
        pizzaImages.forEach(src=>{
            const img=new Image();
           img.src=src
        })
        timeRefresh+=3000
    console.log("Refreshed: "+timeRefresh)
    },3000);


refreshing2 =setTimeout(()=>{
    clearInterval(refreshing)
},60000)
})





//PIZZA 
let score=1000000;
let amountPerClick=1;
let multiplier=1;
let slicesEaten=0;
let pizzasEaten=0;
let isCooldown=false;
let powerGain=1;
let amountPerClickBase=1;
let doubleBakedChance=0
let bonusPizza=4;
let multiplierGrowth=1;
//COMBO
let combo=0;
let isComboLocked=false;
//CRIT
let critChance=0;
let critGainMultiplier=1;
let critMultiplier=1;
//MUSIC
let trackNumber=0;
let backgroundMusic=new Audio();
backgroundMusic.volume=0.07;
//UI
let popupColor=""
let currentPage="upgrades";
let activeFloatingText=null;


//REBIRTH
let currentRebirthIndex=0;
let pizzaCoins=10000000
let pizzaPassive=0;
//PIZZA PERMANENT
let permanentMultiplier=1
let startingScore=0
//AUTOMATION
let autoClickerTime=2000
let autoClickerTimer=null;
//
let autoComboTime=2000;
let autoComboTimer=null;
//
let autoUpgradeTimer=null;
//main UI
const pizzaImage=document.getElementById("pizza")
const targetImage=document.getElementById("target")
const scoreDisplay=document.getElementById("score")
const comboDisplay=document.getElementById("combo")
const multiplierDisplay=document.getElementById("multiplier")
const lockCombo=document.getElementById("lockCombo");
const popupStack = document.getElementById("popup-Stack")
//Notepad ui
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
//inside the notepad ui
const nextPageButton=document.getElementById("nextPageButton");
const upgradeGrid=document.getElementById("upgrade-grid");
const rebirthGrid=document.getElementById("rebirth-grid");
const coinGrid=document.getElementById("pizza-grid")
const coinDisplay=document.getElementById("pizzaCoinsDisplay")


function calculateGain(multi=1){
        const upgrade12=upgradeList.find(upgrade=>upgrade.id==="12")
    const upgrade14=upgradeList.find(upgrade=>upgrade.id==="14")

    let totalLevels=totalUpgrades()
    let totalUpgradeBonus=1+(totalLevels*(0.02+(0.01*upgrade14.currentCount)))
    let scoreSquared=1;
    //find thes upgrade
    if(upgrade12.currentCount>0 && score>1){
        scoreSquared=1+(Math.log(score)*0.05*upgrade12.currentCount)
    }
    return ((
    totalUpgradeBonus*scoreSquared*permanentMultiplier*
    amountPerClickBase*amountPerClick*multiplier*
    critMultiplier*multi)**powerGain)
}

//let the audio play multiple times overlapping
//SOUND AND MUSISC
function soundClick(){
const cloneSound=click.cloneNode();
cloneSound.volume=0.1;
cloneSound.play();
}
function soundHoverOver(){
const cloneHoverOver=hoverOver.cloneNode();
cloneHoverOver.volume=0.1;
cloneHoverOver.play();
}
function soundClickPizza(){
const clonePizza=clickPizza.cloneNode();
clonePizza.volume=0.03;
clonePizza.play();
}

function soundFinishPizza(a){
const cloneFinishPizza=finishPizza.cloneNode();
cloneFinishPizza.volume=0.02;
cloneFinishPizza.playbackRate=a;
cloneFinishPizza.play();
}
function soundOpenNotepad(a){
const cloneNotepad=openNotepad.cloneNode();
cloneNotepad.volume=0.05;
cloneNotepad.playbackRate=a;
cloneNotepad.play();
}
const playlist=[
    {title:"Midnight Mellow", src:"audio/music/midnight-mellow.mp3"},
    {title:"After Hours Session", src:"audio/music/after-hours-session.mp3"},
    {title: "Velvet Echoes", src:"audio/music/velvet-echoes.mp3"}
];

function playSong(a){
trackNumber=a;
backgroundMusic.src=playlist[trackNumber].src;
backgroundMusic.volume=0.03;
backgroundMusic.play();
}

backgroundMusic.addEventListener('ended',()=>{
trackNumber=(trackNumber+1)%playlist.length;
playSong(trackNumber);
})

document.addEventListener('click', ()=>{
if(backgroundMusic.paused && backgroundMusic.src===""){
    playSong(0);
}
},{once:true});








nextPageButton.addEventListener("click",()=>{
    soundOpenNotepad(1.5);
    if(currentPage==="upgrades"){
        currentPage="rebirths";
        upgradeGrid.style.display="none";
        rebirthGrid.style.display="flex";
        coinDisplay.style.display="block";
        coinGrid.style.display="flex"
        nextPageButton.textContent="Switch to Upgrades";
        openCoinShop()
        openRebirth();

    }else{
        currentPage="upgrades";
        upgradeGrid.style.display="flex";
        rebirthGrid.style.display="none";
                coinDisplay.style.display="none";

        coinGrid.style.display="none"

        nextPageButton.textContent="Switch to Rebirths";
        openUpgrade();
    }
})










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
if(!pizzaImage || !targetImage){
    return;
}

const pizzaWidth = pizzaImage.clientWidth > 0 ? pizzaImage.clientWidth : 300;
const pizzaHeight = pizzaImage.clientHeight > 0 ? pizzaImage.clientHeight : 300;
const targetWidth = targetImage.clientWidth > 0 ? targetImage.clientWidth : 40;
const targetHeight = targetImage.clientHeight > 0 ? targetImage.clientHeight : 40;
const maxX = Math.max(0, pizzaWidth - targetWidth);
const maxY = Math.max(0, pizzaHeight - targetHeight);
const randomX = Math.random() * maxX;
const randomY = Math.random() * maxY;

targetImage.style.top = randomY + "px";
targetImage.style.left = randomX + "px";
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
pizzaImage.addEventListener("click", ()=>{
pizzaClick(false)
} )
function pizzaClick(auto){


if(isCooldown){
    return;
}
popupColor=""
if(!auto){
soundClickPizza();
//check if it reset
if(!isComboLocked) {
    combo=0;
multiplier=1;
}
}
//crit
const isCrit=Math.random()<critChance;
if(isCrit){
 critMultiplier =4*critGainMultiplier;
}else{
 critMultiplier=1;
}


slicesEaten+=1;
slicesEaten=Math.max(0, Math.min(8,slicesEaten))
//calculate the gain
let gain=calculateGain(1);

pizzaImage.src=imgArray[slicesEaten]

//8 slices
if(slicesEaten>=8){
gain*= bonusPizza/(amountPerClick*amountPerClickBase);


if(doubleBakedChance>0&&Math.random()<doubleBakedChance){
    gain*=1000
    popupColor="#00FF98"
}else{
    popupColor="#e6cd12"
}
soundFinishPizza(0.8);
pizzasEaten+=1;
slicesEaten=0;
isCooldown=true;
spawnFloatingText("✨PIZZA FORMED!✨",0,-30,"crit centered");


//cooldown for regen
setTimeout(()=>{

    pizzaImage.src ="images/pizza/pizza8.png";
    isCooldown=false;
},400);
screenShake();
}
if(isCrit){

spawnPopupStack("+"+formatShort.format(gain), "crit");
screenShake();
}else{
  spawnPopupStack("+" + formatShort.format(gain), "normal", popupColor);

}

score+=gain;
updateUI();
};





//popup text



//the target
targetImage.addEventListener("click", function(e) {
e.stopPropagation();
if(!isComboLocked){
    combo+=1;
multiplier=1+Math.log(1+combo*0.1*multiplierGrowth);

const gain=calculateGain(3)
score+=gain;
const localX=targetImage.offsetLeft+e.offsetX;
const localY=targetImage.offsetTop+e.offsetY;

spawnPopupStack("+"+formatShort.format(gain), "normal", "#F93F3F");
const bottomY =pizzaImage.clientHeight+10;

spawnFloatingText("Combo x" + combo, 0, bottomY, "stationary-combo");
moveTarget();
updateUI();
}
})



//updates the ui like pizza score and other stuff




//this formats large numbers into Million billion trillion, 
const format=new Intl.NumberFormat("en-US",{
    notation: "compact",
    compactDisplay: "long",
    maximumFractionDigits: 2
})
const formatShort=new Intl.NumberFormat("en-US",{
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2
})









//popuptext on the left side
function spawnPopupStack(text, type="normal", color=""){
    if(!popupStack){
        return;
    }
    const popup=document.createElement("div");
    if(type==="crit"){
            popup.className="stackedPopup crit";

    }else{
    popup.className="stackedPopup";
    }
    if(color){
        popup.style.color=color
    }
    popupStack.appendChild(popup)
    popup.textContent=text;
    setTimeout(() => {
        popup.remove();
    }, 1000);
}


//example spawnFloatingText("Banana", -30, 0, "large")
function spawnFloatingText(text, x,y, classes) {
    //cancel
    const isCombo=classes.includes("stationary-combo")
    if(isCombo&&activeFloatingText){
        activeFloatingText.remove()
    }
    const popup=document.createElement("div");
    popup.className = "popup-text " + classes;
    popup.textContent=text;
    popup.style.top=y+"px"

    if(!classes.includes("centered")&&!isCombo){
    popup.style.left=x+"px"
    }

    document.getElementById("pizzaStuff").appendChild(popup);

    if(isCombo){
    activeFloatingText=popup
    }
    //Timout
    setTimeout(()=>{
        popup.remove();
        if(activeFloatingText===popup){
            activeFloatingText=null;
        }
    },1000);
}



function updateUI(){
if(scoreDisplay){
    scoreDisplay.textContent=format.format(score)
}
if(comboDisplay){
    comboDisplay.textContent=combo;
}
if(multiplierDisplay){
    multiplierDisplay.textContent=multiplier.toFixed(2);
}
if(coinDisplay){
    coinDisplay.textContent="Pizza Coins:"+(pizzaCoins.toFixed(2));
}
}
updateUI()