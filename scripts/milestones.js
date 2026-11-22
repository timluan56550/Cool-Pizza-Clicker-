let milestoneSave={}
document.getElementById("milestone-bar")?.addEventListener("scroll", milestoneArrows);




function openMilestone(){
    const grid=document.getElementById("milestone-grid")
    const milestoneBar=document.getElementById("milestone-bar")



    const scroll=milestoneBar.scrollTop

    grid.innerHTML=""
    milestoneUpgradeList.forEach(upgrade=>{
        if(!upgrade.required()){
            return;
        }  

        const maxed=upgrade.currentCount>=upgrade.maxCount;
        const upgradeButton=document.createElement("div");
        upgradeButton.className=`milestoneUpgrade-button ${maxed ? 'maxed' : ''}`;
        upgradeButton.innerHTML=  
            "<b>"+upgrade.title+"</b>"+
            "<span> Cost: "+ format.format(upgrade.price) + "</span>" +
            "<span> Level: "+ upgrade.currentCount + "/" + upgrade.maxCount+ "</span>"+
            "<span style='color: green;'>"+totalBuff(upgrade)+"</span>"
            
        upgradeButton.addEventListener("click", ()=>{
            if(maxed){
                return;
            }
            if(pizzaBoxCoins>= upgrade.price){
                soundClick();
                pizzaBoxCoins-=upgrade.price;
                upgrade.currentCount+=1;
                upgrade.price=Math.floor(upgrade.price+upgrade.growth);
                upgrade.effect();
                updateUI();
                openMilestone();
            } 
        }) 
        
        upgradeButton.addEventListener("mouseenter",()=>{
            if(!info){
                return;
            }
            info.style.display="block";
            soundHoverOver();
            info.innerHTML=
                "<span>" + upgrade.info + "</span>"
        })
    
        upgradeButton.addEventListener("mouseleave", ()=>{
            if(!info){
                return;
            }
            info.style.display="none";
        });
        
        grid.appendChild(upgradeButton)
    })


    updateMilestoneUI()
    updatePizzaStack()
    
   
    
    //makes it so you start at teh bottom and continue every time the ufnction runs
    //also makes it smooth going downawards
    if(scroll === 0){ 
        milestoneBar.scrollTo({
        top: milestoneBar.scrollHeight,
        behavior: 'smooth' });
         } else { 
        milestoneBar.scrollTo({ 
        top: scroll, behavior: 'smooth' });
     }
     milestoneArrows()
}
function milestoneArrows(){
    const milestoneBar=document.getElementById("milestone-bar")
   if (!milestoneBar || !upArrow || !downArrow) {
    return}
    let above=false
    let below=false;
const boxTop=milestoneBar.scrollTop;
const boxHeight=milestoneBar.clientHeight
    milestoneList.forEach(milestone=>{
        const reached=pizzasEaten>=milestone.requirement
    const claimable= reached && !milestone.claimed;
    if(claimable){
        const save=milestoneSave[milestone.id]
        if(save && save.button){
            //gets the parent of the button so the row
            const row =save.button.parentElement
            const top=row.offsetTop
            if(top<boxTop){
                above=true
            }else if(top>boxTop+boxHeight){
                below=true
            }

        }
    }
    })
    upArrow.style.display= above?"block": "none";
        downArrow.style.display= below?"block": "none";

}

function updatePizzaStack(){
    const towerStack =document.getElementById("tower-stack")
    const milestoneTower=document.getElementById("milestone-tower")
    const towerHeight=milestoneTower.clientHeight
    if(towerHeight===0){
        return;
    }

    const totalBoxes=Math.floor(towerHeight/10)
    for (let x=1; x<=totalBoxes; x++){
    const ratio=x/totalBoxes
    //max*ratio^inverse
    const pizzaRate=10000*Math.pow(ratio, 1/0.55)
    const bottom=(x-1)*10
        //[index='x']
        let existingBox=towerStack.querySelector("[index='"+x+"']")
        //if pizzabox is spawnable and there isnt an exisitng one then
    if(pizzasEaten>=pizzaRate&&!existingBox){
            const pizzaBox=document.createElement("div")
            pizzaBox.className="stacked-box dropping"
            pizzaBox.setAttribute("index", x)
            pizzaBox.style.bottom=bottom+"px"
//sin wave, like a seeded random
            const random=(((Math.abs(Math.sin(x * 12.9898) * 43758.5453) % 1)*8)-4).toFixed(1)+"px"
// 
            pizzaBox.style.setProperty("--random", random)
// This prevents the animation to be played ever again.
            pizzaBox.addEventListener("animationend",()=>{
                pizzaBox.classList.remove("dropping")
            })
            towerStack.appendChild(pizzaBox)

        // else if requirment is met and exisitn box is there
    }else if (pizzasEaten>=pizzaRate && existingBox){
        existingBox.style.bottom=bottom+"px"

        //else if requirment is not met but exisitng box is there
    } else if(!(pizzasEaten>=pizzaRate) && existingBox)
        existingBox.remove()
    

    }
}




