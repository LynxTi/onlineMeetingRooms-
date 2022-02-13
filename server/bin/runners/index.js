const httpServerRunner = require('./httpServerRunner/httpServerRunner');
const mongoDbRunner = require('./mongoDbRunner/mongoDbrunner');

const run = () => {
    httpServerRunner();
    mongoDbRunner();
}

module.exports = run;