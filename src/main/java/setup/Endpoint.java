package setup;

import static spark.Spark.init;
import static spark.Spark.post;
import static spark.Spark.get;
import static spark.Spark.staticFiles;
import static spark.Spark.webSocket;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Endpoint {

	public static void main(String[] args) {

		staticFiles.location("/public");

		webSocket("/socket", WebSocketHandler.class);
		init();

		get("/configuracoes", "application/json", (request, response) -> {

			if (Util.getConfiguracoes() == null || Util.getConfiguracoes().isEmpty()) {
				response.status(500);
				Util.getClienteSocket().sendMessage("Arquivo de configurações não encontrado.");
				return "";
			}

			return Util.getConfiguracoesJSon();
		});

		post("/run", (request, response) -> {

			response.type("text/plain; charset=UTF-8");

			if (null == request.queryParamsValues("modulos")) {
				response.status(402);
				Util.getClienteSocket().sendMessage("Selecione os módulos.");
				return "";
			}

			if (null == request.queryParams("configuracao")) {
				response.status(402);
				Util.getClienteSocket().sendMessage("Selecione a configuração.");
				return "";
			}

			response.status(200);

			Map<String, String> parametros = new HashMap<>();
			for (String codigoPostParametro : request.queryParams()) {
				for (GrupoParametro grupoParametro : Util.getConfiguracao(request.queryParams("configuracao")).getGruposParametros()) {
					Parametro parametro = grupoParametro.getParametro(codigoPostParametro);
					if (parametro != null) {
						parametros.put(codigoPostParametro, request.queryParams(codigoPostParametro));
					}
				}
			}

			for (String modulo : request.queryParamsValues("modulos")) {
				Comando comando = Util.getConfiguracao(request.queryParams("configuracao")).getComando(modulo);
				if (comando != null) {
					executarComando(Util.getConfiguracao(request.queryParams("configuracao")), comando, parametros);
				}
			}

			return "";
		});

	}

	private static void executarComando(Configuracao configuracao, Comando comando, Map<String, String> parametros) {

		Process processo;
		try {
			Util.getClienteSocket().sendMessage("::: Aguarde. Executando comando > " + comando.getDescricao());

			processo = Runtime.getRuntime().exec(comando.getExec(configuracao, parametros));
			int exitCode = processo.waitFor();
			if (exitCode != 0) {
				InputStream inputStreamErro = processo.getErrorStream();
				InputStreamReader inputStreamReaderErro = new InputStreamReader(inputStreamErro);
				BufferedReader bufferedReaderErro = new BufferedReader(inputStreamReaderErro);
				String line = null;
				while ((line = bufferedReaderErro.readLine()) != null) {
					Util.getClienteSocket().sendMessage(line + "\n");
				}
				throw new IOException("Comando não pode ser executado. Código de erro: " + exitCode);
			}
			BufferedReader reader = new BufferedReader(new InputStreamReader(processo.getInputStream()));

			String linha = "";
			while ((linha = reader.readLine()) != null) {
				Util.getClienteSocket().sendMessage(linha + "\n");
			}

		} catch (Exception e) {
			Util.getClienteSocket().sendMessage(e.getMessage() + "\n");
			Logger.getGlobal().log(Level.SEVERE, e.getMessage(), e);
		}
	}
}