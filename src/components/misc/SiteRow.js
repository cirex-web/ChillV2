import css from "../../App.module.css";
import useSite from "../../useSite";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useContext, useState } from "react";
import { AppContext } from "../../App";

let SiteRow = ({ siteEntry }) => {
  const { timer, timerStr, color, status, url } = useSite(siteEntry);
  const { unblockSite } = useContext(AppContext);
  const [imageStatus, setImageStatus] = useState({
    loaded: false,
    works: false,
  });
  return (
    <div className={css.row}>
      <a href={`https://${url}`} style={{ height: "20px" }}>
        <div
          className={css.loading}
          style={{ display: imageStatus.loaded ? "none" : "block" }}
        >
          <div></div>
          <div></div>
        </div>
        <img
          style={{ display: imageStatus.loaded ? "block" : "none" }}
          onError={() => {
            setImageStatus({ loaded: true, works: false });
          }}
          onLoad={() => {
            setImageStatus({ loaded: true, works: true });
          }}
          src={`https://www.google.com/s2/favicons?domain=${url}&sz=128`}
          alt=""
        />
      </a>

      <div className={css.rowUrl}>{url}</div>

      <div className={css.rowData}>
        <div style={{ color: color }}>{status}</div>
      </div>
      <div className={css.rowActions}>
        {!isNaN(timer) && timer >= 0 && (
          <Tippy content={timerStr}>
            <img src="../../../assets/clock.svg" alt="clock" />
          </Tippy>
        )}
        <Tippy content={"Permanently Unblock"}>
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
