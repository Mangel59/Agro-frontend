import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Container, Toolbar, Paper } from '@mui/material';

import { useThemeToggle } from './components/dashboard/ThemeToggleProvider';
import { useTranslation } from 'react-i18next';
import './i18n.js';
import './index.css';
import { useLocation } from 'react-router-dom';

import AppBarComponent from './components/dashboard/AppBarComponent.jsx';
import Copyright from './components/dashboard/Copyright';
import Inicio from './components/Inicio.jsx';
import Contenido from './components/dashboard/Contenido.jsx';
import Navigator2 from './components/dashboard/Navigator2.jsx';

// Módulos
import Persona from "./components/personas/Persona.jsx";
import Pais from './components/pais/Pais';
import Departamento from './components/departamento/Departamento';
import Municipio from './components/municipio/Municipio';
import Presentacionproducto from './components/Presentacionproducto/Presentacionproducto.jsx';
import Produccion from './components/produccion/Produccion';
import Empresa from './components/empresas/Empresa.jsx';
import Producto from './components/producto/Producto.jsx';
import ProductoCategoria from './components/producto_categoria/ProductoCategoria.jsx';
import Almacen from './components/almacen/Almacen.jsx';
import Espacio from './components/espacio/Espacio.jsx';
import Bloque from './components/bloque/Bloque.jsx';
import Sede from './components/sede/Sede.jsx';
import Marca from './components/marca/Marca.jsx';
import Unidad from './components/unidad/Unidad.jsx';
import TipoMovimiento from './components/tipo_movimiento/TipoMovimiento.jsx';
import TipoProduccion from './components/tipo_produccion/TipoProduccion.jsx';
import Presentacion from './components/Presentacion/Presentacion.jsx';
import TipoBloque from './components/tipo_bloque/Tipobloque.jsx';
import TipoSedes from './components/tipo_sede/TipoSede.jsx';
import TipoEspacio from './components/tipo_espacio/TipoEspacio.jsx';
import RPedido from './components/r_pedido/Pedido.jsx';
import kardex from './components/Kardex/kardex.jsx';
import Rol from './components/Rol/Rol.jsx';
import TipoIdentificacion from './components/TipoIdentificacion/TipoIdentificacion.jsx';
import Proveedor from './components/Proveedor/Proveedor.jsx';
import MediaCard from './components/MediaCard.jsx';
import OrdenCompra from './components/OrdenCompra/OrdenCompra.jsx';
import Ocupacion from './components/ocupacion/Ocupacion.jsx';
import EvaluacionItem from './components/Evaluacion_item/Evaluacion_item.jsx';
import Grupo from './components/Grupo/Grupo.jsx';
import Movimineto from './components/Movimiento/Movimiento.jsx';
import Proceso from './components/Proceso/Proceso.jsx';
import Ingrediente from './components/ingrediente/ingrediente.jsx';
import Seccion from './components/seccion/Seccion.jsx';
import Subseccion from './components/subseccion/subseccion.jsx';
import TipoInventario from './components/tipo_inventario/Tipo_inventario.jsx';
import Inventario from './components/Inventario/Inventario.jsx';
import IngredientePresentacionProducto from './components/IngredientePP/IngredientePP.jsx';
import TipoEvaluacion from './components/tipo-evaluacion/Tipo_evaluacion.jsx';
import Re_pedido from './components/RE_pedido/re_pv.jsx';
import RE_kardex from './components/RKardex/Rkardex.jsx';
import RE_productoVencimiento from './components/RE_pv/re_pvn.jsx';
import RE_ordenCompra from './components/RE_oc/re_oc.jsx';
import RE_fc from './components/RE_fc/re_fc.jsx';
import Verify from './components/Verify.jsx';
import FormRegistroPersona from "./components/seguridad/formRegistroPersona";
import FormRegistroEmpresa from "./components/seguridad/formRegistroEmpresa";

const moduleMap = {
  persona: Persona,
  pais: Pais,
  departamento: Departamento,
  municipio: Municipio,
  presentacion_producto: Presentacionproducto,
  produccion: Produccion,
  empresa: Empresa,
  producto: Producto,
  producto_categoria: ProductoCategoria,
  almacen: Almacen,
  espacio: Espacio,
  bloque: Bloque,
  sede: Sede,
  marca: Marca,
  unidad: Unidad,
  tipo_movimiento: TipoMovimiento,
  tipo_produccion: TipoProduccion,
  presentacion: Presentacion,
  tipo_bloque: TipoBloque,
  tipo_sede: TipoSedes,
  tipo_espacio: TipoEspacio,
  r_pedido: RPedido,
  kardex: kardex,
  rol: Rol,
  tipoidentificacion: TipoIdentificacion,
  proveedor: Proveedor,
  media_card: MediaCard,
  ordencompra: OrdenCompra,
  ocupacion: Ocupacion,
  evaluacion_item: EvaluacionItem,
  grupo: Grupo,
  movimiento: Movimineto,
  proceso: Proceso,
  ingrediente: Ingrediente,
  seccion: Seccion,
  subseccion: Subseccion,
  tipo_inventario: TipoInventario,
  inventario: Inventario,
  ingredientepresentacionproducto: IngredientePresentacionProducto,
  tipo_evaluacion: TipoEvaluacion,
  re_pedido: Re_pedido,
  re_kardex: RE_kardex,
  re_productovencimiento: RE_productoVencimiento,
  re_ordencompra: RE_ordenCompra,
  re_fc: RE_fc
};

