/* Stats explained:
Earned Run Average (ERA): The average number of runs a pitcher gives up that is charged against him every 9 innings. An "earned" run is any run a pitcher gives up
that reached base while they were pitching and did not reach due to an error, including errors charged against the pitcher. For example, if a routine ground ball
is hit to the shortstop who then throws it over the first baseman's head, an error will be charged against the shortstop and if the run scores, it is not an ER.
In addition, if a new pitcher enters the game while runners are on base, any runners that score that were already on base are charged to the previous pitcher.
ERA Formula: (ER * 9) / IP
Rounding: Nearest hundredth (ex. 3.15)
Batting Average (AVG/BA): The percentage of hits per at bat. An "at bat" or AB is defined not by the amount of times the hitter steps up to the plate. It excludes
walks, hit-by-pitches, sacrifice flies (flyouts that score a runner), and sacrifice bunts (a bunt that moves a runner over. Will not count if hitter was bunting
for a hit, determined by the scorer).
AVG Formula: H/AB
Rounding: Nearest thousandth (ex. .343)
*/
let eraRank = 1;
let avgRank = 1;
async function getERAData() {
    const response = await fetch(
        "https://statsapi.mlb.com/api/v1/stats?stats=season&group=pitching&playerPool=ALL&sportIds=1&season=" + new Date().getFullYear() + "&limit=5000"
    );
    const data = await response.json();
    for (let i = 0; i < data.stats[0].splits.length; i++) {
        var playerData = data.stats[0].splits[i]; //var used for function scope
    }
    if (playerData.stat.eraRank === 1){
        let changeRank1 = document.getElementById("rank1");
        changeRank1.textContent = playerData.player.fullName;
        console.log("Random player with 0.00 ERA: " + playerData.player.fullName
    }
}
/* function getAVGData(id){
    const apiURL = fetch('https://statsapi.mlb.com/api/v1/stats?stats=season&group=hitting&playerPool=ALL&sportIds=1&season=' + new Date().getFullYear() + '&limit=5000');
    for (let i = 0; i < apiURL.length; i++){
        if (i > 0 && stat[i].average < stat[i - 1].avg){
            avgRank++;
        }
        player[i].avgRank = avgRank;
    }
    rankAvg();
}
function rankERA(){
    if player.eraRank = 1 {
        let changeRank1 = document.getElementById("rank1");
        changeRank1.textContent = player.name;
    }
    if player.eraRank =  2{
        let changeRank2 = document.getElementById("rank2");
        changeRank2.textContent = player.name;
    }
    if player.eraRank =  3{
        let changeRank3 = document.getElementById("rank3");
        changeRank3.textContent = player.name;
    }
    if player.eraRank =  4{
        let changeRank4 = document.getElementById("rank4");
        changeRank4.textContent = player.name;
    }
    if player.eraRank =  5{
        let changeRank5 = document.getElementById("rank5");
        changeRank5.textContent = player.name;
    }
    if player.eraRank =  6{
        let changeRank6 = document.getElementById("rank6");
        changeRank6.textContent = player.name;
    }
    if player.eraRank =  7{
        let changeRank7 = document.getElementById("rank7");
        changeRank7.textContent = player.name;
    }
    if player.eraRank =  8{
        let changeRank8 = document.getElementById("rank8");
        changeRank8.textContent = player.name;
    }
    if player.eraRank =  9{
        let changeRank9 = document.getElementById("rank9");
        changeRank9.textContent = player.name;
    }
    if player.eraRank =  10{
        let changeRank10 = document.getElementById("rank10");
        changeRank10.textContent = player.name;
    }
    if player.eraRank =  11{
        let changeRank11 = document.getElementById("rank11");
        changeRank11.textContent = player.name;
    }
    if player.eraRank =  12{
        let changeRank12 = document.getElementById("rank12");
        changeRank12.textContent = player.name;
    }
    if player.eraRank =  13{
        let changeRank13 = document.getElementById("rank13");
        changeRank13.textContent = player.name;
    }
    if player.eraRank =  14{
        let changeRank14 = document.getElementById("rank14");
        changeRank14.textContent = player.name;
    }
    if player.eraRank =  15{
        let changeRank15 = document.getElementById("rank15");
        changeRank15.textContent = player.name;
    }
    if player.eraRank =  16{
        let changeRank16 = document.getElementById("rank16");
        changeRank16.textContent = player.name;
    }
    if player.eraRank =  17{
        let changeRank17 = document.getElementById("rank17");
        changeRank17.textContent = player.name;
    }
    if player.eraRank =  18{
        let changeRank18 = document.getElementById("rank18");
        changeRank18.textContent = player.name;
    }
    if player.eraRank =  19{
        let changeRank19 = document.getElementById("rank19");
        changeRank19.textContent = player.name;
    }
    if player.eraRank =  20{
        let changeRank20 = document.getElementById("rank20");
        changeRank20.textContent = player.name;
    }
}
function rankAvg(){
    if player.avgRank = 1 {
        let changeRank1 = document.getElementById("rank1");
        changeRank1.textContent = player.name;
    }
    if player.avgRank =  2{
        let changeRank2 = document.getElementById("rank2");
        changeRank2.textContent = player.name;
    }
    if player.avgRank =  3{
        let changeRank3 = document.getElementById("rank3");
        changeRank3.textContent = player.name;
    }
    if player.avgRank =  4{
        let changeRank4 = document.getElementById("rank4");
        changeRank4.textContent = player.name;
    }
    if player.avgRank =  5{
        let changeRank5 = document.getElementById("rank5");
        changeRank5.textContent = player.name;
    }
    if player.avgRank =  6{
        let changeRank6 = document.getElementById("rank6");
        changeRank6.textContent = player.name;
    }
    if player.avgRank =  7{
        let changeRank7 = document.getElementById("rank7");
        changeRank7.textContent = player.name;
    }
    if player.avgRank =  8{
        let changeRank8 = document.getElementById("rank8");
        changeRank8.textContent = player.name;
    }
    if player.avgRank =  9{
        let changeRank9 = document.getElementById("rank9");
        changeRank9.textContent = player.name;
    }
    if player.avgRank =  10{
        let changeRank10 = document.getElementById("rank10");
        changeRank10.textContent = player.name;
    }
    if player.avgRank =  11{
        let changeRank11 = document.getElementById("rank11");
        changeRank11.textContent = player.name;
    }
    if player.avgRank =  12{
        let changeRank12 = document.getElementById("rank12");
        changeRank12.textContent = player.name;
    }
    if player.avgRank =  13{
        let changeRank13 = document.getElementById("rank13");
        changeRank13.textContent = player.name;
    }
    if player.avgRank =  14{
        let changeRank14 = document.getElementById("rank14");
        changeRank14.textContent = player.name;
    }
    if player.avgRank =  15{
        let changeRank15 = document.getElementById("rank15");
        changeRank15.textContent = player.name;
    }
    if player.avgRank =  16{
        let changeRank16 = document.getElementById("rank16");
        changeRank16.textContent = player.name;
    }
    if player.avgRank =  17{
        let changeRank17 = document.getElementById("rank17");
        changeRank17.textContent = player.name;
    }
    if player.avgRank =  18{
        let changeRank18 = document.getElementById("rank18");
        changeRank18.textContent = player.name;
    }
    if player.avgRank =  19{
        let changeRank19 = document.getElementById("rank19");
        changeRank19.textContent = player.name;
    }
    if player.avgRank =  20{
        let changeRank20 = document.getElementById("rank20");
        changeRank20.textContent = player.name;
    }
}
function switchToERA(){
    
}
function switchToAvg(){
    
}
function switchToNL(){
    
}
function switchToAL(){
    
}
*/
