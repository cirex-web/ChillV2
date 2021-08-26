import css from "../App.module.css";

const Header = () => {
  return (
    <div className={css.header}>
      <div className={css.mainImgContainer}>
        <img src="../assets/chillLogo2.png" alt="img logo" />
      </div>
    </div>
  );
};

export default Header;
