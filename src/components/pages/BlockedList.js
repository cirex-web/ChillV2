import { useContext, useRef } from "react";
import { AppContext } from "../../App";
import css from "../../App.module.css";
import SiteRow from "../misc/SiteRow";

let BlockedList = ({ blockedSites }) => {
  const { blockSite, loaded } = useContext(AppContext);
  const ref = useRef(null);
  let blockSiteFromInput = () => {
    if (ref.current?.value) {
      blockSite(ref.current.value);
      ref.current.value = "";
    }
  };
  return (
    <>
      <div className={css.inputContainer}>
        <div className={css.input}>
          <input
            ref={ref}
            placeholder={"Add a site"}
            style={{ flexGrow: 1 }}
            onKeyPress={(e) => e.key === "Enter" && blockSiteFromInput()}
          />
          <span className="material-icons" onClick={blockSiteFromInput}>
            add
          </span>
        </div>
      </div>
      <div className={css.container} style={{ gap: "0px" }}>
        {loaded ? (
          Object.entries(blockedSites).length > 0 ? (
            Object.entries(blockedSites).map((siteEntry, i) => {
              return <SiteRow siteEntry={siteEntry} key={i} />;
            })
          ) : (
            <>
              <div className={css.placeholder}>
                <span className={`material-icons ${css.md40}`}>tab</span>
                <h2>You have no blocked sites yet</h2>
                <h3>Try adding one above!</h3>
              </div>
            </>
          )
        ) : (
          [...Array(10)].map((_, i) => {
            return <SiteRow siteEntry={undefined} key={i} />;
          })
        )}
      </div>
    </>
  );
};
export default BlockedList;
