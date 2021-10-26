import { useRef, useState } from "react";
// import css from "../../App.module.css";
import popupCss from "../../Popup.css";
import useTimer from "../../useTimer";
let SendRequest = ({ processResult, data }) => {
  const inputRef = useRef(undefined);
  const { url, request } = data;
  const { timer, timerString } = useTimer(request?.end_time);

  const requestDone = timer < 0;
  return (
    <>
      <div className="container">
        <div className="text">
          {!request ? (
            <>
              <h2>Hold up!</h2>
              <h3>Why do you wish to unblock this site?</h3>
            </>
          ) : !requestDone ? (
            <>
              <h2>You've already requested to unblock this site!</h2>
              <h3>Time left until possible unblock:</h3>
              <span style={{ fontSize: "20px", margin: "5px" }}>
                {timerString}
              </span>
            </>
          ) : (
            <>
              <h2>Are you sure you want to unblock this site?</h2>
              <h3>View your request below</h3>
            </>
          )}
        </div>

        {(!request || requestDone) && (
          <textarea
            required
            ref={inputRef}
            disabled={request}
            value={request?.message}
            placeholder={
              "Note: You will be able to approve/reject this request in 24 hours."
            }
          ></textarea>
        )}
      </div>
      <div className="buttonContainer">
        {!request ? (
          <button
            className="lowerButton"
            onClick={() => {
              processResult({
                data: { res: inputRef.current.value, url: url },
                type: "send_unblock_request",
              });
            }}
          >
            Send!
          </button>
        ) : !requestDone ? (
          <button className="lowerButton" onClick={processResult}>
            Ok
          </button>
        ) : (
          <>
            <button
              className="lowerButton two"
              onClick={() => {
                processResult({
                  type: "process_unblock_request",
                  data: { res: false, url: url },
                });
              }}
            >
              No
            </button>
            <button
              className="lowerButton two"
              onClick={() => {
                processResult({
                  type: "process_unblock_request",
                  data: { res: true, url: url },
                });
              }}
            >
              Yes
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default SendRequest;
