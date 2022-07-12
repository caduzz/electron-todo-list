const tarefasInput = document.querySelector('.input-tarefa input'),
    dataInput = document.querySelector('.input-tarefa input#data-tarefa'),
    filters = document.querySelectorAll('.filtros span'),
    clearAll = document.querySelector('.btn-limpar'),
    tarefaBox = document.querySelector('.area-tarefas'),
    erroBox = document.querySelector('.area-controle .erro');

let editId;
let isEditTask = false;

//Recebe os arquivos do todo-list
let todos = JSON.parse(localStorage.getItem('todo-list'));

filters.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add('active');
        showTodo(btn.id);
    })
});



function showTodo(filter) {
    let li = "";
    if (todos) {
        todos.forEach((todo, id) => {
            let isCompleto = todo.status == 'concluida' ? 'checked' : '';
            if (filter == todo.status || filter == "todos") {
                li += `<li class="tarefa">
                        <label for="${id}">
                            <p class="data">${todo.data}</p>
                            <input class="check" type="checkbox" onclick="updateStatus(this)" id="${id}" ${isCompleto}>
                            <p class="${isCompleto}">${todo.name}</p>
                        </label>
                        <div>
                            <ul>
                                <li onclick="editeTask(${id}, '${todo.name}', '${todo.data}')"><i class='bx bx-edit-alt'></i></li>
                                <li onclick="deleteTask(${id})"><i class='bx bx-trash'></i></li>
                            </ul>
                        </div>
                    </li>`;
            }
        });
    }

    tarefaBox.innerHTML = li || `<h2>Nenhuma Tarefa Definida</h2>`;
}
showTodo("todos")

function editeTask(tarefaId, tarefaNome, data) {
    editId = tarefaId;
    isEditTask = true;
    tarefasInput.value = tarefaNome;
    dataInput.value = data;
}

function deleteTask(deleteId) {
    todos.splice(deleteId, 1);
    localStorage.setItem('todo-list', JSON.stringify(todos));
    showTodo("todos");
}

clearAll.addEventListener('click', () => {
    todos.splice(0, todos.length);
    localStorage.setItem('todo-list', JSON.stringify(todos))
    showTodo("todos");
});

function updateStatus(teskSelect) {
    //PEGA O PARAGRAFO QUE TEM O NOME DA TAREFA
    let tarefaNome = teskSelect.parentElement.lastElementChild;
    if (teskSelect.checked) {
        tarefaNome.classList.add('checked');
        //ATUALIZA OS STATUS PARA CONCLUIDO
        todos[teskSelect.id].status = 'concluida';
    } else {
        tarefaNome.classList.remove('checked');
        //ATUALIZA OS STATUS PARA PENDENTE
        todos[teskSelect.id].status = 'pendente';
    }
    localStorage.setItem('todo-list', JSON.stringify(todos));
}

tarefasInput.addEventListener('keyup', e => {
    let userTarefa = tarefasInput.value.trim();
    let dataTarefa = dataInput.value.trim();
    if (e.key == 'Enter') {
        if (userTarefa && dataTarefa) {
            if (!isEditTask) {
                if (!todos) {
                    todos = [];
                }
                let tarefasInfo = { name: userTarefa, status: 'pendente', data: dataTarefa };
                todos.push(tarefasInfo); //ADICIONA UMA NOVA TAREFA NO TODOS
            } else {
                todos[editId].name = userTarefa;
                todos[editId].data = dataTarefa;
                isEditTask = false;
            }
            tarefasInput.value = "";
            dataInput.value = "";
            localStorage.setItem('todo-list', JSON.stringify(todos));
            erroBox.style.display = 'none';
            showTodo("todos");
        } else {
            erroBox.style.display = 'block';
        }
    }
});