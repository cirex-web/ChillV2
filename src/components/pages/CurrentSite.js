import css from "../../App.module.css";
import useSite from "../../useSite";

const CurrentSite = ({ siteUrl, siteData, toggleCurrentSite }) => {
  const { url, status, color } = useSite([siteUrl, siteData]);
  const isBlocked = !!siteData;
  return (
    <>
      <div className={css.container}>
        <img
          className={css.faviconLarge}
          src={`https://api.faviconkit.com/${url}/144`}
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
          onClick={() => toggleCurrentSite(isBlocked)}
        >
          {isBlocked ? "Request to unblock" : "Block Site"}
        </button>
      </div>
    </>
  );
};
export default CurrentSite;
