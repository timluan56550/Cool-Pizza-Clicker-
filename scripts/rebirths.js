const rebirthList= [
    {
        title:'First Rebirth',
        info:'Resets your progress.<br>Bonuses: <br>1.5x CpC <br>1.5x Bonus Pizza <br>1.5x Crits <br>5% Crit chance <br>+1 Passive Pizza Coin Per Sec',
        price: 1000000,
        effect: ()=>{
            amountPerClick*=1.5;
            bonusPizza*=1.5;
            critGainMultiplier*=1.5;
            critChance+=0.05;
        }
    },
      {
        title:'Second Rebirth',
        info:'Resets your progress. Bonuses: 2.5x CpC, 2.5x Bonus Pizza, 2.5x Crits, 5% Crit chance <br>+2 Passive Pizza Coin Per Sec',
        price: 100000000,

        effect: ()=>{
            amountPerClick*=2.5;
            bonusPizza*=2.5;
            critGainMultiplier*=2.5;
            critChance+=0.05;
        }
    },
     {
        title:'Third Rebirth',
        info:'Resets your progress. Bonuses: 5x CpC, 4x Bonus Pizza, 4x Crits, 10% Crit chance <br>+4 Passive Pizza Coin Per Sec',
        price: 1000000000,

        effect: ()=>{
            amountPerClick*=5;
            bonusPizza*=4;
            critGainMultiplier*=4;
            critChance+=0.1;
        }
    },
    {
        title:'Fourth Rebirth',
        info:'Resets your progress. Bonuses: 8x CpC, 6x Bonus Pizza, 6x Crits, 15% Crit chance <br>+8 Passive Pizza Coin Per Sec',
        price: 100000000000,

        effect: ()=>{
            amountPerClick*=8;
            bonusPizza*=6;
            critGainMultiplier*=6;
            critChance+=0.15;
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
        maxCount: 25,
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


},

{
        id: '2',
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
        id: '3',
        title: 'AUTOMATION: Auto Baker',
        info: 'Automatically clicks the pizza every second, 2x speed per upgrade',
        price: 40,
        basePrice:40,
        maxCount: 4,
        currentCount: 0,
        growth: 30,
        toggleable:true,
        isActive:true,
        required: ()=> pizzaCoinUpgradeList[2].currentCount>=1,
        effect: ()=> {autoClickerTime*=0.5
        startAutoBaker()
        }
    },
    {
        id: '4',
        title: 'AUTOMATION: Combo Assist',
        info: 'Increases the speed of the Combo autoclicker by 2x per upgrade',
        price: 50,
        basePrice:50,
        maxCount: 3,
        currentCount: 0,
        growth: 50,
        toggleable:true,
        isActive:true,
        required: ()=> pizzaCoinUpgradeList[2].currentCount>=1,
        effect: ()=> {
            autoComboTime*=0.5
            if(upgradeList[4].currentCount>0){
                startAutoComboClicker()
            }
            }
            
    },
    {
        id: '5',
        title: 'AUTOMATION: Upgrade buyer',
        info: 'Automatically buys the cheapest upgrade.',
        price: 100,
        basePrice:100,
        maxCount: 1,
        currentCount: 0,
        growth: 1,
        toggleable:true,
        isActive:true,
        required: ()=> pizzaCoinUpgradeList[2].currentCount>=1,
        effect: ()=> {autoUpgrade=true
            startAutoUpgrade()
        }
    },
]