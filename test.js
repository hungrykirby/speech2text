const dict = require('./dict/java_candidate');

const txt = "I bought a pan, and met my classmate. Now I am set up for his birthday party.";

var textAnalysis = function(texts){
  return new Promise(function(resolve, reject){
    splitText = texts;
    splitText = splitText.replace(/[\.\,]/g, " ");
    splitText = splitText.split(" ");
    let result = [];
    let noMatch = [];
    for(const text of splitText){
      let isInText = false;
      console.log(text);
      for(const words of dict.collection.data){
        for(const c of words.candidate){
          if((text.indexOf(c)>-1 && words.include) || (text === c && !words.include)){
            result.push(words.word);
          }else{
            if((text !== " " || text !== "") && !isInText){
              noMatch.push(text);
              isInText = true;
            }
          }
        }
      }
    }
    /*
    for(const words of dict.collection.data){
      for(const c of words.candidate){
        if(texts.indexOf(c) > -1){
          result += (words.word + " ");
        }
      }
    }*/
    resolve({
      result: result,
      noMatch: noMatch,
    });
  });
};

textAnalysis(txt)
  .then(function(data){
    console.log(data);
  });

/*for(const words of dict.collection.data){
  console.log("word", words.word);
  for(const c of words.candidate){
    console.log("candidate", c);
  }
}*/
