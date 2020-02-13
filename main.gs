//程式參考 http://www.pre-practice.net/2017/10/line-bot_25.html
var CHANNEL_ACCESS_TOKEN = "";


var firebaseUrl = "";
var secret = "";
var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
var data = base.getData();
///////////


var stockId=2049;
var theYear=107;
var theSeason=4;

function doGet(e){
 var stock_list = [5471,6202,9910,6239,9927,9930,8271,1582,5203,6224,6112,3028,2542,1227,9917];
  var result_str ="";
  var sId = 6202;
    /*

  
  for(var i = 0;i<stock_list.length;i++){
    for(var year = 108; year >= 102 ; year--){
      for(var season =4 ; season>0 ; season--){
        if(year ==108&&season>2){
          continue;
        }
        
        if(get_Cashflow(stock_list[i],year,season)){
          result_str+="success"+stock_list[i]+":"+year+","+season,"</br>";
        }
        else{
          result_str+="fail"+stock_list[i]+":"+year+","+season,"</br>";
        }
        Utilities.sleep(1000);
      }
    }
  }
  
   return ContentService.createTextOutput(get_ComprehensiveIncome(2049,107,1));
*/
  return HtmlService.createHtmlOutputFromFile('index');
}


function get_Cashflow_loop(id){
  for(var year = 108; year >= 102 ; year--){
      for(var season =4 ; season>0 ; season--){
        if(year ==108&&season>2){
          continue;
        }
        get_Cashflow(id,year,season);
        Utilities.sleep(1000);

      }
  }
}
/////////////
function get_Cashflow(id,year,season){
  var queryUrl='https://mops.twse.com.tw/mops/web/ajax_t164sb05'; 

  var queryBody = "encodeURIComponent=1&id=&key=&TYPEK=sii&step=2&year="+year+"&season="+season+"&co_id="+id+"&firstin=1";

    var options = {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/x-www-form-urlencoded"
    },
    "payload" : queryBody
  }
  
  var response = UrlFetchApp.fetch(queryUrl,options);
  var fetchHtml = response.getContentText();

  tableHtml = fetchHtml.substring(fetchHtml.search("even")-16,fetchHtml.search("</center>")-9);
  tableHtml = "<html>"+tableHtml+"</html>"
  tableHtml = tableHtml.replace(/,/g, '');
  var document = XmlService.parse(tableHtml);
  var root = document.getRootElement();
  
  var str1="{";
  var td_list = parser.getElementsByTagName(root,"td");
  
  for(var i=0; i<td_list.length ; i++){

    
    if(0==i%3){
      str1 += "\""+td_list[i].getValue().replace(/\s/g, '')+"\":";
    }
    else if(1==i%3){
      str1 += "{\""+theYear+"年第"+theSeason+"季\":\""+td_list[i].getValue().replace(/\s/g, '')+"\",";
    }
    else if( 2==i%3 && i==(td_list.length-1)){
      str1 += "\""+(theYear-1)+"年第"+theSeason+"季\":\""+td_list[i].getValue().replace(/\s/g, '')+"\"}";
    }
    else if( 2==i%3){
      str1 += "\""+(theYear-1)+"年第"+theSeason+"季\":\""+td_list[i].getValue().replace(/\s/g, '')+"\"},";

    }
    
  }
  str1 = str1+"}";
  var result = JSON.parse(str1);
  try{
  base.setData("finance/"+id+"/"+year+"/"+"s"+season+"/現金流量表",result);
  return true;
  }
  catch(e){
  return false;
  }
}

/////////


function get_ComprehensiveIncome_loop(id){
  for(var year = 108; year >= 102 ; year--){
      for(var season =4 ; season>0 ; season--){
        if(year ==108&&season>2){
          continue;
        }
        get_ComprehensiveIncome(id,year,season);
        Utilities.sleep(1000);

      }
  }
}

function get_ComprehensiveIncome(id,year,season){
var queryUrl='https://mops.twse.com.tw/mops/web/ajax_t164sb04'; 
/////table!!!///
  var queryBody = "encodeURIComponent=1&id=&key=&TYPEK=sii&step=2&year="+year+"&season="+season+"&co_id="+id+"&firstin=1";

    var options = {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/x-www-form-urlencoded"
    },
    "payload" : queryBody
  }
  
  var response = UrlFetchApp.fetch(queryUrl,options);
  var fetchHtml = response.getContentText();
  tableHtml = fetchHtml.substring(fetchHtml.search("even")-16,fetchHtml.search("</center>")-9);
  tableHtml = "<html>"+tableHtml+"</html>";
  tableHtml = tableHtml.replace(/,/g, '');
  tableHtml = tableHtml.replace(/class=odd/g,"");
  tableHtml = tableHtml.replace(/class=even/g,"");

 var document = XmlService.parse(tableHtml);

