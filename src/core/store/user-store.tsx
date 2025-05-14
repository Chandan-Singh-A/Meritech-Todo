import { action, observable, makeObservable } from 'mobx';
import { IUser,IObervableState } from '../../models/i_common';
export class UserStore {
    user: IUser[] = []
    userState: IObervableState = {
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
        let users = localStorage.getItem("user");
        if (users) {
            this.user = JSON.parse(users);
        }
        const existing = this.user.find(u => u.email === user.email);
        if (existing) {
            console.log(existing)
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
            let loggedInUserInfo = {
                userId: existingUser.userId,
                loggedIn: true,
            }
            localStorage.setItem("loggedInUserInfo", JSON.stringify(loggedInUserInfo));
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
        localStorage.removeItem("loggedInUserInfo");
        this.userState.isloading = false;
        this.userState.isSuccess = true;
    }
}
const userStore = new UserStore()
export default userStore