import Popup from "reactjs-popup";
import css from "../../App.module.css";
import popupCss from "../../Popup.css";
let SitePopup = ({ open, setOpen, content }) => {
  return (
    <Popup open={open} onClose={() => setOpen(0)} modal className={css.popup}>
      {content}
    </Popup>
  );
};
export default SitePopup;
