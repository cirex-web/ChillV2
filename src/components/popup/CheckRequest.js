import css from "../../App.module.css";

let BlockSite = () => {
  return (
    <>
      <div>
        <h2>Hold up!</h2>
        <h3>Why do you wish to unblock this site?</h3>
      </div>
      <div style={{ textAlign: "left" }}>
        <textarea
          placeholder={
            "Note: You will be able to approve/reject this request in 24 hours."
          }
        ></textarea>
      </div>
      <button className={css.mediumButton}>Send!</button>
    </>
  );
};

export default BlockSite;
