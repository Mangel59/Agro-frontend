import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoEspacio from "../Tipo_Espacio/FormTipo_Espacio";
import GridTipoEspacio from "../Tipo_Espacio/GridTipo_Espacio";
import { Box } from '@mui/material';
import { SiteProps } from "../dashboard/SiteProps";

export default function TipoEspacio() {
  const initialRow = { id: null, nombre: "", descripcion: "", estado: 1 };

  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });
  const [tipoSedes, setTipoEspacio] = useState([]);
  const [selectedRow, setSelectedRow] = useState(initialRow);
  const gridRef = useRef();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${SiteProps.urlbasev1}/tipo_espacio`);
      console.log("Datos recibidos de tipo_espacio:", response.data);

      const data = response.data.content;
      if (Array.isArray(data)) {
        setTipoEspacio(data);
      } else {
        console.error("Formato inesperado de respuesta:", response.data);
        setMessage({ open: true, severity: "error", text: "Formato de datos inesperado del servidor" });
      }
    } catch (error) {
      console.error("Error al cargar los datos de tipo_espacio:", error);
      setMessage({ open: true, severity: "error", text: "Error al cargar los datos de tipo_espacio!" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addTipoEspacio = (newData) => {
    setTipoEspacio((prevData) => [...prevData, newData]);
    setMessage({ open: true, severity: "success", text: "Tipo de Sedes creado con éxito!" });
    setSelectedRow(initialRow);
    fetchData();
  };

  const updateTipoEspacio = (updatedData) => {
    setTipoEspacio((prevData) =>
      prevData.map((item) => (item.id === updatedData.id ? updatedData : item))
    );
    setMessage({ open: true, severity: "success", text: "Tipo de Sedes actualizado con éxito!" });
    setSelectedRow(initialRow);
    fetchData();
  };

  const deleteTipoEspacio = (id) => {
    setTipoEspacio((prevData) => prevData.filter((item) => item.id !== id));
    setMessage({ open: true, severity: "success", text: "Tipo de Sedes eliminado con éxito!" });
    fetchData();
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormTipoEspacio
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={fetchData} // Pasa fetchData como reloadData
        setMessage={setMessage}
      />
      <GridTipoEspacio
        ref={gridRef}
        espacios={tipoSedes}
        setSelectedRow={setSelectedRow}
        deleteTipoEspacio={deleteTipoEspacio}
      />
    </Box>
  );
}
