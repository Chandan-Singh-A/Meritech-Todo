export const getUserLoginInfo=()=>{
    const userLoginInfo=localStorage.getItem("loggedInUserInfo");
    if(userLoginInfo){
        return JSON.parse(userLoginInfo)
    }
}