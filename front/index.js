const API = "http://127.0.0.1:3000/municipios";

const listagem = document.getElementById("listagem");
const btnCarregar = document.getElementById("btn");
const btnSalvar = document.getElementById("btnSalvar");
const btnMais = document.getElementById("btnMais");
const btnVoltar = document.getElementById("btnVoltar");

const API_KEY_SECRET = "SUA_CHAVE_SECRETA_MUITO_FORTE_123456"

// Eventos
btnCarregar.addEventListener("click", carregarMunicipios);
btnSalvar.addEventListener("click", inserirOeditando);
document.getElementById("btnMais").addEventListener("click", () => {
    pagina++;

    const offset = pagina * limit;
    if (offset >= dadosCache.length) {
        pagina = 0;
    }

    mostrarPagina();
});
document.getElementById("btnMenos").addEventListener("click", () => {
    pagina--;
    if (pagina < 0) {
        pagina = Math.ceil(dadosCache.length / limit) - 1;
    }

    mostrarPagina();
});
//--------------------------------------------------
// LISTAR MUNICÍPIOS
//--------------------------------------------------

let pagina = 0
const limit = 3
let dadosCache = []

// Carrega a lista completa 1 vez
async function carregarMunicipios() {
    try {
        const resposta = await fetch(API, {
            headers: {
                'minha-chave': API_KEY_SECRET
            }
        });
        dadosCache = await resposta.json()

        pagina = 0
        mostrarPagina()

    } catch (erro) {
        console.error("Erro ao carregar:", erro.message)
    }
}

//--------------------------------------------------
// CRIAR CARD NO FRONT
//--------------------------------------------------
function criarCard(m) {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        <h3>${m.nome} (${m.estado})</h3>
        <p>${m.caracteristica}</p>
        <button class="btn-delete" onclick="deletar(${m.id})">Deletar</button>
        <button class="btn-alterar" onclick="selecionar(${m.id})">Alterar</button>
    `

    listagem.appendChild(card);
}

//--------------------------------------------------
// INSERIR MUNICÍPIO (POST)
//--------------------------------------------------
async function inserirMunicipio() {
    const nome = document.getElementById("campoMunicipio").value;
    const estado = document.getElementById("campoUF").value;
    const caracteristica = document.getElementById("campoCaracteristica").value;

    const novoMunicipio = { nome, estado, caracteristica };

    try {
        const resposta = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json", 'minha-chave': API_KEY_SECRET },
            body: JSON.stringify(novoMunicipio),
        });

        if (!resposta.ok) {
            throw new Error("Erro ao inserir!");
        }

        carregarMunicipios();

    } catch (erro) {
        console.error("Erro ao inserir:", erro.message);
    }
}

async function deletar(id) {
    try {
        const resposta = await fetch(`http://127.0.0.1:3000/municipios/${id}`, {
            method: "DELETE",
            headers: {
                'minha-chave': API_KEY_SECRET
            }
        });
        if (!resposta.ok) {
            throw new Error("Erro ao deletar!")
        }
        carregarMunicipios()

    } catch (erro) {
        console.error("Erro ao deletar:", erro.message)
    }
}

async function alterar(id) {
    const nome = document.getElementById("campoMunicipio").value
    const estado = document.getElementById("campoUF").value
    const caracteristica = document.getElementById("campoCaracteristica").value

    const municipio = { nome, estado, caracteristica };

    try {
        const resposta = await fetch(`http://127.0.0.1:3000/municipios/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(municipio),
        });

        if (!resposta.ok) {
            throw new Error("Erro ao alterar!")
        }

        carregarMunicipios()
        window.idEditando = null

    } catch (erro) {
        console.error("Erro ao alterar:", erro.message)
    }
}

async function selecionar(id) {
    const resposta = await fetch(`${API}/${id}`)
    const municipio = await resposta.json()

    document.getElementById("campoMunicipio").value = municipio.nome
    document.getElementById("campoUF").value = municipio.estado
    document.getElementById("campoCaracteristica").value = municipio.caracteristica

    window.idEditando = id
}

async function inserirOeditando() {
    if (window.idEditando) {
        await alterar(window.idEditando)
        limparCampos()
    } else {
        await inserirMunicipio()
        limparCampos
    }
}

function limparCampos() {
    document.getElementById("campoMunicipio").value = ""
    document.getElementById("campoUF").value = ""
    document.getElementById("campoCaracteristica").value = ""
}

function mostrarPagina() {
    listagem.innerHTML = "";

    const offset = pagina * limit
    const fim = offset + limit

    const recorte = dadosCache.slice(offset, fim);

    recorte.forEach(m => criarCard(m));
}
