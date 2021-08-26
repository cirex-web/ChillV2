import css from "../App.module.css";
import Switch from "react-switch";
import { useEffect, useRef } from "react";

const SiteStatus = ({ site, isBlocked, toggleCurrentSite }) => {
  let ref = useRef(null);
  // let switchRef = useRef(null);
  // const width = ;
  // useEffect(()=>{
  //     switchRef.current.width = width;
  // },[width]);
  return (
    <div className={css.container} ref={ref}>
      <div className={css.wide}>
        <h2>{site} is </h2>
        {isBlocked ? (
          <h2 className={css.blocked}>chilled</h2>
        ) : (
          <h2 className={css.unblocked}>unblocked</h2>
        )}
      </div>
      <label className={css.switch}>
        <Switch
          width={150}
          height={70}
          uncheckedIcon={false}
          checkedIcon={false}
          onChange={toggleCurrentSite}
          checked={isBlocked}
        />
      </label>
      {/* <div>Toggle site</div> */}
    </div>
  );
};
export default SiteStatus;
