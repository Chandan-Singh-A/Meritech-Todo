import {action,observable,makeObservable} from 'mobx';

export interface ITodo{
    id:number,
    title:string,
    completed:boolean,
    start:Date,
    end:Date,
}
interface ITodoState{
    isloading:boolean,
    isError:string|null,
    isSuccess:boolean,
}
export class TodoStore{
    todos:ITodo[]=[]
    todoState:ITodoState={
        isloading:false,
        isError:null,
        isSuccess:false,
    }
    constructor(){
        makeObservable(this,{
            todos:observable,
            todoState:observable,
            getTodos:action,
            setTodos:action,
            addTodo:action,
            deleteTodo:action,
            completeTodo:action,
            
        })
    }
    getTodos(){
        this.todoState.isloading=true
        this.todoState.isError=null
        let todos=localStorage.getItem("todos")
        if(todos){
            this.todos=JSON.parse(todos)
        }
        this.todoState.isloading=false
        this.todoState.isSuccess=true
    }

    setTodos(todos:ITodo[]){
        this.todoState.isloading=true   
        this.todoState.isError=null
        this.todos=todos
        localStorage.setItem("todos",JSON.stringify(this.todos))
        this.todoState.isloading=false
        this.todoState.isSuccess=true
    }

    addTodo(todo:ITodo){
        this.todoState.isloading=true
        this.todoState.isError=null
        this.todos.push(todo)
        localStorage.setItem("todos",JSON.stringify(this.todos))
        this.todoState.isloading=false
        this.todoState.isSuccess=true
    }
    deleteTodo(id:number){
        this.todoState.isloading=true
        this.todoState.isError=null
        let filterTodo=this.todos.filter((todo:ITodo)=>todo.id!==id)
        this.todos=filterTodo
        localStorage.setItem("todos",JSON.stringify(this.todos))
        this.todoState.isloading=false
        this.todoState.isSuccess=true
    }
    completeTodo(id:number){
        this.todoState.isloading=true
        this.todoState.isError=null
        let filterTodo=this.todos.map((todo:ITodo)=>{
            if(todo.id===id){
                todo.completed=!todo.completed
            }
            return todo
        })
        this.todos=filterTodo
        localStorage.setItem("todos",JSON.stringify(this.todos))
        this.todoState.isloading=false
        this.todoState.isSuccess=true
    }
}
const todoStore=new TodoStore()
export default todoStore;