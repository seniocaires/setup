function start(websocketServerLocation){
	webSocket = new WebSocket(websocketServerLocation);
	webSocket.onmessage = function(msg) { 
		document.write("<pre>" + msg.data + "</pre>");
	};
	webSocket.onopen = function(){
		console.log("Conexao websocket aberta.");
    };
	webSocket.onclose = function(){
		console.log("Conexao websocket fechada.");
        setTimeout(function(){start(websocketServerLocation)}, 5000);
    };
}

start("ws://" + location.hostname + ":" + location.port + "/socket");

//var webSocket = new WebSocket("ws://" + location.hostname + ":" + location.port + "/socket");

//webSocket.onmessage = function(msg) {
//	document.write("<pre>" + msg.data + "</pre>");
//};

//webSocket.onclose = function() {
//};