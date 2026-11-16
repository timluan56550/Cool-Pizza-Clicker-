




let score=0;
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
let doubleBakedChance=0
let popupColor=""



let currentPage="upgrades";
let currentRebirthIndex=0;

//rebirth upgrades and vairables
let pizzaCoins=0
let pizzaPassive=0;
let permanentMultiplier=1
let startingScore=0
let autoClickerTime=2000
let autoClickerTimer=null;
let autoComboTime=2000;
let autoComboTimer=null;
let autoUpgradeTimer=null;
function startScore(){
score=startingScore
}
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
    return ((totalUpgradeBonus*scoreSquared*permanentMultiplier*amountPerClickBase*amountPerClick*multiplier*critMultiplier*multi)**powerGain)
}

backgroundMusic.volume=0.07;
const pizzaImage=document.getElementById("pizza")
const targetImage=document.getElementById("target")
const scoreDisplay=document.getElementById("score")
const comboDisplay=document.getElementById("combo")
const multiplierDisplay=document.getElementById("multiplier")
const lockCombo=document.getElementById("lockCombo");
const popupStack = document.getElementById("popup-Stack")
const coinDisplay=document.getElementById("pizzaCoinsDisplay")

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
const refreshPizzaButton=document.getElementById("refresh")

const nextPageButton=document.getElementById("nextPageButton");
const upgradeGrid=document.getElementById("upgrade-grid");
const rebirthGrid=document.getElementById("rebirth-grid");
const coinGrid=document.getElementById("pizza-grid")


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



