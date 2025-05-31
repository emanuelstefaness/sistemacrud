// Seleciona elementos do DOM
var form = document.getElementById("myform"),
    imgInput = document.querySelector(".img"),
    file = document.getElementById("imgInput"),
    modelo = document.getElementById("name"),
    marca = document.getElementById("marca"),
    tamanhoContainer = document.getElementById("tamanhos-container"),
    infoTenis = document.getElementById("data"),
    modal = document.getElementById("tenisform"),
    modalTitle = document.querySelector('#tenisform .modal-title'),
    submitBtn = document.getElementById("submitBtn"),
    marcaFilter = document.getElementById('marcaFilter'),
    tamanhoFilter = document.getElementById('tamanhoFilter');

// Recupera dados do localStorage ou cria array vazio
let getData = localStorage.getItem('tenis') ? JSON.parse(localStorage.getItem('tenis')) : [];

let isEdit = false, editId;
let imgUrl = "./tenisexemplo.png";

// Botão para adicionar campos de tamanho dinâmicos
document.querySelector('.adicionar-tamanho').addEventListener('click', function() {
    const novoCampo = document.createElement('div');
    novoCampo.className = 'tamanho-estoque d-flex gap-2 mb-2';
    novoCampo.innerHTML = `
        <input type="number" placeholder="Tamanho" class="form-control tamanho" min="30" max="46" required>
        <input type="number" placeholder="Quantidade" class="form-control quantidade" min="0" required>
        <button type="button" class="btn btn-sm btn-danger remover-tamanho">-</button>
    `;
    tamanhoContainer.appendChild(novoCampo);
    
    // Permite remover o campo criado
    novoCampo.querySelector('.remover-tamanho').addEventListener('click', function() {
        tamanhoContainer.removeChild(novoCampo);
    });
});

// Atualiza a imagem de preview quando um arquivo é selecionado
file.onchange = function () {
    if (file.files[0].size < 1000000) {
        const fileReader = new FileReader();
        fileReader.onload = function (e) {
            imgUrl = e.target.result;
            imgInput.src = imgUrl;
        };
        fileReader.readAsDataURL(file.files[0]);
    } else {
        alert("Esse arquivo é muito grande!");
    }
};

// Pega os tamanhos e quantidades do formulário
function getTamanhosEstoque() {
    const tamanhos = document.querySelectorAll('.tamanho');
    const quantidades = document.querySelectorAll('.quantidade');
    let estoquePorTamanho = {};
    
    for (let i = 0; i < tamanhos.length; i++) {
        if (tamanhos[i].value && quantidades[i].value) {
            estoquePorTamanho[tamanhos[i].value] = quantidades[i].value;
        }
    }
    
    return estoquePorTamanho;
}

// Formata os dados do estoque para exibir na tabela
function formatarEstoque(estoque) {
    if (!estoque) return "";
    
    let resultado = [];
    for (let tamanho in estoque) {
        resultado.push(`${tamanho}: ${estoque[tamanho]}`);
    }
    return resultado.join(', ');
}

// Atualiza a tabela com os dados salvos (ou dados filtrados)
function showInfo(dados = null) {
    infoTenis.innerHTML = "";
    document.querySelectorAll('.employeeDetails').forEach(info => info.remove());

    const arrayParaMostrar = dados || getData;

    arrayParaMostrar.forEach((element, index) => {
        // índice real no array global para ações funcionarem certo
        let realIndex = getData.indexOf(element);

        let row = `
        <tr class="employeeDetails">
            <td>${realIndex + 1}</td>
            <td><img src="${element.picture}" alt="Tênis imagem" width="50" height="50"></td>
            <td>${element.employeeName}</td>
            <td>${element.employeeMarca}</td>
            <td>${formatarEstoque(element.employeeEstoque)}</td>
            <td>
                <button class="btn btn-success" onclick="readInfo(${realIndex})" data-bs-toggle="modal" data-bs-target="#visualizar"><i class="bi bi-eye"></i></button>
                <button class="btn btn-primary" onclick="editInfo(${realIndex})" data-bs-toggle="modal" data-bs-target="#tenisform"><i class="bi bi-pencil-square"></i></button>
                <button class="btn btn-danger" onclick="deleteInfo(${realIndex})"><i class="bi bi-trash"></i></button>
            </td>
        </tr>`;
        infoTenis.innerHTML += row;
    });
}

// Mostra detalhes do tênis na modal de visualização
function readInfo(index) {
    const item = getData[index];
    document.querySelector('.showImg').src = item.picture;
    document.querySelector('#showname').value = item.employeeName;
    document.querySelector('#showmarca').value = item.employeeMarca;
    
    const estoqueDiv = document.querySelector('#show-estoque');
    estoqueDiv.innerHTML = '';
    
    if (item.employeeEstoque) {
        for (let tamanho in item.employeeEstoque) {
            estoqueDiv.innerHTML += `<div>Tamanho ${tamanho}: ${item.employeeEstoque[tamanho]} unidades</div>`;
        }
    }
}

