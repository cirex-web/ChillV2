import css from "../App.module.css";
import Switch from "react-switch";
import { useEffect, useRef } from "react";

const SiteStatus = ({ site, isBlocked, toggleCurrentSite }) => {
  return (
    <>
      <div className={css.container}>
        <img
          className={css.containerImg}
          src="https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico?v=ec617d715196"
          alt="site favicon"
        />
        <div style={{ flexGrow: 1 }}>
          <h3>{site}</h3>
          <h2>
            is&nbsp;
            {isBlocked ? (
              <span className={css.blocked}>chilled</span>
            ) : (
              <span className={css.unblocked}>unblocked</span>
            )}
          </h2>
        </div>
      </div>
      <div className={css.container}>
        {isBlocked ? (
          <button className={css.largeButton} onClick={toggleCurrentSite}>
            Request to unblock
          </button>
        ) : (
          <button className={css.largeButton} onClick={toggleCurrentSite}>
            Block this site
          </button>
        )}
      </div>
    </>
  );
};
export default SiteStatus;
