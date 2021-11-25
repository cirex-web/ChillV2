import Tippy from "@tippyjs/react";
import { useContext } from "react";
import { AppContext } from "../../App";
import css from "../../App.module.css";
import useSite from "../../useSite";

const CurrentSite = ({ siteUrl, siteData, siteBlockable, siteFavicon }) => {
  const { url, status, color} = useSite([siteUrl, siteData]);
  const { blockSite, unblockSite,loaded } = useContext(AppContext);
  const isBlocked = !!siteData;
  let toggleCurrentSite = () => {
    if (isBlocked) {
      unblockSite(url);
    } else {
      blockSite(url);
    }
  };
  const loadingStr = (loaded?"":(" "+css.loading));
  return (
    <>
      <div className={css.container+loadingStr}>
        <img
          className={css.faviconLarge}
          src={siteFavicon || `https://www.google.com/s2/favicons?domain=${url}&sz=128`}
          alt=""
        />
        <div className={css.divider}></div>
        <div className={css.siteInfo}>
          <h3>{url}</h3>
          <h2>
            is&nbsp;<span style={{ color: color }}>{status.toLowerCase()}</span>
          </h2>
        </div>
        {/* <div className={css.divider}></div>
        <div style={{ flexGrow: 1}}>
          Well this 
        </div> */}
      </div>
      <div className={css.container+loadingStr}>
        <button
          className={css.largeButton}
          onClick={toggleCurrentSite}
          disabled={!siteBlockable}
        >
          {isBlocked ? "Unblock Site" : "Block Site"}
          {!siteBlockable && (
            <Tippy content={"This site cannot be blocked because it is (likely) a Chrome-related site."}>
              <span className={"material-icons "+css.md20}>help_outline</span>
            </Tippy>
          )}
        </button>
      </div>
    </>
  );
};
export default CurrentSite;
