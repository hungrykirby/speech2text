const dict = require('./dict/java_candidate');

var textAnalysis = function(texts){
  return new Promise(function(resolve, reject){
    splitText = texts;
    splitTexts = [];
    splitText = splitText.replace(/[\.\,]/g, "");
    splitTexts = splitText.split(" ");
    let result = [];
    let noMatch = [];
    for(const text of splitTexts){
      let isInText = false;
      for(const words of dict.collection.data){
        for(const c of words.candidate){
          if((text.indexOf(c)>-1 && words.include) || (text === c && !words.include)){
            result.push(words.word);
            console.log(words.word);
          }else{
            if((text != " " || text != "") && !isInText){
              noMatch.push(text);
              isInText = true;
            }
          }
        }
      }
    }
    resolve({
      result: result,
      noMatch: noMatch,
    });
  });
};


exports.voice_analyze = textAnalysis;
