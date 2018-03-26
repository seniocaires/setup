package setup;

import java.util.ArrayList;
import java.util.List;

public class GrupoParametro {

	private String descricao;

	private List<Parametro> parametros;

	public Parametro getParametro(String codigo) {

		for (Parametro parametro : getParametros()) {
			if (parametro.getCodigo().equals(codigo)) {
				return parametro;
			}
		}

		return null;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public List<Parametro> getParametros() {

		if (parametros == null) {
			parametros = new ArrayList<>();
		}
		return parametros;
	}

	public void setParametros(List<Parametro> parametros) {
		this.parametros = parametros;
	}
}
