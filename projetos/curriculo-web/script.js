// Campos e botões
const campoNome = document.getElementById("nome");
const campoCargo = document.getElementById("cargo");
const campoResumo = document.getElementById("resumo");
const botaoSalvar = document.getElementById("salvar");
const botaoRemover = document.getElementById("remover");
const botaoTema = document.getElementById("tema");
const notificacao = document.getElementById("notificacao");
const nomePerfil = document.getElementById("nomePerfil");
const cargoPerfil = document.getElementById("cargoPerfil");
const resumoPerfil = document.getElementById("resumoPerfil");

let temporizadorNotificacao;

function atualizarVisualizacao() {
    nomePerfil.innerText = campoNome.value.trim() || "Seu Nome";
    cargoPerfil.innerText = campoCargo.value.trim() || "Cargo Desejado";
    resumoPerfil.innerText = campoResumo.value.trim() || "Seu resumo profissional.";
}

// Atualiza o currículo enquanto a pessoa digita
campoNome.addEventListener("input", atualizarVisualizacao);
campoCargo.addEventListener("input", atualizarVisualizacao);
campoResumo.addEventListener("input", atualizarVisualizacao);

function mostrarNotificacao(mensagem) {
    notificacao.innerText = mensagem;
    notificacao.hidden = false;

    clearTimeout(temporizadorNotificacao);
    temporizadorNotificacao = setTimeout(function () {
        notificacao.hidden = true;
    }, 4000);
}

botaoSalvar.addEventListener("click", salvarPerfil);

function salvarPerfil() {
    const perfil = {
        nome: campoNome.value,
        cargo: campoCargo.value,
        resumo: campoResumo.value
    };

    atualizarVisualizacao();

    try {
        localStorage.setItem("perfil", JSON.stringify(perfil));
        mostrarNotificacao("Perfil salvo com sucesso!");
    } catch (erro) {
        console.error("Erro ao salvar o perfil:", erro);
        mostrarNotificacao("Não foi possível salvar o perfil.");
    }
}

botaoRemover.addEventListener("click", removerPerfil);

function removerPerfil() {
    const confirmar = confirm("Tem certeza que deseja remover o perfil?");
    if (!confirmar) {
        return;
    }

    try {
        localStorage.removeItem("perfil");
        campoNome.value = "";
        campoCargo.value = "";
        campoResumo.value = "";
        atualizarVisualizacao();
        mostrarNotificacao("Perfil removido com sucesso!");
    } catch (erro) {
        console.error("Erro ao remover o perfil:", erro);
        mostrarNotificacao("Não foi possível remover o perfil.");
    }
}

botaoTema.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        sessionStorage.setItem("tema", "dark");
    } else {
        sessionStorage.removeItem("tema");
    }
});

function lerCookie(nome) {
    const partes = document.cookie.split(";");

    for (const parte of partes) {
        const cookie = parte.trim();
        const separador = cookie.indexOf("=");

        if (separador === -1) {
            continue;
        }

        const chave = cookie.substring(0, separador);
        const valor = cookie.substring(separador + 1);

        if (chave === nome) {
            return decodeURIComponent(valor);
        }
    }

    return null;
}

window.onload = function () {
    const dadosSalvos = localStorage.getItem("perfil");

    if (dadosSalvos) {
        try {
            const perfilSalvo = JSON.parse(dadosSalvos);
            campoNome.value = perfilSalvo.nome || "";
            campoCargo.value = perfilSalvo.cargo || "";
            campoResumo.value = perfilSalvo.resumo || "";
        } catch (erro) {
            console.error("Não foi possível recuperar o perfil:", erro);
        }
    }

    atualizarVisualizacao();

    if (sessionStorage.getItem("tema") === "dark") {
        document.body.classList.add("dark");
    }

    const ultima = lerCookie("ultimaVisita");

    if (ultima) {
        document.getElementById("visita").innerText = "Última visita: " + ultima;
    } else {
        document.getElementById("visita").innerText = "Primeira visita!";
    }

    const agora = new Date().toLocaleString("pt-BR");
    document.cookie = "ultimaVisita=" + encodeURIComponent(agora) + "; max-age=31536000; path=/";
};
