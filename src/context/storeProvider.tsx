import { useContext, createContext, } from "react";
import rootStore, { RootStore } from "../core/store";
import { useLocalObservable } from "mobx-react-lite";

const StoreContext = createContext<RootStore | null>(null);
interface StoreProviderProps {
    children: React.ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
    const store = useLocalObservable(() => rootStore);
    return<StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export const useStore=()=>{
    const store=useContext(StoreContext)
    if(!store){
        throw new Error("useStore must be used within a StoreProvider")
    }
    return store
}