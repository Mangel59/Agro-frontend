/**
 * @file Inicio.jsx - Componente de la pantalla de bienvenida con un carrusel de imágenes.
 * @module Inicio
 * @component
 * @returns {JSX.Element} Componente de la pantalla de inicio con un carrusel de imágenes.
 */

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useThemeToggle } from './dashboard/ThemeToggleProvider';

/**
 * Lista de imágenes para el carrusel.
 * @constant {Array<Object>}
 */
const images = [
    { src: '/images/carousel/img1.png' },
    { src: '/images/carousel/img2.png' },
    { src: '/images/carousel/img3.png' },
    { src: '/images/carousel/img4.png' },
    { src: '/images/carousel/img5.png' },
];

/**
 * CustomArrow es un componente de botón utilizado para navegar entre las diapositivas del carrusel.
 *
 * @param {Object} props - Las propiedades pasadas al componente de la flecha.
 * @param {function} props.onClick - La función para manejar el evento de clic de la flecha.
 * @param {string} props.direction - La dirección en la que apunta la flecha, ya sea 'prev' o 'next'.
 * @returns {JSX.Element} Un botón estilizado como flecha personalizada.
 */
const CustomArrow = ({ onClick, direction }) => {
    return (
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
                [direction === 'prev' ? 'left' : 'right']: 0,
                width: "80px",
                height: "100%",
                zIndex: 2,
                cursor: "pointer",
                opacity: 0.5,
                transition: "opacity 0.3s",
                borderRadius: 0, 
                '&:hover': { opacity: 1 }
            }}
        >
            {direction === 'prev' ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
        </Button>
    );
};

/**
 * Componente de la pantalla de bienvenida con un carrusel de imágenes.
 * Muestra un título de bienvenida y un slider con imágenes representativas.
 *
 * @component
 * @example
 * return (
 *   <Inicio />
 * )
 */
const Inicio = () => {
    const navigate = useNavigate();
    const toggleTheme = useThemeToggle();

    /**
     * Navega a la página de inicio de sesión.
     * @function handleLogin
     */
    const handleLogin = () => {
        navigate('/login');
    };

    /**
     * Navega a la página de registro.
     * @function handleRegister
     */
    const handleRegister = () => {
        navigate('/register');
    };

    /**
     * Configuración del carrusel de imágenes.
     * @constant {Object}
     */
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
                    backgroundColor: '#114232',
                    width: '100%',
                    color: 'white', 
                    padding: '1rem', 
                    display: 'inline-block', 
                    fontWeight: 'bold'
                }}
            >
                Bienvenidos
            </Typography>
    
            <Box sx={{ backgroundColor: '#114232', padding: '1rem' }}>
                <Slider {...settings}>
                    {images.map((image, index) => (
                        <Box key={index} sx={{ position: 'relative', padding: 0 }}>
                            <img
                                src={image.src}
                                alt={`Slide ${index + 1}`}
                                className="carousel-image"
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        </Box>
                    ))}
                </Slider>
            </Box>
        </Box>
    );    
};

export default Inicio;
