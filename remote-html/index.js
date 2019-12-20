const request = require('request');
const cheerio = require('cheerio');


/**
 * Get HTML body from given URL
 * @param url
 * @returns A promise that is resolved with string of HTML body on success, rejected with error on failure
 */
const getBody = function (url){
    return new Promise((resolve, reject) => {
      request(url, (error, response, body) => {
        if(error || !response ){
            if(error.code === "ENOTFOUND"){
                console.log('O url "' + url + '" não existe');
            } else {
                console.log("Ocurreu um erro -> ", error.code);
            }
            reject(error);
        } else {
          resolve(body);
        }
      });
    });
}
  
/**
 * Parse HTML body string
 * @param  {String} body
 * @returns Cheerio instance object with parsed HTML body on success, false on failure
 */
const parseHTML = function (body){
    if(!body) return false;

    return cheerio.load(body);
}

module.exports = { 
    parseHTML,
    getBody
}