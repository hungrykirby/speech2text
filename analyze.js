const dict = require('./dict/java_candidate');

var textAnalysis = function(texts){
  return new Promise(function(resolve, reject){
    let splitText = texts;
    splitTexts = [];
    splitTexts = splitText.replace(/[\.\,]/g, "");
    //splitTexts = splitText.split(" ");
    //let result = [];
    //let noMatch = [];
    let result = '';
    let noMatch = '';
    //for(const text of splitTexts){
    let text = texts;
      console.log('text', text);
      let isInText = false;
      for(const words of dict.collection.data){
        for(const c of words.candidate){
          //console.log("c", c)
          if(((text.indexOf(c[0])>-1 || text === c[0]) && words.include) || (text === c[0] && !words.include)){
            //result.push(words.word);
            //console.log("----", words.word);
            result = words.word;
            isInText = true;
          }else{
            if((text != " " || text != "") && !isInText){
              //noMatch.push(text);
              //console.log("else", text);
              noMatch = text;
              isInText = true;
            }
          }
        }
      }
    //}
    console.log("R", result);
    console.log("N", noMatch);
    resolve({
      result: result,
      noMatch: noMatch,
    });
  });
};


exports.voice_analyze = function(inputs){
  let promises = [];
  return new Promise(function(resolve, reject){
    let add_text = '';
    let defined = false;
    for(const d of inputs){
      promises.push(textAnalysis(d.word));
    }
    Promise.all(promises).then(function(results){
      for(const r of results){
        if(r.result !== '' && !defined){
          add_text += r.result;
          defined = true;
        }else{

        }
      }
      console.log('defined', defined);
      resolve({
        add_text: add_text,
        IsDefined: defined
      });
    });
      /*textAnalysis(d.word).then(function(voice){
        if(voice.result !== '' && !defined){
          //all_text += voice.noMatch;
          add_text = voice.result;
          defined = true;
          console.log('add_text', add_text);
        }else{
          //all_text += voice.result;
        }
      });*/

  });
};
