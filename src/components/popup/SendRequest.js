import { useRef, useState } from "react";
import css from "../../App.module.css";
import popupCss from "../../Popup.css";
import useTimer from "../../useTimer";
let SendRequest = ({ processResult, data }) => {
  let inputRef = useRef(undefined);
  let { url, request } = data;
  let { timerString } = useTimer(request?.end_time);

  return (
    <>
      <div className="container">
        <div className="text">
          {!request ? (
            <>
              <h2>Hold up!</h2>
              <h3>Why do you wish to unblock this site?</h3>
            </>
          ) : (
            <>
              <h2>You've already requested to unblock this site!</h2>
              <h3>Time left until possible unblock:</h3>
              <span style={{ fontSize: "20px", margin: "5px" }}>
                {timerString}
              </span>
            </>
          )}
        </div>

        {!request && (
          <textarea
            required
            ref={inputRef}
            placeholder={
              "Note: You will be able to approve/reject this request in 24 hours."
            }
          ></textarea>
        )}
      </div>
      <button
        className="lowerButton"
        onClick={() => {
          processResult({ message: inputRef.current.value, url: url });
        }}
      >
        Send!
      </button>
    </>
  );
};

export default SendRequest;
