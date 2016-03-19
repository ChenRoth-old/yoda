const argv = require('yargs').argv;
const moment = require('moment');

module.exports = (input, prefix) => {
  prefix = prefix || moment().format('HH:mm:ss');
  argv.verbose && console.log(`[${prefix}] ${input}`);
}
