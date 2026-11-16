//innerHtml is useful- do variableName.innerHtml="" remember to put "<span>, <b>, etc in quotations if it doesnt work"
//block-make new line
//inline block places on same line(doesnt break line)
//list below is for upgrade may add more later if i need to but i think this is all i need use. use arrow function for required and effect
//
// id:
// title:
// info:
// price:
// maxCount:
// currentCount:
// growth:
// required:
// effect:
//module.exports- makes teh array avaliable to any other file that requires this module
//module.exports - doesnt work idk why
let autoclick=null;
const upgradeList=[
    {
id: '0',
title: 'Extra Pizzas',
info: 'Increase CpC Base by 1',
price: 50,
basePrice:50,
maxCount: 5,
currentCount: 0,
growth: 1.8,
required: ()=> score>=0,
effect: ()=> amountPerClickBase+=1,
buff: (count)=>"+"+count+" Cpc"
},
{
id: '1',
title: 'Combos',
info:'Click the target button to stack combos',
price: 100,
basePrice:100,
maxCount: 1,
currentCount: 0,
growth: 1,
required: ()=>upgradeList[0].currentCount>=2,
effect: ()=>{
    document.getElementById("target").style.display='block';
      document.getElementById("comboText").style.display='inline-block';

    moveTarget();
},
buff: (count)=>"Bought"
},
{
id: '2',
title: 'Combo Lock',
info:'Be able to freeze your combos to not lose them',
price: 250,
basePrice:250,
maxCount: 1,
currentCount: 0,
growth: 1,
required: ()=>upgradeList[1].currentCount>=1,
effect: ()=>{
    document.getElementById("lockCombo").style.display='inline-block';
},
buff: (count)=>"Bought"
},
{
id: '3',
title: 'Crispy Crits',
info:'adds a 2% chance for every click to give you 4x Pizzas',
price: 500,
basePrice:500,
maxCount: 5,
currentCount: 0,
growth: 1.2,
required: ()=>upgradeList[0].currentCount>=3,
effect: ()=>{
    critChance+=0.02;
},
buff: (count)=>"+"+count*2+"% Crit"

},
{
id: '4',
title: 'Combo AutoClicker',
info:'Automatically clicks the target for you every 2 seconds',
price: 350,
basePrice:350,
maxCount: 1,
currentCount: 0,
growth: 1,
required: ()=>upgradeList[1].currentCount>=1,
effect: ()=>{
    startAutoComboClicker()
    
    
},
buff: (count)=>"Every "+(autoComboTime/1000)+"s"
},
{
id: '5',
title: 'Bigger Bonus',
info:'Increases the reward for finishing a pizza by 1.4x per upgrade!',
price: 200,
basePrice:200,
maxCount: 10,
currentCount: 0,
growth: 1.45,
required: ()=>upgradeList[0].currentCount>=3,
effect: ()=>{
    bonusPizza*=1.4;
},
buff: (count)=>(Math.pow(1.4, count)).toFixed(2)+"x Bonus"

},
{
id: '6',
title: 'Better Combo Multiplier',
info:'Slightly improves the formula for the Combo Multiplier',
price: 700,
basePrice:700,
maxCount: 5,
currentCount: 0,
growth: 1.9,
required: ()=>upgradeList[2].currentCount>=1,
effect: ()=>{
    multiplierGrowth+=0.5;
    multiplier=1+Math.log(1+combo*0.1*multiplierGrowth);
    updateUI()

},
buff: (count)=>"Bought "+count

},
{
id: '7',
title: 'XL Pizzas',
info:'Multiplies the CpC by 1.3 per upgrade',
price: 500,
basePrice:500,
maxCount: 10,
currentCount: 0,
growth: 1.75,
required: ()=>upgradeList[0].currentCount>=5,
effect: ()=>{
    amountPerClick*=1.3;
},
buff: (count)=>(Math.pow(1.3, count)).toFixed(2)+"x CpC"


},
{
id: '8',
title: 'More Powerful Crits',
info:'Increases the multiplier for Crits by 1.5x per upgrade',
price: 800,
basePrice:800,
maxCount: 2,
currentCount: 0,
growth: 3,
required: ()=>upgradeList[3].currentCount>=3,
effect: ()=>{critGainMultiplier*=1.5

},
buff: (count)=>(Math.pow(1.5, count)).toFixed(2)+"x Crits"


},
{
id: '9',
title: 'Powerful Pizza',
info:'Powers EVERYTHING by 1.1',
price: 50000,
basePrice:50000,
maxCount: 1,
currentCount: 0,
growth: 1,
required: ()=>upgradeList[7].currentCount>=5,
effect: ()=>{powerGain+=0.1

},
buff: (count)=>"1.1"


},
{
id: '10',
title: 'XL Bonus with Bonus',
info:'1.7x Bonus Pizza AND 1.5x your CpC',
price: 10000,
basePrice:10000,
maxCount: 4,
currentCount: 0,
growth: 4.8,
required: ()=>upgradeList[5].currentCount>=10,
effect: ()=>{bonusPizza*=1.7;
amountPerClick*=1.5

},
buff: (count)=>(Math.pow(1.7, count)).toFixed(2)+"x Bonus "+(Math.pow(1.5, count)).toFixed(2)+"x CpC"


},
{
id: '11',
title: 'MORE CRIT CHAAAANCE',
info:'Increase your crit chance by 5% per upgrade',
price: 100000,
basePrice:100000,
maxCount: 3,
currentCount: 0,
growth: 5,
required: ()=>upgradeList[3].currentCount>=5,
effect: ()=>{critChance+=0.05;

},
buff: (count)=>"+"+count*5+"% Chance"


},
{
id: '12',
title: 'More pizza, more pizza(er)',
info:'Boost pizza gain based on your current pizzas. Better formula per upgrade',
price: 5000000,
basePrice:5000000,
maxCount: 3,
currentCount: 0,
growth: 1.5,
required: ()=>upgradeList[9].currentCount>=1,
effect: ()=>{critChance+=0.05;

},
buff: (count)=>"Bought "+count


},
{
id: '13',
title: 'Upgrade Up-Pizzas',
info:'Boosts pizza gain by +2% for every total upgrade level you own. +1% per upgrade' ,
price: 50000000,
basePrice:50000000,
maxCount: 4,
currentCount: 0,
growth: 1.8,
required: ()=>currentRebirthIndex>=1&&upgradeList[11].currentCount>=3,
effect: ()=>{totalUpgrades()
},
buff: (count)=>"+"+totalUpgrades()*(count+1)+"%"

},
{
id: '14',
title: 'Double Baked Pizza',
info:'5% finishing a pizza gives you 1000x bonus!. +5% per upgrade' ,
price: 155555555,
basePrice:155555555,
maxCount: 4,
currentCount: 0,
growth: 1.7,
required: ()=>currentRebirthIndex>=2&&upgradeList[11].currentCount>=3,
effect: ()=>{ doubleBakedChance+=0.05
},
buff: (count)=>count*5+"%"


},

// {
// id: '12',
// title: '10 Million Pizza',
// info:'You did it, you reached 10 million pizzas! You are a true pizza master yayayayaya! - Well once you have bought this upgrade',
// price: 10000000,
// maxCount: 1,
// currentCount: 0,
// growth: 1,
// required: ()=>upgradeList[9].currentCount>=1,
// effect: ()=>{
//     //trigger an end game cutscene
//     const endScene=document.getElementById("endScene")
//  endScene.style.display="flex";
//  setTimeout(()=>{
//     endScene.classList.add("show");
//  },20);
// }

// },

// end of upgrade list
]

