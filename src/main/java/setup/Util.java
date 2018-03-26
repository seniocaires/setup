package setup;

import java.io.File;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.eclipse.jetty.websocket.api.Session;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.google.gson.stream.JsonReader;

public class Util {

	static int numeroUsuario = 1;

	private static WebsocketClientEndpoint clienteSocket;

	static Map<Session, String> mapaUsuarios = new ConcurrentHashMap<>();

	private static List<Configuracao> configuracoes;
	private static final Type CONFIGURACAO_TYPE = new TypeToken<List<Configuracao>>() {
	}.getType();

	public static void enviarMensagemBroadcast(String mensagem) {
		Util.mapaUsuarios.keySet().stream().filter(Session::isOpen).forEach(session -> {
			try {
				session.getRemote().sendString(mensagem);
			} catch (Exception e) {
				Logger.getGlobal().log(Level.SEVERE, e.getMessage(), e);
			}
		});
	}

	public static List<Configuracao> getConfiguracoes() {

		if (configuracoes == null) {

			Gson gson = new Gson();
			JsonReader jsonReader;
			jsonReader = new JsonReader(new InputStreamReader(Util.class.getClassLoader().getResourceAsStream("public" + File.separator + "cfg" + File.separator + "configuracoes.json")));
			configuracoes = gson.fromJson(jsonReader, CONFIGURACAO_TYPE);
		}

		return configuracoes;
	}

	public static Configuracao getConfiguracao(String codigo) {

		for (Configuracao configuracao : getConfiguracoes()) {
			if (configuracao.getCodigo().equals(codigo)) {
				return configuracao;
			}
		}

		return null;
	}

	public static WebsocketClientEndpoint getClienteSocket() {
		if (clienteSocket == null || clienteSocket.userSession == null || !clienteSocket.userSession.isOpen()) {
			try {
				clienteSocket = new WebsocketClientEndpoint(new URI("ws://localhost:4567/socket"));

				clienteSocket.addMessageHandler(new WebsocketClientEndpoint.MessageHandler() {
					public void handleMessage(String message) {
						System.out.println(message);
					}
				});
			} catch (URISyntaxException e) {
				Logger.getGlobal().log(Level.SEVERE, e.getMessage(), e);
			}
		}
		return clienteSocket;
	}
}
