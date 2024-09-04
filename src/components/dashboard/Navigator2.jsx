import * as React from 'react';
import axios from 'axios';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTranslation } from 'react-i18next'; // Importar useTranslation
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import TimerIcon from '@mui/icons-material/Timer';
import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import Persona from "../personas/Persona.jsx";
import Pais from '../pais/Pais';
import Departamento from '../departamento/Departamento';
import Municipio from '../municipio/Municipio';
import ProductoPresentacion from '../producto_presentacion/ProductoPresentacion';
import Produccion from '../produccion/Produccion';
import Kardex from '../kardex/Kardex';
import KardexItem from '../kardex_item/KardexItem';
import Reportes from '../reportes/Reportes';
import Empresa from '../empresas/Empresa.jsx';
import Producto from '../producto/Producto.jsx';
import ProductoCategoria from '../producto_categoria/ProductoCategoria.jsx';

const icons = {
  DnsRounded: <DnsRoundedIcon />,
  Home: <HomeIcon />,
  People: <PeopleIcon />,
  Public: <PublicIcon />,
  AddShoppingCartIcon: <AddShoppingCartIcon />,
  Settings: <SettingsIcon />,
  Timer: <TimerIcon />,
  PhonelinkSetup: <PhonelinkSetupIcon />,
  ProductionQuantityLimitsIcon: <ProductionQuantityLimitsIcon />,
  LockIcon: <LockIcon />,
  PersonIcon: <PersonIcon />
};

const components = {
  pais: Pais,
  departamento: Departamento,
  municipio: Municipio,
  producto_presentacion: ProductoPresentacion,
  producto_categoria: ProductoCategoria,
  producto: Producto,
  produccion: Produccion,
  kardex: Kardex,
  kardex_item: KardexItem,
  reportes: Reportes,
  persona: Persona,
  empresa: Empresa
};


export default function Navigator2(props) {
  const { t } = useTranslation(); // Hook de traducción
  const [menuItems, setMenuItems] = React.useState([]);
  const [selectedMenu, setSelectedMenu] = React.useState(null);
  const [breadcrumb, setBreadcrumb] = React.useState([]);

  React.useEffect(() => {
    axios.get('/menu.json')
      .then((response) => {
        setMenuItems(response.data);

        // Auto-select the first menu and display its children
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
    if (menu && menu.children) {
      props.setCurrentModuleItem(renderSubmenu(menu.children, menuId));
    } else {
      props.setCurrentModuleItem(null); // Clear content if no children
    }
  };

  const handleSubMenuClick = (subMenuId, parentMenuId) => {
    setBreadcrumb([...breadcrumb, subMenuId]);
    props.setCurrentModuleItem(React.createElement(components[subMenuId], { goBack: () => handleBackToParent(parentMenuId) }));
  };

  const handleBackToParent = (parentMenuId) => {
    const parentMenu = menuItems.find(item => item.id === parentMenuId);
    setBreadcrumb([parentMenuId]);
    props.setCurrentModuleItem(renderSubmenu(parentMenu.children, parentMenuId));
  };

  const renderSubmenu = (children, parentMenuId) => {
    return (
      <Box display="flex" flexWrap="wrap" justifyContent="center" p={2}>
        {children.map(({ id, text, icon }) => (
          <Card sx={{ minWidth: 275, m: 2 }} key={id}>
            <CardContent>
              <ListItemIcon>{icons[icon]}</ListItemIcon>
              <Typography variant="h5" component="div">
                {t(text)} {/* Traducir el texto del menú */}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleSubMenuClick(id, parentMenuId)}>{t('see_more')}</Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    );
  };

  return (
    <Box>
      <List component="nav">
        {menuItems.map(({ id, text, icon }) => (
          <ListItem disablePadding key={id}
            id={id}
            onClick={() => handleMenuClick(id)}
          >
            <ListItemButton selected={selectedMenu === id}>
              <ListItemIcon>{icons[icon]}</ListItemIcon>
              <ListItemText primary={t(text)} /> {/* Traducir el texto del menú */}
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
      </List>
    </Box>
  );
}