function makeMilestones(){
    const milestoneTower=document.getElementById("tower-milestones")
milestoneList.forEach(milestone=>{
    const button=document.createElement("div")
    const dash=document.createElement("div")
    const row=document.createElement("div")
    row.className="milestoneRow"
    dash.className="milestone-dash"

    row.style.top=milestonePosition(milestone.requirement, 10000)
    //adds dash to the row
    row.appendChild(dash)
    row.appendChild(button)
    milestoneTower.appendChild(row)

    button.className="milestone-button"

    const title=document.createElement("span")
    const status=document.createElement("span")
    title.textContent=milestone.title
    status.className="milestone-status"

    button.appendChild(title)
    button.appendChild(status)
    //this saves it so we can use it in antoerh function
    milestoneSave[milestone.id]={button, status, milestone}
    
    
    
    button.addEventListener("click",()=>{
        const reached=pizzasEaten>=milestone.requirement
        //if reached and milestone hasnt been clicked
        const claimable= reached && !milestone.claimed;
        if(!claimable){
            return;
        }
        soundClick()
        milestone.claimed=true
        milestone.effect()
        updateUI()
        updateMilestoneUI()
        milestoneArrows()
        
    })

    button.addEventListener("mouseenter",()=>{
        if(!info){
            return
        }
        info.style.display="block"
        soundHoverOver()
        info.innerHTML="<span>"+milestone.info+"</span>"
    })

     button.addEventListener("mouseleave",()=>{
        if(!info){
            return
        }
        info.style.display="none"
    })


    })
}
function updateMilestoneUI(){
    milestoneList.forEach(milestone=>{
    //transfer varibles
    const save=milestoneSave[milestone.id]
    const {button, status}=save
    
    const reached=pizzasEaten>=milestone.requirement
    const claimable= reached && !milestone.claimed;
    
    button.className="milestone-button";
    if(milestone.claimed){
        button.classList.add("claimed")
    }else if(claimable){
        button.classList.add("claim")
    }

    let statusNow=pizzasEaten+"/"+milestone.requirement
    if(milestone.claimed){
        statusNow="CLAIMED"
    }else if(claimable){
        statusNow="CLAIM"
    }
    status.textContent=statusNow
})
}

function milestonePosition(requirement, maxRequirement){   
    //sqrt but i can edit the formula
    const ratio=Math.pow(requirement/maxRequirement, 0.55)
    const percentage=(1-ratio)*100;
    return percentage+"%"
}
setInterval(()=>{
    if(passivePizzaBoxCoins>0){
        pizzaBoxCoins+=(passivePizzaBoxCoins/25);
        updateUI()
    }
},40)







const milestoneUpgradeList=[
    {
        id: '0',
        title: 'Double Slicer',
        info: 'Eat 2 slices instead of 1 every click',
        price: 15,
        basePrice:15,
        maxCount: 1,
        currentCount: 0,
        growth: 0,
        required: ()=> pizzaBoxCoins>=0,
        effect: ()=> slicePerClick=2,
        buff: (count)=>"Bought"
    },
     {
        id: '1',
        title: 'Reduce Cooldown',
        info: 'Reduce Cooldown to regenerate a pizza by -0.05 per upgrade',
        price: 20,
        basePrice:20,
        maxCount: 4,
        currentCount: 0,
        growth: 20,
        required: ()=> milestoneUpgradeList[0].currentCount>=1,
        effect: ()=> cooldown+=0.05,
        buff: (count)=>"-"+(count*0.05).toFixed(2)+" seconds"
    },
    {
        id: '2',
        title: 'Slices to whole pizzas',
        info: 'Increase pizzas eaten per pizza by +1 per Upgrade',
        price: 45,
        basePrice:50,
        maxCount: 3,
        currentCount: 0,
        growth: 25,
        required: ()=> milestoneUpgradeList[0].currentCount>=1,
        effect: ()=> pizzasEatenMultiplier+=1,
        buff: (count)=>"+"+count+"/pizza"
    },
  
    {
        id: '3',
        title: 'Pizza Multiplier',
        info: '1.5x Pizzas per upgrade',
        price: 30,
        basePrice:30,
        maxCount: 5,
        currentCount: 0,
        growth: 10,
        required: ()=> milestoneUpgradeList[2].currentCount>=1,
        effect: ()=> milestoneMultiplier2*=1.5,
        buff: (count)=>"x"+Math.pow(1.5,count).toFixed(2)+" Pizzas"
    },
    {
        id: '4',
        title: 'Bonus Multiplier',
        info: '1.8x Bonus pizzas per upgrade',
        price: 30,
        basePrice:30,
        maxCount: 5,
        currentCount: 0,
        growth: 10,
        required: ()=> milestoneUpgradeList[2].currentCount>=1,
        effect: ()=> bonusPizzaMultiplier2*=1.8,
        buff: (count)=>"x"+Math.pow(1.8,count).toFixed(2)+" Bonus"
    },
    {
         id: '5',
        title: 'More Pizza Coin',
        info: '+3 Passive pizza coins per upgrade',
        price: 10,
        basePrice:100,
        maxCount: 4,
        currentCount: 0,
        growth: 25,
        required: ()=> (milestoneUpgradeList[3].currentCount>=1 || milestoneUpgradeList[4].currentCount>=1),
        effect: ()=> pizzaPassiveAdd+=3,
        buff: (count)=>"+"+count*3+" Pizza Coins/s"
    },
    {
        id: '6',
        title: 'Yummy Yummy Pizzy',
        info: 'Pizza so Yummy it gives you +2 pizza eaten per pizza',
        price: 200,
        basePrice:200,
        maxCount: 3,
        currentCount: 0,
        growth: 0,
        required: ()=> milestoneUpgradeList[2].currentCount>=3,
        effect: ()=> pizzasEatenMultiplier+=2,
        buff: (count)=>"+"+count*2+"/Pizza"
    },
    
]









