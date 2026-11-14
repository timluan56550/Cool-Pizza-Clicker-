const rebirthList= [
    {
        title:'First Rebirth',
        info:'Resets your progress. Bonuses: 1.5x CpC, 1.5x Bonus Pizza, 1.5x Crits, 5% Crit chance',
        price: 1000000,
        required: ()=>upgradeList[10].currentCount>=3,
        effect: ()=>{
            amountPerClick*=1.5;
            bonusPizza*=1.5;
            critGainMultiplier*=1.5;
            critChance+=0.05;
        }
    },
      {
        title:'Second Rebirth',
        info:'Resets your progress. Bonuses: 1.5x CpC, 1.5x Bonus Pizza, 1.5x Crits, 5% Crit chance',
        price: 10000000,

        required: ()=>upgradeList[10].currentCount>=3,
        effect: ()=>{
            amountPerClick*=1.5;
            bonusPizza*=1.5;
            critGainMultiplier*=1.5;
            critChance+=0.05;
        }
    },
]