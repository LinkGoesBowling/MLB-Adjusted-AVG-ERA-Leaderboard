const response = fetch('https://api.bigballsdata.com/v1/players/{player_id}/stats?sport=baseball', {
  headers: {
    Authorization: "Bearer bbs_live_00000FQfo2ituNAqIBd98eazIP9M8HnT90MaSwLOBcgFMR5E", //security key was not kept secret because it is a free plan
    Accept: "application/json";
  }
})
const data = await response.json();
console.log(data); //to see if it works
