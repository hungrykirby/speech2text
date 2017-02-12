// 音声認識機能
var recognition;
var nowRecognition = false;
let startFlag = false;
const socket = io.connect();

// 音声認識開始のメソッド
function start () {
  //setTimeout(function()

  recognition = new webkitSpeechRecognition();
  recognition.lang = 'en';
  recognition.maxAlternatives = 10;
  // 以下2点がポイント！！
  // 継続的に処理を行い、不確かな情報も取得可能とする.
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onsoundstart = function(){
    socket.emit('status', 'soundstart')
  };

  recognition.onresult = function (e) {
    socket.emit('status', 'result')
    let finalText = '';
    let interimText = '';
    let confidence = 0;
    let result = {
      word: '',
      confidence: confidence
    };
    // isFinalがtrueの場合は確定した内容
    if (e.results[e.results.length - 1].isFinal || e.results.final) {
      results = [];
      for(var i = 0; i < e.results[e.results.length - 1].length; i++){
        finalText = String(e.results[e.results.length - 1][i].transcript).trim();
        confidence = Number(e.results[e.results.length - 1][i].confidence);
        result = {
          word: finalText,
          confidence: confidence
        };
        console.log('send data', result);
        //socket.emit('final_result', result);
        results.push(result);
      }
      socket.emit('final_result', results);
      setTimeout(function(){
        recognition.stop();
      }, 200);
    } else {
        interimText = String(e.results[e.results.length - 1][0].transcript).trim();
        confidence = Number(e.results[e.results.length - 1][0].confidence);
        result = {
          word: interimText,
          confidence: confidence
        };
        nowRecognition = true;
        console.log('send data', result);
        socket.emit('interim_result', result);
    }
  };

  recognition.onnomatch = function(){
    socket.emit('status', 'no_match');
  }

  recognition.onerror = function(error){
    socket.emit('status', error.error);
    if(!nowRecognition){
      start();
    }
  };

  recognition.onsoundend = function(){
    socket.emit('status', 'stop');
    start();
  };
  nowRecognition = false;
  recognition.start();
  //}, 2000);
};

if(startFlag = socket.on('start')){
  start();
  document.querySelector('#btn').value = '音声認識を止める';
  document.querySelector('#btn').className = 'select';
}else{
  stop();
  document.querySelector('#btn').value = '音声認識を継続的に行う';
  document.querySelector('#btn').className = '';
}

// ボタンアクションの定義
document.querySelector('#btn').onclick = function () {

    // unsupported.
    if (!'webkitSpeechRecognition' in window) {
        alert('Web Speech API には未対応です.');
        return;
    }
    /*
    if (nowRecognition) {
        stop();
        this.value = '音声認識を継続的に行う';
        this.className = '';
    } else {
        start();
        this.value = '音声認識を止める';
        this.className = 'select';
    }
    */
}
