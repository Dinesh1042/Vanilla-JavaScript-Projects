class LinkedListNode {
  dateCreated = new Date().getTime();
  isCompleted = false;
  id = this.getRandomId();
  next = null;

  constructor(value) {
    this.value = value;
  }

  getRandomId() {
    return Math.random().toString(16).slice(3, 9);
  }
}

class LinkedList {
  head = null;
  tail = null;
  length = 0;

  add(value) {
    // O(1)
    const newNode = new LinkedListNode(value);
    if (this.head) newNode.next = this.head;
    this.head = newNode;
    if (!this.tail) this.tail = newNode;
    this.updateLength();
    return newNode;
  }

  delete(id) {
    // O(n)

    if (!this.head) return null;

    while (this.head && this.head.id === id) this.head = this.head.next;

    let currentNode = this.head;
    if (this.head)
      while (currentNode.next) {
        if (currentNode.next.id === id)
          currentNode.next = currentNode.next.next;
        else currentNode = currentNode.next;
      }

    if (this.tail.id === id) this.updateTail();
    this.updateLength();
    return this;
  }

  updateTail() {
    // O(n)

    if (this.head === null) return (this.tail = null);

    let currentNode = this.head;

    while (currentNode) {
      if (currentNode.next === null) this.tail = currentNode;
      currentNode = currentNode.next;
    }
  }
  toArray() {
    // O(n)
    if (!this.head) return [];
    const listArray = [];
    let currentNode = this.head;
    while (currentNode) {
      const { dateCreated, id, isCompleted, value } = currentNode;
      listArray.push({ dateCreated, id, isCompleted, value });
      currentNode = currentNode.next;
    }
    return listArray.reverse();
  }

  find(id) {
    // O(n)
    if (!this.head) return null;
    let currentNode = this.head;
    while (currentNode) {
      if (currentNode.id === id) return currentNode;
      currentNode = currentNode.next;
    }
    return null;
  }

  update(id, value) {
    // O(1)
    const editNode = this.find(id);
    if (editNode) editNode.value = value;
    return editNode;
  }

  updateLength() {
    // O(1)
    this.length = this.toArray().length;
  }

  updateCompleted(id, value) {
    const node = this.find(id);
    if (node) node.isCompleted = value;
  }
}

class Todo {
  isEditMode = false;
  editEl = null;
  editId = null;

  constructor(form, listGroup) {
    this.form = form;
    this.listGroup = listGroup;
    this.initializeApp();
  }

  initializeApp() {
    this.todoLinkedList = new LinkedList();
    this.handleSubmit();
    this.initializeLocalList();
  }

  handleSubmit() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();

      const inputEl = this.form.querySelector(".form-control");
      const value = inputEl.value;

      if (value.trim()) {
        this.isEditMode ? this.editTodo(value) : this.addTodo(value);

        this.form.reset();
      }
    });
  }

  editTodo(value) {
    this.todoLinkedList.update(this.editId, value);

    const todoEl = this.editEl.querySelector("span");

    todoEl.innerHTML = value;

    this.saveLocal(this.todoLinkedList);

    this.isEditMode = false;
    this.editEl = null;
    this.editId = null;
    this.updateStyle();
  }

  addTodo(value) {
    const list = this.todoLinkedList.add(value);
    this.createList(list);
    this.saveLocal(this.todoLinkedList);
  }

  deleteTodo(id) {
    this.todoLinkedList.delete(id);
    this.saveLocal(this.todoLinkedList);
    this.updateStyle();
  }

  toggleCompleted(id, value) {
    this.todoLinkedList.updateCompleted(id, value);
    this.saveLocal(this.todoLinkedList);
  }

  createList(todo) {
    const { value, isCompleted, id } = todo;

    const liEl = document.createElement("li");

    liEl.id = id;

    if (isCompleted) liEl.classList.add("completed");

    liEl.classList.add("todo-list-item");

    const col1 = document.createElement("div");
    col1.classList = "col col1";

    const col1Label = document.createElement("label");

    col1.appendChild(col1Label);

    const isCompletedCheckBox = document.createElement("input");
    isCompletedCheckBox.type = "checkbox";

    isCompletedCheckBox.addEventListener("change", () => {
      const value = isCompletedCheckBox.checked;

      this.toggleCompleted(id, value);

      value
        ? liEl.classList.add("completed")
        : liEl.classList.remove("completed");
    });

    isCompletedCheckBox.checked = isCompleted;
    isCompletedCheckBox.classList.add("form-check");

    col1Label.appendChild(isCompletedCheckBox);

    const todoText = document.createElement("span");

    todoText.innerHTML = value;

    col1Label.appendChild(todoText);

    liEl.appendChild(col1);

    // Col 2

    const col2 = document.createElement("div");
    col2.classList = "col col2";

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.innerHTML = `<ion-icon name="create"></ion-icon>`;

    editBtn.addEventListener("click", () => {
      this.editEl = liEl;
      this.isEditMode = true;
      this.editId = id;
      this.updateInput();
      this.updateStyle();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = `<ion-icon name="trash"></ion-icon>`;

    deleteBtn.addEventListener("click", () => {
      this.deleteTodo(id);
      liEl.remove();
    });

    col2.appendChild(editBtn);
    col2.appendChild(deleteBtn);
    liEl.appendChild(col2);

    this.listGroup.prepend(liEl);
  }

  updateInput() {
    const inputEl = this.form.querySelector(".form-control");
    let todoText = this.editEl.querySelector("span");
    inputEl.value = todoText.innerHTML;
    inputEl.focus();
  }

  // LocalStorage

  saveLocal(list) {
    this.todoLinkedList.updateLength();
    return localStorage.setItem("todo", JSON.stringify(list));
  }

  getLocal() {
    return localStorage.getItem("todo")
      ? JSON.parse(localStorage.getItem("todo"))
      : null;
  }

  initializeLocalList() {
    const local = this.getLocal();
    if (local) {
      this.todoLinkedList.head = local.head;
      this.todoLinkedList.updateTail();
      this.createLocalList();
    }
  }

  createLocalList() {
    this.todoLinkedList.toArray().forEach((i) => this.createList(i));
  }

  updateStyle() {
    const btn = this.form.querySelector("#addBtn");
    const formControl = this.form.querySelector(".form-control");
    if (this.isEditMode) {
      btn.classList = "btn btn-success";
      formControl.classList.add("input-success");
      btn.innerHTML = `Edit Todo`;
      return;
    }
    btn.classList = "btn btn-primary";
    btn.innerHTML = `Add Todo`;
    formControl.classList.remove("input-success");
  }
}

const formEl = document.getElementById("form");
const listGroupEl = document.getElementById("listGroup");

const todoLinkedList = new Todo(formEl, listGroupEl);
