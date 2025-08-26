// src/components/Inicio.jsx
import React, { useEffect, useCallback, useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// Navegación a pantallas públicas
import Login from './Login';
import Register from './Register';
import ResetPassword from './ResetPassword';

// Imágenes (desde public/images/carousel)
import img1 from '/images/carousel/img1.png';
import img2 from '/images/carousel/img2.png';
import img3 from '/images/carousel/img3.png';
import img4 from '/images/carousel/img4.png';
import img5 from '/images/carousel/img5.png';

// Estructura/medidas del carrusel
import './diseño/inicio-embla.css';

const IMAGES = [img1, img2, img3, img4, img5];

/* =====================  TOKENS  ===================== */
function useTokens() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Un solo color de fondo por modo
  const pageBg = isDark ? '#0F2327' : '#E7F6F7';

  // Superficies (tarjetas/paneles) que contrasten suavemente con el fondo unificado
  const cardBg = isDark ? alpha('#FFFFFF', 0.06) : alpha('#FFFFFF', 0.55);

  return {
    pageBg,
    cardBg,
    borderWrap: alpha(theme.palette.primary.main, 0.35),
    accent: theme.palette.primary.main,
    textPrimary: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
    arrowBg: alpha(theme.palette.primary.main, isDark ? 0.45 : 0.55),
    arrowColor: isDark
      ? theme.palette.getContrastText(theme.palette.primary.main)
      : '#fff',
  };
}

