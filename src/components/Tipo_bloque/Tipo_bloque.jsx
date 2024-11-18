import React, { useEffect, useState } from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import GridTipoBloque from './GridTipoBloque';
import FormTipoBloque from './FormTipoBloque';
import { Box } from '@mui/material';
import { SiteProps } from "../dashboard/SiteProps";

export default function TipoBloque() {
  const initialRow = {
    id: null,
    nombre: "",
    descripcion: "",
    estado: 1,
  };

  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });
  const [tipoBloques, setTipoBloques] = useState([]);
  const [selectedRow, setSelectedRow] = useState(initialRow);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${SiteProps.urlbasev1}/tipo_bloque`);
      console.log("Datos recibidos de tipo_bloque:", response.data);
      
      const data = response.data.content;
      if (Array.isArray(data)) {
        setTipoBloques(data);
      } else {
        console.error("Formato inesperado de respuesta:", response.data);
        setMessage({ open: true, severity: "error", text: "Formato de datos inesperado del servidor" });
      }
    } catch (error) {
      console.error("Error al cargar los datos de tipo_bloque:", error);
      setMessage({ open: true, severity: "error", text: "Error al cargar los datos de tipo_bloque!" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addTipoBloque = (newData) => {
    const newTipoBloque = { ...newData, id: Date.now() };
    setTipoBloques((prevData) => [...prevData, newTipoBloque]);
    setMessage({ open: true, severity: "success", text: "Tipo de Bloque creado con éxito!" });
    setSelectedRow(initialRow);
    fetchData();
  };

  const updateTipoBloque = (updatedData) => {
    setTipoBloques((prevData) =>
      prevData.map((item) => (item.id === updatedData.id ? updatedData : item))
    );
    setMessage({ open: true, severity: "success", text: "Tipo de Bloque actualizado con éxito!" });
    setSelectedRow(initialRow);
    fetchData();
  };

  const deleteTipoBloque = (id) => {
    setTipoBloques((prevData) => prevData.filter((item) => item.id !== id));
    setMessage({ open: true, severity: "success", text: "Tipo de Bloque eliminado con éxito!" });
    fetchData();
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormTipoBloque
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        addTipoBloque={addTipoBloque}
        updateTipoBloque={updateTipoBloque}
        reloadData={fetchData} // Pasa fetchData como reloadData
      />
      <GridTipoBloque
        bloques={tipoBloques}
        setSelectedRow={setSelectedRow}
        deleteTipoBloque={deleteTipoBloque}
      />
    </Box>
  );
}
