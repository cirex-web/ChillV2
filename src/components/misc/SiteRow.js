import css from "../../App.module.css";
import useSite from "../../useSite";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useContext } from "react";
import { AppContext } from "../../App";

let SiteRow = ({ siteEntry }) => {
  const { timer, timerStr, color, status, url } = useSite(siteEntry);
  const { unblockSite } = useContext(AppContext);
  return (
    <div className={css.row}>
      <a href={`https://${url}`} style={{ height: "20px" }}>
        <img src={`https://api.faviconkit.com/${url}/144`} alt="" />
      </a>

      <div className={css.rowUrl}>{url}</div>

      <div className={css.rowData}>
        <div style={{ color: color }}>{status}</div>
      </div>
      <div className={css.rowActions}>
        {!isNaN(timer) && (
          <Tippy content={timerStr}>
            <img src="../../../assets/clock.svg" alt="clock" />
          </Tippy>
        )}
        <Tippy content={"Unblock"}>
          <span
            className={"material-icons " + css.md20}
            onClick={() => unblockSite(url)}
          >
            highlight_off
          </span>
        </Tippy>
      </div>
    </div>
  );
};
export default SiteRow;
