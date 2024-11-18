import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoSedes from "../Tipo_Sede/FormTipoSede";
import GridTipoSedes from "../Tipo_Sede/GridTipoSede";
import { Box } from '@mui/material';
import { SiteProps } from "../dashboard/SiteProps";

export default function TipoSedes() {
  const initialRow = { id: null, nombre: "", descripcion: "", estado: 1 };

  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });
  const [tipoSedes, setTipoSedes] = useState([]);
  const [selectedRow, setSelectedRow] = useState(initialRow);
  const gridRef = useRef();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${SiteProps.urlbasev1}/tipo_sede`);
      console.log("Datos recibidos de tipo_sede:", response.data);

      const data = response.data.content;
      if (Array.isArray(data)) {
        setTipoSedes(data);
      } else {
        console.error("Formato inesperado de respuesta:", response.data);
        setMessage({ open: true, severity: "error", text: "Formato de datos inesperado del servidor" });
      }
    } catch (error) {
      console.error("Error al cargar los datos de tipo_sede:", error);
      setMessage({ open: true, severity: "error", text: "Error al cargar los datos de tipo_sede!" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addTipoSedes = (newData) => {
    setTipoSedes((prevData) => [...prevData, newData]);
    setMessage({ open: true, severity: "success", text: "Tipo de Sedes creado con éxito!" });
    setSelectedRow(initialRow);
    fetchData();
  };

  const updateTipoSedes = (updatedData) => {
    setTipoSedes((prevData) =>
      prevData.map((item) => (item.id === updatedData.id ? updatedData : item))
    );
    setMessage({ open: true, severity: "success", text: "Tipo de Sedes actualizado con éxito!" });
    setSelectedRow(initialRow);
    fetchData();
  };

  const deleteTipoSedes = (id) => {
    setTipoSedes((prevData) => prevData.filter((item) => item.id !== id));
    setMessage({ open: true, severity: "success", text: "Tipo de Sedes eliminado con éxito!" });
    fetchData();
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormTipoSedes
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={fetchData} // Pasa fetchData como reloadData
        setMessage={setMessage}
      />
      <GridTipoSedes
        ref={gridRef}
        sedes={tipoSedes}
        setSelectedRow={setSelectedRow}
        deleteTipoSedes={deleteTipoSedes}
      />
    </Box>
  );
}
