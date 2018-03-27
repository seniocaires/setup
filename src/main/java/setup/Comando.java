package setup;

import java.util.Map;

public class Comando {

	private String codigo;

	private String exec;

	private String descricao;

	private boolean obrigatorio;

	public String getCodigo() {
		return codigo;
	}

	public void setCodigo(String codigo) {
		this.codigo = codigo;
	}

	public String getExec(Configuracao configuracao, Map<String, String> parametros) {
		String retorno = exec;
		for (GrupoParametro grupoParametro : configuracao.getGruposParametros()) {
			for (Parametro parametro : grupoParametro.getParametros()) {
				retorno = retorno.replaceAll(parametro.getKeystring(), parametros.get(parametro.getCodigo()));
			}
		}
		return retorno;
	}

	public void setExec(String exec) {
		this.exec = exec;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public boolean isObrigatorio() {
		return obrigatorio;
	}

	public void setObrigatorio(boolean obrigatorio) {
		this.obrigatorio = obrigatorio;
	}
}
