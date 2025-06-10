import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormProduccion from "./FormProduccion";
import GridProduccion from "./GridProduccion";
import {
  Box, Typography, Button
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Produccion() {
  const [producciones, setProducciones] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });

  const reloadData = () => {
    axios.get("/v1/produccion")
      .then((res) => {
        const datos = res.data.map(item => ({
          ...item,
          estadoId: item.estado?.id || item.estadoId,
          espacioId: item.espacio?.id || item.espacioId,
        }));
        setProducciones(datos);
      })
      .catch((err) => {
        console.error("Error al cargar producciones:", err);
        setMessage({ open: true, severity: "error", text: "Error al cargar producciones" });
      });
  };

  const handleDelete = () => {
    if (!selectedRow) return;
    axios.delete(`/v1/produccion/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Producción eliminada correctamente" });
        reloadData();
        setSelectedRow(null);
      })
      .catch((err) => {
        console.error("Error al eliminar producción:", err);
        setMessage({ open: true, severity: "error", text: "Error al eliminar producción" });
      });
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom> Produccion</Typography>

      <Box sx={{ mb: 2, display: "flex", gap: 1, justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setFormMode("create");
            setSelectedRow(null);
            setFormOpen(true);
          }}
        >
          Crear
        </Button>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          disabled={!selectedRow}
          onClick={() => {
            setFormMode("edit");
            setFormOpen(true);
          }}
        >
          Editar
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          disabled={!selectedRow}
          onClick={handleDelete}
        >
          Eliminar
        </Button>
      </Box>

      <GridProduccion
        producciones={producciones}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />

      <FormProduccion
        open={formOpen}
        setOpen={setFormOpen}
        reloadData={reloadData}
        selectedRow={selectedRow}
        formMode={formMode}
        setMessage={setMessage}
      />

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
