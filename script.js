//Programmed by Link Kelly (LinkGoesBowling)
/* Stats explained:
Earned Run Average (ERA): The average number of runs a pitcher gives up that is charged against him every 9 innings. An "earned" run is any run a pitcher gives up
that reached base while they were pitching and did not reach due to an error, including errors charged against the pitcher. For example, if a routine ground ball
is hit to the shortstop who then throws it over the first baseman's head, an error will be charged against the shortstop and if the run scores, it is not an ER.
In addition, if a new pitcher enters the game while runners are on base, any runners that score that were already on base are charged to the previous pitcher.
ERA Formula: (ER * 9) / IP
Rounding: Nearest hundredth (ex. 3.15)
Batting Average (AVG/BA): The percentage of hits per at bat. An "at bat" or AB is defined not by the amount of times the hitter steps up to the plate. It excludes
walks, hit-by-pitches, sacrifice flies (flyouts that score a runner), sacrifice bunts (a bunt that moves a runner over, will not count if hitter was bunting
for a hit, determined by the scorer), and catcher's interference.
AVG Formula: H/AB
Rounding: Nearest thousandth (ex. .343) 
*/
//Note: Variables declared with var were for function scope and were intentionally declared with var. I apologize to the JavaScript community for my villainous act. 
let eraRank = 1;
let avgRank = 1;
let stat = "era";
let colorNonQualifiedPlayers = true;
let league = "mlb";
let currentSeason = new Date().getFullYear();
let nlTeams = [119, 134, 115, 137, 146, 120, 144, 138, 112, 143, 109, 121, 113, 135, 173, 155, 123, 132, 195, 124, 150, 224, 199, 187, 208, 299, 297, 213, 196, 129, 220, 126, 209, 166, 148, 221];
let playersShown = 20;
async function getERAData(season) {
        stat = "era";
        if (currentSeason < 2013){ //include astros in nl if the season was before 2013. else they are an al team
                nlTeams.push(117);
        }
        if (currentSeason >= 2013){
                nlTeams.splice(nlTeams.indexOf(117));
        }
        if (currentSeason < 1998){ //brewers are nl starting 1998 season. else they are al
                nlTeams.splice(nlTeams.indexOf(158));
        }
        if (currentSeason >= 1998){
                nlTeams.push(158);
        }
        const ruleDescription = document.getElementById("ruleDescription");
        ruleDescription.textContent = "Unofficial rule: If a pitcher falls short of the IP requirement (same as amount of respective player's team's games played), 1 ER and 1 IP will be added for every inning missed.";
        let changeERATab = document.getElementById("eraTab"); //makes ERA tab look selected
        changeERATab.style.backgroundColor = 'white';
        changeERATab.style.border = '2px solid black';
        let changeAvgTab = document.getElementById("avgTab"); //makes avg tab not selected
        changeAvgTab.style.backgroundColor = 'gray';
        changeAvgTab.style.border = '1px solid black';
        const playerAPI = await fetch("https://statsapi.mlb.com/api/v1/stats?stats=season&group=pitching&playerPool=ALL&sportIds=1&season=" + season + "&limit=5000");
        const teamAPI = await fetch ("https://statsapi.mlb.com/api/v1/teams/stats?stats=season&group=pitching&season=" + season + "&sportIds=1");
        const pData = await playerAPI.json();
        const tData = await teamAPI.json();
        const teams = tData.stats[0].splits;
        const players = pData.stats[0].splits;
        let preAdjustmentERA = " ";
        for (let i = 0; i < players.length; i++){
            for (let j = 0; j <  30; j++){ //find player's team's games played for accurate minimum innings count
                    if (players[i].team.id === teams[j].team.id){
                            var minimumInnings = Math.round(teams[j].stat.gamesPlayed);
                            break;
                    }
            }    
            if (players[i].stat.inningsPitched >= minimumInnings){ //do not adjust qualified players
                adjustedERA = (players[i].stat.era * 1).toFixed(2); //converts to accurate formatting e.g. 3 -> 3.00
                players[i].adjustedERA = adjustedERA; //still uses adjustedERA so they can be compared against non-qualifiers
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
            for (let i = 0; i < playersShown; i++) {
                const changeRank = document.getElementById("rank" + (i + 1))
                changeRank.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + players[i].preAdjustmentERA;
                if (players[i].isQualified === false && colorNonQualifiedPlayers === true){
                        changeRank.style.color = "red"; //changes non-qualified players to red
                }
                if (players[i].isQualified === true){
                        changeRank.style.color = "black"; //when changing from avg to ERA, reset qualified players to black
                }
                if (colorNonQualifiedPlayers === false){
                        changeRank.style.color = "black"; //reset all players to black
                }
            }
        }
}
async function getAvgData(season){ //uses same structure as getERAData, but with avg
        stat = "avg";
        if (currentSeason < 2013){ //include astros in nl if the season was before 2013. else they are an al team
                nlTeams.push(117);
        }
        if (currentSeason >= 2013){
                nlTeams.splice(nlTeams.indexOf(117));
        }
        if (currentSeason < 1998){ //brewers are nl starting 1998 season. else they are al
                nlTeams.splice(nlTeams.indexOf(158));
        }
        if (currentSeason >= 1998){
                nlTeams.push(158);
        }
        const ruleDescription = document.getElementById("ruleDescription");
        ruleDescription.textContent = "Tony Gwynn Rule (10.22(a)): If a player falls short of the minimum amount of plate appearances (3.1 per game his team has played), a new average will be calculated by adding theoretical hitless at-bats until he reaches the minimum plate appearance count. If that player is still leading his league in average, he will win the batting title."
        let changeERATab = document.getElementById("eraTab"); //makes avg tab look selected
        let changeAvgTab = document.getElementById("avgTab"); //makes ERA tab not selected
        changeAvgTab.style.backgroundColor = 'white';
        changeAvgTab.style.border = '2px solid black';
        changeERATab.style.backgroundColor = 'gray';
        changeERATab.style.border = '1px solid black';
        const playerAPI = await fetch("https://statsapi.mlb.com/api/v1/stats?stats=season&group=hitting&playerPool=ALL&sportIds=1&season=" + season + "&limit=5000");
        const teamAPI = await fetch ("https://statsapi.mlb.com/api/v1/teams/stats?stats=season&group=hitting&season=" + season + "&sportIds=1");
        const pData = await playerAPI.json();
        const tData = await teamAPI.json();
        const players = pData.stats[0].splits;
        const teams = tData.stats[0].splits;
        for (let i = 0; i < players.length; i++) {
            for (let j = 0; j <  30; j++){ //find player's team's games played for accurate minimum PA count
                if (players[i].team.id === teams[j].team.id){
                        var minimumPlateAppearances = Math.round((teams[j].stat.gamesPlayed) * 3.1);
                        break;
            }
            }
            if (players[i].stat.plateAppearances >= minimumPlateAppearances){ //do not adjust qualified players
                if (league === "nl" && nlTeams.includes(players[i].team.id) || league === "mlb" || league === "al" && !nlTeams.includes(players[i].team.id)){ //check if player is in selected league
                        let adjustedAvg = players[i].stat.avg;
                        players[i].adjustedAvg = adjustedAvg;
                        players[i].preAdjustmentAvg = " "; //does not add adjustment message
                        players[i].isQualified = true;
                }
                else {
                        players[i].adjustedAvg = -1; //list non-league players last
                }
            }
            else if (players[i].stat.plateAppearances < minimumPlateAppearances){ //adjustment for non-qualified players
                if (league === "nl" && nlTeams.includes(players[i].team.id) || league === "mlb" || league === "al" && !nlTeams.includes(players[i].team.id)){ //check if player is in selected league
                        let adjustedAvg = players[i].stat.hits / ((minimumPlateAppearances - players[i].stat.plateAppearances) + players[i].stat.atBats);
                        adjustedAvg = Math.round(adjustedAvg * 1000) / 1000; //rounds to nearest thousandth
                        adjustedAvg = (adjustedAvg * 1).toFixed(3); //adds trailing 0's if needed. ex. .3 -> .300
                        adjustedAvg = "." + adjustedAvg.toString().split('.')[1]; //removes 0 from start e.g. 0.321 -> .321
                        players[i].adjustedAvg = adjustedAvg;
                        players[i].preAdjustmentAvg = ", adjusted from: " + players[i].stat.avg; //add adjustment message
                        players[i].isQualified = false; //marks player as non-qualified so it appears as red
                }
                else {
                        players[i].adjustedAvg = -1; //list non-league players last
                }
            }
        }
        for (let i = 0; i < players.length; i++){ //increase rank if avg is lower than other players
            if (i > 0 && players[i].adjustedAvg < players[i - 1].adjustedAvg){
                if (players[i].adjustedAvg === -1){
                        avgRank = undefined; //do not include non-league players
                }
                else{
                        avgRank++;
                }
            }
            players.sort((a, b) => b.adjustedAvg - a.adjustedAvg);
        for (let i = ol1.children.length; i < playersShown; i++) {
                if (ol1.children.length < playersShown){ //change to half of playersShown for multiple rows
                        const createRanks = document.createElement('li'); //create new li elements and add them to the ol
                        let ol1 = document.getElementById('playerRanks');
                        createRanks.classList.add('rank' + (i + 1 + (playersShown - 20))); //add class
                        createRanks.setAttribute('id', 'rank' + (i + 1 + (playersShown - 20))); //add id
                        ol1.appendChild(createRanks);
                 }
        }
        for (let i = 0; i < playersShown; i++){ //switches ranks already generated to new filter
                const changeRank = document.getElementById("rank" + (i + 1 + (playersShown - 20)));
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
            let ol1 = document.getElementById('playerRanks');
                /* const ol2 = document.getElementById('playerRanks2'); //commented out because i wanted one row
                if (ol2.children.length < (playersShown / 2)){
                        const createRanks = document.createElement('li'); //create new li elements and add them to the ol
                        createRanks.classList.add('rank' + (i + 11)); //add class
                        createRanks.setAttribute('id', 'rank' + (i + 11)); //add id
                        ol2.appendChild(createRanks);
                } */
        }
}
function changeQualifiedPlayerRule(){
        if (colorNonQualifiedPlayers === true){
                colorNonQualifiedPlayers = false;
                if (stat === "avg"){
                        getAvgData(currentSeason); //retriggers getAvgData with year user inputted
                }
                if (stat === "era"){
                        getERAData(currentSeason);
                }
                return;
        }
        if (colorNonQualifiedPlayers === false){
                colorNonQualifiedPlayers = true;
                if (stat === "avg"){
                        getAvgData(currentSeason); //retriggers getAvgData with current year or most recently entered season
                }
                if (stat === "era"){
                        getERAData(currentSeason);
                }
                return;
        }
}
function switchToMLB(){
        league = "mlb";
        let mlbTab = document.getElementById("mlbTab");
        mlbTab.style.backgroundColor = 'white';
        mlbTab.style.border = '2px solid black';
        let nlTab = document.getElementById("nlTab");
        nlTab.style.backgroundColor = 'gray';
        nlTab.style.border = '1px solid black';
        let alTab = document.getElementById("alTab");
        alTab.style.backgroundColor = 'gray';
        alTab.style.border = '1px solid black';
        if (stat === "avg"){
                getAvgData(currentSeason);
        }
        if (stat === "era"){
                getERAData(currentSeason);
        }
}
function switchToNL(){
    league = "nl";
        let mlbTab = document.getElementById("mlbTab");
        mlbTab.style.backgroundColor = 'gray';
        mlbTab.style.border = '1px solid black';
        let nlTab = document.getElementById("nlTab");
        nlTab.style.backgroundColor = 'white';
        nlTab.style.border = '2px solid black';
        let alTab = document.getElementById("alTab");
        alTab.style.backgroundColor = 'gray';
        alTab.style.border = '1px solid black';
        if (stat === "avg"){
                getAvgData(currentSeason);
        }
        if (stat === "era"){
                getERAData(currentSeason);
        }
}
function switchToAL(){
        let mlbTab = document.getElementById("mlbTab");
        mlbTab.style.backgroundColor = 'gray';
        mlbTab.style.border = '1px solid black';
        let nlTab = document.getElementById("nlTab");
        nlTab.style.backgroundColor = 'gray';
        nlTab.style.border = '1px solid black';
        let alTab = document.getElementById("alTab");
        alTab.style.backgroundColor = 'white';
        alTab.style.border = '2px solid black';
        league = "al";
        if (stat === "avg"){
                getAvgData(currentSeason);
        }
        if (stat === "era"){
                getERAData(currentSeason);
        }
}
function processInput(){
        const seasonInputElement = document.getElementById("seasonInput");
        currentSeason = seasonInputElement.value;
        if (stat === "avg"){
                getAvgData(currentSeason);
        }
        if (stat === "era"){
                getERAData(currentSeason);
        }
}
function showMorePlayers(){
        playersShown += 20;
        if (stat === "avg"){
                getAvgData(currentSeason);
        }
        if (stat === "era"){
                getERAData(currentSeason);
        }
}
