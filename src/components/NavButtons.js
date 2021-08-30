import css from "../App.module.css";
import PanelButton from "./PanelButton";

const NavButtons = () => {
  return (
    <div className={css.container}>
      <PanelButton text={"View all blocked sites"} type="list" />
      <PanelButton text={"Show stats"} type="stats" />
    </div>
  );
};
export default NavButtons;
