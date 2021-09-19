import css from "../../App.module.css";
import useSite from "../../useSite";



import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; 



let SiteRow = ({ siteEntry }) => {
  
  const {timer,timerStr,color,status,url} = useSite(siteEntry);
  
  return (
    <div className={css.row}>
      <a href={`https://${url}`} style={{ height: "20px" }}>
        <img src={`https://api.faviconkit.com/${url}/144`} alt="" />
      </a>

      <div className={css.rowUrl}>{url}</div>
      <div className={css.rowData}>
        {!isNaN(timer)&& (
          <Tippy content={timerStr}>
            <img src="../../../assets/clock.svg" alt="clock" />
          </Tippy>
        )}
        <div style={{color: color}}>{status}</div>
      </div>
    </div>
  );
};
export default SiteRow;
