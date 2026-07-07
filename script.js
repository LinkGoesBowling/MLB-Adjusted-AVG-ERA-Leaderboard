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
    const playerAPI = await fetch("https://statsapi.mlb.com/api/v1/stats?stats=season&group=pitching&playerPool=ALL&sportIds=1&season=" + new Date().getFullYear() + "&limit=5000");
    const teamAPI = await fetch ("https://statsapi.mlb.com/api/v1/teams/stats?stats=season&group=pitching&season=" + new Date().getFullYear() + "&sportIds=1");
    const pData = await playerAPI.json();
    const tData = await teamAPI.json();
    for (let i = 0; i < pData.stats[0].splits.length; i++) {
        const playerData = pData.stats[0].splits[i];
        const minimumInnings = tData.stats[0].splits[0].stat.gamesPlayed; //not based on any particular team yet
        if (playerData.stat.inningsPitched < minimumInnings){
            continue;
        }
        if (playerData.stat.inningsPitched >= minimumInnings){
            if (i < 19){
                console.log("Qualified: " + playerData.player.fullName + ", ERA: " + playerData.stat.era + ", IP: " + playerData.stat.inningsPitched);
                let changeRanks = document.getElementById("rank" + (i + 1));
                changeRanks.textContent = playerData.player.fullName + " " + playerData.stat.era;
            }
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
