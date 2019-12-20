const inputUrl = require('./input-url');
const remoteHtml = require('./remote-html');
const actions = require('./actions');
const fs = require('fs');
const Spinner = require('cli-spinner').Spinner;

let loading;

/**
 * Shows CLI loading text
 */
function showLoading(){
  loading = new Spinner("A carregar...");
  loading.setSpinnerString(18);
  loading.start();
}

/**
 * Hides CLI loading text if it's showing
 */
function hideLoading(){
  if( loading && loading.isSpinning() ){
    loading.stop(true);
  }
}

/**
 * Write JSON output into a file and exit
 * @param obj - JSON object to write in output file
 */
function writeOutput(obj){
  fs.writeFile('./output.json', JSON.stringify(obj, null, 2), function(err){
    if(err){
      console.log("Ocurreu um erro a criar o ficheiro de output");
    } else {
      console.log("Ficheiro output.json criado");
    }
    process.exit();
  });
}

/**
 * Get, parse and analyze HTML from given url
 * @param {String} url - URL to get the HTML from
 */
function start(url){
  if(!url){
    console.log("Por favor insira um URL");
    getData(true);

    return;
  }
  showLoading();
  remoteHtml.getBody(url).then(
    async (body) => {
      const parsedBody = remoteHtml.parseHTML(body);
      if( !parsedBody ){
        console.log("Ocurreu um erro a ler o HTML");
        getData(true);

        return;
      };

      let finObj = {};
      finObj.treeDepth = actions.getTreeDepth(parsedBody);
      finObj.elementCount = actions.countElements(parsedBody);
      finObj.attributesCount = actions.countAtributesByTag(parsedBody);
      finObj.childrenCount = actions.getChildrenByTag(parsedBody);
      finObj.loadedResources = await actions.getLoadedResources(parsedBody, url, true);
      hideLoading();
      console.log("-----JSON----");
      console.log(JSON.stringify(finObj, null, 2));
      console.log("-------------");
      writeOutput(finObj);
    },
    (err) => {
      getData(true);
    }
  );
}

/**
 * Starter function to get the URL
 * @param {Boolean} ignoreArg - Choose if program should ignore the URL provided via CLI
 */
function getData(ignoreArg = false){
  hideLoading();
  // Check if url was provided
  if( process.argv.length > 2 && inputUrl.validateUrl(process.argv[2]) && !ignoreArg ){
    start(process.argv[2]);
  } else {
    inputUrl.getUrlInput()
    .then(
      (url) => {
        if( !url || !inputUrl.validateUrl(url) ){
          console.log("URL Inválido");
          getData(true);
        } else {
          start(url);
        }
      }, 
      (err) => {
        getData(true);
      }
    );
  }
}

getData();