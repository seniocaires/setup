package setup;

import java.util.ArrayList;
import java.util.List;

public class Configuracao {

	private String codigo;

	private String nome;

	private String descricao;

	private List<Comando> comandos;

	private List<GrupoParametro> gruposParametros;

	public Comando getComando(String codigo) {

		for (Comando comando : getComandos()) {
			if (comando.getCodigo().equals(codigo)) {
				return comando;
			}
		}

		return null;
	}

	public String getCodigo() {
		return codigo;
	}

	public void setCodigo(String codigo) {
		this.codigo = codigo;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public List<Comando> getComandos() {

		if (comandos == null) {
			comandos = new ArrayList<>();
		}
		return comandos;
	}

	public void setComandos(List<Comando> comandos) {
		this.comandos = comandos;
	}

	public List<GrupoParametro> getGruposParametros() {

		if (gruposParametros == null) {
			gruposParametros = new ArrayList<>();
		}
		return gruposParametros;
	}

	public void setGruposParametros(List<GrupoParametro> gruposParametros) {
		this.gruposParametros = gruposParametros;
	}

}
