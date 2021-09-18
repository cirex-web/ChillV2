import css from "../../App.module.css";
import { useState, useEffect } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional

let getReadableTimeString = (time) => {
  if (time < 0) {
    return "0:00";
  }
  time /= 1000;
  time |= 0;
  let s = (time % 60) + "";
  time = time / 60;
  time |= 0;
  let m = (time % 60) + "";
  time /= 60;
  time |= 0;
  let h = (time % 24) + "";
  if (h !== "0") {
    return h + ":" + m.padStart(2, "0") + ":" + s.padStart(2, "0");
  } else {
    return m + ":" + s.padStart(2, "0");
  }
};

let SiteRow = ({ url, siteData }) => {
  let { currently_blocked, date_blocked, request, reblock } = siteData;
  let time = request?.end_time || reblock;
  if (!currently_blocked) {
    time = reblock;
  } else if (request) {
    time = request.end_time;
  }
  const [timer, setTimer] = useState(time - new Date());
  useEffect(() => {
    if (timer&&timer>=0) {
      setTimeout(() => {
        setTimer(time - new Date());
      }, 100);
    }
  }, [timer, setTimer, time]);
  useEffect(()=>{
    return ()=>{
      setTimer(0);
    }
  },[]);
  return (
    <div className={css.row}>
      <a href={`https://${url}`} style={{ height: "20px" }}>
        <img src={`https://api.faviconkit.com/${url}/144`} alt="" />
      </a>

      <div className={css.rowUrl}>{url}</div>
      <div className={css.rowData}>
        {(request || !currently_blocked) && timer >= 0 && (
          <Tippy content={getReadableTimeString(timer)}>
            <img src="../../../assets/clock.svg" alt="clock" />
          </Tippy>
        )}
        {currently_blocked ? (
          <div className={css.blocked}>
            {request ? (timer >= 0 ? "Pending" : "Awaiting approval") : "Chilled"}
          </div>
        ) : (
          <div className={css.unblocked}>Unblocked</div>
        )}
      </div>
    </div>
  );
};
export default SiteRow;
