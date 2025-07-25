import * as React from 'react';
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
  Button
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import LockIcon from '@mui/icons-material/Lock';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PersonIcon from '@mui/icons-material/Person';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import DomainIcon from '@mui/icons-material/Domain';

import axios from '../axiosConfig.js';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import Persona from "../personas/Persona.jsx";
import Pais from '../pais/Pais';
import Departamento from '../departamento/Departamento';
import Municipio from '../municipio/Municipio';
import Presentacionproducto from '../Presentacionproducto/Presentacionproducto.jsx';
import Produccion from '../produccion/Produccion';
import Empresa from '../empresas/Empresa.jsx';
import Producto from '../producto/Producto.jsx';
import ProductoCategoria from '../producto_categoria/ProductoCategoria.jsx';
import Almacen from '../almacen/Almacen.jsx';
import Espacio from '../espacio/Espacio.jsx';
import Bloque from '../bloque/Bloque.jsx';
import Sede from '../sede/Sede.jsx';
import Marca from '../marca/Marca.jsx';
import Unidad from '../unidad/Unidad.jsx';
import TipoMovimiento from '../tipo_movimiento/TipoMovimiento.jsx';
import TipoProduccion from '../tipo_produccion/TipoProduccion.jsx';
import Presentacion from '../Presentacion/Presentacion.jsx';
import TipoBloque from '../tipo_bloque/Tipobloque.jsx';
import TipoSedes from '../tipo_sede/TipoSede.jsx';
import TipoEspacio from '../tipo_espacio/TipoEspacio.jsx';
import RPedido from '../r_pedido/Pedido.jsx';
import kardex from '../Kardex/kardex.jsx';
import Rol from '../Rol/Rol.jsx';
import TipoIdentificacion from '../TipoIdentificacion/TipoIdentificacion.jsx';
import Proveedor from '../Proveedor/Proveedor.jsx';
import MediaCard from '../MediaCard.jsx';
import OrdenCompra from '../OrdenCompra/OrdenCompra.jsx';
import Ocupacion from '../ocupacion/Ocupacion.jsx';
import EvaluacionItem from '../Evaluacion_item/Evaluacion_item.jsx';
import Grupo from '../Grupo/Grupo.jsx';
import Movimineto from '../Movimiento/Movimiento.jsx';
import Proceso from '../Proceso/Proceso.jsx';
import Ingrediente from '../ingrediente/ingrediente.jsx';
import Seccion from '../seccion/Seccion.jsx'
import Subseccion from '../subseccion/subseccion.jsx';
import TipoInventario from '../tipo_inventario/Tipo_inventario.jsx';
import Inventario from '../Inventario/Inventario.jsx';
import IngredientePresentacionProducto from '../IngredientePP/IngredientePP.jsx';
import TipoEvaluacion from '../tipo-evaluacion/Tipo_evaluacion.jsx';
import Re_pedido from '../RE_pedido/re_pv.jsx';
import RE_kardex from '../RKardex/Rkardex.jsx';
import RE_productoVencimiento from '../RE_pv/re_pvn.jsx';
import RE_ordenCompra from '../RE_oc/re_oc.jsx';
import RE_fc from '../RE_fc/re_fc.jsx';

const icons = {
  DnsRounded: <DnsRoundedIcon />, Home: <HomeIcon />, People: <PeopleIcon />,
  Public: <PublicIcon />, AddShoppingCartIcon: <AddShoppingCartIcon />, Domain: <DomainIcon />,
  Settings: <SettingsIcon />, Apartment: <ApartmentIcon />, LocationCity: <LocationCityIcon />,
  ProductionQuantityLimitsIcon: <ProductionQuantityLimitsIcon />, LockIcon: <LockIcon />,
  PersonIcon: <PersonIcon />, HomeWorkIcon: <HomeWorkIcon />, Warehouse: <WarehouseIcon />
};

