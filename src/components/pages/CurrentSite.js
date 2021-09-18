import css from "../../App.module.css";


const CurrentSite = ({ site, isBlocked, toggleCurrentSite }) => {
  return (
    <>
      <div className={css.container}>
        <img
          className={css.faviconLarge}
          src={`https://api.faviconkit.com/${site}/144`}
          alt=""
        />
        <div style={{ flexGrow: 1 }}>
          <h3>{site??"Loading..."}</h3>
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
export default CurrentSite;
