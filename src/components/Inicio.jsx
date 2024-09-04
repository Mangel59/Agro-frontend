import React from 'react';
import { Box, Button, Typography, Switch } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import AppBarComponent from './dashboard/AppBarComponent'; 
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useThemeToggle } from './dashboard/ThemeToggleProvider';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const images = [
    { src: '/images/carousel/img1.png' },
    { src: '/images/carousel/img2.png' },
    { src: '/images/carousel/img3.png' },
    { src: '/images/carousel/img4.png' },
    { src: '/images/carousel/img5.png' },
];

const CustomArrow = (props) => {
    const { onClick, direction } = props;
    return (
        <Button
            onClick={onClick}
            style={{
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
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.5)}
        >
            {direction === 'prev' ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
        </Button>
    );
};

const Inicio = (props) => {
    const navigate = useNavigate();
    const toggleTheme = useThemeToggle();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
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
                className="bienvenidos-title"
            >
                <Box
                    sx={{
                        backgroundColor: '#114232',
                        width: '100%',
                        color: 'white', 
                        padding: '1rem', 
                        display: 'inline-block', 
                    }}
                >
                    Bienvenidos
                </Box>
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