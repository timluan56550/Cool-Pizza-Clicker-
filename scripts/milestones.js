let milestoneSave={}





function openMilestone(){
    const milestoneGrid=document.getElementById("milestone-grid")
    const milestoneBar=document.getElementById("milestone-bar")

    const scroll=milestoneBar.scrollTop
    
    updateMilestoneUI()
    updatePizzaStack()
    
   
    
    //makes it so you start at teh bottom and continue every time the ufnction runs
    if(scroll===0){
    milestoneBar.scrollTop=milestoneBar.scrollHeight
    }else{
        milestoneBar.scrollTop=scroll
    }
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

const milestoneList =[
{
    id:"0",
    title:'Pizza I',
    requirement: 50,
    info: "Reach 50 Full Pizzas.<br>Bonuses: <br>1 Passive Pizza Box Coin.<br>1.5x Pizzas",
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
    info: "Reach 125 Full Pizzas.<br>Bonuses: <br>2 Passive Pizza Box Coin.<br>2x Pizzas<br>1.5x Pizza Coins",
    claimed: false,
    effect: ()=>{
        passivePizzaBoxCoins+=1;
        milestoneMultiplier=2
        pizzaCoinMultiplier=1.5
    }
    },
    {
    id:"2",
    title:'Pizza III',
    requirement: 250,
    info: "Reach 250 Full Pizzas.<br>Bonuses: <br>4 Passive Pizza Box Coin.<br>3x Pizzas<br>2x Pizza Coins",
    claimed: false,
    effect: ()=>{
        passivePizzaBoxCoins+=2;
        milestoneMultiplier=3
        pizzaCoinMultiplier=2
    }
    },
     {
    id:"3",
    title:'Pizza IV',
    requirement: 500,
    info: "Reach 500 Full Pizzas.<br>Bonuses: <br>8 Passive Pizza Box Coin.<br>5x Pizzas<br>5x Bonus Pizza<br>3x Pizza Coins<br>",
    claimed: false,
    effect: ()=>{
        passivePizzaBoxCoins+=4;
        bonusPizzaMultiplier=5
        milestoneMultiplier=5
        pizzaCoinMultiplier=3
    }
    },
     {
    id:"4",
    title:'Pizza V',
    requirement: 1000,
    info: "Reach 1000 Full Pizzas.<br>Bonuses: <br>20 Passive Pizza Box Coin.<br>10x Pizzas<br>8x Bonus Pizza<br>5x Pizza Coins<br>Power +0.05",
    claimed: false,
    effect: ()=>{
        passivePizzaBoxCoins+=12;
        bonusPizzaMultiplier=8
        milestoneMultiplier=10
        pizzaCoinMultiplier=5
        powerGain+=0.05
    }
    },
    {
    id:"5",
    title:'Pizza VI',
    requirement: 2000,
    info: "Reach 2000 Full Pizzas.<br>Bonuses: <br>20 Passive Pizza Box Coin.<br>10x Pizzas<br>8x Bonus Pizza<br>5x Pizza Coins<br>Power +0.05",
    claimed: false,
    effect: ()=>{
        passivePizzaBoxCoins+=12;
        bonusPizzaMultiplier=8
        milestoneMultiplier=10
        pizzaCoinMultiplier=5
        powerGain+=0.05
    }
    },
    {
    id:"6",
    title:'Pizza VII',
    requirement: 3500,
    info: "Reach 3500 Full Pizzas.<br>Bonuses: <br>20 Passive Pizza Box Coin.<br>10x Pizzas<br>8x Bonus Pizza<br>5x Pizza Coins<br>Power +0.05",
    claimed: false,
    effect: ()=>{
        passivePizzaBoxCoins+=12;
        bonusPizzaMultiplier=8
        milestoneMultiplier=10
        pizzaCoinMultiplier=5
        powerGain+=0.05
    }
    },{
    id:"7",
    title:'Pizza VIII',
    requirement: 5000,
    info: "Reach 5000 Full Pizzas.<br>Bonuses: <br>20 Passive Pizza Box Coin.<br>10x Pizzas<br>8x Bonus Pizza<br>5x Pizza Coins<br>Power +0.05",
    claimed: false,
    effect: ()=>{
        passivePizzaBoxCoins+=12;
        bonusPizzaMultiplier=8
        milestoneMultiplier=10
        pizzaCoinMultiplier=5
        powerGain+=0.05
    }
    },{
    id:"8",
    title:'Pizza IX',
    requirement: 7000,
    info: "Reach 7000 Full Pizzas.<br>Bonuses: <br>20 Passive Pizza Box Coin.<br>10x Pizzas<br>8x Bonus Pizza<br>5x Pizza Coins<br>Power +0.05",
    claimed: false,
    effect: ()=>{
        passivePizzaBoxCoins+=12;
        bonusPizzaMultiplier=8
        milestoneMultiplier=10
        pizzaCoinMultiplier=5
        powerGain+=0.05
    }
    },{
    id:"9",
    title:'Pizza X',
    requirement: 10000,
    info: "Reach 10000 Full Pizzas.<br>Bonuses: <br>20 Passive Pizza Box Coin.<br>10x Pizzas<br>8x Bonus Pizza<br>5x Pizza Coins<br>Power +0.05",
    claimed: false,
    effect: ()=>{
        passivePizzaBoxCoins+=12;
        bonusPizzaMultiplier=8
        milestoneMultiplier=10
        pizzaCoinMultiplier=5
        powerGain+=0.05
    }
    },

]
makeMilestones()