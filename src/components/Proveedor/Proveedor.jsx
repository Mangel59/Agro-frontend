import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormProveedor from "./FormProveedor";
import GridProveedor from "./GridProveedor";
import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Proveedor() {
  const [tiposIdentificacion, setTiposIdentificacion] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [message, setMessage] = useState({
    open: false,
    severity: "success",
    text: "",
  });

  const reloadData = () => {
    axios.get("/v1/proveedor")
      .then((res) => {
        const datos = res.data.map(p => ({
          ...p,
          estadoId: p.estado?.id || p.estadoId,
          tipoIdentificacionId: p.tipoIdentificacion?.id || p.tipoIdentificacionId,
        }));
        setProveedores(datos);
      })
      .catch(() => {
        setMessage({ open: true, severity: "error", text: "Error al cargar proveedores" });
      });
  };

  useEffect(() => {
    reloadData();
    axios.get("/v1/tipo_identificacion")
      .then((res) => setTiposIdentificacion(res.data))
      .catch(() =>
        setMessage({ open: true, severity: "error", text: "Error al cargar tipos de identificación" })
      );
  }, []);

  const handleDelete = async () => {
    if (!selectedRow) return;
    if (window.confirm(`¿Eliminar al proveedor "${selectedRow.nombre}"?`)) {
      try {
        await axios.delete(`/v1/proveedor/${selectedRow.id}`);
        setMessage({ open: true, severity: "success", text: "Proveedor eliminado correctamente." });
        setSelectedRow(null);
        reloadData();
      } catch {
        setMessage({ open: true, severity: "error", text: "Error al eliminar proveedor." });
      }
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Gestión de Proveedores
      </Typography>

      {/* Botones de acción alineados a la derecha */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setFormMode("create");
            setFormOpen(true);
            setSelectedRow(null);
          }}
        >
          Agregar
        </Button>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => {
            setFormMode("edit");
            setFormOpen(true);
          }}
          disabled={!selectedRow}
        >
          Actualizar
        </Button>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          disabled={!selectedRow}
        >
          Eliminar
        </Button>
      </Box>

      {/* Formulario de proveedor */}
      <FormProveedor
        open={formOpen}
        setOpen={setFormOpen}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        formMode={formMode}
        setMessage={setMessage}
        reloadData={reloadData}
        tiposIdentificacion={tiposIdentificacion}
      />

      {/* Tabla de proveedores */}
      <GridProveedor
        proveedores={proveedores}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />

      {/* Snackbar de mensajes */}
      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
