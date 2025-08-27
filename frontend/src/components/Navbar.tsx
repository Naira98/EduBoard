import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { i18n } = useTranslation();

  const handleChangeLang = () => {
    i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar");
  };

  return (
    <div>
      <button onClick={handleChangeLang}>
        {i18n.language === "ar" ? "English" : "العربية"}
      </button>
    </div>
  );
};

export default Navbar;
