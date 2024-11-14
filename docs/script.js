const varModalCriar = document.getElementById("modal-criar");

const varTitulo = document.getElementById("tituloTarefa");
const varDescr = document.getElementById("descricao");
const varPrio = document.getElementById("prioridade");
const varDataVenc = document.getElementById("dataVenc");
const varResp = document.getElementById("responsaveis");
const varIdInput = document.getElementById("idInput");
const varColumn = document.getElementById("column");

const varTituloCriacao = document.getElementById("tituloCriacao");
const varTituloEdicao = document.getElementById("tituloEdicao");

const varBtnCriacao = document.getElementById("btnSalvarCriar");
const varBtnEdicao = document.getElementById("btnSalvarEditar");

var tarefas = localStorage.getItem("tarefas");

var lista = tarefas ? JSON.parse(tarefas) : [];

gerarCards();


function fModalCriar(data_column) {
    varModalCriar.style.display = "flex";

    varColumn.value = data_column;

    varTituloCriacao.style.display = "block";
    varBtnCriacao.style.display = "block";

    varTituloEdicao.style.display = "none";
    varBtnEdicao.style.display = "none";
}

function fModalEditar(id) {
    varModalCriar.style.display = "flex";

    varTituloCriacao.style.display = "none";
    varBtnCriacao.style.display = "none";

    varTituloEdicao.style.display = "block";
    varBtnEdicao.style.display = "block";

    const indice = lista.findIndex(function (tarefa) {
        return tarefa.id == id;
    });

    const task = lista[indice];

    varIdInput.value = task.id;
    varTitulo.value = task.titulo;
    varDescr.value = task.descricao;
    varPrio.value = task.prioridade;
    varDataVenc.value = task.dataVencimento;
    varResp.value = task.responsaveis;
    varColumn.value = task.column;
}

function fFecharModalCriar() {
    varModalCriar.style.display = "none";
    varTitulo.value = '';
    varDescr.value = '';
    varPrio.value = '';
    varDataVenc.value = '';
    varResp.value = '';
    varIdInput.value = '';
    varColumn.value = '';
}

function resetColumn() {
    document.querySelector('[data-column="1"] .body').innerHTML = '';
    document.querySelector('[data-column="2"] .body').innerHTML = '';
    document.querySelector('[data-column="3"] .body').innerHTML = '';
}

function gerarCards() {

    resetColumn();

    lista.forEach(function (tarefa) {

        const columnBody = document.querySelector(`[data-column="${tarefa.column}"] .body`);

        const card = `
            <div id="${tarefa.id}" class="item" draggable="true" ondragstart="dragstart_handler(event)">
                <div class="card-header">
                    <p class="titulo-tarefa">${tarefa.titulo}</p><button id="editar" class="material-symbols-outlined" onclick="fModalEditar(${tarefa.id})">edit</button>
                    </p><button id="excluir" class="material-symbols-outlined">delete</button>
                </div>
                    <p class="descricao-tarefa">Descrição:</p>
                    <p class="descricao-tarefa">${tarefa.descricao}</p>
                    <p class="prioridade">Prioridade</p>
                    <div class="tag">${tarefa.prioridade}</div>
                    <p class="descricao-tarefa">Data de validade: ${tarefa.dataVencimento}</p>
                    <p class="descricao-tarefa">Responsáveis:
                        ${tarefa.responsaveis}
                    </p>
            </div>
            <br>
        `;

        columnBody.innerHTML += card;
    });
}

function fCriarTarefa() {

    const novaTarefa = {
        id: Math.floor(Math.random() * 999999),
        titulo: varTitulo.value,
        descricao: varDescr.value,
        prioridade: varPrio.value,
        dataVencimento: varDataVenc.value,
        responsaveis: varResp.value,
        column: varColumn.value,
    }

    lista.push(novaTarefa);

    localStorage.setItem("tarefas", JSON.stringify(lista));

    gerarCards();

    fFecharModalCriar();
}

function fEditarTarefa() {

    const tarefa = {
        id: varIdInput.value,
        titulo: varTitulo.value,
        descricao: varDescr.value,
        prioridade: varPrio.value,
        dataVencimento: varDataVenc.value,
        responsaveis: varResp.value,
        column: varColumn.value,
    }

    const indice = lista.findIndex(function (tarefa) {
        return tarefa.id == varIdInput.value;
    });

    lista[indice] = tarefa;

    localStorage.setItem("tarefas", JSON.stringify(lista));

    gerarCards();

    fFecharModalCriar();
}

    function mudarColuna(tarefa_id, column_id) {
        if(tarefa_id && column_id) {
            lista = lista.map((tarefa) => {
                if(tarefa_id != tarefa.id) return tarefa;
    
                return {
                    ...tarefa,
                    column: column_id,
                };
            });
        }

        localStorage.setItem("tarefas", JSON.stringify(lista));

        gerarCards();
    }

    function dragstart_handler(ev) {
        console.log(ev);
        ev.dataTransfer.setData("my_custom_data", ev.target.id);
        ev.dataTransfer.effectAllowed = "move";
    }

    function dragover_handler(ev) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
    }

    function drop_handler(ev) {
        ev.preventDefault();

        const tarefa_id = ev.dataTransfer.getData("my_custom_data");
        const column_id = ev.target.dataset.column;

        mudarColuna(tarefa_id, column_id);

        console.log(ev);
    }