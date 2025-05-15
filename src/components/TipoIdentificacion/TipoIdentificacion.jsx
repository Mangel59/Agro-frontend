import React, { useState, useEffect } from "react";
import FormTipoIdentificacion from "./FormTipoIdentificacion";
import GridTipoIdentificacion from "./GridTipoIdentificacion";
import axios from "../axiosConfig";

export default function TipoIdentificacion() {
  const [tiposIdentificacion, setTiposIdentificacion] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const reloadData = () => {
    axios.get("/tipo_identificacion", axiosConfig)
      .then((res) => setTiposIdentificacion(res.data))
      .catch((err) => console.error("Error al cargar tipos de identificación:", err));
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleAdd = (newTipo) => {
    axios.post("/tipo_identificacion", newTipo, axiosConfig)
      .then(() => reloadData())
      .catch((err) => console.error("Error al agregar:", err));
  };

  const handleUpdate = (updatedTipo) => {
    axios.put(`/tipo_identificacion/${updatedTipo.id}`, updatedTipo, axiosConfig)
      .then(() => reloadData())
      .catch((err) => console.error("Error al actualizar:", err));
  };

  const handleDelete = (id) => {
    axios.delete(`/tipo_identificacion/${id}`, axiosConfig)
      .then(() => reloadData())
      .catch((err) => console.error("Error al eliminar:", err));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Gestión de Tipos de Identificación</h1>
      <FormTipoIdentificacion
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
      <GridTipoIdentificacion
        tiposIdentificacion={tiposIdentificacion}
        onEdit={setSelectedRow}
      />
    </div>
  );
}
