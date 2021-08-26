import { useContext } from "react";
import css from '../App.module.css';

const Header = () => {
    return <div className={css.header}>
        <img className={css.mainImg} src="../assets/chillLogo2.png" alt="img logo" />
    </div>
}

export default Header;