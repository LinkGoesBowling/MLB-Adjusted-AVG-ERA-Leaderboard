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
async function getERAData(season) {
    const playerAPI = await fetch("https://statsapi.mlb.com/api/v1/stats?stats=season&group=pitching&playerPool=ALL&sportIds=1&season=" + season + "&limit=5000");
    const teamAPI = await fetch ("https://statsapi.mlb.com/api/v1/teams/stats?stats=season&group=pitching&season=" + season + "&sportIds=1");
    const pData = await playerAPI.json();
    const tData = await teamAPI.json();
    const minimumInnings = tData.stats[0].splits[0].stat.gamesPlayed; //not based on any particular team yet
    const players = pData.stats[0].splits;
    let preAdjustedERA = " ";
    for (let i = 0; i < players.length; i++) {
        if (players[i].stat.inningsPitched < minimumInnings){ //adjustment for non-qualified players
            const modifiedERTotal = players[i].stat.earnedRuns + (minimumInnings - players[i].stat.inningsPitched);
            let adjustedERA = (modifiedERTotal * 9) / minimumInnings
            adjustedERA = Math.round(adjustedERA * 100) / 100; //rounds to nearest hundredth
            players[i].adjustedERA = adjustedERA;
            preAdjustedERA = ", adjusted from: " + players[i].stat.era;
        }
        if (players[i].stat.inningsPitched >= minimumInnings){ //do not adjust qualified players
            let adjustedERA = players[i].stat.era
            adjustedERA = Math.round(adjustedERA * 100) / 100; //rounds to nearest hundredth
            players[i].adjustedERA = adjustedERA;
        }
    }
    for (let i = 0; i < players.length; i++){ //increase rank if era is higher than other player
        if (i > 0 && players[i].adjustedERA > players[i - 1].adjustedERA){
            eraRank++;
        }
        players.sort((a, b) => a.adjustedERA - b.adjustedERA);
        if (eraRank === 1){ //modify top 20 ranks on website
            let changeRanks = document.getElementById("rank1");
            changeRanks.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + preAdjustmentERA;
        }
        if (eraRank === 2){
            let changeRanks = document.getElementById("rank2");
            changeRanks.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + preAdjustmentERA;
        }
        if (eraRank === 3){
            let changeRanks = document.getElementById("rank3");
            changeRanks.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + preAdjustmentERA;
        }
        if (eraRank === 4){
            let changeRanks = document.getElementById("rank4");
            changeRanks.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + preAdjustmentERA;
        }
        if (eraRank === 5){
            let changeRanks = document.getElementById("rank5");
            changeRanks.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + preAdjustmentERA;
        }
        if (eraRank === 6){
            let changeRanks = document.getElementById("rank6");
            changeRanks.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + preAdjustmentERA;
        }
        if (eraRank === 7){
            let changeRanks = document.getElementById("rank7");
            changeRanks.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + preAdjustmentERA;
        }
        if (eraRank === 8){
            let changeRanks = document.getElementById("rank8");
            changeRanks.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + preAdjustmentERA;
        }
        if (eraRank === 9){
            let changeRanks = document.getElementById("rank9");
            changeRanks.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + preAdjustmentERA;
        }
        if (eraRank === 10){
            let changeRanks = document.getElementById("rank10");
            changeRanks.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + preAdjustmentERA;
        }
        if (eraRank === 11){
            let changeRanks = document.getElementById("rank11");
            changeRanks.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + preAdjustmentERA;
        }
        if (eraRank === 12){
            let changeRanks = document.getElementById("rank12");
            changeRanks.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + preAdjustmentERA;
        }
        if (eraRank === 13){
            let changeRanks = document.getElementById("rank13");
            changeRanks.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + preAdjustmentERA;
        }
        if (eraRank === 14){
            let changeRanks = document.getElementById("rank14");
            changeRanks.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + preAdjustmentERA;
        }
        if (eraRank === 15){
            let changeRanks = document.getElementById("rank15");
            changeRanks.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + preAdjustmentERA;
        }
        if (eraRank === 16){
            let changeRanks = document.getElementById("rank16");
            changeRanks.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + preAdjustmentERA;
        }
        if (eraRank === 17){
            let changeRanks = document.getElementById("rank17");
            changeRanks.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + preAdjustmentERA;
        }
        if (eraRank === 18){
            let changeRanks = document.getElementById("rank18");
            changeRanks.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + preAdjustmentERA;
        }
        if (eraRank === 19){
            let changeRanks = document.getElementById("rank19");
            changeRanks.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + preAdjustmentERA;
        }
        if (eraRank === 20){
            let changeRanks = document.getElementById("rank20");
            changeRanks.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + preAdjustmentERA;
        }
    }
}
async function getAvgData(){
    
}
function switchToERA(){
    
}
function switchToAvg(){
    
}
function switchToNL(){
    
}
function switchToAL(){
    
}
