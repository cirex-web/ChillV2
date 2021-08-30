import { useState } from "react";
import css from "../App.module.css";
import Popup from "./Popup";

const PanelButton = ({ text, type }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <button className={css.filledButton} onClick={toggleOpen} type={type}>
        <h3>{text}</h3>
      </button>

      {open && <Popup type={type} toggleOpen={toggleOpen}></Popup>}
    </>
  );
};
export default PanelButton;
