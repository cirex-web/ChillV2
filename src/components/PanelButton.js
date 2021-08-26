import { useState } from "react";
import css from "../App.module.css";
import Popup from "./Popup";

const PanelButton = ({ text, type }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <button className={css.filledContainer} onClick={toggleOpen} type={type}>
        <h3>{text}</h3>
      </button>

      {open && <Popup type={type}></Popup>}
    </div>
  );
};
export default PanelButton;