const APPBAR_GREEN = '#0F2327';

const App = () => {
  useTranslation();
  useThemeToggle();
  const location = useLocation();
  const [currentModule, setCurrentModule] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    const hasValidToken = () => {
      const token = localStorage.getItem('token');
      const exp = Number(localStorage.getItem('token_expiration'));
      return Boolean(token && exp && Date.now() < exp);
    };

    // 1) Verify por URL
    if (location.pathname.startsWith('/coagronet/auth/verify')) {
      setIsAuthenticated(false);
      setCurrentModule(<Verify />);
      return;
    }

    // 1.1) Onboarding por ruta — SIN MENÚ
    if (location.pathname.startsWith('/coagronet/onboarding/persona')) {
      if (hasValidToken()) {
        setIsAuthenticated(false); // 👈 clave: modo público
        setCurrentModule(<FormRegistroPersona setCurrentModule={setCurrentModule} />);
      } else {
        setIsAuthenticated(false);
        setCurrentModule(<Inicio setCurrentModule={setCurrentModule} />);
      }
      return;
    }

    if (location.pathname.startsWith('/coagronet/onboarding/empresa')) {
      if (hasValidToken()) {
        setIsAuthenticated(false); // 👈 clave: modo público
        setCurrentModule(<FormRegistroEmpresa setCurrentModule={setCurrentModule} />);
      } else {
        setIsAuthenticated(false);
        setCurrentModule(<Inicio setCurrentModule={setCurrentModule} />);
      }
      return;
    }

    // 2) /dashboard
    if (location.pathname === '/dashboard') {
      if (hasValidToken()) {
        setIsAuthenticated(true);
        setCurrentModule(<Contenido setCurrentModule={setCurrentModule} />);
        return;
      }
      setIsAuthenticated(false);
      setCurrentModule(<Inicio setCurrentModule={setCurrentModule} />);
      return;
    }

    // 3) Flujo normal
    if (hasValidToken()) {
      const savedModule = localStorage.getItem('activeModule');

      // 🔒 Onboarding sin menú si quedó activo por localStorage
      if (savedModule === 'form_registro_persona') {
        setIsAuthenticated(false);
        setCurrentModule(<FormRegistroPersona setCurrentModule={setCurrentModule} />);
        return;
      }
      if (savedModule === 'form_registro_empresa') {
        setIsAuthenticated(false);
        setCurrentModule(<FormRegistroEmpresa setCurrentModule={setCurrentModule} />);
        return;
      }

      // ✅ Autenticado normal con menú
      setIsAuthenticated(true);
      if (savedModule && moduleMap[savedModule]) {
        const Component = moduleMap[savedModule];
        setCurrentModule(<Component setCurrentModule={setCurrentModule} />);
      } else {
        setCurrentModule(<Contenido setCurrentModule={setCurrentModule} />);
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('token_expiration');
      localStorage.removeItem('activeModule');
      setIsAuthenticated(false);
      setCurrentModule(<Inicio setCurrentModule={setCurrentModule} />);
    }
  }, [location.pathname]);

  const isPublic = !isAuthenticated;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Menú solo si está autenticado */}
      {isAuthenticated && (
        <Navigator2
          setCurrentModuleItem={setCurrentModule}
          setMenuOpen={setMenuOpen}
          isAuthenticated={isAuthenticated}
        />
      )}

      <Box
        id="app-main"
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          ml: isAuthenticated
            ? {
                xs: menuOpen ? '200px' : '60px',
                sm: menuOpen ? '220px' : '70px',
                md: menuOpen ? '250px' : '70px',
              }
            : 0,
          transition: 'margin-left 0.3s ease',
          bgcolor: 'transparent',
        }}
      >
        <AppBarComponent
          key={isAuthenticated}
          setCurrentModule={setCurrentModule}
          setIsAuthenticated={setIsAuthenticated}
          isAuthenticated={isAuthenticated}
        />

        <Toolbar
          disableGutters
          sx={{
            bgcolor: APPBAR_GREEN,
            boxShadow: 'none',
            border: 0,
          }}
        />

        {isPublic ? (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {currentModule}
            <Box sx={{ py: 2 }}>
              <Copyright />
            </Box>
          </Box>
        ) : (
          <Container
            maxWidth="lg"
            disableGutters
            sx={{
              flex: 1,
              py: 1,
              px: { xs: 1, sm: 2 },
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'transparent',
            }}
          >
            <Box
              sx={{
                flex: 1,
                width: '100%',
                minHeight: 'calc(100vh - 160px)',
                overflow: 'auto',
                bgcolor: 'transparent',
              }}
            >
              {currentModule}
            </Box>
            <Box sx={{ pt: 2 }}>
              <Copyright />
            </Box>
          </Container>
        )}
      </Box>
    </Box>
  );
};

export default App;
