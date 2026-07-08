/* Stats explained:
Batting Average (AVG/BA): The percentage of hits per at bat. An "at bat" or AB is defined not by the amount of times the hitter steps up to the plate. It excludes
walks, hit-by-pitches, sacrifice flies (flyouts that score a runner), and sacrifice bunts (a bunt that moves a runner over. Will not count if hitter was bunting
for a hit, determined by the scorer).
AVG Formula: H/AB
Rounding: Nearest thousandth (ex. .343) 
*/
let avgRank = 1;
let colorNonQualifiedPlayers = true;
async function getAvgData(season){
        const playerAPI = await fetch("https://statsapi.mlb.com/api/v1/stats?stats=season&group=hitting&playerPool=ALL&sportIds=1&season=" + season + "&limit=5000");
        const teamAPI = await fetch ("https://statsapi.mlb.com/api/v1/teams/stats?stats=season&group=hitting&season=" + season + "&sportIds=1");
        const pData = await playerAPI.json();
        const tData = await teamAPI.json();
        const players = pData.stats[0].splits;
        const teams = tData.stats[0].splits;
        for (let i = 0; i < players.length; i++) {
            for (let j = 0; j <  30; j++){ //find player's team's games played for accurate minimum PA count
                    if (players[i].team.id === teams[j].team.id){
                            var minimumPlateAppearances = (teams[j].stat.gamesPlayed) * 3.1; //var used for function scope
                            break;
            }
            } //add bracket here if there is a bracket error 
            if (players[i].stat.plateAppearances >= minimumPlateAppearances){ //do not adjust qualified players
                let adjustedAvg = players[i].stat.avg;
                players[i].adjustedAvg = adjustedAvg;
                players[i].preAdjustmentAvg = " "; //does not add adjustment message
                players[i].isQualified = true;
            }
            else if (players[i].stat.plateAppearances < minimumPlateAppearances){ //adjustment for non-qualified players
                let adjustedAvg = players[i].stat.hits / ((minimumPlateAppearances - players[i].stat.plateAppearances) + players[i].stat.atBats);
                adjustedAvg = Math.round(adjustedAvg * 1000) / 1000; //rounds to nearest thousandth
                adjustedAvg = (adjustedAvg * 1).toFixed(3);
                adjustedAvg = "." + adjustedAvg.toString().split('.')[1]; //removes 0 from start e.g. 0.321 -> .321
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
                if (colorNonQualifiedPlayers === false){
                        changeRank.style.color = "black"; //resets all players to black
                }
            }
        }
}
function changeQualifiedPlayerRule(){
        if (colorNonQualifiedPlayers === true){
                colorNonQualifiedPlayers = false;
                getAvgData(new Date().getFullYear()); //retriggers getAvgData with current year
                return;
        }
        if (colorNonQualifiedPlayers === false){
                colorNonQualifiedPlayers = true;
                getAvgData(new Date().getFullYear()); //retriggers getAvgData with current year
                return;
        }
}
function switchToNL(){
    
}
function switchToAL(){
    
}
