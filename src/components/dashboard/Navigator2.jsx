import * as React from "react";
import {
  Divider,
  List,
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Grid,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";
import DnsRoundedIcon from "@mui/icons-material/DnsRounded";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import PublicIcon from "@mui/icons-material/Public";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import SettingsIcon from "@mui/icons-material/Settings";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import LockIcon from "@mui/icons-material/Lock";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import DomainIcon from "@mui/icons-material/Domain";
// seguridad
import HistoryIcon from '@mui/icons-material/History';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GroupsIcon from '@mui/icons-material/Groups';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import AppsIcon from '@mui/icons-material/Apps';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import BusinessIcon from '@mui/icons-material/Business';
import LinkIcon from '@mui/icons-material/Link';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import PersonIcon from '@mui/icons-material/Person';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// parametrización

//costos
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

// inventario
import CategoryIcon from '@mui/icons-material/Category';
import StyleIcon from '@mui/icons-material/Style';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ScienceIcon from '@mui/icons-material/Science';
import BiotechIcon from '@mui/icons-material/Biotech';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import HandshakeIcon from '@mui/icons-material/Handshake';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import InventoryIcon from '@mui/icons-material/Inventory';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReorderIcon from '@mui/icons-material/Reorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import FactoryIcon from '@mui/icons-material/Factory';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';


import axios from "../axiosConfig.js";
import { useTranslation } from "react-i18next";

import Persona from "../personas/Persona.jsx";
import Pais from "../pais/Pais";
import Departamento from "../departamento/Departamento";
import Municipio from "../municipio/Municipio";
import Presentacionproducto from "../Presentacionproducto/Presentacionproducto.jsx";
import Produccion from "../produccion/Produccion";
import Empresa from "../empresas/Empresa.jsx";
import Producto from "../producto/Producto.jsx";
import ProductoCategoria from "../producto_categoria/ProductoCategoria.jsx";
import Almacen from "../almacen/Almacen.jsx";
import Espacio from "../espacio/Espacio.jsx";
import Bloque from "../bloque/Bloque.jsx";
import Sede from "../sede/Sede.jsx";
import Marca from "../marca/Marca.jsx";
import Unidad from "../unidad/Unidad.jsx";
import TipoMovimiento from "../tipo_movimiento/TipoMovimiento.jsx";
import TipoProduccion from "../tipo_produccion/TipoProduccion.jsx";
import Presentacion from "../Presentacion/Presentacion.jsx";
import TipoBloque from "../tipo_bloque/Tipobloque.jsx";
import TipoSedes from "../tipo_sede/TipoSede.jsx";
import TipoEspacio from "../tipo_espacio/TipoEspacio.jsx";
import RPedido from "../r_pedido/Pedido.jsx";
import kardex from "../Kardex/kardex.jsx";
import Rol from "../Rol/Rol.jsx";
import TipoIdentificacion from "../TipoIdentificacion/TipoIdentificacion.jsx";
import Proveedor from "../Proveedor/Proveedor.jsx";
import MediaCard from "../MediaCard.jsx";
import OrdenCompra from "../OrdenCompra/OrdenCompra.jsx";
import Ocupacion from "../ocupacion/Ocupacion.jsx";
import EvaluacionItem from "../Evaluacion_item/Evaluacion_item.jsx";
import Grupo from "../Grupo/Grupo.jsx";
import Movimineto from "../Movimiento/Movimiento.jsx";
import Proceso from "../Proceso/Proceso.jsx";
import Ingrediente from "../ingrediente/ingrediente.jsx";
import Seccion from "../seccion/Seccion.jsx";
import Subseccion from "../subseccion/subseccion.jsx";
import TipoInventario from "../tipo_inventario/Tipo_inventario.jsx";
import Inventario from "../Inventario/Inventario.jsx";
import IngredientePresentacionProducto from "../IngredientePP/IngredientePP.jsx";
import TipoEvaluacion from "../tipo-evaluacion/Tipo_evaluacion.jsx";
import Re_pedido from "../RE_pedido/re_pv.jsx";
import RE_kardex from "../RKardex/Rkardex.jsx";
import RE_productoVencimiento from "../RE_pv/re_pvn.jsx";
import RE_ordenCompra from "../RE_oc/re_oc.jsx";
import RE_fc from "../RE_fc/re_fc.jsx";

// Imágenes
import img1 from "/images/cards/1.jpg";
import img2 from "/images/cards/2.jpg";
import img3 from "/images/cards/3.jpg";
import img4 from "/images/cards/4.jpg";
import img5 from "/images/cards/5.jpg";
import img6 from "/images/cards/6.jpg";
import img7 from "/images/cards/7.jpg";
import img8 from "/images/cards/8.jpg";
import img9 from "/images/cards/9.jpg";
import img10 from "/images/cards/10.jpg";

// seguridad
import persona from "/images/cards/persona.png";
import rol from "/images/cards/rol.png";
import tipo_identificacion from "/images/cards/tipo_identificacion.png";
import empresa from "/images/cards/empresa.png";
import tipo_evaluacion from "/images/cards/tipo_evaluacion.png";
// parametrización
import pais from "/images/cards/pais.png";
import departamento from "/images/cards/departamento.png";
import municipio from "/images/cards/municipio.png";
import tipo_sede from "/images/cards/tipo_sede.png";
import sede from "/images/cards/sede.png";
import tipo_bloque from "/images/cards/tipo_bloque.png";
import bloque from "/images/cards/bloque.png";
import grupo from "/images/cards/grupo.png";
import tipo_espacio from "/images/cards/tipo_espacio.png";
import espacio from "/images/cards/espacio.png";
import almacen from "/images/cards/almacen.png";
import seccion from "/images/cards/seccion.png";
import subseccion from "/images/cards/subseccion.png";
import tip_inventario from "/images/cards/tip_inventario.png";
import inventario from "/images/cards/inventario.png";
// inventario
import ingredienteproductopresentacion from "/images/cards/ingredienteproductopresentacion.png";
import presentacion_producto from "/images/cards/presentacion_producto.png";
import presentacion from "/images/cards/presentacion.png";
import producto_categoria from "/images/cards/producto_categoria.png";
import marca from "/images/cards/marca.png";
import ingrediente from "/images/cards/ingrediente.png";
import tipo_produccion from "/images/cards/tipo_produccion.png";
import produccion from "/images/cards/produccion.png";
import proceso from "/images/cards/proceso.png";
import tipo_movimiento from "/images/cards/tipo_movimiento.png";
import movimiento from "/images/cards/movimiento.png";
import unidad from "/images/cards/unidad.png";
import productos from "/images/cards/productos.png";
import proveedor from "/images/cards/proveedor.png";
import pedido from "/images/cards/pedido.png";
import orde_compra from "/images/cards/orde_compra.png";
import kardexx from "/images/cards/kardexx.png";
import ocupacion from "/images/cards/ocupacion.png";
// reportes
import r_pedidoo from "/images/cards/r_pedidoo.png";
import r_kardexx from "/images/cards/r_kardexx.png";
import r_factura from "/images/cards/r_factura.png";
import prodcutos_vencidos from "/images/cards/prodcutos_vencidos.png";
import r_orden_compra from "/images/cards/r_orden_compra.png";

const icons = {
  DnsRounded: <DnsRoundedIcon />,
  Home: <HomeIcon />,
  People: <PeopleIcon />,
  Public: <PublicIcon />,
  AddShoppingCartIcon: <AddShoppingCartIcon />,
  Domain: <DomainIcon />,
  Settings: <SettingsIcon />,
  Apartment: <ApartmentIcon />,
  LocationCity: <LocationCityIcon />,
  ProductionQuantityLimitsIcon: <ProductionQuantityLimitsIcon />,
  LockIcon: <LockIcon />,
  PersonIcon: <PersonIcon />,
  HomeWorkIcon: <HomeWorkIcon />,
  Warehouse: <WarehouseIcon />,
};

const components = {
  tipoidentificacion: TipoIdentificacion,
  roll: Rol,
  proveedor: Proveedor,
  pais: Pais,
  departamento: Departamento,
  municipio: Municipio,
  almacen: Almacen,
  espacio: Espacio,
  tipo_espacio: TipoEspacio,
  bloque: Bloque,
  tipo_bloque: TipoBloque,
  tipo_sede: TipoSedes,
  sede: Sede,
  presentacion_producto: Presentacionproducto,
  presentacion: Presentacion,
  producto_categoria: ProductoCategoria,
  producto: Producto,
  produccion: Produccion,
  marca: Marca,
  unidad: Unidad,
  tipo_evaluacion: TipoEvaluacion,
  tipo_movimiento: TipoMovimiento,
  tipo_produccion: TipoProduccion,
  persona: Persona,
  empresa: Empresa,
  r_pedido: RPedido,
  kardex: kardex,
  media_card: MediaCard,
  evaluacion_item: EvaluacionItem,
  OrdenCompra: OrdenCompra,
  Ocupacion: Ocupacion,
  grupo: Grupo,
  Movimiento: Movimineto,
  Proceso: Proceso,
  Ingrediente: Ingrediente,
  Seccion: Seccion,
  Subseccion: Subseccion,
  tipo_inventario: TipoInventario,
  Inventario: Inventario,
  IngredientePresentacionProducto: IngredientePresentacionProducto,
  RE_pedido: Re_pedido,
  RE_kardex: RE_kardex,
  RE_pv: RE_productoVencimiento,
  RE_oc: RE_ordenCompra,
  RE_fc: RE_fc,
};

const moduleImages = {
  persona,
  rol,
  tipoidentificacion: tipo_identificacion,
  tipo_evaluacion,
  empresa,
  pais,
  departamento,
  municipio,
  grupo,
  tipo_sede,
  sede,
  tipo_bloque,
  bloque,
  tipo_espacio,
  espacio,
  almacen,
  Seccion: seccion,
  Subseccion: subseccion,
  tipo_inventario: tip_inventario,
  Inventario: inventario,
  IngredientePresentacionProducto: ingredienteproductopresentacion,
  presentacion_producto,
  presentacion,
  producto_categoria,
  marca,
  Ingrediente: ingrediente,
  tipo_produccion,
  produccion,
  Proceso: proceso,
  tipo_movimiento,
  Movimiento: movimiento,
  unidad,
  producto: productos,
  proveedor,
  r_pedido: pedido,
  OrdenCompra: orde_compra,
  kardex: kardexx,
  Ocupacion: ocupacion,
  RE_pedido: r_pedidoo,
  RE_kardex: r_kardexx,
  RE_pv: prodcutos_vencidos,
  RE_oc: r_orden_compra,
  RE_fc: r_factura,
  media_card: img7,
  evaluacion_item: img2,
};

export default function Navigator2({
  setCurrentModuleItem,
  setMenuOpen,
  isAuthenticated,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Helper para normalizar ids al comparar con localStorage
  const toKey = (v) => String(v);

  // ===== TOKENS =====
  const softBg = isDark ? alpha(theme.palette.primary.light, 0.08) : "#e7f6f7";

  const sidebarBg = isDark
    ? alpha(theme.palette.background.paper, 0.98)
    : theme.palette.background.paper;
  const dividerColor = isDark ? alpha("#fff", 0.08) : alpha("#000", 0.08);
  const hoverBg = isDark
    ? alpha("#FFFFFF", 0.06)
    : alpha(theme.palette.primary.main, 0.06);

  // Más contraste para dark mode
  const selectedBg = isDark
    ? alpha("#FFFFFF", 0.15)   // blanco con opacidad para contraste
    : alpha(theme.palette.primary.main, 0.12);

  const selectedColor = isDark
     ? "#FFFFFF"
    : theme.palette.primary.dark;

  const selectedBar = theme.palette.primary.main;

  // tiles
  const tileBorder = isDark ? alpha("#FFFFFF", 0.12) : alpha(theme.palette.primary.main, 0.28);
  const tileOverlayFrom = isDark ? alpha("#000", 0.05) : alpha("#000", 0.0);
  const tileOverlayTo = isDark ? alpha("#000", 0.65) : alpha("#000", 0.55);
  const tileTitleColor = isDark ? alpha("#fff", 0.95) : theme.palette.common.white;
  const tileTitleShadow = isDark ? "0 1px 2px rgba(0,0,0,.85)" : "0 1px 2px rgba(0,0,0,.45)";
  const tileIconBg = isDark ? alpha(theme.palette.primary.light, 0.22) : alpha("#fff", 0.75);
  const tileIconFg = isDark ? "#fff" : theme.palette.primary.dark;

  const [menuItems, setMenuItems] = React.useState([]);
  const [selectedMenu, setSelectedMenu] = React.useState(null);
  const [open, setOpen] = React.useState(() => {
    const stored = localStorage.getItem("sidebarOpen");
    return stored ? JSON.parse(stored) : true;
  });

  React.useEffect(() => {
    setMenuOpen?.(open);
  }, [open]);

  React.useEffect(() => {
    if (!isAuthenticated) return;

    axios
      .get("/v1/menu")
      .then((response) => {
        setMenuItems(response.data);

        const savedModule = localStorage.getItem("activeModule");
        if (savedModule && components[savedModule]) {
          setCurrentModuleItem(React.createElement(components[savedModule]));
          setSelectedMenu(toKey(savedModule));
        } else {
          const firstMenu = response.data[0];
          if (firstMenu?.children?.length) {
            setSelectedMenu(toKey(firstMenu.id));
            setCurrentModuleItem(renderSubmenu(firstMenu.children, firstMenu.id));
          }
        }
      })
      .catch(console.error);
  }, [isAuthenticated]);

  const toggleDrawer = () => {
    const newOpen = !open;
    setOpen(newOpen);
    setMenuOpen?.(newOpen);
    localStorage.setItem("sidebarOpen", JSON.stringify(newOpen));
  };

  const handleMenuClick = (menuId) => {
    const key = toKey(menuId);
    setSelectedMenu(key);
    localStorage.setItem("activeModule", key);

    const menu = menuItems.find((item) => toKey(item.id) === key);
    if (menu?.children?.length) {
      setCurrentModuleItem(renderSubmenu(menu.children, menuId));
    } else {
      const Component = components[key];
      setCurrentModuleItem(Component ? <Component /> : null);
    }
  };

  const handleSubMenuClick = (subMenuId) => {
    const key = toKey(subMenuId);
    localStorage.setItem("activeModule", key);
    const Component = components[key];
    setCurrentModuleItem(Component ? <Component /> : null);
  };

  // ======== SOLO CONTAINER 3 ========
  const renderSubmenu = (children, parentMenuId) => (
    <Box
      key={theme.palette.mode}
      sx={{
        bgcolor: (t) => (t.palette.mode === "dark" ? "transparent" : "#e7f6f7"),
        borderRadius: 3,
        p: { xs: 2, md: 3 },
      }}
    >
      <Grid container spacing={2.5}>
        {children.map(({ id, text, icon }) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={id}>
            <Box
              onClick={() => handleSubMenuClick(id, parentMenuId)}
              sx={{
                position: "relative",
                height: 190,
                borderRadius: 3,
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform .2s ease",
                "&:hover": { transform: "translateY(-2px)" },
                "&:before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  borderRadius: 3,
                  border: `2px solid ${tileBorder}`,
                  pointerEvents: "none",
                },
              }}
            >
              {/* Imagen */}
              <Box
                component="img"
                src={moduleImages[id] || img1}
                alt={id}
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "50% 35%",
                }}
              />

              {/* Overlay gradiente */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(180deg, ${tileOverlayFrom} 45%, ${tileOverlayTo} 100%)`,
                }}
              />

              {/* Icono + título */}
              <Box
                sx={{
                  position: "absolute",
                  left: 12,
                  right: 12,
                  bottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: tileIconBg,
                    color: tileIconFg,
                    flex: "0 0 auto",
                  }}
                >
                  {icons[icon]}
                </Box>
                <Typography
                  variant="subtitle1"
                  title={t(text)}
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.1,
                    color: tileTitleColor,
                    textShadow: tileTitleShadow,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {t(text)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  if (!isAuthenticated) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 65,
        left: 0,
        width: {
          xs: open ? "200px" : "60px",
          sm: open ? "220px" : "70px",
          md: open ? "250px" : "70px",
        },
        height: "calc(100vh - 65px)",
        bgcolor: sidebarBg,
        color: theme.palette.text.primary,
        borderRight: `1px solid ${dividerColor}`,
        boxShadow: "none",
        transition: "width 0.25s ease",
        zIndex: 1200,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header del sidebar */}
      <Box
        onClick={toggleDrawer}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1.5,
          borderBottom: `1px solid ${dividerColor}`,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <MenuIcon />
        {open && (
          <Typography variant="h6" fontWeight={800}>
            {t("Menú")}
          </Typography>
        )}
      </Box>

      {/* Lista de módulos */}
      <List sx={{ px: 1, py: 1, flex: 1, overflowY: "auto" }}>
        {menuItems.map(({ id, text, icon }) => (
          <ListItem key={id} disablePadding onClick={() => handleMenuClick(id)}>
            <ListItemButton
              selected={selectedMenu === toKey(id)}
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                justifyContent: open ? "flex-start" : "center",
                "&:hover": { bgcolor: hoverBg },
                "&.Mui-selected": {
                  bgcolor: selectedBg,
                  color: selectedColor,
                  "& .MuiListItemIcon-root": { color: selectedColor },
                  "& .MuiListItemText-primary": {
                    color: selectedColor,
                    fontWeight: 800,
                  },
                  "&:hover": { bgcolor: selectedBg }, // estable al hover
                  position: "relative",
                  boxShadow: isDark
                    ? `inset 0 0 0 1px ${alpha(theme.palette.primary.main, 0.25)}`
                    : "none",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 6,
                    bottom: 6,
                    width: 3.5,
                    borderRadius: "0 3px 3px 0",
                    backgroundColor: selectedBar,
                  },
                },
              }}
            >
              <ListItemIcon
                className="MuiListItemIcon-root"
                sx={{
                  color: theme.palette.text.primary,
                  minWidth: 0,
                  mr: open ? 2 : 0,
                }}
              >
                {icons[icon]}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={t(text)}
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1.5, borderColor: dividerColor }} />
      </List>
    </Box>
  );
}