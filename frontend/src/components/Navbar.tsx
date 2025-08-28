import { AppBar, Box, Button, Toolbar } from "@mui/material";
import { useTranslation } from "react-i18next";
import logo from "../assets/logoWithoutText.png";

const Navbar = () => {
  const { i18n } = useTranslation();

  const handleChangeLang = () => {
    i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar");
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: "divider" }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 3 } }}>
        <Box
          component="div"
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "default",
            textDecoration: "none",
          }}
        >
          <img src={logo} alt="Logo" style={{ height: 40, width: "auto" }} />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            onClick={handleChangeLang}
            variant="text"
            color="inherit"
            size="medium"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              border: "1px solid",
              borderColor: "divider",
              "&:hover": {
                borderColor: "primary.main",
              },
            }}
          >
            {i18n.language === "ar" ? "ENG" : "عربي"}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
