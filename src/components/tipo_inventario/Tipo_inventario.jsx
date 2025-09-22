import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoInventario from "./FormTipoInventario";
import GridTipoInventario from "./GridTipoInventario";
import { Box, Typography, Button, Tooltip, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TipoInventario() {
  // -------------------- Estado --------------------
  const [selectedRow, setSelectedRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [tiposInventario, setTiposInventario] = useState([]);

  // -------------------- Auth / helpers --------------------
  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };
  const unwrapPage = (data) => (Array.isArray(data) ? data : data?.content ?? []);

  /**
   * Carga los tipos de inventario desde la API con autenticación.
   */
  const reloadData = () => {
    axios.get("/v1/tipo_inventario", { 
      ...headers, 
      params: { page: 0, size: 1000 } 
    })
      .then((res) => {
        const lista = unwrapPage(res.data);
        setTiposInventario(lista);
        setSelectedRow(null);
      })
      .catch((err) => {
        console.error("❌ Error al cargar tipos de inventario:", err);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar tipos de inventario",
        });
      });
  };

  /**
   * Eliminar tipo de inventario seleccionado tras confirmación.
   */
  const handleDelete = async () => {
    if (!selectedRow) return;
    if (window.confirm(`¿Eliminar el tipo de inventario "${selectedRow.nombre}"?`)) {
      try {
        await axios.delete(`/v1/tipo_inventario/${selectedRow.id}`, headers);
        setMessage({
          open: true,
          severity: "success",
          text: "Tipo de inventario eliminado correctamente.",
        });
        setSelectedRow(null);
        reloadData();
      } catch (err) {
        setMessage({
          open: true,
          severity: "error",
          text: "Error al eliminar tipo de inventario.",
        });
      }
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h5">Gestión de Tipo de Inventario</Typography>
      </Stack>

      {/* Botones acción CRUD */}
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Tooltip title="Crear">
          <Button
            variant="contained"
            onClick={() => { setFormMode("create"); setSelectedRow(null); setFormOpen(true); }}
            startIcon={<AddIcon />}
          >
            Agregar
          </Button>
        </Tooltip>

        <Tooltip title="Editar">
          <Button
            variant="outlined"
            onClick={() => { setFormMode("edit"); setFormOpen(true); }}
            disabled={!selectedRow}
            startIcon={<EditIcon />}
          >
            Actualizar
          </Button>
        </Tooltip>

        <Tooltip title="Eliminar">
          <Button
            variant="outlined"
            color="error"
            onClick={handleDelete}
            disabled={!selectedRow}
            startIcon={<DeleteIcon />}
          >
            Eliminar
          </Button>
        </Tooltip>
      </Box>

      <GridTipoInventario tiposInventario={tiposInventario} setSelectedRow={setSelectedRow} />

      <FormTipoInventario
        open={formOpen}
        setOpen={setFormOpen}
        formMode={formMode}
        selectedRow={selectedRow}
        reloadData={reloadData}
        setMessage={setMessage}
        authHeaders={headers}
      />

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
