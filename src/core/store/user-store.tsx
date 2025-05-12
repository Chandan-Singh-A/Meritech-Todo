import { action, observable, makeObservable } from 'mobx';

interface IUser {
    username: string,
    email: string,
    password: string
    id: number,
}

interface IUserState {
    isloading: boolean,
    isError: string | null,
    isSuccess: boolean,
}

export class UserStore {
    user: IUser[] = []
    userState: IUserState = {
        isloading: false,
        isError: null,
        isSuccess: false,
    }

    constructor() {
        makeObservable(this, {
            user: observable,
            userState: observable,
            addUser: action,
            loginUser: action,
            logout:action
        })
    }
    addUser(user: IUser) {
        const existing = this.user.find(u => u.email === user.email);
        if (existing) {
            this.userState.isError = "Email already exists";
            this.userState.isSuccess = false;
            return;
        }
        this.user.push(user);
        localStorage.setItem("user", JSON.stringify(this.user));
        this.userState.isSuccess = true;
        this.userState.isError = null;
    }
    loginUser(email: string, password: string): boolean {
        const storedUsers = JSON.parse(localStorage.getItem("user") || "[]");
        const existingUser = storedUsers.find((u: IUser) => u.email === email && u.password === password);
        if (existingUser) {
            this.user = [existingUser];
            this.userState.isSuccess = true;
            this.userState.isError = null;
            localStorage.setItem("loggedInUser", JSON.stringify(true));
            return true;
        } else {
            this.userState.isError = "Invalid email or password";
            this.userState.isSuccess = false;
            return false;
        }
    }
    logout() {
        this.user = [];
        this.userState.isSuccess = false;
        this.userState.isError = null;
        localStorage.removeItem("loggedInUser");
    }
}
const userStore = new UserStore()
export default userStore