var root = document.getRootElement();
  
  var str1="{";
  var td_list = parser.getElementsByTagName(root,"td");
  
  for(var i=0; i<td_list.length ; i++){
    
    if(0==i%5){
      str1 += "\""+td_list[i].getValue().replace(/\s/g, '')+"\":";

    }
    else if(1==i%5){
      str1 += "{\""+theYear+"年第"+theSeason+"季\":\""+td_list[i-1].getValue().replace(/\s/g, '')+"\",";
    }
    else if(2==i%5){
      str1 += "\""+(theYear)+"年第"+theSeason+"季\":\""+td_list[i-1].getValue().replace(/\s/g, '')+"\",";
    }
    else if(3==i%5){
      str1 += "\""+(theYear-1)+"年第"+theSeason+"季\":\""+td_list[i-1].getValue().replace(/\s/g, '')+"\",";
    }
    else if( 4==i%5 && i==(td_list.length-1)){
      str1 += "\""+(theYear-1)+"年第"+theSeason+"季\":\""+td_list[i-1].getValue().replace(/\s/g, '')+"\"}";
    }
    else if(4==i%5){
      str1 += "\""+(theYear-1)+"年第"+theSeason+"季\":\""+td_list[i-1].getValue().replace(/\s/g, '')+"\"},";
    }    

    
  }
  
  str1=str1+"}";
  var result = JSON.parse(str1);
  try{
  base.setData("finance/"+id+"/"+year+"/"+"s"+season+"/綜合損益表",result);
  return true;
  }
  catch(e){
  return false;
  }
}






///////////////
function get_CombinAssets(id,year,season){
var queryUrl='https://mops.twse.com.tw/mops/web/ajax_t164sb03'; 

  var queryBody = "encodeURIComponent=1&id=&key=&TYPEK=sii&step=2&year="+year+"&season="+season+"&co_id="+id+"&firstin=1";

    var options = {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/x-www-form-urlencoded"
    },
    "payload" : queryBody
  }
  
  var response = UrlFetchApp.fetch(queryUrl,options);
  var fetchHtml = response.getContentText();

}



function get_FincialPosition(id,year,season){

var queryUrl='https://mops.twse.com.tw/mops/web/ajax_t164sb06'; 

  var queryBody = "encodeURIComponent=1&id=&key=&TYPEK=sii&step=2&year="+year+"&season="+season+"&co_id="+id+"&firstin=1";

    var options = {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/x-www-form-urlencoded"
    },
    "payload" : queryBody
  }
  
  var response = UrlFetchApp.fetch(queryUrl,options);
  var fetchHtml = response.getContentText();
  var document = XmlService.parse(fetchHtml);

}


///////////////////



//處理Line server傳進來訊息，判斷是message或postback
function doPost(e) {  
    
  
  var events = JSON.parse(e.postData.contents).events[0];
  var reply_token = events.replyToken;
  
  if (typeof reply_token === 'undefined') 
    return;
  else if (events.type == "follow"){
    getNameByuserId(events.source.userId);
    //responseSuccess(events.source.userId);

  }
  else if (events.type == "message")
  {
    base.setData("users/"+events.source.userId+"/msg/"+events.timestamp,events.message.text);
    if(events. message.type == "text"){
      store_message(events);
      //responseSuccess(events.source.userId);

    }
    
    reply_message(events);
  }
  
  else if(events.type == "join"){
    
    base.setData("groups/"+events.source.groupId+"/timestamp",events.timestamp);
    
  }
  
  else if (events.type == "postback") 
    post_back(events);
}