// Preenche o formulário para editar dados existentes
function editInfo(index) {
    isEdit = true;
    editId = index;
    const item = getData[index];
    
    imgInput.src = item.picture;
    modelo.value = item.employeeName;
    marca.value = item.employeeMarca;
    
    // Remove campos extras de tamanho para evitar duplicação
    const camposTamanho = document.querySelectorAll('.tamanho-estoque');
    for (let i = 1; i < camposTamanho.length; i++) {
        tamanhoContainer.removeChild(camposTamanho[i]);
    }
    
    const primeiroTamanho = document.querySelector('.tamanho');
    const primeiraQuantidade = document.querySelector('.quantidade');
    
    // Preenche o primeiro campo e adiciona os extras se houver mais tamanhos
    if (item.employeeEstoque) {
        let primeiro = true;
        for (let tamanho in item.employeeEstoque) {
            if (primeiro) {
                primeiroTamanho.value = tamanho;
                primeiraQuantidade.value = item.employeeEstoque[tamanho];
                primeiro = false;
            } else {
                const novoCampo = document.createElement('div');
                novoCampo.className = 'tamanho-estoque d-flex gap-2 mb-2';
                novoCampo.innerHTML = `
                    <input type="number" placeholder="Tamanho" class="form-control tamanho" min="30" max="46" value="${tamanho}" required>
                    <input type="number" placeholder="Quantidade" class="form-control quantidade" min="0" value="${item.employeeEstoque[tamanho]}" required>
                    <button type="button" class="btn btn-sm btn-danger remover-tamanho">-</button>
                `;
                tamanhoContainer.appendChild(novoCampo);
                
                novoCampo.querySelector('.remover-tamanho').addEventListener('click', function() {
                    tamanhoContainer.removeChild(novoCampo);
                });
            }
        }
    }

    submitBtn.innerText = "Atualizar";
    modalTitle.innerText = "Atualizar dados";
}

// Deleta o tênis selecionado após confirmação
function deleteInfo(index) {
    if(confirm("Você tem certeza que deseja excluir?")) {
        getData.splice(index, 1);
        localStorage.setItem("tenis", JSON.stringify(getData));
        aplicarFiltros();  // Atualiza tabela com filtros ativos
    }
}

// Função para aplicar filtros de marca e tamanho
function aplicarFiltros() {
  const marcaTexto = marcaFilter.value.toLowerCase();
  const tamanhoSelecionado = tamanhoFilter.value;

  const dadosFiltrados = getData.filter(item => {
    const marcaMatch = item.employeeMarca.toLowerCase().includes(marcaTexto);

    let tamanhoMatch = true;
    if (tamanhoSelecionado) {
      tamanhoMatch = item.employeeEstoque && item.employeeEstoque[tamanhoSelecionado] > 0;
    }

    return marcaMatch && tamanhoMatch;
  });

  showInfo(dadosFiltrados);
}

// Captura o envio do formulário para adicionar ou editar tênis
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Valida campos obrigatórios
    if (modelo.value.trim() === "" || marca.value.trim() === "") {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    const information = {
        picture: imgInput.src || "./tenisexemplo.png",
        employeeName: modelo.value,
        employeeMarca: marca.value,
        employeeEstoque: getTamanhosEstoque()
    };

    if (!isEdit) {
        getData.push(information);
    } else {
        isEdit = false;
        getData[editId] = information;
    }

    try {
        localStorage.setItem('tenis', JSON.stringify(getData));
    } catch (e) {
        alert("Erro ao salvar no localStorage. Tente apagar alguns itens.");
        return;
    }

    submitBtn.innerText = "Enviar";
    modalTitle.innerText = "Preencha os dados";

    aplicarFiltros();

    form.reset();
    imgInput.src = "./tenisexemplo.png";

    // Limpa campos extras de tamanho
    const camposTamanho = document.querySelectorAll('.tamanho-estoque');
    for (let i = 1; i < camposTamanho.length; i++) {
        tamanhoContainer.removeChild(camposTamanho[i]);
    }
    
    // Reseta o primeiro campo
    document.querySelector('.tamanho').value = '';
    document.querySelector('.quantidade').value = '';

    // Fecha o modal via Bootstrap
    let modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
});

// Eventos para aplicar filtro em tempo real
marcaFilter.addEventListener('input', aplicarFiltros);
tamanhoFilter.addEventListener('change', aplicarFiltros);

// Botão para abrir modal de adicionar novo tênis
document.getElementById('btnAddNovo').addEventListener('click', () => {
    isEdit = false;
    editId = null;

    form.reset();
    imgInput.src = "./tenisexemplo.png";

    modalTitle.innerText = "Adicionar Novo";
    submitBtn.innerText = "Enviar";

    const camposTamanho = document.querySelectorAll('.tamanho-estoque');
    for (let i = 1; i < camposTamanho.length; i++) {
        tamanhoContainer.removeChild(camposTamanho[i]);
    }

    document.querySelector('.tamanho').value = '';
    document.querySelector('.quantidade').value = '';
});

// Mostrar lista completa ao iniciar a página
showInfo();
