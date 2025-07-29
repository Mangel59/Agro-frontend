import React, { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useThemeToggle } from "./dashboard/ThemeToggleProvider";
import Login from "./Login";
import Register from "./Register";
import ResetPassword from "./ResetPassword";

import img1 from '/images/carousel/img1.png';
import img2 from '/images/carousel/img2.png';
import img3 from '/images/carousel/img3.png';
import img4 from '/images/carousel/img4.png';
import img5 from '/images/carousel/img5.png';

// Lista de imágenes del carrusel
const images = [
  { src: img1 },
  { src: img2 },
  { src: img3 },
  { src: img4 },
  { src: img5 },
];

const CustomArrow = ({ onClick, direction }) => (
  <Button
    onClick={onClick}
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      color: "#fff",
      position: "absolute",
      top: 0,
      [direction === "prev" ? "left" : "right"]: 0,
      width: "80px",
      height: "100%",
      zIndex: 2,
      cursor: "pointer",
      opacity: 0.5,
      transition: "opacity 0.3s",
      borderRadius: 0,
      "&:hover": { opacity: 1 },
    }}
  >
    {direction === "prev" ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
  </Button>
);

const Inicio = ({ setCurrentModule }) => {
  const toggleTheme = useThemeToggle();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Cargar el componente de cambio de contraseña directamente
      setCurrentModule(
        <ResetPassword token={token} setCurrentModule={setCurrentModule} />
      );

      // Limpia el token de la URL para que no quede visible
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleLogin = () => {
    setCurrentModule(<Login setCurrentModule={setCurrentModule} />);
  };

  const handleRegister = () => {
    setCurrentModule(<Register setCurrentModule={setCurrentModule} />);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <CustomArrow direction="next" />,
    prevArrow: <CustomArrow direction="prev" />,
  };

  return (
    <Box>
      <Typography
        variant="h3"
        align="center"
        sx={{
          backgroundColor: "#114232",
          width: "100%",
          color: "white",
          padding: "1rem",
          display: "inline-block",
          fontWeight: "bold",
        }}
      >
        Bienvenidos
      </Typography>

      <Box sx={{ backgroundColor: "#114232", padding: "1rem" }}>
        <Slider {...settings}>
          {images.map((image, index) => (
            <Box key={index} sx={{ position: "relative", padding: 0 }}>
              <img
                src={image.src}
                alt={`Slide ${index + 1}`}
                className="carousel-image"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default Inicio;
