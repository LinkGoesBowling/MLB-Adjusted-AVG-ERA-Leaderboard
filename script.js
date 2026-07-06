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
const response = fetch('https://api.bigballsdata.com/v1/players/{player_id}/stats?sport=baseball', {
  headers: {
    Authorization: "Bearer bbs_live_00000FQfo2ituNAqIBd98eazIP9M8HnT90MaSwLOBcgFMR5E", //security key was not kept secret because it is a free plan
    Accept: "application/json"
  }
})
const data = response.json();
console.log(data); //to see if it works
