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
//Note: Variables declared with var were for function scope. No, the JS police haven't arrived yet.
let eraRank = 1;
let avgRank = 1;
let stat = "era";
let colorNonQualifiedPlayers = true;
let league = "mlb";
let currentSeason = new Date().getFullYear();
let playersShown = 20;
async function getERAData(season) {
        stat = "era";
        const ruleDescription = document.getElementById("ruleDescription");
        ruleDescription.textContent = "Unofficial rule: If a pitcher falls short of the IP requirement (same as amount of respective player's team's games played), 1 ER and 1 IP will be added for every inning missed.";
        /* if (currentSeason <= 1901){ //remove AL/NL tabs for seasons before 1901 when there was only NL
                var americanLeague = document.getElementById("alTab");
                americanLeague.remove();
                var nationalLeague = document.getElementById("nlTab");
                nationalLeague.remove();
                var federalLeague = document.getElementById("flTab");
                switchToMLB();
                var mlbTab = document.getElementById("mlbTab");
                mlbTab.style.borderRadius = '10px';
        }
        if ((currentSeason > 1901) && (currentSeason < 1914) || currentSeason > 1915){ //when NL/AL exist alone
                if (nationalLeague === null){
                        var createNL = document.createElement('button');
                        createNL.classList.add('nl-tab');
                        createNL.setAttribute('id', 'nlTab');
                        createNL.setAttribute('onclick', 'switchToNL()');
                        var leagueTabs = document.getElementById("leagueTabs");
                        leagueTabs.appendChild(createNL);
                        var mlbTab = document.getElementById("mlbTab");
                        mlbTab.style.borderRadius = ' '; //removes rounded corners on right side
                }
                if (americanLeague === null){
                        var createAL = document.createElement('button');
                        createAL.classList.add('al-tab');
                        createAL.setAttribute('id', 'alTab');
                        createAL.setAttribute('onclick', 'switchToAL()');
                        leagueTabs.appendChild(createAL);
                }
                if (federalLeague !== null){
                        federalLeague.remove();
                        if (league === "fl"){
                                switchToMLB();
                        }
                }
        }
        if (currentSeason === 1914 || currentSeason === 1915){ //when FL was there
                if (nationalLeague === null){
                        var createNL = document.createElement('button');
                        createNL.classList.add('nl-tab');
                        createNL.setAttribute('id', 'nlTab');
                        createNL.setAttribute('onclick', 'switchToNL()');
                        var leagueTabs = document.getElementById("leagueTabs");
                        leagueTabs.appendChild(createNL);
                        var mlbTab = document.getElementById("mlbTab");
                        mlbTab.style.borderRadius = ' '; //removes rounded corners on right side
                }
                if (americanLeague === null){
                        var createAL = document.createElement('button');
                        createAL.classList.add('al-tab');
                        createAL.setAttribute('id', 'alTab');
                        createAL.setAttribute('onclick', 'switchToAL()');
                        leagueTabs.appendChild(createAL);
                }
                if (federalLeague === null){
                        var createFL = document.createElement('button');
                        createFL.classList.add('fl-tab');
                        createFL.setAttribute('id', 'flTab');
                        createFL.setAttribute('onclick', 'switchToFL()');
                        createFL.style.borderTopRightRadius = '10px';
                        createFL.style.borderBottomRightRadius = '10px';
                        leagueTabs.appendChild(createFL);
                }
        } */
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
                if (league === "nl" && players[i].league.name === "NL" || league === "mlb" || league === "al" && players[i].league.name === "AL" || league === "fl" && players[i].league.name === "FL"){ //check if player is in selected league
                        adjustedERA = (players[i].stat.era * 1).toFixed(2); //converts to accurate formatting e.g. 3 -> 3.00
                        players[i].adjustedERA = adjustedERA; //still uses adjustedERA so they can be compared against non-qualifiers
                        players[i].preAdjustmentERA = " ";
                        players[i].isQualified = true;
                }
                else{
                        players[i].adjustedERA = Infinity;
                }
            }
            else if (players[i].stat.inningsPitched < minimumInnings){ //adjustment for non-qualified players
                if (league === "nl" && players[i].league.name === "NL" || league === "mlb" || league === "al" && players[i].league.name === "AL" || league === "fl" && players[i].league.name === "FL"){ //check if player is in selected league
                        const modifiedERTotal = players[i].stat.earnedRuns + (minimumInnings - players[i].stat.inningsPitched);
                        let adjustedERA = (modifiedERTotal * 9) / minimumInnings;
                        adjustedERA = Math.round(adjustedERA * 100) / 100; //rounds to nearest hundredth
                        adjustedERA = (adjustedERA * 1).toFixed(2); //converts to accurate formatting e.g. 3 -> 3.00
                        players[i].adjustedERA = adjustedERA;
                        players[i].preAdjustmentERA = ", adjusted from: " + players[i].stat.era;
                        players[i].isQualified = false;
                    }
                else{
                        players[i].adjustedERA = Infinity;
                }
            }
        }
        for (let i = 0; i < players.length; i++){
            players.sort((a, b) => a.adjustedERA - b.adjustedERA);
            for (let i = 0; i < playersShown; i++) {
                const ol1 = document.getElementById('playerRanks');
                if ((ol1.children.length < playersShown) && (ol1.children.length < players.length)){
                        const createRanks = document.createElement('li'); //create new li elements and add them to the ol
                        createRanks.classList.add('rank' + (i + 1 + (playersShown - 20))); //add class
                        createRanks.setAttribute('id', 'rank' + (i + 1 + (playersShown - 20))); //add id
                        ol1.appendChild(createRanks);
                }
                const changeRank = document.getElementById("rank" + (i + 1));
                if (league === "nl" && players[i].league.name === "NL" || league === "mlb" || league === "al" && players[i].league.name === "AL"){ //check if player is in selected league
                        changeRank.textContent = players[i].player.fullName + ", ERA: " + players[i].adjustedERA + players[i].preAdjustmentERA;
                }
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
async function getAvgData(season){ //uses same structure as getERAData, but with avg
        stat = "avg";
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
                if (league === "nl" && players[i].league.name === "NL" || league === "mlb" || league === "al" && players[i].league.name === "AL"){ //check if player is in selected league
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
                if (league === "nl" && players[i].league.name === "NL" || league === "mlb" || league === "al" && players[i].league.name === "AL"){ //check if player is in selected league
                        let adjustedAvg = players[i].stat.hits / ((minimumPlateAppearances - players[i].stat.plateAppearances) + players[i].stat.atBats);
                        adjustedAvg = Math.round(adjustedAvg * 1000) / 1000; //rounds to nearest thousandth
                        adjustedAvg = (adjustedAvg * 1).toFixed(3); //adds trailing 0's if needed. ex. .3 -> .300
                        adjustedAvg = "." + adjustedAvg.toString().split('.')[1]; //removes 0 from start e.g. 0.321 -> .321
                        players[i].adjustedAvg = adjustedAvg;
                        players[i].preAdjustmentAvg = ", adjusted from: " + players[i].stat.avg; //add adjustment message
                        players[i].isQualified = false; //marks player as non-qualified so it appears as red
                }
                else {
                        players[i].adjustedAvg = -1; //set non-league players to -1 so they either appear as last or never appear at all
                }
            }
        }
        for (let i = 0; i < players.length; i++){
            players.sort((a, b) => b.adjustedAvg - a.adjustedAvg);
            for (let i = 0; i < playersShown; i++) {
                const ol1 = document.getElementById('playerRanks');
                if ((ol1.children.length < playersShown) && (ol1.children.length < players.length)){ //change to half of playersShown for multiple rows
                        const createRanks = document.createElement('div'); //create new li elements and add them to the ol
                        createRanks.classList.add('rank' + (i + 1 + (playersShown - 20))); //add class
                        createRanks.setAttribute('id', 'rank' + (i + 1 + (playersShown - 20))); //add id
                        ol1.appendChild(createRanks);
                        if (rank === 1){ //test for editing columns
                                const rankBox = document.getElementById("rankBox");
                                rankBox.textContent = 1;
                                const nameBox = document.getElementById("nameBox");
                                nameBox.textContent = players[i].player.fullName;
                                const avgBox = document.getElementById("avgBox");
                                avgBox.textContent = players[i].stat.avg;
                                const preAdjust = document.getElementById("preAdjust");
                                preAdjust.textContent = players[i].preAdjustmentAvg;
                        }
                }
                const changeRank = document.getElementById("rank" + (i + 1));
                if (league === "nl" && players[i].league.name === "NL" || league === "mlb" || league === "al" && players[i].league.name === "AL"){ //check if player is in selected league
                        changeRank.textContent = players[i].player.fullName + ", AVG: " + players[i].adjustedAvg + players[i].preAdjustmentAvg;
                }
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
function switchToFL(){
        let mlbTab = document.getElementById("mlbTab");
        mlbTab.style.backgroundColor = 'gray';
        mlbTab.style.border = '1px solid black';
        let nlTab = document.getElementById("nlTab");
        nlTab.style.backgroundColor = 'gray';
        nlTab.style.border = '1px solid black';
        let alTab = document.getElementById("alTab");
        alTab.style.backgroundColor = 'gray';
        alTab.style.border = '1px solid black';
        let flTab = document.getElementById("flTab");
        flTab.style.backgroundColor = 'white';
        flTab.style.border = '2px solid black';
        league = "fl";
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
