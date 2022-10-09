const todoItem = document.querySelector("#todo-input-box");
const submitBtn = document.querySelector("#submit-btn");
const clearAllBtn = document.querySelector("#clear-all-btn");
const todoListContainer = document.querySelector("#todo-list-container");
let counter = 0;

function createNewElement(todo, state = null) {
    const itemWrapper = document.createElement('div');
    const id = document.createElement('span');
    const todoText = document.createElement('span');
    const deleteBtn = document.createElement('button');
    const doneBtn = document.createElement('button');

    itemWrapper.className = "todo-wrapper";

    id.className = "counter";
    id.textContent = counter += 1;

    todoText.className = "todoText";
    todoText.textContent = todo;
    todoItem.value = "";

    deleteBtn.className = "deleteBtn";
    deleteBtn.textContent = "X";

    doneBtn.className = "doneBtn";
    doneBtn.textContent = "Done";

    if (state != null) {
        doneBtn.disabled = "true";
        itemWrapper.style.backgroundColor = "lightgreen";
    }

    deleteBtn.onclick = () => {
        itemWrapper.remove();
        counter = 0;
        for (let element of todoListContainer.children) {
            counter += 1;
            element.firstElementChild.textContent = counter;
        }
        updateStoredValue();
    }

    doneBtn.onclick = () => {
        doneBtn.disabled = "true";
        itemWrapper.style.backgroundColor = "lightgreen";
        updateStoredValue();
    }

    itemWrapper.appendChild(id);
    itemWrapper.appendChild(todoText);
    itemWrapper.appendChild(deleteBtn);
    itemWrapper.appendChild(doneBtn);

    todoListContainer.appendChild(itemWrapper);
    updateStoredValue();
}

function updateStoredValue() {
    let data = {};
    for (let element of todoListContainer.children) {
        data["Work"+element.children[0].textContent] = [element.children[0].textContent, element.children[1].textContent, checkState(element)];
    }
    storeValue(data)
}

function checkState(element) {
    if (element.lastElementChild.disabled === true) {
        return "done";
    } else {
        return "";
    }
}


function storeValue(value) {
    //Converts the value to a string and stores the value
    value = JSON.stringify(value);
    window.localStorage.setItem("todoList", value);
}

function clearAllStoredValue(){
    window.localStorage.setItem("todoList", "");
}

function retrieveStoredValue() {
    //If there exist on data in the local storage or the todo-list does not exist in the local storage, it will return a new dictionary
    let data = (window.localStorage.getItem("todoList") != null) ? window.localStorage.getItem('todoList') : {};
    return data;
}

submitBtn.addEventListener('click', () => {
    if (todoItem.value.length >= 1) {
        createNewElement(todoItem.value);
    }
});


clearAllBtn.addEventListener('click', () => {
    todoListContainer.innerHTML = "";
    counter = 0;
    clearAllStoredValue();
});

window.addEventListener('DOMContentLoaded', () => {
    let data = (Object.entries(retrieveStoredValue()).length < 1) ? retrieveStoredValue() : JSON.parse(retrieveStoredValue());
    if (Object.entries(data).length >= 1) {
        for (let entry in data) {
            let [num, todo, state] = data[entry];
            if (state === "done") {
                createNewElement(todo, state);
            } else {
                createNewElement(todo);
            }
            counter = parseInt(num);
        }
    }
});