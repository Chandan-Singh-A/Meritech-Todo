import {action,observable,makeObservable} from 'mobx';

interface ITodo{
    id:number,
    todo:string,
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
            addTodo:action,
            deleteTodo:action,
            completeTodo:action,
        })
    }
    addTodo(todo:ITodo){
        console.log("addTodo",todo)
    }
    deleteTodo(id:number){
        console.log("deleteTodo",id)
    }
    completeTodo(id:number){
        console.log("completeTodo",id)
    }
}
const todoStore=new TodoStore()
export default todoStore