import {action,observable,makeObservable} from 'mobx';

interface IUser{
    username:string,
    email:string,
    password:string
    id:number,
}

interface IUserState{
    isloading:boolean,
    isError:string|null,
    isSuccess:boolean,
}

export class UserStore{
    user:IUser[]=[]
    userState:IUserState={
        isloading:false,
        isError:null,
        isSuccess:false,
    }

    constructor(){
    makeObservable(this,{
        user:observable,
        userState:observable,
        addUser:action,
        deletUser:action        
    })
    }
    addUser(user:IUser){
        console.log("adduser",user)
    }
    deletUser(id:Number){
        console.log("deleteuser",id)
    }
}
const userStore=new UserStore()
export default userStore