/* =====================  CARRUSEL ===================== */
function FullWidthCarousel({
  images = [],
  autoplay = true,
  interval = 3000,
  loop = true,
  draggable = true,
  gapPx = 12,
  arrows = true,
}) {
  const t = useTokens();
  const autoplayPlugin = useRef(Autoplay({ delay: interval, stopOnInteraction: false }));

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop, align: 'center', containScroll: 'trimSnaps', draggable, skipSnaps: false },
    autoplay ? [autoplayPlugin.current] : []
  );

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100svw',
        marginLeft: 'calc(50% - 50svw)',
        marginRight: 'calc(50% - 50svw)',
        '@supports not (width: 100svw)': {
          width: '100vw',
          marginLeft: 'calc(50% - 50vw)',
          marginRight: 'calc(50% - 50vw)',
        },
        bgcolor: 'transparent', // hereda el pageBg del wrapper
        py: { xs: 3, md: 5 },
        overflow: 'hidden',
      }}
    >
      <div className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container" style={{ gap: `${gapPx}px` }}>
            {images.map((src, idx) => (
              <div className="embla__slide" key={idx}>
                <div className="embla__slide__inner">
                  <img src={src} alt={`slide-${idx + 1}`} className="embla__img" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {arrows && (
          <>
            <button
              type="button"
              className="embla__button embla__button--prev"
              onClick={scrollPrev}
              aria-label="Anterior"
              style={{ color: t.arrowColor, background: t.arrowBg }}
            >
              ‹
            </button>
            <button
              type="button"
              className="embla__button embla__button--next"
              onClick={scrollNext}
              aria-label="Siguiente"
              style={{ color: t.arrowColor, background: t.arrowBg }}
            >
              ›
            </button>
          </>
        )}
      </div>
    </Box>
  );
}

/* =====================  HERRAMIENTAS ===================== */
function ToolsColumnsSection() {
  const t = useTokens();
  const cols = [
    { title: 'Control', items: ['Seguimiento', 'Alertas', 'Informes', 'Auditoría', 'Precios'] },
    { title: 'Eficiencia', items: ['Automatización', 'Integración', 'Escaneo', 'Pedidos', 'Proveedores'] },
    { title: 'Visión', items: ['Análisis', 'Tendencias', 'Pronóstico', 'Rentabilidad', 'Crecimiento'] },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100svw',
        marginLeft: 'calc(50% - 50svw)',
        marginRight: 'calc(50% - 50svw)',
        '@supports not (width: 100svw)': {
          width: '100vw',
          marginLeft: 'calc(50% - 50vw)',
          marginRight: 'calc(50% - 50vw)',
        },
        bgcolor: 'transparent', // hereda
        color: t.textPrimary,
        pt: { xs: 6, md: 10 },
        pb: { xs: 6, md: 10 },
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, md: 6 } }}>
        <Typography
          component="h2"
          sx={{
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.8px',
            fontSize: { xs: '42px', sm: '56px', md: '72px' },
            mb: { xs: 3, md: 6 },
          }}
        >
          Herramientas que te harán la vida más fácil y tu negocio más rentable.
          ¡Deja de adivinar y empieza a controlar!
        </Typography>

        <Grid container spacing={{ xs: 4, md: 8 }}>
          {cols.map((c) => (
            <Grid key={c.title} item xs={12} md={4}>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 20 }, mb: 2 }}>
                {c.title}
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                {c.items.map((it) => (
                  <Box key={it} component="li" sx={{ mb: 2, fontSize: { xs: 16, md: 18 } }}>
                    {it}
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

/* =====================  FUNCIONES ===================== */
function FeaturesSection() {
  const t = useTokens();
  const items = [
    { title: 'Control Total', text: 'Sepa exactamente qué tiene, dónde está y cuándo se acabará. ¡Adiós a las sorpresas desagradables!' },
    { title: 'Alertas Inteligentes', text: 'Recibe avisos antes de que tus productos se conviertan en reliquias. ¡Mantén tu inventario fresco!' },
    { title: 'Informes Claros', text: 'Gráficos y números que entiendes sin un doctorado. ¡Toma decisiones con confianza!' },
    { title: 'Personalizable', text: 'Adapta estas plantillas a tu negocio, no al revés. ¡Flexibilidad es nuestro segundo nombre!' },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100svw',
        marginLeft: 'calc(50% - 50svw)',
        marginRight: 'calc(50% - 50svw)',
        '@supports not (width: 100svw)': {
          width: '100vw',
          marginLeft: 'calc(50% - 50vw)',
          marginRight: 'calc(50% - 50vw)',
        },
        bgcolor: 'transparent', // hereda
        py: { xs: 6, md: 8 },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 1.5,
            lineHeight: 1.1,
            letterSpacing: -0.5,
            fontSize: { xs: 36, md: 56 },
          }}
        >
          Funciones Que Te Harán Bailar
        </Typography>

        <Typography sx={{ mb: 4, fontSize: 18 }}>
          Estas plantillas no son solo bonitas, son bestias de la organización. ¡Prepárate para la
          eficiencia!
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
            gap: 2.5,
          }}
        >
          {items.map((it, i) => (
            <Box
              key={i}
              sx={{
                position: 'relative',
                p: 2.5,
                borderRadius: 3,
                bgcolor: t.cardBg,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 3,
                  border: `2px solid ${t.borderWrap}`,
                  opacity: 1,
                  pointerEvents: 'none',
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    bgcolor: t.accent,
                    display: 'grid',
                    placeItems: 'center',
                    mr: 1.25,
                  }}
                >
                  <CheckCircleRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />
                </Box>
                <Typography sx={{ fontWeight: 700 }}>{it.title}</Typography>
              </Box>
              <Typography>{it.text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/* =====================  CONTACTO ===================== */
function ContactSection() {
  const t = useTokens();

  const cards = [
    { icon: <LocalPhoneRoundedIcon sx={{ fontSize: 32 }} />, title: 'Teléfono', text: '+57 30000000' },
    { icon: <AlternateEmailRoundedIcon sx={{ fontSize: 32 }} />, title: 'Email', text: 'postmangrupal@gmail.com' },
    { icon: <PlaceRoundedIcon sx={{ fontSize: 32 }} />, title: 'Dirección', text: 'Calle 123, Ciudad Neiva' },
  ];

  return (
    <Box sx={{ width: '100%', bgcolor: 'transparent', py: { xs: 6, md: 8 } }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Typography
          component="h2"
          sx={{
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.5px',
            fontSize: { xs: 36, md: 56 },
            mb: { xs: 4, md: 6 },
          }}
        >
          Contáctanos
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: { xs: 3, md: 5 },
          }}
        >
          {cards.map((c) => (
            <Box
              key={c.title}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: t.cardBg,
                boxShadow: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ mb: 2, color: t.accent, display: 'inline-flex' }}>{c.icon}</Box>
              <Box sx={{ width: '100%', height: 1, bgcolor: t.borderWrap, opacity: 0.6, mb: 2 }} />
              <Typography sx={{ fontWeight: 700, mb: 1 }}>{c.title}</Typography>
              <Typography sx={{ lineHeight: 1.6 }}>{c.text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/* =====================  PÁGINA  ===================== */
export default function Inicio({ setCurrentModule = () => {} }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setCurrentModule(<ResetPassword token={token} setCurrentModule={setCurrentModule} />);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [setCurrentModule]);

  const goLogin = () => setCurrentModule(<Login setCurrentModule={setCurrentModule} />);
  const goRegister = () => setCurrentModule(<Register setCurrentModule={setCurrentModule} />);

  const t = useTokens();

  const faqs = [
    { q: '¿Funcionan para cualquier tipo de negocio?', a: 'Desde tiendas de barrio hasta gigantes tecnológicos, estas plantillas se adaptan a todos.' },
    { q: '¿Necesito ser un genio de la informática?', a: 'Solo necesitas saber cómo encender una computadora. ¡Lo demás es pan comido!' },
    { q: '¿Qué pasa si me atasco?', a: 'Nuestro soporte técnico es tan bueno que te harán sentir como un rey.' },
    { q: '¿Cuánto cuestan estas maravillas?', a: 'Menos de lo que gastas en café al mes. ¡Una ganga!' },
    { q: '¿Son seguras mis datos?', a: 'Más seguras que el banco. Tus datos están protegidos con cifrado de grado militar.' },
  ];
  const [expanded, setExpanded] = useState(false);
  const handleToggle = (panel) => (_e, isExp) => setExpanded(isExp ? panel : false);

  return (
    // ======= WRAPPER DE PÁGINA: UN SOLO FONDO PARA TODO =======
    <Box
      sx={{
        position: 'relative',
        left: '50%',
        right: '50%',
        ml: '-50vw',
        mr: '-50vw',
        width: '100vw',
        bgcolor: t.pageBg, // <— fondo unificado (claro #E7F6F7 / oscuro #0F2327)
        color: t.textPrimary,
      }}
    >
      {/* HERO */}
      <Box sx={{ px: { xs: 2, md: 6 }, py: { xs: 6, md: 10 }, maxWidth: '100%' }}>
        <Typography
          component="h1"
          sx={{
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: -1,
            fontSize: { xs: '42px', sm: '56px', md: '96px' },
            mb: 3,
          }}
        >
          ¡Adiós al Caos!
        </Typography>

        <Typography sx={{ fontSize: { xs: 18, md: 22 }, maxWidth: '100%', mb: 4 }}>
          Gestiona tu inventario como un profesional. Deja de perder dinero por el desorden.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button onClick={goRegister} variant="contained" sx={{ textTransform: 'none', borderRadius: 3, px: 3, py: 1.2 }}>
            Empezar Ya
          </Button>
           <Button onClick={goLogin} variant="contained" sx={{ textTransform: 'none', borderRadius: 3, px: 3, py: 1.2 }}>
            Ya tengo cuenta
          </Button>
        </Box>
      </Box>

      {/* CARRUSEL */}
      <FullWidthCarousel images={IMAGES} autoplay interval={3000} loop draggable gapPx={12} arrows />

      {/* HERRAMIENTAS */}
      <ToolsColumnsSection />

      {/* FUNCIONES */}
      <FeaturesSection />

      {/* FAQ + CONTACTO (MISMO FONDO) */}
      <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 6, md: 8 }, maxWidth: 1200, mx: 'auto' }}>
        <Box
          sx={{
            display: 'inline-block',
            bgcolor: alpha('#FFFFFF', 0.35),
            px: 2,
            py: 0.75,
            borderRadius: '9999px',
            fontWeight: 600,
            mb: 3,
          }}
        >
          Preguntas Frecuentes
        </Box>

        <Box sx={{ maxWidth: { xs: '100%', lg: '66%' } }}>
          {faqs.map((item, idx) => {
            const id = `panel-${idx}`;
            const isOpen = expanded === id;
            return (
              <Accordion
                key={id}
                expanded={isOpen}
                onChange={handleToggle(id)}
                disableGutters
                elevation={0}
                square
                sx={{
                  mb: 1.5,
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: t.cardBg,
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary
                  expandIcon={isOpen ? <RemoveRoundedIcon /> : <AddRoundedIcon />}
                  sx={{ '& .MuiAccordionSummary-content': { my: 1 }, px: 2, py: 0 }}
                >
                  <Typography sx={{ fontWeight: 600 }}>{item.q}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, px: 2, pb: 2 }}>
                  <Typography sx={{ color: 'inherit' }}>{item.a}</Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>

        {/* CONTACTO */}
        <ContactSection />
      </Box>
    </Box>
  );
}
