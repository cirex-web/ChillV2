import css from "./App.module.css";
const NavBar = ({page, setPage}) =>{
    return <div className={css.container} style={{gap:0}}>
        <div className={page===0?css.activeTab:css.tab} onClick={()=>setPage(0)}>Current</div>
        <div className={page===1?css.activeTab:css.tab} onClick={()=>setPage(1)}>Site list</div>
        <div className={page===2?css.activeTab:css.tab} onClick={()=>setPage(2)}>Stats</div>
    </div>
}
export default NavBar;