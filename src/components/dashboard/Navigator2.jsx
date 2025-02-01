import * as React from 'react';
import axios from 'axios';
import { Divider, List, Box, ListItem, ListItemButton, ListItemIcon, ListItemText, Grid, Card, CardContent, CardActions, Typography, Button, IconButton } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

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

import Persona from "../personas/Persona.jsx";
import Pais from '../pais/Pais';
import Departamento from '../departamento/Departamento';
import Municipio from '../municipio/Municipio';
import ProductoPresentacion from '../producto_presentacion/ProductoPresentacion';
import Produccion from '../produccion/Produccion';
import Kardex from '../kardex/Kardex.jsx';
import KardexItem from '../kardex_item/KardexItem';
import Reportes from '../reportes/Reportes';
import Empresa from '../empresas/Empresa.jsx';
import Producto from '../producto/Producto.jsx';
import ProductoCategoria from '../producto_categoria/ProductoCategoria.jsx';
import Almacen from '../almacen/Almacen.jsx';
import Espacio from '../espacio/Espacio.jsx';
import Bloque from '../bloque/Bloque.jsx';
import Sede from '../sede/Sede.jsx';
import KardexNuevo from '../kardex_nuevo/KardexNuevo.jsx'
import Marca from '../marca/Marca.jsx';
import Unidad from '../unidad/Unidad.jsx';
import TipoMovimiento from '../tipo_movimiento/TipoMovimiento.jsx';
import TipoProduccion from '../tipo_produccion/TipoProduccion.jsx';
import Presentacion from '../Presentacion/Presentacion.jsx';
import TipoBloque from '../tipo_bloque/Tipobloque.jsx';
import TipoSedes from '../tipo_sede/TipoSede.jsx';
import TipoEspacio from '../tipo_espacio/TipoEspacio.jsx';
import EspacioOcupacion from '../espacio_ocupacion/EspacioOcupacion.jsx';
import RPedido from '../r_pedido/Pedido.jsx';
import ROrdenCompra from '../r_orden_compra/OrdenCompra.jsx';
// import DomainIcon from '@mui/icons-material/Domain';
import Rol from '../Rol/Rol.jsx';
import TipoIdentificacion from '../TipoIdentificacion/TipoIdentificacion.jsx';
import ProveedorEvaluacion from '../Proveedor Evaluacion/ProveedorEvaluacion.jsx';
import Evaluacion from '../Evaluacion/Evaluacion.jsx';
import ClienteEvaluacion from '../ClienteEvaluacion/ClienteEvaluacion.jsx';
import Proveedor from '../Proveedor/Proveedor.jsx';

// Definición de íconos
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
  Warehouse: <WarehouseIcon />
};

// Mapeo de componentes por menú
const components = {
  tipoidentificacion: TipoIdentificacion,
  proveedor_eevaluacion: ProveedorEvaluacion,
  roll: Rol,
  evaluacion: Evaluacion,
  cliente_evalacion: ClienteEvaluacion,
  proveedor: Proveedor,
  pais: Pais,
  departamento: Departamento,
  municipio: Municipio,
  almacen: Almacen,
  espacio: Espacio,
  espacio_ocupacion:EspacioOcupacion,
  tipo_espacio: TipoEspacio,
  bloque: Bloque,
  tipo_bloque: TipoBloque,
  tipo_sede: TipoSedes,
  sede: Sede,
  producto_presentacion: ProductoPresentacion,
  presentacion: Presentacion,
  producto_categoria: ProductoCategoria,
  producto: Producto,
  produccion: Produccion,
  kardex: Kardex,
  kardex_nuevo: KardexNuevo,
  kardex_item: KardexItem,
  marca: Marca,
  unidad: Unidad,
  tipo_movimiento: TipoMovimiento,
  tipo_produccion: TipoProduccion,
  reportes: Reportes,
  persona: Persona,
  empresa: Empresa,
  r_pedido: RPedido,
  r_orden_compra: ROrdenCompra
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
  
    if (menu && menu.children && menu.children.length > 0) {
      props.setCurrentModuleItem(renderSubmenu(menu.children, menuId));
    } else {
      const Component = components[menuId];
      console.log("Component to render:", Component); // Debugging line
      if (Component) {
        props.setCurrentModuleItem(<Component />);
      } else {
        console.warn(`No component found for menuId: ${menuId}`);
        props.setCurrentModuleItem(null);
      }
    }
  };
  

  const handleSubMenuClick = (subMenuId, parentMenuId) => {
    console.log("subMenuId:", subMenuId);
    console.log("components[subMenuId]:", components[subMenuId]);
    if (!components[subMenuId]) {
        console.warn(`El componente para subMenuId "${subMenuId}" es undefined.`);
    }
    setBreadcrumb([...breadcrumb, subMenuId]);
    if (components[subMenuId]) {
        props.setCurrentModuleItem(
            React.createElement(components[subMenuId], { goBack: () => handleBackToParent(parentMenuId) })
        );
    } else {
        props.setCurrentModuleItem(null);
    }
};

const renderSubmenu = (children, parentMenuId) => (
    <Grid container spacing={3} sx={{ padding: 2, marginTop: '40px' }}>
      {children.map(({ id, text, icon }) => (
        <Grid item xs={12} sm={6} md={4} key={id}>
          <Card sx={{ 
              minWidth: 275, 
              height: '100%', 
              backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff', 
              color: theme.palette.mode === 'dark' ? '#fff' : '#000', 
              marginBottom: '20px', 
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' 
            }}>
            <CardContent>
              <ListItemIcon sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>{icons[icon]}</ListItemIcon>
              <Typography variant="h6" component="div">
                {t(text)}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" sx={{ color: theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2' }} onClick={() => handleSubMenuClick(id, parentMenuId)}>
                {t('see_more')}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ 
        position: 'fixed', 
        top: '65px', 
        left: '0', 
        width: open ? '250px' : '70px', 
        height: '100vh', 
        overflowY: 'auto', 
        backgroundColor: theme.palette.mode === 'dark' ? '#212121' : '#fff', 
        color: theme.palette.mode === 'dark' ? '#fff' : '#000', 
        boxShadow: '0 0 10px rgba(0,0,0,0.1)', 
        transition: 'width 0.3s' 
      }}>
      {/* Título del menú que funciona como botón de alternancia */}
      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', p: 2 }} onClick={() => setOpen(!open)}>
        <MenuIcon sx={{ mr: open ? 1 : 0, color: theme.palette.mode === 'dark' ? '#fff' : '#000' }} />
        {open && <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>{t('Menú')}</Typography>}
      </Box>

      <List component="nav">
        {menuItems.map(({ id, text, icon }) => (
          <ListItem disablePadding key={id} id={id} onClick={() => handleMenuClick(id)}>
            <ListItemButton selected={selectedMenu === id} sx={{ justifyContent: open ? 'flex-start' : 'center', px: open ? 2 : 0 }}>
              <ListItemIcon sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000', minWidth: 0, mr: open ? 2 : 0, justifyContent: 'center' }}>
                {icons[icon]}
              </ListItemIcon>
              {open && <ListItemText primary={t(text)} sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }} />}
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1, backgroundColor: theme.palette.mode === 'dark' ? '#757575' : '#e0e0e0' }} />
      </List>
    </Box>
  );
}