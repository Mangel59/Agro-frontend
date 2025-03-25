/**
 * @file FormOrdenCompraItem.jsx
 * @module FormOrdenCompraItem
 * @description Componente de formulario para agregar ítems a una orden de compra. Permite seleccionar producto, cantidad y precio. Utiliza Axios para enviar datos al backend y actualizar la lista de ítems. Muestra advertencia si ya existe un ítem en la orden de compra.
 * @author Karla
 */

import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Autocomplete } from "@mui/material";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente FormOrdenCompraItem.
 *
 * @param {Object} props - Props del componente
 * @param {number|string} props.ordenCompraId - ID de la orden de compra a la cual se asociará el ítem
 * @param {Function} props.fetchOrdenCompraItems - Función para recargar la lista de ítems desde la API
 * @param {boolean} props.disabled - Indica si se permite agregar ítems (deshabilitado si ya existe uno)
 * @returns {JSX.Element} Formulario para añadir un ítem a la orden de compra
 */
export default function FormOrdenCompraItem({ ordenCompraId, fetchOrdenCompraItems, disabled }) {
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [precio, setPrecio] = useState(0);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${SiteProps.urlbasev1}/producto-presentacion/minimal`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProductos(response.data.content || []);
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };
    fetchProductos();
  }, [ordenCompraId]);

  const handleSaveItem = async () => {
    if (!ordenCompraId || !selectedProducto || !cantidad || !precio) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${SiteProps.urlbasev1}/orden_compra_item/orden/${ordenCompraId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const items = response.data?.content || [];
      if (items.length > 0) {
        alert("Esta orden de compra ya tiene un ítem asociado. No se pueden agregar más.");
        return;
      }

      await axios.post(
        `${SiteProps.urlbasev1}/orden_compra_item`,
        {
          ordenCompra: ordenCompraId,
          productoPresentacion: selectedProducto.id,
          cantidad: cantidad,
          precio: precio,
          estado: 1,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Ítem agregado correctamente.");
      fetchOrdenCompraItems();
    } catch (error) {
      console.error("Error al guardar el ítem:", error);
      alert("Hubo un problema al guardar el ítem.");
    }
  };

  return (
    <Box
      p={2}
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginTop: "20px",
        width: "100%",
        maxWidth: { xs: "100%", sm: "600px", md: "800px", lg: "1200px" },
        margin: "20px auto",
      }}
    >
      <h3>Añadir Ítem a la Orden de Compra {ordenCompraId}</h3>
      {disabled ? (
        <p style={{ color: "red" }}>
          Esta orden de compra ya tiene un ítem asociado. No puedes agregar más.
        </p>
      ) : (
        <>
          <Autocomplete
            options={productos}
            getOptionLabel={(option) => `${option.id} - ${option.nombre}`}
            value={selectedProducto}
            onChange={(event, value) => setSelectedProducto(value)}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => <TextField {...params} label="Producto" margin="normal" required />}
            fullWidth
          />

          <TextField
            label="Cantidad"
            type="number"
            margin="normal"
            fullWidth
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />

          <TextField
            label="Precio"
            type="number"
            margin="normal"
            fullWidth
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />

          <Button variant="contained" color="primary" onClick={handleSaveItem} fullWidth>
            Guardar Ítem
          </Button>
        </>
      )}
    </Box>
  );
}