//若message不是"0"，就送出訊息到用戶端，告知需要服務選單請按0
function reply_message(e) {
  var input_text = e.message.text;
  var msg_userId = e.source.userId;
  //若message是"0"，就要組成一個Button Template https://developers.line.me/en/docs/messaging-api/reference/#buttons
  if (input_text=="0") {  
    var postData = {
      "replyToken": e.replyToken,
      "messages": [{
        "type": "template",
        "altText": "select",
        "template": {
          "type": "buttons",
          "title": "我是聊天機器人",
          "text": "Hi, 需要下列哪一項服務嗎?",
          "actions": [{
              "type": "postback",
              "label": "測試Postback action", //注意Max: 20 characters
              "data": "使用者按下測試Postback action"        //String returned via webhook
            },
            {
              "type": "message",
              "label": "測試Message action",  //注意Max: 20 characters
              "text": "已經按下測試Message action"
            },
            {
              "type": "uri",
              "label": "測試URI action",      //注意Max: 20 characters
              "uri": "https://www.google.com"
            },
            {
              "type": "datetimepicker",
              "label": "測試Datetimepicker",  //注意Max: 20 characters
              "data": "使用者按下測試Datetimepicker action", //String returned via webhook
              "mode": "datetime",
              "initial": "2018-04-10T00:00",
              "max": 　 "2018-12-31T23:59",
              "min": "2018-01-01T00:00"
            }
          ]
        }
      }]
    };
  } 
  else if(input_text == "object"){
    var postData = {
      "replyToken": e.replyToken,
      "messages": [{
        "type": "text",
        "text": JSON.stringify(e)
      }]   
    };
  }
    else if(input_text == "id"){
    var postData = {
      "replyToken": e.replyToken,
      "messages": [{
        "type": "text",
        "text": e.source.userId
      }]   
    };
  }
  
  else { //只要對方提問不是輸入0，就都是回應這句話
  
    if(msg_userId=="U163e36aa7fc9989391eb72a734a76b3a"){
        var postData = {
      "replyToken": e.replyToken,
      "messages": [{
        "type": "text",
        "text": "Hi, "
      }]
    };  
    }
    else{
    var postData = {
      "replyToken": e.replyToken,
      "messages": [{
        "type": "text",
        "text": "Hi, 需要服務選單請按0"
      }]
    };  
  }}
  fetch_data(postData);
}

function post_back(e) {
  var data = e.postback.data;  //String returned via webhook in the postback.data  https://developers.line.me/en/docs/messaging-api/reference/#action-objects
  var replay_text = "";
  if (data == "使用者按下測試Postback action") {
    replay_text = data;
  } else if (data == "使用者按下測試Datetimepicker action") {
    replay_text = data + "\n" + e.postback.params['datetime'];
  }
  // reply message https://developers.line.me/en/docs/messaging-api/reference/#send-reply-message
  var postData = {
    "replyToken": e.replyToken,
    "messages": [{
      "type": "text",
      "text": replay_text + "\n" + JSON.stringify(e.postback)
    }]
  };
  fetch_data(postData);
}

function fetch_data(postData) {
  // reply message https://developers.line.me/en/docs/messaging-api/reference/#send-reply-message
  var options = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN
    },
    "payload": JSON.stringify(postData)
  };
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", options);
}


function store_message(events){
      base.setData("users/"+events.source.userId+"/msg/"+events.timestamp+"/",events.message.text);

}


function getNameByuserId(id){
  var options = {
    "method" : "get",
    "headers" : {
      "Authorization" : "Bearer " + CHANNEL_ACCESS_TOKEN
    }
  };
  var result = UrlFetchApp.fetch("https://api.line.me/v2/bot/profile/"+id,options);
  
  if (result.getResponseCode() == 200) {
    
    var params = JSON.parse(result.getContentText());
    
    base.setData("users/"+id+"/name/",params.displayName);
    base.setData("users/"+id+"/picUrl/",params.pictureUrl);

  }

}


function responseSuccess(id){
  
  postData = {
    "to": id,
    "messages":[
        {
            "type":"text",
            "text":"儲存成功"
        }
    ]
  };
  
  var options = {
    "method" : "post",
    "headers" : {
      "Authorization" : "Bearer " + CHANNEL_ACCESS_TOKEN,
      "Content-Type" : "application/json"
    },
    "payload" : JSON.stringify(postData)
  };
  
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push",options);
  
}


function getData(){
  var options = {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/x-www-form-urlencoded"
    },
    "payload" : "encodeURIComponent=1&id=&key=&TYPEK=sii&step=2&year=107&season=3&co_id=2049&firstin=1"
  }
  
  UrlFetchApp.fetch("https://mops.twse.com.tw/mops/web/ajax_t164sb05",options);

}

function A1(spreadsheetname){
  var newspreadsheet = SpreadsheetApp.create(spreadsheetname);
  var newsheet = newspreadsheet.insertSheet();
}



/////////////////////////
var src = '<doc>'
        + '  <title id="doc-title">Anime Japan Expo</title>'
        + '  <chapter class="chapter">'
        + '    <paragraph class="paragraph">Do you like Anime?</paragraph>'
        + '  </chapter>'
        + '</doc>';

function parseXML() {
  var doc   = XmlService.parse(src),
      xml   = doc.getRootElement(),
      title = parser.getElementById(xml, 'doc-title');
  Logger.log(title.getValue());
}

function parseXMLByTagName() {
  
  var doc   = XmlService.parse(src),
      xml   = doc.getRootElement(),
      title = parser.getElementsByTagName(xml, 'title');
  return title[0].getValue();
}