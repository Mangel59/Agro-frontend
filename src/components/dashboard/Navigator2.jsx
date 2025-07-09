/**
 * @file Navigator2.jsx
 * @module Navigator2
 * @description Componente que representa el menú de navegación lateral con submenús y renderización dinámica de componentes con imagen fija.
 * @component
 */

import * as React from 'react';
import axios from 'axios';
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

import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

// Componentes del sistema
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
import Evaluacion from '../Evaluacion/Evaluacion.jsx';
import EvaluacionItem from '../Evaluacion_item/Evaluacion_item.jsx';
import Grupo from '../Grupo/Grupo.jsx';
import Movimineto from '../Movimiento/Movimiento.jsx';
import Proceso from '../Proceso/Proceso.jsx';
import ArticuloKardex from  '../kardexItem/ArticuloKardex.jsx';
import Ingrediente from '../ingrediente/ingrediente.jsx';
import Seccion from '../seccion/Seccion.jsx'
import Subseccion from '../subseccion/subseccion.jsx';
import TipoInventario from '../tipo_inventario/Tipo_inventario.jsx';
import Inventario from '../inventario/Inventario.jsx';
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
  tipo_espacio: TipoEspacio, bloque: Bloque,
  tipo_bloque: TipoBloque, tipo_sede: TipoSedes, sede: Sede,
  presentacion_producto: Presentacionproducto, presentacion: Presentacion,
  producto_categoria: ProductoCategoria, producto: Producto, produccion: Produccion,
  ArticuloKardex: ArticuloKardex, marca: Marca, unidad: Unidad, tipo_movimiento: TipoMovimiento,
  tipo_produccion: TipoProduccion, persona: Persona, empresa: Empresa, r_pedido: RPedido,
  kardex:kardex, media_card: MediaCard, evaluacion_item: EvaluacionItem,
  OrdenCompra: OrdenCompra, Ocupacion: Ocupacion,
  evaluacion:Evaluacion, grupo:Grupo, Movimiento:Movimineto, Proceso: Proceso, Ingrediente: Ingrediente,
  Seccion:Seccion, Subseccion:Subseccion,  tipo_inventario: TipoInventario, Inventario: Inventario

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
  kardex: "/images/cards/8.jpg",
  evaluacion_item: "/images/cards/2.jpg",
  evaluacion: "/images/cards/7.jpg",
  OrdenCompra: "/images/cards/9.jpg",
  Ocupacion: "/images/cards/5.jpg",
  Ingrediente: "/images/cards/5.jpg",
  Seccion: "/images/cards/5.jpg",
  Subseccion: "/images/cards/10.jpg",
  TipoInventario: "/images/cards/6.jpg",
  Inventario: "/images/cards/7.jpg"
};

export default function Navigator2(props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [menuItems, setMenuItems] = React.useState([]);
  const [selectedMenu, setSelectedMenu] = React.useState(null);
  const [breadcrumb, setBreadcrumb] = React.useState([]);
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    axios.get('/menu.json')
      .then((response) => {
        setMenuItems(response.data);
        if (response.data.length > 0) {
          const firstMenuId = response.data[0].id;
          setSelectedMenu(firstMenuId);
          setBreadcrumb([firstMenuId]);
          const firstMenu = response.data[0];
          if (firstMenu.children && firstMenu.children.length > 0) {
            props.setCurrentModuleItem(renderSubmenu(firstMenu.children, firstMenuId));
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching menu data:', error);
      });
  }, []);

  const handleMenuClick = (menuId) => {
    setSelectedMenu(menuId);
    const menu = menuItems.find(item => item.id === menuId);
    setBreadcrumb([menuId]);

    if (menu?.children?.length) {
      props.setCurrentModuleItem(renderSubmenu(menu.children, menuId));
    } else {
      const Component = components[menuId];
      props.setCurrentModuleItem(Component ? <Component /> : null);
    }
  };

  const handleSubMenuClick = (subMenuId, parentMenuId) => {
    setBreadcrumb([...breadcrumb, subMenuId]);
    if (components[subMenuId]) {
      props.setCurrentModuleItem(
        React.createElement(components[subMenuId], {
          goBack: () => handleMenuClick(parentMenuId),
        })
      );
    } else {
      props.setCurrentModuleItem(null);
    }
  };

  const renderSubmenu = (children, parentMenuId) => (
    <Grid container spacing={3} sx={{ padding: 2, marginTop: '40px' }}>
    {children.map(({ id, text, icon }) => (
      <Grid item xs={12} sm={6} md={4} lg={2} xl={2} key={id}>
        <Box
          sx={{
            minWidth: 150,
            height: 180,
            boxShadow: 3,
            borderRadius: 2,
            overflow: 'hidden',
            cursor: 'pointer',
            transition: '0.3s',
            display: 'flex',
            flexDirection: 'column',
            '&:hover': { transform: 'scale(1.03)' }
          }}
        >
          {/* Imagen superior */}
          <Box
            component="img"
            src={moduleImages[id] || "/images/cards/1.jpg"}
            alt={`Imagen de ${id}`}
            sx={{
              width: '100%',
              height: 80,
              objectFit: 'cover'
            }}
          />
  
          {/* Contenido */}
          <Box sx={{ flex: 1, padding: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ListItemIcon sx={{ minWidth: 0, color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
                {icons[icon]}
              </ListItemIcon>
              <Typography variant="body2" fontWeight="bold" noWrap>
                {t(text)}
              </Typography>
            </Box>
  
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 1 }}>
              <Button
                size="small"
                sx={{ color: theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2' }}
                onClick={() => handleSubMenuClick(id, parentMenuId)}
              >
                {t('Ver más')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Grid>
    ))}
  </Grid>
  
  );

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
    minWidth: open ? '60px' : '40px',
    height: '100vh',
    overflowY: 'auto',
    backgroundColor: theme.palette.mode === 'dark' ? '#212121' : '#fff',
    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    transition: 'width 0.3s'
  }}
>
      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', p: 2 }} onClick={() => setOpen(!open)}>
        <MenuIcon sx={{ mr: open ? 1 : 0, color: theme.palette.mode === 'dark' ? '#fff' : '#000' }} />
        {open && <Typography variant="h6">{t('Menú')}</Typography>}
      </Box>

      <List component="nav">
        {menuItems.map(({ id, text, icon }) => (
          <ListItem disablePadding key={id} id={id} onClick={() => handleMenuClick(id)}>
            <ListItemButton selected={selectedMenu === id} sx={{ justifyContent: open ? 'flex-start' : 'center' }}>
              <ListItemIcon sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000', minWidth: 0, mr: open ? 2 : 0 }}>
                {icons[icon]}
              </ListItemIcon>
              {open && <ListItemText primary={t(text)} />}
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1, backgroundColor: theme.palette.mode === 'dark' ? '#757575' : '#e0e0e0' }} />
      </List>
    </Box>
  );
}
