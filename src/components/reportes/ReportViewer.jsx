import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, FormControl, InputLabel, MenuItem, Select, Button, Box, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import jsPDF from 'jspdf';
import movimientosData from '/public/movimientos.json'; // Importamos el archivo JSON


export default function ReportViewer() {
  const [empresa, setEmpresa] = useState('');
  const [sede, setSede] = useState('');
  const [bloque, setBloque] = useState('');
  const [espacio, setEspacio] = useState('');
  const [produccion, setProduccion] = useState('');
  const [almacen, setAlmacen] = useState('');
  const [categoriaProducto, setCategoriaProducto] = useState('');
  const [movimiento, setMovimiento] = useState(''); // Movimiento seleccionado
  const [producto, setProducto] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [formatoReporte, setFormatoReporte] = useState('PDF'); // Estado para el formato del reporte
  const [openDialog, setOpenDialog] = useState(false); // Estado para abrir/cerrar el modal

  const [empresas, setEmpresas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [producciones, setProducciones] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [categoriasProducto, setCategoriasProducto] = useState([]);
  const [productos, setProductos] = useState([]);
  const [tiposMovimientos, setTiposMovimientos] = useState([]); // Tipos de movimiento

  useEffect(() => {
    axios.get('/empresa2.json').then(response => setEmpresas(response.data));
  }, []);

  const handleEmpresaChange = (event) => {
    const empresaId = event.target.value;
    setEmpresa(empresaId);
    setSede('');
    setBloque('');
    setEspacio('');
    setProduccion('');
    setAlmacen('');
    setCategoriaProducto('');
    setProducto('');

    axios.get('/sede2.json').then(response => {
      const sedesFiltradas = response.data.filter(sede => sede.sed_empresa_id === empresaId);
      setSedes(sedesFiltradas);
    });

    const empresaSeleccionada = movimientosData.empresas.find(emp => emp.nombre_empresa === (empresaId === 'A' ? 'Empresa A' : 'Empresa B'));
    if (empresaSeleccionada) {
      setTiposMovimientos(empresaSeleccionada.tipos_movimiento);
    }
  };

  const handleMovimientoChange = (event) => {
    setMovimiento(event.target.value);
  };

  const handleFechaInicioChange = (event) => {
    setFechaInicio(event.target.value);
  };

  const handleFechaFinChange = (event) => {
    setFechaFin(event.target.value);
  };

  const handleSedeChange = (event) => {
    const sedeId = event.target.value;
    setSede(sedeId);
    setBloque('');
    setEspacio('');
    setProduccion('');
    setAlmacen('');
    setCategoriaProducto('');
    setProducto('');

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
    setCategoriaProducto('');
    setProducto('');

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
    setCategoriaProducto('');
    setProducto('');

    axios.get('/produccion2.json').then(response => {
      const produccionesFiltradas = response.data.filter(produccion => produccion.pro_espacio_id === espacioId);
      setProducciones(produccionesFiltradas);
    });
  };

  const handleProduccionChange = (event) => {
    const produccionId = event.target.value;
    setProduccion(produccionId);
    setAlmacen('');
    setCategoriaProducto('');
    setProducto('');

    axios.get('/almacen2.json').then(response => {
      const almacenesFiltrados = response.data.filter(almacen => almacen.produccion_id === produccionId);
      setAlmacenes(almacenesFiltrados);
    });
  };

  const handleAlmacenChange = (event) => {
    const almacenId = event.target.value;
    setAlmacen(almacenId);
    setCategoriaProducto('');
    setProducto('');

    axios.get('/producto_categoria2.json').then(response => {
      const categoriasFiltradas = response.data.filter(categoria => categoria.almacen_id === almacenId);
      setCategoriasProducto(categoriasFiltradas);
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

  const generarReportePDF = () => {
    const doc = new jsPDF();
  
    // Título
    doc.setFontSize(20);
    doc.text('Reporte Detallado', 20, 20);
  
    // Información General
    doc.setFontSize(12);
    doc.text(`Empresa ID: ${empresa}`, 20, 30);
    doc.text(`Sede ID: ${sede}`, 20, 40);
    doc.text(`Bloque ID: ${bloque}`, 20, 50);
    doc.text(`Espacio ID: ${espacio}`, 20, 60);
    doc.text(`Movimiento: ${movimiento}`, 20, 70);
    doc.text(`Producción ID: ${produccion}`, 20, 80);
    doc.text(`Almacén ID: ${almacen}`, 20, 90);
    doc.text(`Categoría ID: ${categoriaProducto}`, 20, 100);
    doc.text(`Producto ID: ${producto}`, 20, 110);
    doc.text(`Fecha Inicio: ${fechaInicio}`, 20, 120);
    doc.text(`Fecha Fin: ${fechaFin}`, 20, 130);
  
    // Línea divisoria
    doc.line(20, 135, 190, 135);
  
    // Detalles de Movimientos
    doc.setFontSize(16);
    doc.text('Detalles de Movimientos:', 20, 145);
  
    doc.setFontSize(12);
    let yPosition = 155; // Posición inicial en el eje Y
    const detallesMovimientos = tiposMovimientos.find(mov => mov.tipo_movimiento === movimiento)?.detalles_movimientos;
  
    if (detallesMovimientos && detallesMovimientos.length > 0) {
      detallesMovimientos.forEach((detalle, index) => {
        // Dividir el texto largo en varias líneas
        const textoDetalle = `Hora: ${detalle.hora}, Almacén ID: ${detalle.kar_almacen_id}, Producción ID: ${detalle.kar_produccion_id}, Producto: ${detalle.pro_nombre}, Cantidad: ${detalle.cantidad}, Entrada: ${detalle.entrada}, Salida: ${detalle.salida}, Saldo: ${detalle.saldo}`;
        const lineas = doc.splitTextToSize(textoDetalle, 170); // Ajusta el ancho del texto a la página
  
        // Añadir cada línea y ajustar la posición Y
        lineas.forEach((linea) => {
          doc.text(linea, 20, yPosition);
          yPosition += 10;
        });
  
        // Crear una nueva página si se supera el límite de la página
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20; // Reiniciar la posición en la nueva página
        }
      });
    } else {
      doc.text('No hay detalles de movimientos disponibles.', 20, yPosition);
    }
  
    // Descargar el PDF
    doc.save('reporte_detallado.pdf');
  };
  

  // Función para generar el CSV
  const generarReporteCSV = () => {
    const headers = ['Empresa', 'Sede', 'Bloque', 'Espacio', 'Movimiento', 'Producción', 'Almacén', 'Categoría de Producto', 'Producto', 'Fecha Inicio', 'Fecha Fin'];
    const data = [
      [empresa, sede, bloque, espacio, movimiento, produccion, almacen, categoriaProducto, producto, fechaInicio, fechaFin]
    ];

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\n';
    data.forEach(row => {
      csvContent += row.join(',') + '\n';
    });

    // Detalles de movimientos
    const detallesMovimientos = tiposMovimientos.find(mov => mov.tipo_movimiento === movimiento)?.detalles_movimientos;
    if (detallesMovimientos) {
      csvContent += 'Detalles de Movimientos\n';
      csvContent += 'Hora,Almacen ID,Producción ID,Producto,Cantidad,Entrada,Salida,Saldo\n';
      detallesMovimientos.forEach(detalle => {
        csvContent += [
          detalle.hora,
          detalle.kar_almacen_id,
          detalle.kar_produccion_id,
          detalle.pro_nombre,
          detalle.cantidad,
          detalle.entrada,
          detalle.salida,
          detalle.saldo
        ].join(',') + '\n';
      });
    }

    // Totales de productos
    const totalesProductos = tiposMovimientos.find(mov => mov.tipo_movimiento === movimiento)?.totales_productos;
    if (totalesProductos) {
      csvContent += 'Totales de Productos\n';
      csvContent += 'Producto,Entrada,Salida,Saldo\n';
      totalesProductos.forEach(total => {
        csvContent += [
          total.pro_nombre,
          total.entrada,
          total.salida,
          total.saldo
        ].join(',') + '\n';
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'reporte_detallado.csv');
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  };

  // Función para manejar la apertura de la ventana modal
  const handleGenerarReporte = () => {
    setOpenDialog(true);
  };

  // Función para cerrar el modal
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Función para generar el informe después de seleccionar el formato
  const handleFormatoSeleccionado = () => {
    if (formatoReporte === 'PDF') {
      generarReportePDF();
    } else if (formatoReporte === 'CSV') {
      generarReporteCSV();
    }
    setOpenDialog(false); // Cerrar el modal después de generar el informe
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filtrar por:
            </Typography>
            <Grid container spacing={2}>
              {/* Fecha Inicio */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    id="fecha_inicio"
                    label="Fecha Inicio"
                    type="date"
                    value={fechaInicio}
                    onChange={handleFechaInicioChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
              </Grid>
              {/* Fecha Fin */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    id="fecha_fin"
                    label="Fecha Fin"
                    type="date"
                    value={fechaFin}
                    onChange={handleFechaFinChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
              </Grid>

              {/* Empresa */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Empresa</InputLabel>
                  <Select value={empresa || ''} onChange={handleEmpresaChange}>
                    {empresas.map((empresa) => (
                      <MenuItem key={empresa.emp_id} value={empresa.emp_id}>
                        {empresa.emp_nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Sede */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth sx={{ mb: 2 }} disabled={!empresa}>
                  <InputLabel>Sede</InputLabel>
                  <Select value={sede || ''} onChange={handleSedeChange}>
                    {sedes.map((sede) => (
                      <MenuItem key={sede.sed_id} value={sede.sed_id}>
                        {sede.sed_nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Bloque */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth sx={{ mb: 2 }} disabled={!sede}>
                  <InputLabel>Bloque</InputLabel>
                  <Select value={bloque || ''} onChange={handleBloqueChange}>
                    {bloques.map((bloque) => (
                      <MenuItem key={bloque.blo_id} value={bloque.blo_id}>
                        {bloque.blo_nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Espacio */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth sx={{ mb: 2 }} disabled={!bloque}>
                  <InputLabel>Espacio</InputLabel>
                  <Select value={espacio || ''} onChange={handleEspacioChange}>
                    {espacios.map((espacio) => (
                      <MenuItem key={espacio.esp_id} value={espacio.esp_id}>
                        {espacio.esp_nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Producción */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth sx={{ mb: 2 }} disabled={!espacio}>
                  <InputLabel>Producción</InputLabel>
                  <Select value={produccion || ''} onChange={handleProduccionChange}>
                    {producciones.map((produccion) => (
                      <MenuItem key={produccion.pro_id} value={produccion.pro_id}>
                        {produccion.pro_nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Almacén */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth sx={{ mb: 2 }} disabled={!produccion}>
                  <InputLabel>Almacén</InputLabel>
                  <Select value={almacen || ''} onChange={handleAlmacenChange}>
                    {almacenes.map((almacen) => (
                      <MenuItem key={almacen.alm_id} value={almacen.alm_id}>
                        {almacen.alm_nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Categoría de Producto */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth sx={{ mb: 2 }} disabled={!almacen}>
                  <InputLabel>Categoría de Producto</InputLabel>
                  <Select value={categoriaProducto || ''} onChange={handleCategoriaProductoChange}>
                    {categoriasProducto.map((categoria) => (
                      <MenuItem key={categoria.prc_id} value={categoria.prc_id}>
                        {categoria.prc_nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Producto */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth sx={{ mb: 2 }} disabled={!categoriaProducto}>
                  <InputLabel>Producto</InputLabel>
                  <Select value={producto || ''} onChange={(e) => setProducto(e.target.value)}>
                    {productos.map((producto) => (
                      <MenuItem key={producto.pro_id} value={producto.pro_id}>
                        {producto.pro_nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Movimiento */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth sx={{ mb: 2 }} disabled={!producto}>
                  <InputLabel>Movimiento</InputLabel>
                  <Select value={movimiento || ''} onChange={handleMovimientoChange}>
                    {tiposMovimientos.map((mov, index) => (
                      <MenuItem key={index} value={mov.tipo_movimiento}>
                        {mov.descripcion}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleGenerarReporte} sx={{ mt: 2 }}>
            Generar Informe
          </Button>
        </Grid>
      </Grid>

      {/* Modal para seleccionar el formato del informe */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Seleccione el formato del informe</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Formato del Informe</InputLabel>
            <Select value={formatoReporte} onChange={(e) => setFormatoReporte(e.target.value)}>
              <MenuItem value="PDF">PDF</MenuItem>
              <MenuItem value="CSV">CSV</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleFormatoSeleccionado} variant="contained">Generar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
