import Popup from "reactjs-popup";
import css from "../../App.module.css";
import popupCss from "../../Popup.css";
let SitePopup = ({ open, setOpen }) => {
  return (
    <Popup open={open} onClose={() => setOpen(0)} modal className={css.popup}>
      <div>
        <h2>Hold up!</h2>
        <h3>Why do you wish to unblock this site?</h3>
      </div>
      <div style={{ textAlign: "left" }}>
        <textarea></textarea>
        <p>
          Note: You will be able to approve/reject this request in 24 hours.
        </p>
      </div>
      <button className={css.mediumButton}>Send!</button>
    </Popup>
  );
};
export default SitePopup;
