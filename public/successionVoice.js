// 音声認識機能
var recognition;
var nowRecognition = false;
const socket = io.connect();

// 音声認識開始のメソッド
function start () {
  recognition = new webkitSpeechRecognition();
  recognition.lang = 'en';
  // 以下2点がポイント！！
  // 継続的に処理を行い、不確かな情報も取得可能とする.
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onsoundstart = function(){
    socket.emit('status', 'soundstart')
  };

  recognition.onresult = function (e) {
    socket.emit('status', 'result')
    var finalText = '';
    var interimText = '';
    // isFinalがtrueの場合は確定した内容
    if (e.results[e.results.length - 1].isFinal) {
        finalText = e.results[e.results.length - 1][0].transcript;
        console.log('finalText', finalText);
        socket.emit('finalText', finalText);
    } else {
        interimText = e.results[e.results.length - 1][0].transcript;
        console.log('interimText', interimText);
        socket.emit('interimText', interimText);
    }
  };

  recognition.onerror = function(){
    socket.emit('status', 'error');
    if(!nowRecognition){
      start();
    }
  };

  recognition.onsoundend = function(){
    socket.emit('status', 'stop');
    start();
  };
  recognition.start();
  nowRecognition = true;
};



// ボタンアクションの定義
document.querySelector('#btn').onclick = function () {

    // unsupported.
    if (!'webkitSpeechRecognition' in window) {
        alert('Web Speech API には未対応です.');
        return;
    }

    if (nowRecognition) {
        stop();
        this.value = '音声認識を継続的に行う';
        this.className = '';
    } else {
        start();
        this.value = '音声認識を止める';
        this.className = 'select';
    }
}
