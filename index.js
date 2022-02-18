// index.js
const {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation,
} = require("./iss");

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log("It worked! Returned IP:", ip);
});

fetchCoordsByIP("50.67.152.165", (error, data) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }
  console.log("Coords are:", data);
});

fetchISSFlyOverTimes(
  { latitude: 49.1836, longitude: -123.1164 },
  (error, data) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }
    console.log("Fly over time are:", data);
  }
);

const printPassTimes = (passTimes) => {
  for (let pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  printPassTimes(passTimes);
});
