import React, { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Switch,
  Box,
  FormControlLabel
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useTheme, alpha } from "@mui/material/styles";
import Brightness7Icon from "@mui/icons-material/Brightness7"; 
import DarkModeIcon from "@mui/icons-material/DarkMode";    
import Login from "../Login";
import Register from "../Register";
import ProfileMenu from "../ProfileMenu";
import Inicio from "../Inicio.jsx";
import { useThemeToggle } from "./ThemeToggleProvider";

const APPBAR_GREEN = "#114232";

export default function AppBarComponent({
  setCurrentModule,
  onLogout,
  isAuthenticated,
  setIsAuthenticated,
}) {
  const location = useLocation();
  const { toggleTheme, darkMode } = useThemeToggle();
  const theme = useTheme();

  const BASE_PATH =
    (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL) ||
    process.env.PUBLIC_URL ||
    "/";
  const LOGO_SRC = `${BASE_PATH.replace(/\/+$/, "")}/images/Icono.png`;

  const handleGoHome = () => {
    if (typeof setCurrentModule === "function") {
      setCurrentModule(<Inicio setCurrentModule={setCurrentModule} />);
    }
  };

  const handleLogin = () => {
    if (typeof setCurrentModule === "function") {
      setCurrentModule(
        <Login setIsAuthenticated={setIsAuthenticated} setCurrentModule={setCurrentModule} />
      );
    }
  };

  const handleRegister = () => {
    if (typeof setCurrentModule === "function") {
      setCurrentModule(<Register setCurrentModule={setCurrentModule} />);
    }
  };

  useEffect(() => {
    if (location.pathname === "/login") handleLogin();
    if (location.pathname === "/register") handleRegister();
  }, [location.pathname]);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        backgroundColor: APPBAR_GREEN,
        borderRadius: 0,
      }}
    >
      <Toolbar>
        {/* Logo / Título */}
        {!isAuthenticated ? (
          <Button
            onClick={handleGoHome}
            color="inherit"
            startIcon={
              <Box
                component="img"
                src={LOGO_SRC}
                alt="InmeroStock"
                sx={{ width: 28, height: 28, objectFit: "contain" }}
              />
            }
            sx={{
              mr: "auto",
              textTransform: "none",
              fontSize: 22,
              fontWeight: 700,
              px: 1,
              gap: 1,
            }}
          >
            InmeroStock
          </Button>
        ) : (
          <Box sx={{ mr: "auto", display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box
              component="img"
              src={LOGO_SRC}
              alt="InmeroStock"
              sx={{ width: 28, height: 28, objectFit: "contain" }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
              InmeroStock
            </Typography>
          </Box>
        )}

<FormControlLabel
  control={
    <Switch
      checked={darkMode}
      onChange={toggleTheme}
      sx={{
        width: 44,
        height: 24,
        padding: 0,
        "& .MuiSwitch-switchBase": {
          padding: 0.3,
          "&.Mui-checked": {
            transform: "translateX(20px)",
            color: "#fff",
            "& + .MuiSwitch-track": {
              backgroundColor: theme.palette.primary.main,
              opacity: 1,
            },
          },
        },
        "& .MuiSwitch-thumb": {
          width: 18,
          height: 18,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
        },
        "& .MuiSwitch-track": {
          borderRadius: 20,
          backgroundColor: alpha(theme.palette.common.white, 0.5),
          opacity: 1,
        },
      }}
      icon={<Brightness7Icon sx={{ fontSize: 20}} />}     // ☀️
      checkedIcon={<DarkModeIcon sx={{ fontSize: 20}} />} // 🌙
    />
  }
  label={darkMode ? "Modo oscuro" : "Modo claro"}
  labelPlacement="start"
  sx={{
    ml: 2,
    mr: 2,
    color: "inherit",
    display: "flex",
    alignItems: "center",
    gap: 1.2, // 👈 separa label y switch (usa theme.spacing)
    "& .MuiFormControlLabel-label": {
      fontWeight: 600,
    },
  }}
/>
        {!isAuthenticated ? (
          <>
            <Button color="inherit" onClick={handleLogin}>Login</Button>
            <Button color="inherit" onClick={handleRegister}>Register</Button>
          </>
        ) : (
          <ProfileMenu
            setCurrentModule={setCurrentModule}
            setIsAuthenticated={setIsAuthenticated}
            onLogout={onLogout}
          />
        )}
      </Toolbar>
    </AppBar>
  );
}
