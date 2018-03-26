package setup;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.eclipse.jetty.websocket.api.*;
import org.eclipse.jetty.websocket.api.annotations.*;

@WebSocket
public class WebSocketHandler {

	@OnWebSocketConnect
	public void onConnect(Session user) throws Exception {
		String username = "Usuario" + Util.numeroUsuario++;
		Util.mapaUsuarios.put(user, username);
		Logger.getGlobal().log(Level.FINE, username + " conectou no socket");
	}

	@OnWebSocketClose
	public void onClose(Session user, int statusCode, String reason) {
		String username = Util.mapaUsuarios.get(user);
		Util.mapaUsuarios.remove(user);
		Logger.getGlobal().log(Level.FINE, username + " desconectou do socket");
	}

	@OnWebSocketMessage
	public void onMessage(Session user, String message) {
		Util.enviarMensagemBroadcast(message);
	}

}
