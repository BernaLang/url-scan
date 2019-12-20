const _ = require('lodash');
const cheerio = require('cheerio');
const path = require('path');
const urlPkg = require('url');
const request = require('request');


/**
 * @param $ - The parsed HTML with cheerio package
 * @returns JSON object deepset tagname, depth and the parents, false on failure
 */
const getTreeDepth = function($){
    // Check if cheerio object was provided
    if(!$ || !$('*').cheerio){
        return false;
    }
    let res = {};
    let topDepth = 0;
    $("*").each(function(){
        if($(this).parents().length > topDepth){
            topDepth = $(this).parents().length;
            res = {
                tag: this.tagName,
                depth: topDepth,
                parents: $(this).parents().toArray().map(function(element){ return element.tagName; })
            };
        }
    });
    return res;
}

/**
 * @param $ - The parsed HTML with cheerio package
 * @returns JSON object with each HTML elements type and a count of total children and a count of each children tag, false on failure
 */
const getChildrenByTag = function($){
    // Check if cheerio object was provided
    if(!$ || !$('*').cheerio){
        return false;
    }
    let res = {};
    // Loop trough all tags
    $("*").each(function () {
        let children = $(this).children().toArray();
        let tmp = res[this.tagName] || { childrenCount: 0, children: [] };
        let flag = false;
        let tmp_array = [];
        tmp.childrenCount = tmp.childrenCount + children.length;
        for (let i = 0; i < children.length; i++) {
            tmp_array.push(children[i].tagName);
            flag = true;   
        }
        // Only add the element to the response object if there is at least 1 children
        if(flag){
            tmp.children = tmp_array.concat( tmp.children );
            res[this.tagName] = tmp;
        }
    });
    for (var k in res) {
        if (res.hasOwnProperty(k)) {
          res[k].children = _.countBy(res[k].children);
        }
    }
    return res;
}

/**
 * Count all the elements in a HTML page by tag
 * @param $ - The parsed HTML with cheerio package
 * @returns JSON object with tag names as keys and how many times it exists as values on success, false on failure
 */
const countElements = function($){
    // Check if cheerio object was provided
    if(!$ || !$('*').cheerio){
        return false;
    }
    // Loop trough all tags and count by the object key 'tagName'
    return _.countBy($("*"), 'tagName');
}

/**
 * Count all atributes in HTML page by tag
 * @param $ - The parsed HTML with cheerio package
 * @returns JSON object with tag names as keys containing the attributes and how many times they exist on success, false on failure
 */
const countAtributesByTag = function($){
    // Check if cheerio object was provided
    if(!$ || !$('*').cheerio){
        return false;
    }
    let res = {};
    // Loop trough all tags
    $("*").each(function () {
        let attrs = this.attribs;
        let tmp = res[this.tagName] || {};
        let flag = false;
        for (let name in attrs) {
            // Check if the object key with the count already exists
            if( tmp[name] || tmp[name] === 0 ){
                tmp[name]++;
            } else {
                tmp[name] = 1;
            }
            flag = true;
        }
        // Only add the element to the response object if there is at least 1 attribute
        if(flag) res[this.tagName] = tmp;
    });

    return res;
}

/**
 * @param url - Url to fetch headers
 * @returns object containing headers on success, error object on failure
 */
function getFileHeaders(url) {
    return new Promise((resolve, reject) => {
        request({ url: url, method: "HEAD" }, (error, response) => {
            if (error) return reject(error);
            resolve(response.headers);
        });
    });
}

/**
 * @param $ - The parsed HTML with cheerio package
 * @param {String} url - The url of the request to create the absolute paths
 * @param {Boolean} additionalInfo - Specifies if additional info should be fetched of each Resource (Content size, content type, etc)
 * @returns - Array containing JSON objects with information of the loaded resource on success, false on failure
 */
const getLoadedResources = async function($, url, additionalInfo = false){
    // Check if cheerio object was provided
    if(!$ || !$('*').cheerio){
        return false;
    }
    let res = [];
    $('*[src]').each(function () {
        let tmpObj = {};
        // Get the absolute path 
        let tmpSrc = urlPkg.resolve(url, $(this).attr('src'));
        tmpObj.path = $(this).attr('src');
        tmpObj.absolutePath = tmpSrc;
        tmpObj.tagName = this.tagName;
        tmpObj.file = path.basename( tmpSrc );
        tmpObj.fileExtension = path.extname( tmpSrc );
        res.push(tmpObj);
    });

    if(additionalInfo === true){
        for (let i = 0; i < res.length; i++) {
            let tmpAdditionalInfo;
            try {
                let tmpHeaders = await getFileHeaders(res[i].absolutePath);    
                tmpAdditionalInfo = {
                    fileSize: tmpHeaders['content-length'],
                    fileType: tmpHeaders['content-type'],
                    lastModified: tmpHeaders['last-modified']
                };
            } catch (error) {
                tmpAdditionalInfo = { err: error };
            }
            res[i].additionalInfo = tmpAdditionalInfo;   
        }
    }
    return res;
}

module.exports = {
    getTreeDepth,
    countElements,
    countAtributesByTag,
    getLoadedResources,
    getChildrenByTag
};