const milestoneList =[
{
    id:"0",
    title:'Pizza I',
    requirement: 50,
    info: "Reach 50 Pizza Eaten.<br>Bonuses: <br>1 Passive Pizza Box Coin.<br>1.5x Pizzas",
    claimed: false,
    effect: ()=>{
        passivePizzaBoxCoins+=1;
        milestoneMultiplier=1.5
    }
    },
    {
    id:"1",
    title:'Pizza II',
    requirement: 125,
    info: "Reach 125 Pizza Eaten.<br>Bonuses: <br>2 Passive Pizza Box Coin.<br>2x Pizzas",
    claimed: false,
    effect: ()=>{
        passivePizzaBoxCoins+=1;
        milestoneMultiplier=2
    }
    },
    {
    id:"2",
    title:'Pizza III',
    requirement: 250,
    info: "Reach 250 Pizza Eaten.<br>Bonuses: <br>4 Passive Pizza Box Coin.<br>3x Pizzas",
    claimed: false,
    effect: ()=>{
        passivePizzaBoxCoins+=2;
        milestoneMultiplier=3
           }
    },
     {
    id:"3",
    title:'Pizza IV',
    requirement: 500,
    info: "Reach 500 Pizza Eaten.<br>Bonuses: <br>8 Passive Pizza Box Coin.<br>4x Pizzas<br>2x Bonus Pizza",
    claimed: false,
    effect: ()=>{
        passivePizzaBoxCoins+=4;
        bonusPizzaMultiplier=2
        milestoneMultiplier=4
        
    }
    },
     {
    id:"4",
    title:'Pizza V',
    requirement: 1000,
    info: "Reach 1000 Pizza Eaten.<br>Bonuses: <br>20 Passive Pizza Box Coin.<br>5x Pizzas<br>3x Bonus Pizza<br><b>+0.05 Power</b>",
    claimed: false,
    effect: ()=>{
        passivePizzaBoxCoins+=12;
        bonusPizzaMultiplier=3
        milestoneMultiplier=5
               powerGain+=0.05
    }
    },
    {
    id:"5",
    title:'Pizza VI',
    requirement: 2000,
    info: "Reach 2000 Pizza Eaten.<br>Bonuses: <br>40 Passive Pizza Box Coin.<br>6.5x Pizzas<br>4x Bonus Pizza",
    claimed: false,
    effect: ()=>{
        passivePizzaBoxCoins+=20;
        bonusPizzaMultiplier=4
        milestoneMultiplier=6.5
        
    }
    },
    {
    id:"6",
    title:'Pizza VII',
    requirement: 3500,
    info: "Reach 3500 Pizza Eaten.<br>Bonuses: <br>20 Passive Pizza Box Coin.<br>8x Pizzas<br>5x Bonus Pizza",
    claimed: false,
    effect: ()=>{
        passivePizzaBoxCoins+=12;
        bonusPizzaMultiplier=5
        milestoneMultiplier=8
           }
    },{
    id:"7",
    title:'Pizza VIII',
    requirement: 5000,
    info: "Reach 5000 Pizza Eaten.<br>Bonuses: <br>20 Passive Pizza Box Coin.<br>10x Pizzas<br>6x Bonus Pizza",
    claimed: false,
    effect: ()=>{
        passivePizzaBoxCoins+=12;
        bonusPizzaMultiplier=6
        milestoneMultiplier=10
        

    }
    },{
    id:"8",
    title:'Pizza IX',
    requirement: 7000,
    info: "Reach 7000 Pizza Eaten.<br>Bonuses: <br>20 Passive Pizza Box Coin.<br>12x Pizzas<br>7x Bonus Pizza",
    claimed: false,
    effect: ()=>{
        passivePizzaBoxCoins+=12;
        bonusPizzaMultiplier=7
        milestoneMultiplier=12
           }
    },{
    id:"9",
    title:'Pizza X',
    requirement: 10000,
    info: "Reach 10000 Pizza Eaten.<br>Bonuses: <br>20 Passive Pizza Box Coin.<br>15x Pizzas<br>8x Bonus Pizza",
    claimed: false,
    effect: ()=>{
        passivePizzaBoxCoins+=12;
        bonusPizzaMultiplier=8
        milestoneMultiplier=15
        
    }
    },

]
makeMilestones()