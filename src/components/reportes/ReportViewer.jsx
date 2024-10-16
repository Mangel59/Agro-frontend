// import React, { useState } from 'react';
// import axios from 'axios';
// import { Button, Container, FormControl, InputLabel, MenuItem, Select, Box } from '@mui/material';

// export default function ReportViewer() {
//   const [category, setCategory] = useState(0); // Estado para la categoría seleccionada
//   const [reportUrl, setReportUrl] = useState(''); // Estado para el URL del reporte generado

//   // Función para manejar el cambio de categoría
//   const handleChangeCategory = (event) => {
//     setCategory(event.target.value);
//   };

//   // Función para obtener el reporte según la categoría seleccionada
//   const fetchReport = async () => {
//     const baseUrl = "http://localhost:8080/api/report?category=" + category;
//     const response = await axios.get(baseUrl, {
//       responseType: 'blob', // Importante para datos binarios (PDF)
//     });

//     // Crear una URL de Blob para mostrar el PDF en un iframe
//     const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
//     setReportUrl(url); // Establecer el URL del reporte
//   };

//   return (
//     <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 4 }}>
//       {/* Selector de Categoría */}
//       <FormControl fullWidth sx={{ maxWidth: 400, mb: 2 }}>
//         <InputLabel id="category-select-label">Categoría</InputLabel>
//         <Select
//           labelId="category-select-label"
//           id="category-select"
//           value={category}
//           label="Categoría"
//           onChange={handleChangeCategory}
//         >
//           <MenuItem value={0}>Todas</MenuItem>
//           <MenuItem value={1}>Granos</MenuItem>
//           <MenuItem value={2}>Frutas</MenuItem>
//           <MenuItem value={3}>Vegetales</MenuItem>
//         </Select>
//       </FormControl>

//       {/* Botón para generar el reporte */}
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={fetchReport}
//         sx={{ maxWidth: 200, alignSelf: 'center', marginBottom: 2 }}
//       >
//         Generar Reporte
//       </Button>

//       {/* Mostrar el reporte si se ha generado */}
//       {reportUrl && (
//         <iframe
//           src={reportUrl}
//           width="100%"
//           height="600px"
//           style={{ marginTop: '20px' }}
//           title="Visor de Reporte"
//         />
//       )}
//     </Container>
//   );
// }


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, FormControl, InputLabel, MenuItem, Select, Button, Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import jsPDF from 'jspdf';

