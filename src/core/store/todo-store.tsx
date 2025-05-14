import { action, observable, makeObservable } from 'mobx';
import { ITodo, IObervableState } from '../../models/i_common';

export class TodoStore {
    todos: ITodo[] = []
    todoState: IObervableState = {
        isloading: false,
        isError: null,
        isSuccess: false,
    }
    constructor() {
        makeObservable(this, {
            todos: observable,
            todoState: observable,
            getTodos: action,
            updateTodo: action,
            addTodo: action,
            deleteTodo: action,
            completeTodo: action,

        })
    }
    getTodos(id: number) {
        this.todoState.isloading = true
        this.todoState.isError = null
        let todos = localStorage.getItem("todos")
        if (todos) {
            let parsedTodos = JSON.parse(todos)
            this.todos = parsedTodos.filter((todo: ITodo) => todo.userId === id)
        }
        this.todoState.isloading = false
        this.todoState.isSuccess = true
    }

    addTodo(todo: ITodo, userId: number) {
        this.todoState.isloading = true;
        this.todoState.isError = null;
        this.todos.push(todo);

        const allTodosStr = localStorage.getItem("todos");
        let allTodos: ITodo[] = allTodosStr ? JSON.parse(allTodosStr) : [];

        const otherUsersTodos = allTodos.filter(t => t.userId !== userId);

        const newAllTodos = [...otherUsersTodos, ...this.todos];

        localStorage.setItem("todos", JSON.stringify(newAllTodos));

        this.todoState.isloading = false;
        this.todoState.isSuccess = true;
    }

    updateTodo(updatedTodos: ITodo[], userId: number) {
        this.todoState.isloading = true;
        this.todoState.isError = null;
        this.todos = updatedTodos;

        const allTodosStr = localStorage.getItem("todos");
        let allTodos: ITodo[] = allTodosStr ? JSON.parse(allTodosStr) : [];
        const otherUsersTodos = allTodos.filter(todo => todo.userId !== userId);

        const newAllTodos = [...otherUsersTodos, ...this.todos];

        localStorage.setItem("todos", JSON.stringify(newAllTodos));

        this.todoState.isloading = false;
        this.todoState.isSuccess = true;
    }

    deleteTodo(id: number) {
        this.todoState.isloading = true
        this.todoState.isError = null
        let filterTodo = this.todos.filter((todo: ITodo) => todo.id !== id)
        this.todos = filterTodo
        localStorage.setItem("todos", JSON.stringify(this.todos))
        this.todoState.isloading = false
        this.todoState.isSuccess = true
    }
    completeTodo(id: number) {
        this.todoState.isloading = true
        this.todoState.isError = null
        let filterTodo = this.todos.map((todo: ITodo) => {
            if (todo.id === id) {
                todo.completed = !todo.completed
            }
            return todo
        })
        this.todos = filterTodo
        localStorage.setItem("todos", JSON.stringify(this.todos))
        this.todoState.isloading = false
        this.todoState.isSuccess = true
    }
    logout() {
        this.todoState.isSuccess = false
        this.todoState.isError = null
        this.todos = []
        this.todoState.isloading = false
        this.todoState.isSuccess = true
    }
}
const todoStore = new TodoStore()
export default todoStore;