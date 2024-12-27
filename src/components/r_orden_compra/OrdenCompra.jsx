import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, TextField, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { SiteProps } from "../SiteProps";

export default function OrdenCompra() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [unidad, setUnidad] = useState("");
  const [ordenItems, setOrdenItems] = useState([]);
  const [error, setError] = useState("");

  // Cargar productos desde el backend
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/productos`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        // Asegurar que cada producto tenga un `id`
        const productosConId = response.data.data.map((producto, index) => ({
          ...producto,
          id: producto.id || index, // Usa `id` o genera uno único
        }));
        setProductos(productosConId || []);
      } catch (error) {
        setError("Error al cargar productos.");
      }
    };
    fetchProductos();
  }, []);

  // Agregar un producto a la orden de compra
  const agregarProducto = () => {
    if (!productoSeleccionado || !cantidad || !precio || !unidad) {
      setError("Completa todos los campos.");
      return;
    }
    const nuevoItem = {
      id: ordenItems.length + 1, // Generar un ID único
      producto: productoSeleccionado,
      cantidad,
      precio,
      unidad,
    };
    setOrdenItems([...ordenItems, nuevoItem]);
    setProductoSeleccionado("");
    setCantidad("");
    setPrecio("");
    setUnidad("");
  };

  // Eliminar un producto de la orden de compra
  const eliminarProducto = (id) => {
    setOrdenItems(ordenItems.filter((item) => item.id !== id));
  };

  // Configuración de columnas de la grilla
  const columns = [
    { field: "producto", headerName: "Producto", width: 200 },
    { field: "cantidad", headerName: "Cantidad", width: 150 },
    { field: "precio", headerName: "Precio", width: 150 },
    { field: "unidad", headerName: "Unidad", width: 150 },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 150,
      renderCell: (params) => (
        <Button
          color="error"
          onClick={() => eliminarProducto(params.row.id)}
        >
          Eliminar
        </Button>
      ),
    },
  ];

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Formulario para agregar productos */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Producto"
          select
          value={productoSeleccionado}
          onChange={(e) => setProductoSeleccionado(e.target.value)}
          SelectProps={{ native: true }}
        >
          <option value="">Seleccionar</option>
          {productos.map((producto) => (
            <option key={producto.id} value={producto.nombre}>
              {producto.nombre}
            </option>
          ))}
        </TextField>
        <TextField
          label="Cantidad"
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
        <TextField
          label="Precio"
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <TextField
          label="Unidad"
          value={unidad}
          onChange={(e) => setUnidad(e.target.value)}
        />
        <Button variant="contained" onClick={agregarProducto}>
          Agregar
        </Button>
      </Box>

      {/* Grilla para mostrar los productos */}
      <DataGrid
        rows={ordenItems}
        columns={columns}
        pageSize={5}
        autoHeight
        getRowId={(row) => row.id} // Asegurar que se use `id` como clave única
      />

      {/* Botón para ver reporte */}
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          href="/reporte-orden-compra" // Navegación al reporte de orden de compra
        >
          Ver Reporte de Orden de Compra
        </Button>
      </Box>
    </Box>
  );
}
