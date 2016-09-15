//addPushOne.htmlファイルを呼び出す
function doGet() {
    var html = HtmlService.createTemplateFromFile('addPushOne');
    return html.evaluate();
}

/*Trelloにカードを追加する
*   gasで作ったhtmlファイルにうめこんだ<script>タグ内のjsから呼べる
*   → 呼び方　google.script.run.(呼び出したいgsファイルの関数名)
*/
function addCard(trelloKey,trelloToken,json_list_id,title,desc,due){
    var listId = json_list_id;
    var url = 'https://api.trello.com/1/cards/?key=' + trelloKey + '&token=' + trelloToken;
    var options = {
        'method' : 'post',
        'muteHttpExceptions' : true,
        'payload' : {
            'name'      : title,
            'desc'      : desc,
            'due'       : due,
            'idList'    : listId,
            'urlSource' : ''
        }
    }
    Logger.log(UrlFetchApp.fetch(url, options));
}