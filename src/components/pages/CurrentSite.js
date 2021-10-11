import Tippy from "@tippyjs/react";
import { useContext } from "react";
import { AppContext } from "../../App";
import css from "../../App.module.css";
import useSite from "../../useSite";

const CurrentSite = ({ siteUrl, siteData, siteBlockable, siteFavicon }) => {
  const { url, status, color } = useSite([siteUrl, siteData]);
  const { blockSite, unblockSite } = useContext(AppContext);
  const isBlocked = !!siteData;
  let toggleCurrentSite = () => {
    if (isBlocked) {
      unblockSite(url);
    } else {
      blockSite(url);
    }
  };
  return (
    <>
      <div className={css.container}>
        <img
          className={css.faviconLarge}
          src={siteFavicon || `https://api.faviconkit.com/${url}/144`}
          alt=""
        />
        <div style={{ flexGrow: 1 }}>
          <h3>{url}</h3>
          <h2>
            is&nbsp;<span style={{ color: color }}>{status.toLowerCase()}</span>
          </h2>
        </div>
      </div>
      <div className={css.container}>
        <button
          className={css.largeButton}
          onClick={toggleCurrentSite}
          disabled={!siteBlockable}
        >
          {isBlocked ? "Unblock Site" : "Block Site"}
          {!siteBlockable && (
            <Tippy content={"If this is not a Chrome site, try refreshing the page."}>
              <span className="material-icons">help_outline</span>
            </Tippy>
          )}
        </button>
      </div>
    </>
  );
};
export default CurrentSite;
