import {create} from "zustand/react";


const useGameStore = create((set)=>({
start:false,
setStart:(el)=>set({start:el}),
level:1,
setLevel:(el)=>set({level:el}),
restartLevel:()=>set((state)=>({level:state.level + 1}))
}))

export default useGameStore