function openRebirth(){
    const grid=document.getElementById("rebirth-grid");
    grid.querySelectorAll(".rebirth-button").forEach(button=>button.remove());
const currentRebirth=rebirthList[currentRebirthIndex]
    //No more milestone left
    if(!currentRebirth){
        const completionMessage=document.createElement("div");
        completionMessage.className="rebirth-button";
        completionMessage.textContent="All rebirth milestones complete";
        grid.appendChild(completionMessage);
        return;
    }

    const preview =score>=1000000?("+"+(15*Math.sqrt(score/1000000)).toFixed(2)):"Reach amount to Rebirth"
    const rebirthButton=document.createElement("div");

    rebirthButton.className="rebirth-button";
    rebirthButton.innerHTML=
    "<b>"+currentRebirth.title+"</b>"+
    "<span> Cost: "+ format.format(currentRebirth.price) + "</span>" +
   "<span> "+preview+" Pizza Coins"+"</span>"
    rebirthButton.addEventListener("click",()=>{
        if(score>=currentRebirth.price){
            soundClick();

            if(!confirm("Are you sure you want to rebirth? This will reset your score and upgrades.")){
                console.log("cancel")
                return;
            }
            // base is 20, every 10x score gives you +20 currency
            let bonusCoins=(25*Math.sqrt(score/1000000))
            pizzaCoins+=bonusCoins

            //every time you milstone reset, multiply passive by 2 base is 1
            if(pizzaPassive===0){
                pizzaPassive=1;
            }else{
                pizzaPassive*=2
            }


           rebirth();
           currentRebirth.effect();
            currentRebirthIndex+=1
            startScore()
            updateUI();
            openRebirth();
            console.log("rebirthed")
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
    screenShake()
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
            clearInterval(autoComboTimer)
            targetImage.style.display="none"
            lockCombo.style.display="none"
            lockCombo.src="images/unlock.png";

            
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
    "<span> Cost: "+ format.format(upgrade.price) + "</span>" +
    "<div id='LevelandBuff'>"+
    "<span> Level: "+ upgrade.currentCount + "/" + upgrade.maxCount+ "</span>"+
    "<span style='color: green;'>"+totalBuff(upgrade)+"</span>"+
    "</div>"

    //when you click the upgrade
    upgradeButton.addEventListener("click", ()=>{
        if(maxed){
            return;
         }
         if(score>= upgrade.price){
            soundClick();
            //confirms the last upgrade
            // if(upgrade.id==="12"){
            //     const confirmEndGame=confirm("Do you want to beat the game and become a PIZZA MASTER?")
            //         if(!confirmEndGame){
            //             console.log("cancel")
            //             return;
            //         }
            // }
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
    grid.appendChild(upgradeButton)

    })
}



function openCoinShop(){
    const grid=document.getElementById("pizza-grid");
    grid.innerHTML="";



    pizzaCoinUpgradeList.forEach(upgrade=>{
        if(!upgrade.required()){
            return;
        }
        const maxed=upgrade.currentCount>=upgrade.maxCount;
        const upgradeButton=document.createElement("div");


        upgradeButton.className=`pizza-button ${maxed ? 'maxed' : ''}`;


        //auto upgrade, upgrade
        if(upgrade.toggleable&&maxed){
        upgradeButton.classList.add(upgrade.isActive ? "toggleOn":"toggleOff")

        upgradeButton.innerHTML=  
        "<b>"+upgrade.title+"</b>"+
        "<span> "+ (upgrade.isActive ?"ON":"OFF") + "</span>" +
        "<span>"+"(Click to Toggle)" +"</span>"
        }else{
            upgradeButton.innerHTML=  
        "<b>"+upgrade.title+"</b>"+
        "<span> Cost: "+ upgrade.price + "</span>" +
        "<div id='LevelandBuff'>"+
        "<span> Level: "+ upgrade.currentCount + "/" + upgrade.maxCount+ "</span>"+
        "<span style='color: green;'>"+totalBuff(upgrade)+"</span>"+
        "</div>"
        }
        
        upgradeButton.addEventListener("click",()=>{
            if(upgrade.toggleable&&maxed){
                    soundClick()

                //flipps it
                    upgrade.isActive=!upgrade.isActive
                    //refresh UI
                    openCoinShop()
                    return;
            }
            
            if (maxed){
                return;
            }

            if(pizzaCoins>=upgrade.price){
            soundClick()
            pizzaCoins-=upgrade.price;
            upgrade.currentCount+=1;
            upgrade.price=Math.floor(upgrade.price+upgrade.growth);
            upgrade.effect();
            updateUI();
            openCoinShop()
        }
    })

    upgradeButton.addEventListener("mouseenter",()=>{
        if(!info)return;
        info.style.display="block";
        soundHoverOver()
        info.innerHTML="<span>" + upgrade.info + "</span>"
    })

    upgradeButton.addEventListener("mouseleave", ()=>{
        if(!info)return;
        info.style.display="none"
    })
    grid.appendChild(upgradeButton)
    })

};



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

//popuptext on the right side
function spawnPopupStack(text, type="normal", color=""){
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

let activeFloatingText=null;
function spawnFloatingText(text, x,y, classes) {
    const isCombo=classes.includes("stationary-combo")
    //this removes teh previos one
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
setTimeout(()=>{
popup.remove();
//resets
if(activeFloatingText===popup){
    activeFloatingText=null;
}
},1000);
}

//updates the ui like pizza score and other stuff


setInterval(()=>{
    if(pizzaPassive>0){
        pizzaCoins+=pizzaPassive/25;
        updateUI()
    }
},40)

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









//these are the upgrades rebirth
//for index 2 of rebirths 2nd array
function startAutoBaker(){
    clearInterval(autoClickerTimer)
    autoClickerTimer=setInterval(() => {
        const upgrade=pizzaCoinUpgradeList.find(upgrade=>upgrade.id==="3")
        if(upgrade.currentCount>=upgrade.maxCount&&!upgrade.isActive){
            return;
        }
        pizzaClick(true)
    }, autoClickerTime);
}

function startAutoComboClicker(){
    clearInterval(autoComboTimer)
   
    autoComboTimer=setInterval(()=>{
         const upgrade=pizzaCoinUpgradeList.find(upgrade=>upgrade.id==="4")
        if(upgrade.currentCount>=upgrade.maxCount&&!upgrade.isActive){
            return;
        }
        combo+=1;
        multiplier=1+Math.log(1+combo*0.1*multiplierGrowth);
        const gain=calculateGain(3)
        score+=gain;
        const bottomY =pizzaImage.clientHeight+10;
        spawnPopupStack("+"+(formatShort.format(gain)),"normal", "#F93F3F");
        spawnFloatingText("Combo x" + combo, 0, bottomY,"stationary-combo");
        updateUI();
    }, autoComboTime)
}






function startAutoUpgrade(){
    clearInterval(autoUpgradeTimer)
    autoUpgradeTimer=setInterval(()=>{
        const upgrade=pizzaCoinUpgradeList.find(upgrade=>upgrade.id==="5")
        if(upgrade.currentCount>=upgrade.maxCount&&!upgrade.isActive){
            return;
        }
        let cheapestUpgrade=null;
        let lowestPrice=Infinity;

        upgradeList.forEach(upgrade=>{
            const maxed=upgrade.currentCount>=upgrade.maxCount
            const unlocked=upgrade.required();

            if (upgrade.price<lowestPrice){
                if (!maxed&&unlocked){
                lowestPrice=upgrade.price
                cheapestUpgrade=upgrade;
                }
            }
        })
        if(cheapestUpgrade&& score>=cheapestUpgrade.price){
            //subtract score, increase by 1, effect, and change price
            score-=cheapestUpgrade.price
            cheapestUpgrade.currentCount+=1
            cheapestUpgrade.effect()
            cheapestUpgrade.price=Math.floor(cheapestUpgrade.price*cheapestUpgrade.growth);
            updateUI()
            if(currentPage==="upgrades"){
                openUpgrade()
            }
        }
    },500)
}

function totalBuff(upgrade){
    if(upgrade.currentCount===0||!upgrade.buff){
        return "";
    }
    return upgrade.buff(upgrade.currentCount)
    
}
function totalUpgrades(){
    let total=0
    upgradeList.forEach(upgrade=>{
        total+=upgrade.currentCount
    })
    return total
}










function updateUI(){
scoreDisplay.textContent=format.format(score)
comboDisplay.textContent=combo;
multiplierDisplay.textContent=multiplier.toFixed(2);

coinDisplay.textContent="Pizza Coins:"+(pizzaCoins.toFixed(2));
}
updateUI()