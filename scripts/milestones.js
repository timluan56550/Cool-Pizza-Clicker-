function openMilestone(){
    const milestoneGrid=document.getElementById("milestone-grid")
    const milestoneBar=document.getElementById("milestone-bar")


    //makes it so you start at the bottom
    milestoneBar.scrollTop=milestoneBar.scrollHeight
}