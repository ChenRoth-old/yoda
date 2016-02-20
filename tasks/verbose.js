const argv = require('yargs').argv;

module.exports = (input) => {
  argv.verbose && console.log(input);
}
