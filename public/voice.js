var btn = document.getElementById('btn');
var content = document.getElementById('content');
//音声認識APIの使用
var speech = new webkitSpeechRecognition();
//言語を日本語に設定
speech.lang = "en";
btn.addEventListener( 'click' , function() {
    // ➀ボタンをクリックした時の処理
    speech.start();
} );
speech.addEventListener( 'result' , function( e ) {
    // ➁音声認識した結果を得る処理
    console.log(e.results[0][0].transcript);
    console.log(e.results);
} );
