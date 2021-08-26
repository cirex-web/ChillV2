import { useContext } from "react";
import { AppContext } from "../App";
import css from "../App.module.css";


let BlockedList = () =>{
    const data = useContext(AppContext);
    return <div className={css.popupContent}>
        {JSON.stringify(data)}
    </div>
}
export default BlockedList;