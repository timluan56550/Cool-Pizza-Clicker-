const milestoneGrid=document.getElementById("milestone-grid")
const milestoneBar=document.getElementById("milestone-bar")
//this makes the scroll bar be able t scroll without shift
const tabsGrid2=document.getElementById("notepad-tab")
tabsGrid2.addEventListener("wheel",(e)=>{
    e.preventDefault();
    tabsGrid2.scrollLeft+=e.deltaY*0.15
})

function openTabs(){
    const tabsGrid=document.getElementById("notepad-tab")

    tabsGrid.innerHTML="";

    tabButtons.forEach(tab=>{
        const unlocked=tab.unlocked()
        const button=document.createElement("button")
        button.className="tab-button "+
        (currentPage===tab.id ? "active": "")+
        (unlocked ? "": "locked")

        button.textContent= (unlocked ? tab.title : "???")

        button.addEventListener("click",()=>{
            if(!unlocked){
                return;
            }
            soundOpenNotepad(1.5)
            currentPage=tab.id
            upgradeGrid.style.display="none";
            rebirthGrid.style.display ="none";
            coinGrid.style.display ="none";
            coinDisplay.style.display ="none";
            milestoneBar.style.display="none"
            milestoneGrid.style.display="none";

            tab.clicked()
            openTabs()

        })
        tabsGrid.appendChild(button)
    })
}

const tabButtons=[
    {
        id: "upgrades",
        title:"Upgrades",
        unlocked: ()=>true,
        clicked: ()=>{
            upgradeGrid.style.display="flex"
            openUpgrade()
        }
    },
   {
        id: "rebirths",
        title:"Rebirths",
        unlocked: ()=>true,
        clicked: ()=>{
            rebirthGrid.style.display="flex"
            coinGrid.style.display="flex"
            coinDisplay.style.display="block"

            openCoinShop()
            openRebirth()
        }
    },
 {
        id: "milestones",
        title:"Milestones",
        unlocked: ()=>true,
        clicked: ()=>{
            milestoneGrid.style.display="flex"
            milestoneBar.style.display="block"
            openMilestone()
        }
    },
]