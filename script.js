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
let stat = "era";
let colorNonQualifiedPlayers = true;
async function getERAData(season) {
stat = "era";
        const playerAPI = await fetch("https://statsapi.mlb.com/api/v1/stats?stats=season&group=pitching&playerPool=ALL&sportIds=1&season=" + season + "&limit=5000");
        const teamAPI = await fetch ("https://statsapi.mlb.com/api/v1/teams/stats?stats=season&group=pitching&season=" + season + "&sportIds=1");
        const pData = await playerAPI.json();
        const tData = await teamAPI.json();
        const minimumInnings = tData.stats[0].splits[0].stat.gamesPlayed; //not based on any particular team yet
        const players = pData.stats[0].splits;
        let preAdjustmentERA = " ";
        for (let i = 0; i < players.length; i++) {
            if (players[i].stat.inningsPitched >= minimumInnings){ //do not adjust qualified players
                let adjustedERA = parseFloat(players[i].stat.era);
                players[i].adjustedERA = adjustedERA; //still uses adjustedERA to compare players to each other
                players[i].preAdjustmentERA = " ";
                players[i].isQualified = true;
            }
            else if (players[i].stat.inningsPitched < minimumInnings){ //adjustment for non-qualified players
                const modifiedERTotal = players[i].stat.earnedRuns + (minimumInnings - players[i].stat.inningsPitched);
                let adjustedERA = (modifiedERTotal * 9) / minimumInnings;
                adjustedERA = Math.round(adjustedERA * 100) / 100; //rounds to nearest hundredth
                adjustedERA = (adjustedERA * 1).toFixed(2); //converts to accurate formatting e.g. 3 -> 3.00
                players[i].adjustedERA = adjustedERA;
                players[i].preAdjustmentERA = ", adjusted from: " + players[i].stat.era;
                players[i].isQualified = false;
            }
        }
        for (let i = 0; i < players.length; i++){ //increase rank if era is higher than other player
            if (i > 0 && players[i].adjustedERA > players[i - 1].adjustedERA){
                eraRank++;
            }
            players.sort((a, b) => a.adjustedERA - b.adjustedERA);
            for (let i = 0; i < 20; i++) {
                const changeRank = document.getElementById("rank" + (i + 1))
                changeRank.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + players[i].preAdjustmentERA;
                if (players[i].isQualified === false && colorNonQualifiedPlayers === true){
                        changeRank.style.color = "red"; //changes non-qualified players to red
                }
                if (players[i].isQualified === true){
                        changeRank.style.color = "black"; //when changing from ERA to avg, reset qualified players to black
                }
            }
        }
}
async function getAvgData(season){ //uses same structure as getERAData, but with avg
stat = "avg";
        const playerAPI = await fetch("https://statsapi.mlb.com/api/v1/stats?stats=season&group=hitting&playerPool=ALL&sportIds=1&season=" + season + "&limit=5000");
        const teamAPI = await fetch ("https://statsapi.mlb.com/api/v1/teams/stats?stats=season&group=hitting&season=" + season + "&sportIds=1");
        const pData = await playerAPI.json();
        const tData = await teamAPI.json();
        const minimumPlateAppearances = (tData.stats[0].splits[0].stat.gamesPlayed) * 3.1; //not based on any particular team yet
        const players = pData.stats[0].splits;
        for (let i = 0; i < players.length; i++) {
            if (players[i].stat.plateAppearances >= minimumPlateAppearances){ //do not adjust qualified players
                let adjustedAvg = players[i].stat.avg;
                players[i].adjustedAvg = adjustedAvg;
                players[i].preAdjustmentAvg = " "; //does not add adjustment message
                players[i].isQualified = true;
            }
            else if (players[i].stat.plateAppearances < minimumPlateAppearances){ //adjustment for non-qualified players
                let adjustedAvg = players[i].stat.hits / ((minimumPlateAppearances - players[i].stat.plateAppearances) + players[i].stat.atBats);
                adjustedAvg = Math.round(adjustedAvg * 1000) / 1000; //rounds to nearest thousandth
                if (adjustedAvg === 1){
                        adjustedAvg = 1.000; //perfect averages appear as 1.000 (only really useful for first few days of season)
                }
                else{
                        adjustedAvg = "." + (adjustedAvg.toString().split('.')[1] * 100); //format correction: removes leading 0 and adds 0 for every 0 digit (e.g. 0.3 -> .300)
                }
                players[i].adjustedAvg = adjustedAvg;
                players[i].preAdjustmentAvg = ", adjusted from: " + players[i].stat.avg; //add adjustment message
                players[i].isQualified = false; //marks player as non-qualified so it appears as red
            }
        }
        for (let i = 0; i < players.length; i++){ //increase rank if avg is lower than other players
            if (i > 0 && players[i].adjustedAvg < players[i - 1].adjustedAvg){
                avgRank++;
            }
            players.sort((a, b) => b.adjustedAvg - a.adjustedAvg);
            for (let i = 0; i < 20; i++) {
                const changeRank = document.getElementById("rank" + (i + 1))
                changeRank.textContent = players[i].player.fullName + ", AVG: " + players[i].adjustedAvg + players[i].preAdjustmentAvg;
                if (players[i].isQualified === false && colorNonQualifiedPlayers === true){
                        changeRank.style.color = "red"; //changes non-qualified players to red
                }
                if (players[i].isQualified === true){
                        changeRank.style.color = "black"; //when changing from ERA to avg, reset qualified players to black
                }
            }
        }
}
function changeQualifiedPlayerRule(){
        if (colorNonQualifiedPlayers === true){
                colorNonQualifiedPlayers = false;
                if (stat === "avg"){
                        getAvgData(new Date().getFullYear()); //retriggers getAvgData with current year
                }
                if (stat === "era"){
                        getERAData(new Date().getFullYear());
                }
                return;
        }
        if (colorNonQualifiedPlayers === false){
                colorNonQualifiedPlayers = true;
                if (stat === "avg"){
                        getAvgData(new Date().getFullYear()); //retriggers getAvgData with current year
                }
                if (stat === "era"){
                        getERAData(new Date().getFullYear());
                }
                return;
        }
}
function switchToNL(){
    
}
function switchToAL(){
    
}
