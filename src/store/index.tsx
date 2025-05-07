import todoStore,{TodoStore} from "./todoStore";
import userStore,{UserStore } from "./userStore";

export type RootStore={
    todoStore:TodoStore,
    userStore:UserStore
}

const rootStore:RootStore={
    todoStore,
    userStore,
}

export default rootStore;