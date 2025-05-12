export const getUserLoginInfo=()=>{
    const userLoginInfo=localStorage.getItem("loggedInUser")
    if(userLoginInfo){
        return JSON.parse(userLoginInfo)
    }
}