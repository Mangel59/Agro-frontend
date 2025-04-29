import * as React from "react";
import axios from "../axiosConfig";

import { Box } from "@mui/material";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoEvaluacion from "./FormTipoEvaluacion";
import GridTipoEvaluacion from "./GridTipoEvaluacion";

export default function TipoEvaluacion() {
  const [tipoEvaluaciones, setTipoEvaluaciones] = React.useState([]);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [message, setMessage] = React.useState({ open: false, severity: "info", text: "" });

  const reloadData = () => {
    console.log("Reloading data in TipoEvaluacion.jsx");
    axios.get('/api/v1/tipo_evaluacion/all')
      .then((response) => {
        setTipoEvaluaciones(response.data);
      })
      .catch((error) => {
        console.error("Error al buscar tipo de evaluación:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar la lista de tipos de evaluación.",
        });
      });
  };

  const handleAdd = (nuevo) => {
    const payload = {
      nombre: nuevo.tie_nombre,
      estadoId: parseInt(nuevo.tie_estado),
    };
    axios.post('/api/v1/tipo_evaluacion', payload)
      .then(() => {
        reloadData();
        setMessage({ open: true, severity: "success", text: "Agregado exitosamente." });
      })
      .catch((error) => {
        console.error("Error al agregar:", error);
        setMessage({ open: true, severity: "error", text: "No se pudo agregar." });
      });
  };

  const handleUpdate = (actualizado) => {
    const payload = {
      id: actualizado.tie_id,
      nombre: actualizado.tie_nombre,
      estadoId: parseInt(actualizado.tie_estado),
    };
    axios.put(`/api/v1/tipo_evaluacion/${actualizado.tie_id}`, payload)
      .then(() => {
        reloadData();
        setMessage({ open: true, severity: "success", text: "Actualizado exitosamente." });
      })
      .catch((error) => {
        console.error("Error al actualizar:", error);
        setMessage({ open: true, severity: "error", text: "No se pudo actualizar." });
      });
  };

  const handleDelete = (id) => {
    axios.delete(`/api/v1/tipo_evaluacion/${id}`)
      .then(() => {
        reloadData();
        setMessage({ open: true, severity: "success", text: "Eliminado exitosamente." });
      })
      .catch((error) => {
        console.error("Error al eliminar:", error);
        setMessage({ open: true, severity: "error", text: "No se pudo eliminar." });
      });
  };

  React.useEffect(() => {
    reloadData();
  }, []);

  const mappedData = tipoEvaluaciones.map((item) => ({
    tie_id: item.id,
    tie_nombre: item.nombre,
    tie_estado: item.estadoId,
  }));

  return (
    <Box sx={{ padding: "2rem" }}>
      <h1>Tipos de Evaluación</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormTipoEvaluacion
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
      <GridTipoEvaluacion tipoEvaluaciones={mappedData} onEdit={setSelectedRow} />
    </Box>
  );
}
