/**
 * @file FormKardexNuevo.jsx
 * @module FormKardexNuevo
 * @description Componente principal para crear una entrada en el Kardex y gestionar sus items relacionados.
 * @author Karla
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { SiteProps } from "../dashboard/SiteProps";
import GridKardexNuevo from "./GridKardexNuevo";

/**
 * Componente principal para la creación de registros Kardex.
 *
 * @param {Object} props - Props del componente.
 * @param {Function} props.setMessage - Función para mostrar mensajes de éxito o error.
 * @returns {JSX.Element} El componente renderizado.
 */
export default function FormKardexNuevo(props) {
  const [sedes, setSedes] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [producciones, setProducciones] = useState([]);
  const [tipoMovimientos, setTipoMovimientos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [kardexItems, setKardexItems] = useState([]);
  const [formData, setFormData] = useState({
    sedeId: "",
    almacenID: "",
    bloqueID: "",
    espacioID: "",
    produccionID: "",
    tipoMovimientoID: "",
    descripcion: "",
    estado: "",
    fechaHora: new Date().toISOString().substring(0, 16),
  });

  /**
   * Maneja los cambios en los inputs del formulario.
   * @param {Object} e - Evento del input.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  /**
   * Agrega un nuevo item a la lista de items del Kardex.
   * @param {Object} item - Item a agregar.
   */
  const handleAddItem = (item) => {
    setKardexItems((prevItems) => [...prevItems, item]);
  };

  /**
   * Actualiza un item existente en la lista del Kardex.
   * @param {Object} item - Item a actualizar.
   */
  const handleUpdateItem = (item) => {
    setKardexItems((prevItems) =>
      prevItems.map((i) => (i.id === item.id ? item : i))
    );
  };

  /**
   * Elimina un item de la lista de items del Kardex.
   * @param {number} id - ID del item a eliminar.
   */
  const handleDeleteItem = (id) => {
    setKardexItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  /**
   * Valida que todos los campos obligatorios del formulario estén completos.
   * @returns {boolean} True si el formulario es válido, false en caso contrario.
   */
  const validateFormData = () => {
    const requiredFields = [
      "sedeId",
      "almacenID",
      "bloqueID",
      "espacioID",
      "produccionID",
      "tipoMovimientoID",
      "descripcion",
      "estado",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        props.setMessage({
          open: true,
          severity: "error",
          text: `El campo ${field} es obligatorio.`,
        });
        return false;
      }
    }
    return true;
  };

  /**
   * Transforma los datos del formulario en el formato esperado por el backend.
   * @returns {Object} Datos transformados para enviar.
   */
  const transformFormData = () => {
    const payload = {
      fechaHora: formData.fechaHora,
      almacen: parseInt(formData.almacenID, 10),
      produccion: parseInt(formData.produccionID, 10),
      tipoMovimiento: parseInt(formData.tipoMovimientoID, 10),
      descripcion: formData.descripcion,
      estado: parseInt(formData.estado, 10),
    };

    console.log("Payload transformado:", payload);
    return payload;
  };

  /**
   * Maneja el envío del formulario.
   * @param {Object} e - Evento submit del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFormData()) return;

    const payload = transformFormData();
    console.log("Payload enviado al backend:", payload);

    try {
      const response = await axios.post(`${SiteProps.urlbasev1}/kardex`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Respuesta del backend:", response.data);
      props.setMessage({
        open: true,
        severity: "success",
        text: "Kardex guardado con éxito",
      });
    } catch (error) {
      console.error("Error al guardar kardex:", error.response?.data || error.message);
      props.setMessage({
        open: true,
        severity: "error",
        text: `Error al guardar kardex: ${
          error.response?.data?.message || "Error desconocido"
        }`,
      });
    }
  };

  // ---- Fetch de opciones con useEffect ----

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/sede`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSedes(response.data || []);
      } catch (error) {
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al obtener sedes",
        });
      }
    };
    fetchSedes();
  }, []);

  useEffect(() => {
    if (formData.sedeId) {
      const fetchAlmacenes = async () => {
        try {
          const response = await axios.get(
            `${SiteProps.urlbasev1}/almacen/minimal/sede/${formData.sedeId}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          setAlmacenes(response.data || []);
        } catch (error) {
          props.setMessage({
            open: true,
            severity: "error",
            text: "Error al obtener almacenes",
          });
        }
      };
      fetchAlmacenes();
    } else {
      setAlmacenes([]);
    }
  }, [formData.sedeId]);

  useEffect(() => {
    if (formData.sedeId) {
      const fetchBloques = async () => {
        try {
          const response = await axios.get(
            `${SiteProps.urlbasev1}/bloque/minimal/sede/${formData.sedeId}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          setBloques(response.data || []);
        } catch (error) {
          props.setMessage({
            open: true,
            severity: "error",
            text: "Error al obtener bloques",
          });
        }
      };
      fetchBloques();
    } else {
      setBloques([]);
    }
  }, [formData.sedeId]);

  useEffect(() => {
    if (formData.bloqueID) {
      const fetchEspacios = async () => {
        try {
          const response = await axios.get(
            `${SiteProps.urlbasev1}/espacio/minimal/bloque/${formData.bloqueID}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          setEspacios(response.data || []);
        } catch (error) {
          props.setMessage({
            open: true,
            severity: "error",
            text: "Error al obtener espacios",
          });
        }
      };
      fetchEspacios();
    } else {
      setEspacios([]);
    }
  }, [formData.bloqueID]);

  useEffect(() => {
    if (formData.espacioID) {
      const fetchProducciones = async () => {
        try {
          const response = await axios.get(
            `${SiteProps.urlbasev1}/producciones/short/${formData.espacioID}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          setProducciones(response.data || []);
        } catch (error) {
          props.setMessage({
            open: true,
            severity: "error",
            text: "Error al obtener producciones",
          });
        }
      };
      fetchProducciones();
    } else {
      setProducciones([]);
    }
  }, [formData.espacioID]);

  useEffect(() => {
    const fetchTipoMovimientos = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/tipo_movimiento/minimal`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTipoMovimientos(response.data || []);
      } catch (error) {
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al obtener tipo de movimientos",
        });
      }
    };

    const fetchEstados = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/estados`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setEstados(response.data || []);
      } catch (error) {
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al obtener estados",
        });
      }
    };

    fetchTipoMovimientos();
    fetchEstados();
  }, []);

  // --- JSX Render ---
  return (
    <Box sx={{ marginLeft: "80px", paddingRight: "10px", mt: 50 }}>
      <h1>Kardex Nuevo</h1>
      <form onSubmit={handleSubmit}>
        {/* ... [formulario como lo tienes] ... */}
      </form>

      <GridKardexNuevo
        kardexItems={kardexItems}
        handleAddItem={handleAddItem}
        handleUpdateItem={handleUpdateItem}
        handleDeleteItem={handleDeleteItem}
      />
    </Box>
  );
}