export default function ReportViewer() {
  const [empresa, setEmpresa] = useState('');
  const [grupo, setGrupo] = useState('');
  const [sede, setSede] = useState('');
  const [bloque, setBloque] = useState('');
  const [espacio, setEspacio] = useState('');
  const [produccion, setProduccion] = useState('');
  const [almacen, setAlmacen] = useState('');
  const [categoriaProducto, setCategoriaProducto] = useState('');
  const [producto, setProducto] = useState('');

  const [empresas, setEmpresas] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [producciones, setProducciones] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [categoriasProducto, setCategoriasProducto] = useState([]);
  const [productos, setProductos] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    axios.get('/empresa2.json').then(response => setEmpresas(response.data));
  }, []);

  const handleEmpresaChange = (event) => {
    const empresaId = event.target.value;
    setEmpresa(empresaId);
    setGrupo('');
    setSede('');
    setBloque('');
    setEspacio('');
    setProduccion('');
    setAlmacen('');
    setCategoriaProducto('');
    setProducto('');
    
    axios.get('/grupo2.json').then(response => {
      const gruposFiltrados = response.data.filter(grupo => grupo.gru_empresa_id === empresaId);
      setGrupos(gruposFiltrados);
    });
  };

  const handleGrupoChange = (event) => {
    const grupoId = event.target.value;
    setGrupo(grupoId);
    setSede('');
    setBloque('');
    setEspacio('');
    setProduccion('');
    setAlmacen('');
    
    axios.get('/sede2.json').then(response => {
      const sedesFiltradas = response.data.filter(sede => sede.sed_grupo_id === grupoId);
      setSedes(sedesFiltradas);
    });
  };

  const handleSedeChange = (event) => {
    const sedeId = event.target.value;
    setSede(sedeId);
    setBloque('');
    setEspacio('');
    setProduccion('');
    setAlmacen('');

    axios.get('/bloque2.json').then(response => {
      const bloquesFiltrados = response.data.filter(bloque => bloque.blo_sede_id === sedeId);
      setBloques(bloquesFiltrados);
    });
  };

  const handleBloqueChange = (event) => {
    const bloqueId = event.target.value;
    setBloque(bloqueId);
    setEspacio('');
    setProduccion('');
    setAlmacen('');

    axios.get('/espacio2.json').then(response => {
      const espaciosFiltrados = response.data.filter(espacio => espacio.esp_bloque_id === bloqueId);
      setEspacios(espaciosFiltrados);
    });
  };

  const handleEspacioChange = (event) => {
    const espacioId = event.target.value;
    setEspacio(espacioId);
    setProduccion('');
    setAlmacen('');

    axios.get('/produccion2.json').then(response => {
      const produccionesFiltradas = response.data.filter(produccion => produccion.pro_espacio_id === espacioId);
      setProducciones(produccionesFiltradas);
    });
  };

  const handleCategoriaProductoChange = (event) => {
    const categoriaId = event.target.value;
    setCategoriaProducto(categoriaId);
    setProducto('');

    axios.get('/producto2.json').then(response => {
      const productosFiltrados = response.data.filter(producto => producto.pro_producto_categoria_id === categoriaId);
      setProductos(productosFiltrados);
    });
  };

  const actualizarTabla = () => {
    const data = [
      { id: 1, producto: 'Producto A', entradas: 10, salidas: 5, saldo: 5 },
      { id: 2, producto: 'Producto B', entradas: 20, salidas: 10, saldo: 10 },
    ];

    const datosFiltrados = data.filter(item => {
      return (
        (empresa ? item.producto.includes('A') : true) &&
        (grupo ? item.producto.includes('B') : true) && 
        (sede ? item.producto.includes('A') : true)
      );
    });

    setFilteredData(datosFiltrados);
  };

  const generarReportePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Reporte Detallado', 20, 20);
    doc.setFontSize(12);
    doc.text(`Empresa ID: ${empresa}`, 20, 30); 
    doc.text(`Grupo ID: ${grupo}`, 20, 40);
    doc.text(`Sede ID: ${sede}`, 20, 50);
    doc.text(`Bloque ID: ${bloque}`, 20, 60);
    doc.text(`Espacio ID: ${espacio}`, 20, 70);
    doc.text(`Producción ID: ${produccion}`, 20, 80);
    doc.text(`Producto ID: ${producto}`, 20, 90);
    doc.save('reporte_detallado.pdf');
  };
  
  const columns = [
    { field: 'id', headerName: '#', width: 70 },
    { field: 'producto', headerName: 'Producto', width: 150 },
    { field: 'entradas', headerName: 'Entradas', type: 'number', width: 130 },
    { field: 'salidas', headerName: 'Salidas', type: 'number', width: 130 },
    { field: 'saldo', headerName: 'Saldo', type: 'number', width: 130 },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 40 }}>
      <Grid container spacing={2}>
        {/* Sidebar de Filtros */}
        <Grid item xs={12} md={3}>
          <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Filtrar por:</Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Empresa</InputLabel>
              <Select value={empresa} onChange={handleEmpresaChange}>
                {empresas.map((empresa) => (
                  <MenuItem key={empresa.emp_id} value={empresa.emp_id}>
                    {empresa.emp_nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Grupo</InputLabel>
              <Select value={grupo} onChange={handleGrupoChange} disabled={!empresa}>
                {grupos.map((grupo) => (
                  <MenuItem key={grupo.gru_id} value={grupo.gru_id}>
                    {grupo.gru_nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Sede</InputLabel>
              <Select value={sede} onChange={handleSedeChange} disabled={!grupo}>
                {sedes.map((sede) => (
                  <MenuItem key={sede.sed_id} value={sede.sed_id}>
                    {sede.sed_nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Bloque</InputLabel>
              <Select value={bloque} onChange={handleBloqueChange} disabled={!sede}>
                {bloques.map((bloque) => (
                  <MenuItem key={bloque.blo_id} value={bloque.blo_id}>
                    {bloque.blo_nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Espacio</InputLabel>
              <Select value={espacio} onChange={handleEspacioChange} disabled={!bloque}>
                {espacios.map((espacio) => (
                  <MenuItem key={espacio.esp_id} value={espacio.esp_id}>
                    {espacio.esp_nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Producción</InputLabel>
              <Select value={produccion} onChange={(e) => setProduccion(e.target.value)} disabled={!espacio}>
                {producciones.map((produccion) => (
                  <MenuItem key={produccion.pro_id} value={produccion.pro_id}>
                    {produccion.pro_nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Almacén</InputLabel>
              <Select value={almacen} onChange={(e) => setAlmacen(e.target.value)} disabled={!bloque}>
                {almacenes.map((almacen) => (
                  <MenuItem key={almacen.alm_id} value={almacen.alm_id}>
                    {almacen.alm_nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Categoría de Producto</InputLabel>
              <Select value={categoriaProducto} onChange={handleCategoriaProductoChange} disabled={!empresa}>
                {categoriasProducto.map((categoria) => (
                  <MenuItem key={categoria.prc_id} value={categoria.prc_id}>
                    {categoria.prc_nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Producto</InputLabel>
              <Select value={producto} onChange={(e) => setProducto(e.target.value)} disabled={!categoriaProducto}>
                {productos.map((producto) => (
                  <MenuItem key={producto.pro_id} value={producto.pro_id}>
                    {producto.pro_nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="contained" onClick={actualizarTabla} sx={{ mb: 2, width: '100%' }}>
              Filtrar Datos
            </Button>
          </Box>
        </Grid>

        {/* Tabla de Resultados */}
        <Grid item xs={12} md={9}>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid rows={filteredData} columns={columns} pageSize={5} />
          </Box>

          <Button variant="contained" onClick={generarReportePDF} sx={{ mt: 2 }}>
            Generar Reporte (PDF)
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}