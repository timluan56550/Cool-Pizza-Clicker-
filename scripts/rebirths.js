//VARIBALES I HAVE TO PUT TO NOT GET ERROSs


function startScore(){
score=startingScore
}


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
    const preview=calcPizzaCoins(score, currentRebirth.target, false, currentRebirth.price)

   
    const rebirthButton=document.createElement("div");

    rebirthButton.className="rebirth-button";
    rebirthButton.innerHTML=
    "<b>"+currentRebirth.title+"</b>"+
    "<span> Cost: "+ format.format(currentRebirth.price) + "</span>" +
   "<span>"+preview+"</span>"
    rebirthButton.addEventListener("click",()=>{
        if(score>=currentRebirth.price){
            soundClick();

            if(!confirm("Are you sure you want to rebirth? This will reset your score and upgrades.")){
                console.log("cancel")
                return;
            }
            // base is 20, every 10x score gives you +20 currency
            let bonusCoins=calcPizzaCoins(score, currentRebirth.target, true, currentRebirth.price)
            pizzaCoins+=bonusCoins*pizzaCoinMultiplier

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
            openTabs()
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
function calcPizzaCoins(score, target, onlyNumber, price){
    if (score<price){
        return "Reach amount to Rebirth"
    }
    //0.6 is the max 0.17 is the half way
    let total =target+target*(0.6*(Math.log10(score/price)/(Math.log10(score/price)+0.18))) 
    if(onlyNumber){
        return total
    }else{
    return "+"+format.format(total)+" Pizza Coins"
    }
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
      


function openCoinShop(){
    const grid=document.getElementById("pizza-grid");
    grid.innerHTML="";



    pizzaCoinUpgradeList.forEach(upgrade=>{
        if(!upgrade.required()){
            return;
        }
        const maxed=upgrade.currentCount>=upgrade.maxCount;
        const upgradeButton=document.createElement("div");

        if (upgrade.title.includes("AUTOMATION")) {
                    upgradeButton.className=`pizza-button automation-button ${maxed ? 'maxed' : ''}`;

        }else{
                    upgradeButton.className=`pizza-button ${maxed ? 'maxed' : ''}`;

        }


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


setInterval(()=>{
    if(pizzaPassive>0){
        pizzaCoins+=((pizzaPassive+pizzaPassiveAdd)/25)*pizzaCoinMultiplier;
        updateUI()
    }
},40)




//UPGRADES EFFECT


function startAutoBaker(){
    clearInterval(autoClickerTimer)
    autoClickerTimer=setInterval(() => {
        const upgrade=pizzaCoinUpgradeList.find(upgrade=>upgrade.title==="AUTOMATION: Auto Baker")
        if(upgrade.currentCount>=upgrade.maxCount&&!upgrade.isActive){
            return;
        }
        pizzaClick(true)
    }, autoClickerTime);
}

function startAutoComboClicker(){
    clearInterval(autoComboTimer)
   
    autoComboTimer=setInterval(()=>{
         const upgrade=pizzaCoinUpgradeList.find(upgrade=>upgrade.title==="AUTOMATION: Combo Assist")
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
        const upgrade=pizzaCoinUpgradeList.find(upgrade=>upgrade.title==="AUTOMATION: Upgrade buyer")
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

//UPGRADES AND MILESTONES


const rebirthList= [
    {
        title:'First Rebirth',
        info:'Resets your progress.<br>Bonuses: <br>1.5x CpC <br>1.5x Bonus Pizza <br>1.25x Crits <br>3% Crit chance <br>+1 Passive Pizza Coin Per Sec',
        price: 1000000,
        target:15,
        effect: ()=>{
            amountPerClick*=1.5;
            bonusPizza*=1.5;
            critGainMultiplier*=1.25;
            critChance+=0.03;
        }
    },
      {
        title:'Second Rebirth',
        info:'Resets your progress. <br>Bonuses: 2.5x CpC<br>2.5x Bonus Pizza<br>1.5x Crits<br>5% Crit chance<br>+2 Passive Pizza Coin Per Sec<br><b>UNLOCK MILESTONES<b> ',
        price: 100000000,
        target: 250,
        effect: ()=>{
            amountPerClick*=2.5;
            bonusPizza*=2.5;
            critGainMultiplier*=1.5;
            critChance+=0.05;
        }
    },
     {
        title:'Third Rebirth',
        info:'Resets your progress. Bonuses: 5x CpC, 4x Bonus Pizza, 2x Crits, 7% Crit chance <br>+4 Passive Pizza Coin Per Sec',
        price: 50000000000,
target: 600,
        effect: ()=>{
            amountPerClick*=5;
            bonusPizza*=4;
            critGainMultiplier*=2;
            critChance+=0.07;
        }
    },
    {
        title:'Fourth Rebirth',
        info:'Resets your progress. Bonuses: 8x CpC, 6x Bonus Pizza, 3x Crits, 10% Crit chance <br>+8 Passive Pizza Coin Per Sec',
        price: 50000000000000,
        target: 1000,

        effect: ()=>{
            amountPerClick*=8;
            bonusPizza*=6;
            critGainMultiplier*=3;
            critChance+=0.1;
        }
    },
]
// id:
// title:
// info:
// price:
// maxCount:
// currentCount:
// growth:
// required:
// effect:
const pizzaCoinUpgradeList=[
    {
        id: '0',
        title: 'Golden Pizza',
        info: 'Increase all pizza gains by +10% per level',
        price: 10,
        maxCount: 30,
        currentCount: 0,
        growth: 10,
        required: ()=> pizzaCoins>=0,
        effect: ()=> permanentMultiplier+=0.1,
        buff: (count)=>"+"+count*10+"%"
    },
    {
        id: '1',
        title: 'Fresh Pizza',
        info: 'Start every rebirth with 100 Pizzas, 3x per upgrade,',
        price: 5,
        basePrice:5,
        maxCount: 6,
        currentCount: 0,
        growth: 5,
        required: ()=> pizzaCoins>=0,
        effect: ()=> {if (startingScore===0){
            startingScore=100
        }else{
            startingScore*=3
        }
    },
            buff: (count)=>formatShort.format(100*Math.pow(3,count-1))+" Pizzas"


},   {
        id: '2',
        title: 'Stack Even Faster',
        info: '+3 pizzas Eaten gain per pizza per upgrade',
        price: 1000,
        basePrice:1000,
        maxCount: 3,
        currentCount:0, 
        growth: 200,
        required: ()=> currentRebirthIndex>=3&&milestoneUpgradeList[6].currentCount>=3,
        effect: ()=>pizzasEatenMultiplier+=3,
        buff: (count)=>"+"+count*3+"/Pizza"


},

{
        id: '3',
        title: 'AUTOMATION:',
        info: 'Unlock automation',
        price: 0,
        basePrice:0,
        maxCount: 1,
        currentCount: 0,
        growth: 0,
        required: ()=> pizzaCoins>=0,
        effect: ()=> {
        }
    },
{
        id: '4',
        title: 'AUTOMATION: Auto Baker',
        info: 'Automatically clicks the pizza every second, 2x speed per upgrade',
        price: 30,
        basePrice:20,
        maxCount: 4,
        currentCount: 0,
        growth: 30,
        toggleable:true,
        isActive:true,
        required: ()=> pizzaCoinUpgradeList[3].currentCount>=1,
        effect: ()=> {autoClickerTime*=0.5
        startAutoBaker()
        }
    },
    {
        id: '5',
        title: 'AUTOMATION: Combo Assist',
        info: 'Increases the speed of the Combo autoclicker by 2x per upgrade',
        price: 50,
        basePrice:50,
        maxCount: 3,
        currentCount: 0,
        growth: 50,
        toggleable:true,
        isActive:true,
        required: ()=> pizzaCoinUpgradeList[3].currentCount>=1,
        effect: ()=> {
            autoComboTime*=0.5
            if(upgradeList[4].currentCount>0){
                startAutoComboClicker()
            }
            }
            
    },
    {
        id: '6',
        title: 'AUTOMATION: Upgrade buyer',
        info: 'Automatically buys the cheapest upgrade.',
        price: 100,
        basePrice:100,
        maxCount: 1,
        currentCount: 0,
        growth: 1,
        toggleable:true,
        isActive:true,
        required: ()=> pizzaCoinUpgradeList[3].currentCount>=1,
        effect: ()=> {
            startAutoUpgrade()
        }
    },
]