const components = {
  tipoidentificacion: TipoIdentificacion, roll: Rol, proveedor: Proveedor, pais: Pais,
  departamento: Departamento, municipio: Municipio, almacen: Almacen, espacio: Espacio,
  tipo_espacio: TipoEspacio, bloque: Bloque, tipo_bloque: TipoBloque, tipo_sede: TipoSedes,
  sede: Sede, presentacion_producto: Presentacionproducto, presentacion: Presentacion,
  producto_categoria: ProductoCategoria, producto: Producto, produccion: Produccion,
  marca: Marca, unidad: Unidad, tipo_evaluacion: TipoEvaluacion, tipo_movimiento: TipoMovimiento,
  tipo_produccion: TipoProduccion, persona: Persona, empresa: Empresa, r_pedido: RPedido,
  kardex: kardex, media_card: MediaCard, evaluacion_item: EvaluacionItem,
  OrdenCompra: OrdenCompra, Ocupacion: Ocupacion, grupo: Grupo, Movimiento: Movimineto,
  Proceso: Proceso, Ingrediente: Ingrediente, Seccion: Seccion, Subseccion: Subseccion,
  tipo_inventario: TipoInventario, Inventario: Inventario,
  IngredientePresentacionProducto: IngredientePresentacionProducto,
  RE_pedido: Re_pedido, RE_kardex: RE_kardex, RE_pv: RE_productoVencimiento,
  RE_oc: RE_ordenCompra, RE_fc: RE_fc
};


const moduleImages = {
  persona: "/images/cards/1.jpg",
  rol: "/images/cards/2.jpg",
  tipoidentificacion: "/images/cards/3.jpg",
  empresa: "/images/cards/4.jpg",
  pais: "/images/cards/5.jpg",
  departamento: "/images/cards/6.jpg",
  municipio: "/images/cards/7.jpg",
  tipo_sede: "/images/cards/8.jpg",
  sede: "/images/cards/9.jpg",
  tipo_bloque: "/images/cards/10.jpg",
  bloque: "/images/cards/1.jpg",
  tipo_espacio: "/images/cards/2.jpg",
  espacio: "/images/cards/3.jpg",
  almacen: "/images/cards/4.jpg",
  Kardex: "/images/cards/5.jpg",
  proveedor: "/images/cards/6.jpg",
  producto_categoria: "/images/cards/7.jpg",
  marca: "/images/cards/8.jpg",
  unidad: "/images/cards/9.jpg",
  producto: "/images/cards/10.jpg",
  presentacion_producto: "/images/cards/1.jpg",
  tipo_produccion: "/images/cards/2.jpg",
  tipo_movimiento: "/images/cards/3.jpg",
  produccion: "/images/cards/4.jpg",
  r_pedido: "/images/cards/5.jpg",
  presentacion: "/images/cards/6.jpg",
  media_card: "/images/cards/7.jpg",
  evaluacion_item: "/images/cards/2.jpg",
  OrdenCompra: "/images/cards/9.jpg",
  Ocupacion: "/images/cards/5.jpg",
  Ingrediente: "/images/cards/5.jpg",
  Seccion: "/images/cards/5.jpg",
  Subseccion: "/images/cards/10.jpg",
  TipoInventario: "/images/cards/6.jpg",
  Inventario: "/images/cards/7.jpg",
  tipo_evaluacion: "/images/cards/8.jpg",
  RE_pedido: "/images/cards/9.jpg",
  RE_kardex: "/images/cards/10.jpg",
  RE_productoVencimiento: "/images/cards/1.jpg",
  RE_oc: "/images/cards/2.jpg",
  RE_fc: "/images/cards/3.jpg"
};

