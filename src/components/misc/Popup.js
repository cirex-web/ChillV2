import css from "../../App.module.css";
import { useDetectClickOutside } from 'react-detect-click-outside';

let Popup = ({ innerContent , toggleOpen}) => {
  const ref = useDetectClickOutside({ onTriggered: toggleOpen });

  return (

    <div className={css.popup} ref={ref}>
      <div className={css.popupHeader}>
        <h3>Header</h3>
        <img className={css.closeButton} src="../assets/close.svg" alt="close" onClick={toggleOpen}/>
      </div>
      {innerContent}
    </div>
  );
};
export default Popup;
