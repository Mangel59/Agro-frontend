import * as React from 'react';
import axios from 'axios';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid'; // Para estructura adaptable
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles'; // Para detectar el modo oscuro

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
import Rkardex from '../rkardex/Rkardex.jsx'
// import DomainIcon from '@mui/icons-material/Domain';


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
  HomeWork: <HomeWorkIcon />,
  Warehouse: <WarehouseIcon />
};

// Mapeo de componentes por menú
const components = {
  pais: Pais,
  departamento: Departamento,
  municipio: Municipio,
  almacen: Almacen,
  espacio: Espacio,
  bloque: Bloque,
  sede: Sede,
  producto_presentacion: ProductoPresentacion,
  producto_categoria: ProductoCategoria,
  producto: Producto,
  produccion: Produccion,
  kardex: Kardex,
  rkardex: Rkardex,
  kardex_item: KardexItem,
  reportes: Reportes,
  persona: Persona,
  empresa: Empresa
};

export default function Navigator2(props) {
  const { t } = useTranslation(); // Hook para traducción
  const theme = useTheme(); // Para obtener el tema actual (oscuro o claro)
  const [menuItems, setMenuItems] = React.useState([]);
  const [selectedMenu, setSelectedMenu] = React.useState(null);
  const [breadcrumb, setBreadcrumb] = React.useState([]);

  // Obtener ítems del menú
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

  // Manejador de clic en menú
  const handleMenuClick = (menuId) => {
    setSelectedMenu(menuId);
    const menu = menuItems.find(item => item.id === menuId);
    setBreadcrumb([menuId]);
    
    if (menu && menu.children && menu.children.length > 0) {
      props.setCurrentModuleItem(renderSubmenu(menu.children, menuId));
    } else {
      const Component = components[menuId];
      if (Component) {
        props.setCurrentModuleItem(<Component />);
      } else {
        props.setCurrentModuleItem(null);
      }
    }
  };

  // Manejador de clic en submenú
  const handleSubMenuClick = (subMenuId, parentMenuId) => {
    setBreadcrumb([...breadcrumb, subMenuId]);
    props.setCurrentModuleItem(React.createElement(components[subMenuId], { goBack: () => handleBackToParent(parentMenuId) }));
  };

  // Volver al menú padre
  const handleBackToParent = (parentMenuId) => {
    const parentMenu = menuItems.find(item => item.id === parentMenuId);
    setBreadcrumb([parentMenuId]);
    props.setCurrentModuleItem(renderSubmenu(parentMenu.children, parentMenuId));
  };

  // Renderizar submenús
// Renderizar submenús
const renderSubmenu = (children, parentMenuId) => {
  return (
    <Grid container spacing={3} sx={{ padding: 2 }}> {/* Ajuste de spacing */}
      {children.map(({ id, text, icon }) => (
        <Grid item xs={12} sm={6} md={4} key={id}>
          <Card sx={{ minWidth: 275, height: '100%', backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#fff', 
            marginBottom: '20px', // Espacio adicional entre las tarjetas
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Sombra para darle más estilo
          }}>
            <CardContent>
              <ListItemIcon>{icons[icon]}</ListItemIcon>
              <Typography variant="h6" component="div">
                {t(text)}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleSubMenuClick(id, parentMenuId)}>
                {t('see_more')}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};


  return (
    <Box
      sx={{
        position: 'fixed',
        top: '70px',
        left: '0',
        width: '250px',
        height: '100vh',
        overflowY: 'auto',
        backgroundColor: '#fff', // Aseguramos que el fondo del menú siempre sea blanco
        color: theme.palette.mode === 'dark' ? '#fff' : '#000', // Texto basado en el modo
        p: 2,
        boxShadow: '0 0 10px rgba(0,0,0,0.1)' // Añadimos una sombra para destacarlo mejor
      }}
    >
      {/* Menú principal */}
      <List component="nav">
        {menuItems.map(({ id, text, icon }) => (
          <ListItem disablePadding key={id} id={id} onClick={() => handleMenuClick(id)}>
            <ListItemButton selected={selectedMenu === id}>
              <ListItemIcon sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
                {icons[icon]}
              </ListItemIcon>
              <ListItemText primary={t(text)} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
      </List>
    </Box>
  );
}
