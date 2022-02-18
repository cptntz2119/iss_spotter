const request = require("request");

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function (callback) {
  // use request to fetch IP address from JSON API
  request(
    "https://api.ipify.org?format=json",
    function (error, response, body) {
      if (error) {
        callback(error, null);
        return;
      }
      // if non-200 status, assume server error
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
        callback(Error(msg), null);
        return;
      }
      //console.log(typeof body);
      const data = JSON.parse(body);
      //console.log(typeof data);
      let ip = data.ip;
      return callback(null, ip);
    }
  );
};

const fetchCoordsByIP = function (ip, callback) {
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(
        Error(
          `Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`
        ),
        null
      );
      return;
    }

    const { latitude, longitude } = JSON.parse(body);

    callback(null, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = function ({ latitude, longitude }, callback) {
  request(
    `https://iss-pass.herokuapp.com/json/?lat=49.1836&lon=-123.1164`,
    (error, response, body) => {
      if (error) {
        callback(error, null);
        return;
      }

      if (response.statusCode !== 200) {
        callback(
          Error(
            `Status Code ${response.statusCode} when fetching fly over for Coord: ${body}`
          ),
          null
        );
        return;
      }

      const passTimes = JSON.parse(body).response;
      //console.log(result.response);
      callback(null, passTimes);
    }
  );
};

const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) return callback(error, null);

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) return callback(error, null);

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) return callback(error, null);
        callback(null, nextPasses);
      });
    });
  });
};
module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation,
};
