import React, { useState, useEffect } from "react";
import {
  Box, Button, FormControl, InputLabel,
  MenuItem, Select, TextField, Typography
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar"; // ajusta si cambia la ruta

export default function Rkardex() {
  const [filters, setFilters] = useState({
    producto_id: "",
    movimiento_id: "",
    unidad_id: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });

  const reloadFiltros = async () => {
    const token = localStorage.getItem("token");
    const headers = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const [resProductos, resMovimientos, resUnidades] = await Promise.all([
        axios.get("/v1/producto", headers),
        axios.get("/v1/movimiento", headers),
        axios.get("/v1/unidad", headers),
      ]);

      const obtenerLista = (res) => {
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(res.data?.data)) return res.data.data;
        if (Array.isArray(res.data?.content)) return res.data.content;
        return [];
      };

      const listaProductos = obtenerLista(resProductos).filter(p => p.estadoId === 1);
      const listaMovimientos = obtenerLista(resMovimientos).filter(m => m.estadoId === 1);
      const listaUnidades = obtenerLista(resUnidades).filter(u => u.estadoId === 1);

      console.log("✅ Productos:", listaProductos);
      console.log("✅ Movimientos:", listaMovimientos);
      console.log("✅ Unidades:", listaUnidades);

      setProductos(listaProductos);
      setMovimientos(listaMovimientos);
      setUnidades(listaUnidades);
    } catch (err) {
      console.error("❌ Error al cargar filtros:", err);
      setMessage({
        open: true,
        severity: "error",
        text: "Error al cargar filtros de producto/movimiento/unidad",
      });
    }
  };

  useEffect(() => {
    reloadFiltros();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleBuscar = async () => {
    const formatDate = (value) => {
      if (!value) return "";
      const [date, time] = value.split("T");
      return `${date} ${time.length === 5 ? time + ":00" : time}`;
    };

    const filtros = {
      ...filters,
      fecha_inicio: formatDate(filters.fecha_inicio),
      fecha_fin: formatDate(filters.fecha_fin),
    };

    try {
      const res = await axios.post("/v2/report/kardex", filtros);
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Error al buscar reporte:", err);
      setData([]);
      setMessage({
        open: true,
        severity: "error",
        text: "Error al buscar reporte Kardex",
      });
    }
  };

  const handleImprimir = () => {
    const seleccionados = data.filter(row => selectedRows.includes(row.id));
    console.log("🖨️ Imprimir seleccionados:", seleccionados);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "producto", headerName: "Producto", width: 150, valueGetter: (params) => params.row.producto?.nombre || "" },
    { field: "movimiento", headerName: "Movimiento", width: 150, valueGetter: (params) => params.row.movimiento?.nombre || "" },
    { field: "unidad", headerName: "Unidad", width: 120, valueGetter: (params) => params.row.unidad?.nombre || "" },
    {
      field: "fecha_inicio",
      headerName: "Fecha Inicio",
      width: 180,
      valueGetter: (params) => new Date(params.row.fecha_inicio).toLocaleString(),
    },
    {
      field: "fecha_fin",
      headerName: "Fecha Fin",
      width: 180,
      valueGetter: (params) => new Date(params.row.fecha_fin).toLocaleString(),
    }
  ];

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>Reporte Kardex</Typography>

      <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
        <FormControl fullWidth>
          <InputLabel>Producto</InputLabel>
          <Select name="producto_id" value={filters.producto_id} onChange={handleChange}>
            {productos.map((prod) => (
              <MenuItem key={prod.id} value={prod.id}>{prod.nombre || prod.nombreProducto || `Producto ${prod.id}`}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Movimiento</InputLabel>
          <Select name="movimiento_id" value={filters.movimiento_id} onChange={handleChange}>
            {movimientos.map((mov) => (
              <MenuItem key={mov.id} value={mov.id}>{mov.nombre || mov.nombreMovimiento || `Movimiento ${mov.id}`}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Unidad</InputLabel>
          <Select name="unidad_id" value={filters.unidad_id} onChange={handleChange}>
            {unidades.map((uni) => (
              <MenuItem key={uni.id} value={uni.id}>{uni.nombre || uni.nombreUnidad || `Unidad ${uni.id}`}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Fecha Inicio"
          type="datetime-local"
          name="fecha_inicio"
          value={filters.fecha_inicio}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="Fecha Fin"
          type="datetime-local"
          name="fecha_fin"
          value={filters.fecha_fin}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </Box>

      <Box display="flex" gap={2} mb={2}>
        <Button variant="contained" color="primary" onClick={handleBuscar}>
          Buscar
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleImprimir} disabled={selectedRows.length === 0}>
          Imprimir seleccionados
        </Button>
      </Box>

      <DataGrid
        autoHeight
        rows={data}
        getRowId={(row) => row.id || `${row.producto_id}-${row.fecha_inicio}`}
        columns={columns}
        checkboxSelection
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
        onSelectionModelChange={(newSelection) => {
          setSelectedRows(newSelection);
        }}
      />

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
