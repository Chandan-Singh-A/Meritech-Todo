export interface ITodo{
    id:number,
    title:string,
    completed:boolean,
    start:Date,
    end:Date,
    userId:number
}

export interface IObervableState{
    isloading:boolean,
    isError:string|null,
    isSuccess:boolean,
}

export interface IUser {
    username: string,
    email: string,
    password: string
    userId: number,
}

export interface CalenderInfo {
    selectedDate: string;
    selectedTime: string;
  }