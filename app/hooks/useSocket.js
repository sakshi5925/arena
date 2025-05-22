import { useEffect,useState } from "react";
import { getSocket } from "../lib/socket";

export const useSocket=()=>{
    const [socket]=useState(()=>getSocket());
    useEffect(() => {
       if (!socket) return;
       const onConnect=()=>console.log("connected",socket.id);
       socket.on("connect",onConnect);
    
      return () => {
        socket.off("connect", onConnect);
      }
    }, [socket]);
    return socket;  
    
}