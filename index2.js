// index2.js
const { nextISSTimesForMyLocation } = require("./iss_promised");

// see index.js for printPassTimes
// copy it from there, or better yet, moduralize and require it in both files
const printPassTimes = (passTimes) => {
  for (let pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};
// Call
nextISSTimesForMyLocation().then((passTimes) => {
  printPassTimes(passTimes);
});
