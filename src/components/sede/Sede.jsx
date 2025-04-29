import * as React from "react";
import axios from "../axiosConfig";

import { Box } from "@mui/material";
import MessageSnackBar from "../MessageSnackBar";
import FormSede from "./FormSede";
import GridSede from "./GridSede";

/**
 * Componente principal para gestionar las sedes.
 * @component
 * @returns {JSX.Element}
 */
export default function Sede() {
  const [sedes, setSedes] = React.useState([]);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [message, setMessage] = React.useState({ open: false, severity: "info", text: "" });

  const reloadData = () => {
    const token = localStorage.getItem("token");
    if (!token || token.trim() === "") {
      setMessage({
        open: true,
        severity: "warning",
        text: "No hay token válido. Por favor inicie sesión.",
      });
      return;
    }

    axios.get('/api/v1/sede/all', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        setSedes(response.data || []);
      })
      .catch((error) => {
        console.error("Error al buscar sedes:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar la lista de sedes.",
        });
      });
  };

  const handleAdd = (nuevaSede) => {
    const token = localStorage.getItem("token");
    if (!token || token.trim() === "") return;

    axios.post('/api/v1/sede', nuevaSede, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        reloadData();
        setMessage({ open: true, severity: "success", text: "Sede agregada exitosamente." });
      })
      .catch((error) => {
        console.error("Error al agregar sede:", error);
        setMessage({ open: true, severity: "error", text: "No se pudo agregar la sede." });
      });
  };

  const handleUpdate = (sedeActualizada) => {
    const token = localStorage.getItem("token");
    if (!token || token.trim() === "") return;

    axios.put(`/api/v1/sede/${sedeActualizada.id}`, sedeActualizada, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        reloadData();
        setMessage({ open: true, severity: "success", text: "Sede actualizada exitosamente." });
      })
      .catch((error) => {
        console.error("Error al actualizar sede:", error);
        setMessage({ open: true, severity: "error", text: "No se pudo actualizar la sede." });
      });
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    if (!token || token.trim() === "") return;

    axios.delete(`/api/v1/sede/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        reloadData();
        setMessage({ open: true, severity: "success", text: "Sede eliminada exitosamente." });
      })
      .catch((error) => {
        console.error("Error al eliminar sede:", error);
        setMessage({ open: true, severity: "error", text: "No se pudo eliminar la sede." });
      });
  };

  React.useEffect(() => {
    reloadData();
  }, []);

  const mappedData = sedes.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    grupoId: item.grupoId,
    tipoSedeId: item.tipoSedeId,
    empresaId: item.empresaId,
    municipioId: item.municipioId,
    comuna: item.comuna,
    area: item.area,
    descripcion: item.descripcion,
    estadoId: item.estadoId,
    geolocalizacion: item.geolocalizacion,
    coordenadas: item.coordenadas,
    direccion: item.direccion,
  }));
  

  return (
    <Box sx={{ padding: "2rem" }}>
      <h1>Sedes</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormSede
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage} // ✅ Ahora FormSede recibe también setMessage
        reloadData={reloadData} // ✅ Y reloadData si FormSede lo necesita
      />
      <GridSede
        sedes={mappedData}
        onEdit={setSelectedRow}
      />
    </Box>
  );
}
