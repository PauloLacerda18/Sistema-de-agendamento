// avisos.js

document.addEventListener("DOMContentLoaded", () => {
  // número padrão de WhatsApp (só números, com DDD)
  const WHATSAPP_PADRAO = "85999999999"; // TROCA PARA O NÚMERO QUE VOCÊ QUISER

  const tabelaBody = document.querySelector("#tabelaAvisos tbody");
  const inputBusca = document.querySelector("#buscaAvisos");
  const selectStatus = document.querySelector("#filtroStatus");
  const inputInicio = document.querySelector("#filtroDataInicio");
  const inputFim = document.querySelector("#filtroDataFim");

  const totalAvisosEl = document.querySelector("#totalAvisos");
  const totalPublicadosEl = document.querySelector("#totalPublicados");
  const totalRascunhosEl = document.querySelector("#totalRascunhos");
  const totalSuspensosEl = document.querySelector("#totalSuspensos");
  const totalCanceladosEl = document.querySelector("#totalCancelados");

  let avisos = [];
  let avisosFiltrados = [];

  carregarAvisos();

  function carregarAvisos() {
    fetch("Bancodedados/listar_avisos.php")
      .then((res) => res.json())
      .then((dados) => {
        avisos = dados || [];
        aplicarFiltros();
      })
      .catch((err) => {
        console.error("Erro ao carregar avisos:", err);
        tabelaBody.innerHTML = `
          <tr><td colspan="8">Erro ao carregar avisos.</td></tr>
        `;
      });
  }

  // filtros
  inputBusca.addEventListener("input", aplicarFiltros);
  selectStatus.addEventListener("change", aplicarFiltros);
  inputInicio.addEventListener("change", aplicarFiltros);
  inputFim.addEventListener("change", aplicarFiltros);

  function aplicarFiltros() {
    const texto = inputBusca.value.toLowerCase().trim();
    const statusFiltro = selectStatus.value;
    const inicio = inputInicio.value; // yyyy-mm-dd
    const fim = inputFim.value;       // yyyy-mm-dd

    avisosFiltrados = avisos.filter((aviso) => {
      const titulo = (aviso.titulo || "").toLowerCase();
      const conteudo = (aviso.conteudo || "").toLowerCase();

      if (texto && !titulo.includes(texto) && !conteudo.includes(texto)) {
        return false;
      }

      if (statusFiltro && aviso.status !== statusFiltro) {
        return false;
      }

      if (inicio || fim) {
        const dataEnvio = aviso.data_envio
          ? aviso.data_envio.substring(0, 10)
          : null;

        if (!dataEnvio) return false;

        if (inicio && dataEnvio < inicio) return false;
        if (fim && dataEnvio > fim) return false;
      }

      return true;
    });

    renderizarTabela();
    atualizarResumo();
  }

  function renderizarTabela() {
    tabelaBody.innerHTML = "";

    if (avisosFiltrados.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 8;
      td.textContent = "Nenhum aviso encontrado.";
      tr.appendChild(td);
      tabelaBody.appendChild(tr);
      return;
    }

    avisosFiltrados.forEach((aviso, index) => {
      const tr = document.createElement("tr");

      // #
      const tdIndex = document.createElement("td");
      tdIndex.textContent = index + 1;
      tr.appendChild(tdIndex);

      // Título (e tooltip com conteúdo)
      const tdTitulo = document.createElement("td");
      tdTitulo.textContent = aviso.titulo || "";
      tdTitulo.title = aviso.conteudo || "";
      tr.appendChild(tdTitulo);

      // Prioridade
      const tdPrioridade = document.createElement("td");
      const spanPri = document.createElement("span");
      spanPri.classList.add("badge");
      spanPri.textContent = formatarPrioridade(aviso.prioridade);

      switch (aviso.prioridade) {
        case "baixa":
          spanPri.classList.add("badge-alta"); // cor suave
          break;
        case "media":
          spanPri.classList.add("badge-enviado");
          break;
        case "alta":
          spanPri.classList.add("badge-pendente");
          break;
        case "urgente":
          spanPri.classList.add("badge-aprovado");
          break;
      }

      tdPrioridade.appendChild(spanPri);
      tr.appendChild(tdPrioridade);

      // Data envio
      const tdData = document.createElement("td");
      tdData.textContent = formatarDataHora(aviso.data_envio);
      tr.appendChild(tdData);

      // Destinatários (grupo / cargo / unidade)
      const tdDest = document.createElement("td");
      const partes = [aviso.grupo, aviso.cargo, aviso.unidade].filter(Boolean);
      tdDest.textContent = partes.join(" | ");
      tr.appendChild(tdDest);

      // Status
      const tdStatus = document.createElement("td");
      const spanStatus = document.createElement("span");
      spanStatus.classList.add("badge");
      spanStatus.textContent = formatarStatus(aviso.status);

      switch (aviso.status) {
        case "publicado":
          spanStatus.classList.add("badge-aprovado");
          break;
        case "rascunho":
          spanStatus.classList.add("badge-enviado");
          break;
        case "suspenso":
          spanStatus.classList.add("badge-pendente");
          break;
        case "cancelado":
          spanStatus.classList.add("badge-alta");
          break;
      }

      tdStatus.appendChild(spanStatus);
      tr.appendChild(tdStatus);

      // Leitura
      const tdLeitura = document.createElement("td");
      const spanLeitura = document.createElement("span");
      spanLeitura.classList.add("badge");

      if (parseInt(aviso.lido) === 1) {
        spanLeitura.classList.add("badge-leitura-sim");
        spanLeitura.textContent = "Lido";
        if (aviso.data_leitura) {
          spanLeitura.title = "Lido em " + formatarDataHora(aviso.data_leitura);
        }
      } else {
        spanLeitura.classList.add("badge-leitura-nao");
        spanLeitura.textContent = "Não lido";
      }

      tdLeitura.appendChild(spanLeitura);
      tr.appendChild(tdLeitura);

      // Ações
      const tdAcoes = document.createElement("td");

      // Ver
      const btnVer = document.createElement("button");
      btnVer.textContent = "Ver";
      btnVer.className = "acao ver";
      btnVer.addEventListener("click", () => {
        alert(
          `Título: ${aviso.titulo}\n\nConteúdo:\n${aviso.conteudo}\n\nDestinatários: ${partes.join(
            " | "
          )}`
        );
      });
      tdAcoes.appendChild(btnVer);

      // Editar (vai para o formulário com o aviso carregado)
      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.className = "acao editar";
      btnEditar.addEventListener("click", () => {
        window.location.href = `painel.html?id=${aviso.id}`;
      });
      tdAcoes.appendChild(btnEditar);

      // Aprovar (equivale a publicar)
      if (aviso.status !== "publicado") {
        const btnAprovar = document.createElement("button");
        btnAprovar.textContent = "Aprovar";
        btnAprovar.className = "acao aprovar";
        btnAprovar.addEventListener("click", () =>
          atualizarStatus(aviso.id, "publicado")
        );
        tdAcoes.appendChild(btnAprovar);
      }

      // Suspender
      if (aviso.status !== "suspenso") {
        const btnSuspender = document.createElement("button");
        btnSuspender.textContent = "Suspender";
        btnSuspender.className = "acao rejeitar";
        btnSuspender.addEventListener("click", () =>
          atualizarStatus(aviso.id, "suspenso")
        );
        tdAcoes.appendChild(btnSuspender);
      }

      // Cancelar (equivale a rejeitar)
      if (aviso.status !== "cancelado") {
        const btnCancelar = document.createElement("button");
        btnCancelar.textContent = "Cancelar";
        btnCancelar.className = "acao excluir";
        btnCancelar.addEventListener("click", () =>
          atualizarStatus(aviso.id, "cancelado")
        );
        tdAcoes.appendChild(btnCancelar);
      }

      // Confirmar leitura
      if (parseInt(aviso.lido) === 0) {
        const btnLeitura = document.createElement("button");
        btnLeitura.textContent = "Confirmar leitura";
        btnLeitura.className = "acao ver";
        btnLeitura.addEventListener("click", () =>
          confirmarLeitura(aviso.id)
        );
        tdAcoes.appendChild(btnLeitura);
      }

      // WhatsApp
      const btnWhatsapp = document.createElement("button");
      btnWhatsapp.textContent = "WhatsApp";
      btnWhatsapp.className = "acao whatsapp";
      btnWhatsapp.addEventListener("click", () => {
        const numeroLimpo = WHATSAPP_PADRAO.replace(/\D/g, "");

        const texto =
          `*Aviso de Estoque*\n` +
          `Título: ${aviso.titulo}\n` +
          `Prioridade: ${formatarPrioridade(aviso.prioridade)}\n` +
          `Data de envio: ${formatarDataHora(aviso.data_envio)}\n` +
          `Destinatários: ${partes.join(" | ")}\n\n` +
          `${aviso.conteudo}`;

        const url = `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(
          texto
        )}`;

        window.open(url, "_blank");
      });
      tdAcoes.appendChild(btnWhatsapp);

      tr.appendChild(tdAcoes);
      tabelaBody.appendChild(tr);
    });
  }

  function atualizarResumo() {
    const total = avisosFiltrados.length;
    const publicados = avisosFiltrados.filter(a => a.status === "publicado").length;
    const rascunhos  = avisosFiltrados.filter(a => a.status === "rascunho").length;
    const suspensos  = avisosFiltrados.filter(a => a.status === "suspenso").length;
    const cancelados = avisosFiltrados.filter(a => a.status === "cancelado").length;

    totalAvisosEl.textContent = total;
    totalPublicadosEl.textContent = publicados;
    totalRascunhosEl.textContent = rascunhos;
    totalSuspensosEl.textContent = suspensos;
    totalCanceladosEl.textContent = cancelados;
  }

  function atualizarStatus(id, novoStatus) {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", novoStatus);

    fetch("Bancodedados/avisos_status.php", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((resposta) => {
        if (resposta.sucesso) {
          // atualiza no array local
          const aviso = avisos.find(a => parseInt(a.id) === parseInt(id));
          if (aviso) aviso.status = novoStatus;
          aplicarFiltros();
        } else {
          alert("Erro ao atualizar status: " + (resposta.erro || ""));
        }
      })
      .catch((err) => {
        console.error("Erro ao atualizar status:", err);
        alert("Erro ao atualizar status.");
      });
  }

  function confirmarLeitura(id) {
    const formData = new FormData();
    formData.append("id", id);

    fetch("Bancodedados/avisos_leitura.php", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((resposta) => {
        if (resposta.sucesso) {
          const aviso = avisos.find(a => parseInt(a.id) === parseInt(id));
          if (aviso) {
            aviso.lido = 1;
            aviso.data_leitura = new Date().toISOString().slice(0, 19).replace("T", " ");
          }
          aplicarFiltros();
        } else {
          alert("Erro ao confirmar leitura: " + (resposta.erro || ""));
        }
      })
      .catch((err) => {
        console.error("Erro ao confirmar leitura:", err);
        alert("Erro ao confirmar leitura.");
      });
  }

  // helpers
  function formatarDataHora(str) {
    if (!str) return "";
    const [data, hora] = str.split(" ");
    if (!data) return "";
    const [ano, mes, dia] = data.split("-");
    if (!hora) return `${dia}/${mes}/${ano}`;
    const [h, m] = hora.split(":");
    return `${dia}/${mes}/${ano} ${h}:${m}`;
  }

  function formatarPrioridade(p) {
    switch (p) {
      case "baixa": return "Baixa";
      case "media": return "Média";
      case "alta": return "Alta";
      case "urgente": return "Urgente";
      default: return p || "";
    }
  }

  function formatarStatus(s) {
    switch (s) {
      case "publicado": return "Publicado";
      case "rascunho": return "Rascunho";
      case "suspenso": return "Suspenso";
      case "cancelado": return "Cancelado";
      default: return s || "";
    }
  }
});