export default function Navigator2({ setCurrentModuleItem, setMenuOpen, isAuthenticated }) {
  const { t } = useTranslation();
  const theme = useTheme();

  const [menuItems, setMenuItems] = React.useState([]);
  const [selectedMenu, setSelectedMenu] = React.useState(null);
  const [open, setOpen] = React.useState(() => {
    const stored = localStorage.getItem('sidebarOpen');
    return stored ? JSON.parse(stored) : true;
  });

  const [breadcrumb, setBreadcrumb] = React.useState([]);

  React.useEffect(() => {
    if (setMenuOpen) setMenuOpen(open);
  }, [open]);

  React.useEffect(() => {
    if (!isAuthenticated) return;

    axios.get('/v1/menu')
      .then((response) => {
        setMenuItems(response.data);

        const savedModule = localStorage.getItem('activeModule');
        if (savedModule && components[savedModule]) {
          setCurrentModuleItem(React.createElement(components[savedModule]));
          setSelectedMenu(savedModule);
        } else {
          const firstMenu = response.data[0];
          if (firstMenu?.children?.length > 0) {
            setSelectedMenu(firstMenu.id);
            setCurrentModuleItem(renderSubmenu(firstMenu.children, firstMenu.id));
          }
        }
      })
      .catch(console.error);
  }, [isAuthenticated]);

  const toggleDrawer = () => {
    const newOpen = !open;
    setOpen(newOpen);
    if (setMenuOpen) setMenuOpen(newOpen);
    localStorage.setItem('sidebarOpen', JSON.stringify(newOpen));
  };

  const handleMenuClick = (menuId) => {
    setSelectedMenu(menuId);
    localStorage.setItem('activeModule', menuId);
    setBreadcrumb([menuId]);

    const menu = menuItems.find(item => item.id === menuId);
    if (menu?.children?.length) {
      setCurrentModuleItem(renderSubmenu(menu.children, menuId));
    } else {
      const Component = components[menuId];
      setCurrentModuleItem(Component ? <Component /> : null);
    }
  };

  const handleSubMenuClick = (subMenuId, parentMenuId) => {
    setBreadcrumb([parentMenuId, subMenuId]);
    localStorage.setItem('activeModule', subMenuId);

    const Component = components[subMenuId];
    setCurrentModuleItem(Component ? <Component /> : null);
  };

  const renderSubmenu = (children, parentMenuId) => (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {children.map(({ id, text, icon }) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={id}>
          <Box
            onClick={() => handleSubMenuClick(id, parentMenuId)}
            sx={{
              boxShadow: 1,
              borderRadius: 2,
              overflow: 'hidden',
              height: 160,
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: '0.3s',
              '&:hover': { transform: 'scale(1.03)' },
            }}
          >
            <Box
              component="img"
              src={moduleImages[id] || "/images/cards/1.jpg"}
              alt={id}
              sx={{ width: '100%', height: 80, objectFit: 'cover' }}
            />
            <Box sx={{ flex: 1, p: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                  {icons[icon]}
                </ListItemIcon>
                <Typography variant="body2" fontWeight="bold" noWrap>
                  {t(text)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button size="small">{t('Ver más')}</Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  // 🔒 Si no hay sesión, no renderizar menú
  if (!isAuthenticated) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '65px',
        left: 0,
        width: {
          xs: open ? '200px' : '60px',
          sm: open ? '220px' : '70px',
          md: open ? '250px' : '70px',
        },
        height: '100vh',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: 1,
        transition: 'width 0.3s ease-in-out',
        zIndex: 1200,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, cursor: 'pointer' }} onClick={toggleDrawer}>
        <MenuIcon sx={{ mr: open ? 1 : 0 }} />
        {open && <Typography variant="h6">{t('Menú')}</Typography>}
      </Box>

      <List>
        {menuItems.map(({ id, text, icon }) => (
          <ListItem key={id} disablePadding onClick={() => handleMenuClick(id)}>
            <ListItemButton selected={selectedMenu === id} sx={{ justifyContent: open ? 'flex-start' : 'center' }}>
              <ListItemIcon sx={{ color: theme.palette.text.primary, minWidth: 0, mr: open ? 2 : 0 }}>
                {icons[icon]}
              </ListItemIcon>
              {open && <ListItemText primary={t(text)} />}
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
      </List>
    </Box>
  );
}
