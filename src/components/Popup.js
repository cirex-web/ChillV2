import BlockedList from "./BlockedList";
import Stats from "./Stats";
import css from "../App.module.css";
let Popup = ({type}) =>{
    let innerContent = undefined;
    switch(type){
        case "list":
            innerContent = <BlockedList/>
            break;

        case "stats":
            innerContent = <Stats/>
            break;

        default:
            break;
    }
    return <div className={css.fullPage}>
        <div className={css.header+" "+css.noBorder}><img className={css.topRight} src="../assets/close.svg" alt="close"/></div>
        {innerContent}
    </div>
}
export default Popup;