document.addEventListener("DOMContentLoaded", () => {
  const btnSair = document.querySelector("#btnSair");
  if (btnSair) {
    btnSair.addEventListener("click", () => {
      window.location.href = "Bancodedados/logout.php";
    });
  }

  const formAviso = document.querySelector("#formAviso");
  const mensagemEl = document.querySelector("#mensagem");

  const campoId = document.querySelector("#idAviso");
  const campoTitulo = document.querySelector("#titulo");
  const campoConteudo = document.querySelector("#conteudo");
  const campoPrioridade = document.querySelector("#prioridade");
  const campoStatus = document.querySelector("#status");
  const campoDataEnvio = document.querySelector("#data_envio");
  const campoHoraEnvio = document.querySelector("#hora_envio");
  const campoGrupo = document.querySelector("#grupo");
  const campoCargo = document.querySelector("#cargo");
  const campoUnidade = document.querySelector("#unidade");
  const campoValorGasto = document.querySelector("#valor_gasto");
  const campoUnidadeEstoque = document.querySelector("#unidade_estoque");

  const prevPrioridadeEl = document.querySelector("#prevPrioridade");
  const prevStatusEl = document.querySelector("#prevStatus");
  const prevTituloEl = document.querySelector("#prevTitulo");
  const prevMetaEl = document.querySelector("#prevMeta");
  const prevDestEl = document.querySelector("#prevDestinatarios");
  const prevConteudoEl = document.querySelector("#prevConteudo");

  function atualizarPrevia() {
    const titulo = campoTitulo.value.trim();
    prevTituloEl.textContent = titulo || "Título do aviso";

    const conteudo = campoConteudo.value.trim();
    if (conteudo) {
      prevConteudoEl.textContent = conteudo;
    } else {
      prevConteudoEl.textContent =
        "Comece a preencher o formulário ao lado para visualizar a prévia do aviso.";
    }

    const pri = campoPrioridade.value;
    prevPrioridadeEl.className = "preview-pill";
    let textoPri = "Prioridade não definida";
    let classeExtra = "preview-pill-neutro";

    if (pri === "baixa") {
      textoPri = "Prioridade baixa";
      classeExtra = "preview-pill-baixa";
    } else if (pri === "media") {
      textoPri = "Prioridade média";
      classeExtra = "preview-pill-media";
    } else if (pri === "alta") {
      textoPri = "Prioridade alta";
      classeExtra = "preview-pill-alta";
    } else if (pri === "urgente") {
      textoPri = "Prioridade urgente";
      classeExtra = "preview-pill-urgente";
    }

    prevPrioridadeEl.textContent = textoPri;
    prevPrioridadeEl.classList.add(classeExtra);

    const status = campoStatus.value;
    let textoStatus = "Status: ";
    switch (status) {
      case "publicado":
        textoStatus += "Publicar aviso";
        break;
      case "rascunho":
        textoStatus += "Rascunho";
        break;
      case "suspenso":
        textoStatus += "Suspenso";
        break;
      case "cancelado":
        textoStatus += "Cancelado";
        break;
      default:
        textoStatus += status || "Não definido";
    }
    prevStatusEl.textContent = textoStatus;

    const data = campoDataEnvio.value;
    const hora = campoHoraEnvio.value;
    let textoMeta = "";

    if (data) {
      const [ano, mes, dia] = data.split("-");
      textoMeta += `Envio em ${dia}/${mes}/${ano}`;
    } else {
      textoMeta += "Data de envio não definida";
    }

    if (hora) {
      textoMeta += ` · ${hora}`;
    } else {
      textoMeta += " · Horário não definido";
    }

    prevMetaEl.textContent = textoMeta;

    const grupo = campoGrupo.value.trim();
    const cargo = campoCargo.value.trim();
    const unidade = campoUnidade.value.trim();

    const partes = [grupo, cargo, unidade].filter((p) => p);
    if (partes.length > 0) {
      prevDestEl.textContent = "Destinatários: " + partes.join(" | ");
    } else {
      prevDestEl.textContent = "Destinatários: não definidos";
    }
  }

  [
    campoTitulo,
    campoConteudo,
    campoPrioridade,
    campoStatus,
    campoDataEnvio,
    campoHoraEnvio,
    campoGrupo,
    campoCargo,
    campoUnidade,
  ].forEach((el) => {
    if (!el) return;
    el.addEventListener("input", atualizarPrevia);
    el.addEventListener("change", atualizarPrevia);
  });

  atualizarPrevia();

  const params = new URLSearchParams(window.location.search);
  const idEdicao = params.get("id");

  if (idEdicao) {
    carregarAvisoParaEdicao(idEdicao);
  }

  function carregarAvisoParaEdicao(id) {
    mensagemEl.textContent = "Carregando aviso para edição...";

    fetch(`Bancodedados/avisos_buscar.php?id=${encodeURIComponent(id)}`)
      .then((res) => res.json())
      .then((dados) => {
        if (!dados.sucesso) {
          mensagemEl.textContent =
            "Erro ao carregar aviso: " + (dados.erro || "Desconhecido");
          return;
        }

        const aviso = dados.aviso;
        campoId.value = aviso.id;
        campoTitulo.value = aviso.titulo || "";
        campoConteudo.value = aviso.conteudo || "";
        campoPrioridade.value = aviso.prioridade || "";
        campoStatus.value = aviso.status || "publicado";
        campoDataEnvio.value = aviso.data_envio_dia || "";
        campoHoraEnvio.value = aviso.data_envio_hora || "";
        campoGrupo.value = aviso.grupo || "";
        campoCargo.value = aviso.cargo || "";
        campoUnidade.value = aviso.unidade || "";

        if (campoValorGasto) {
          campoValorGasto.value = aviso.valor_gasto || "";
        }
        if (campoUnidadeEstoque) {
          campoUnidadeEstoque.value = aviso.unidade_estoque || "";
        }

        atualizarPrevia();
        mensagemEl.textContent = "Editando aviso #" + aviso.id;
      })
      .catch((err) => {
        console.error("Erro ao carregar aviso:", err);
        mensagemEl.textContent = "Erro ao carregar aviso para edição.";
      });
  }

  formAviso.addEventListener("submit", (e) => {
    e.preventDefault();
    mensagemEl.textContent = "Salvando aviso...";

    const formData = new FormData(formAviso);

    const dataEnvio = formData.get("data_envio");
    const horaEnvio = formData.get("hora_envio");
    if (!dataEnvio || !horaEnvio) {
      mensagemEl.textContent = "Informe data e hora de envio.";
      return;
    }

    fetch("Bancodedados/avisossalvar.php", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((resposta) => {
        if (resposta.sucesso) {
          mensagemEl.textContent = "Aviso salvo com sucesso!";
          if (!campoId.value) {
            formAviso.reset();
            atualizarPrevia();
          }
        } else {
          mensagemEl.textContent =
            "Erro ao salvar aviso: " + (resposta.erro || "Erro desconhecido");
        }
      })
      .catch((err) => {
        console.error("Erro ao salvar aviso:", err);
        mensagemEl.textContent =
          "Erro ao salvar aviso (falha na requisição).";
      });
  });
});
