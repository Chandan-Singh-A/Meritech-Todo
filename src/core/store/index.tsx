import todoStore,{TodoStore} from "./todo-store";
import userStore,{UserStore } from "./user-store";

export type RootStore={
    todoStore:TodoStore,
    userStore:UserStore
}

const rootStore:RootStore={
    todoStore,
    userStore,
}

export default rootStore;