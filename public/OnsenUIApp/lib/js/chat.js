// Onsen UIのスタイル定義
ons.forcePlatformStyling('ios');

// WebSocketサーバの定義
// var uri = "wss://ruby-websockets-chat.herokuapp.com/";
var uri = "ws://localhost:5000/";
var ws = null;  // WebSocketオブジェクト

var username;   // ユーザー名

// ページが切り替わる度に呼ばれます。
document.addEventListener('init', function(event) {
  var page = event.target;
  if (page.matches('#first-page')) {  // 入室画面の処理
    // 入室ボタンを押した時の処理
    $('#push-button').on('click', function() {
      // ユーザ名を設定
      username = $('#username').val();
      
      // WebSocket接続
      ws = new WebSocket(uri);
      
      // チャット画面に遷移
      document.querySelector('#navigator').pushPage('page2.html');
    });
  } else if (page.matches('#second-page')) {  // チャット画面の処理
    // WebSocketでメッセージを受け取った時の処理
    ws.onmessage = function(message) {
      console.log(message);
      var data = JSON.parse(message.data);
      
      // 送信元が自分か他人かで画面のデザインを変更
      if (data.handle == username) {
        $('#chats').append(`
              <ons-list-item modifier="nodivider">
                <div class="right">
                  <ons-button style="background-color: green">${data.text}</ons-button>
                </div>
              </ons-list-item>`);
      }else{
        $('#chats').append(`
              <ons-list-item modifier="nodivider">
                <ons-button>${data.text}</ons-button>
                <span class="list-item__subtitle">${data.handle}</span>
              </ons-list-item>`);
      }
    };
    
    // 送信ボタンを押した時の処理
    $('#send').on('click', function(e) {
      // WebSocketで送信
      ws.send(JSON.stringify({ handle: username, text: $('#message').val() }));
      
      // 元の入力内容は削除
      $('#message').val('')
    });
    
  }
}); 

// Onsen UIロード完了時の処理
ons.ready(function() {
  // 入室画面に戻るときの処理
  $('#navigator').on('prepop', function() {
    // WebSocket切断
    ws.close();
    ws = null;
  });
});
