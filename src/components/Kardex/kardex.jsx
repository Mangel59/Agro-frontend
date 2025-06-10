import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormKardex from "./FromKardex.jsx";
import GridKardex from "./GridKardex";
import {
  Box, Typography, Button
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Kardex() {
  const [kardexes, setKardexes] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });

  const reloadData = () => {
    axios.get("/v1/kardex")
      .then((res) => {
        const datos = res.data.map(item => ({
          ...item,
          estadoId: item.estado?.id || item.estadoId,
          almacenId: item.almacen?.id || item.almacenId,
        }));
        setKardexes(datos);
      })
      .catch((err) => {
        console.error("Error al cargar kardexes:", err);
        setMessage({ open: true, severity: "error", text: "Error al cargar kardexes" });
      });
  };

  const handleDelete = () => {
    if (!selectedRow) return;
    axios.delete(`/v1/kardex/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Kardex eliminado correctamente" });
        reloadData();
        setSelectedRow(null);
      })
      .catch((err) => {
        console.error("Error al eliminar kardex:", err);
        setMessage({ open: true, severity: "error", text: "Error al eliminar kardex" });
      });
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom> Kardex </Typography>

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

      <GridKardex
        kardexes={kardexes}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />

      <FormKardex
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
