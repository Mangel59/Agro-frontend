import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoSedes from "./FormTipoSede";
import GridTipoSedes from "./GridTipoSede";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

export default function TipoSedes() {
  const initialRow = { id: null, nombre: "", descripcion: "", estado: 1 };

  const [tipoSedes, setTipoSedes] = useState([]);
  const [selectedRow, setSelectedRow] = useState(initialRow);
  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });

  const fetchData = async () => {
    try {
      const response = await axios.get(`${SiteProps.urlbasev1}/tipo_sede`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTipoSedes(response.data || []);
      setMessage({ open: false }); // Limpiar mensajes previos
    } catch (error) {
      console.error("Error al cargar tipo_sedes:", error);
      setMessage({
        open: true,
        severity: "error",
        text: "Error al cargar los datos. Intente nuevamente.",
      });
    }
  };

  const deleteTipoSedes = async (id) => {
    try {
      await axios.delete(`${SiteProps.urlbasev1}/tipo_sede/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTipoSedes((prevData) => prevData.filter((item) => item.id !== id));
      setMessage({
        open: true,
        severity: "success",
        text: "Tipo de Sedes eliminado con éxito.",
      });
    } catch (error) {
      console.error("Error al eliminar tipo_sede:", error);
      setMessage({
        open: true,
        severity: "error",
        text: "Error al eliminar los datos. Intente nuevamente.",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormTipoSedes
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={fetchData} // Recarga en tiempo real
        setMessage={setMessage}
      />
      <GridTipoSedes
        tipoSedes={tipoSedes} // Pasa la lista actualizada
        setSelectedRow={setSelectedRow}
        deleteTipoSedes={deleteTipoSedes} // Conexión para eliminar
      />
    </Box>
  );
}
