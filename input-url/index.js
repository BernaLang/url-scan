const readline = require('readline');
const validUrl = require('valid-url');

/**
 * Ask user for a URL
 * @returns A promise that is resolved when the URL is provided
 */
const getUrlInput = function(){
    return new Promise((resolve, reject) => {
      let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question("Insira um URL: \n>", (url) => {
        resolve(url);
        rl.close();
      });
    });
}

/**
 * Validate a URL
 * @param {String} url
 * @returns Returns the URL on success, undefined on failure 
 */
const validateUrl = function(url){
  return validUrl.isWebUri(url);
}

module.exports = {
    getUrlInput,
    validateUrl
}