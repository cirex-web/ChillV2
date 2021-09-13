import { useContext } from "react";
import { AppContext } from "../../App";
import css from "../../App.module.css";
import SiteRow from "../misc/SiteRow";

let BlockedList = () => {
  const data = useContext(AppContext);
  return (
    <>
      <input className={css.main}/>
    
      <div className={css.container} style={{gap:"0px"}}>
        {Object.entries(data).map(([url,info],i)=>{
          return(<SiteRow url={url} siteData={info} key={i}/>)
        })}
      </div>
      {/* <div className={css.container}>{JSON.stringify(data)}</div> */}
    </>
  );
};
export default BlockedList;
