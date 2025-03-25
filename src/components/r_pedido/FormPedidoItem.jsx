/**
 * @file FormPedidoItem.jsx
 * @module FormPedidoItem
 * @description Componente de formulario para agregar un ítem a un pedido. Incluye selección de producto, cantidad y validación de campos. Usa Axios para comunicarse con el backend.
 * @author Karla
 */

import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Autocomplete } from "@mui/material";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente FormPedidoItem.
 *
 * Permite agregar un ítem (producto y cantidad) a un pedido existente.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string|number} props.pedidoId - ID del pedido al que se agregará el ítem.
 * @param {Function} props.fetchPedidoItems - Función para recargar los ítems del pedido.
 * @param {boolean} props.disabled - Si está activado, desactiva la posibilidad de agregar ítems.
 *
 * @returns {JSX.Element} Formulario para añadir ítems al pedido.
 */
export default function FormPedidoItem({ pedidoId, fetchPedidoItems, disabled }) {
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);

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
  }, [pedidoId]);

  const handleSaveItem = async () => {
    if (!pedidoId || !selectedProducto || !cantidad) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${SiteProps.urlbasev1}/pedido_item`,
        {
          pedido: pedidoId,
          productoPresentacion: selectedProducto.id,
          cantidad: cantidad,
          estado: 1,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Ítem agregado correctamente.");
      fetchPedidoItems(); // Actualizar lista de ítems
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
      <h3>Añadir Ítem al Pedido {pedidoId}</h3>
      {disabled ? (
        <p style={{ color: "red" }}>
          Este pedido ya tiene un ítem asociado. No puedes agregar más.
        </p>
      ) : (
        <>
          <Autocomplete
            options={productos}
            getOptionLabel={(option) => `${option.id} - ${option.nombre}`}
            value={selectedProducto}
            onChange={(event, value) => setSelectedProducto(value)}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => (
              <TextField {...params} label="Producto" margin="normal" required />
            )}
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

          <Button variant="contained" color="primary" onClick={handleSaveItem} fullWidth>
            Guardar Ítem
          </Button>
        </>
      )}
    </Box>
  );
}
