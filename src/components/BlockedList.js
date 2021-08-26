import { useContext } from "react";
import { AppContext } from "../App";


let BlockedList = () =>{
    const data = useContext(AppContext);
    return <div>
        {JSON.stringify(data)}
    </div>
}
export default BlockedList;