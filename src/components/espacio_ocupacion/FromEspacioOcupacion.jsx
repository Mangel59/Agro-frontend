/**
 * @file FromEspacioOcupacion.jsx
 * @module FromEspacioOcupacion
 * @description Formulario modal para crear, actualizar o eliminar ocupaciones de espacios.
 * Permite seleccionar sede, bloque, espacio, actividad, fechas. Usa Formik y Yup para validación.
 * El campo estado se define automáticamente como "Activo" sin mostrarse en el formulario.
 *
 * @component
 * @name FromEspacioOcupacion
 * @exports FromEspacioOcupacion
 *
 * @param {Object} props - Props del componente.
 * @param {Object} props.selectedRow - Fila seleccionada con datos del registro.
 * @param {Function} props.setSelectedRow - Función para actualizar la fila seleccionada.
 * @param {Function} props.setMessage - Función para mostrar mensajes en Snackbar.
 * @param {Function} props.reloadData - Función para recargar datos de la tabla.
 * @returns {JSX.Element} Formulario de ocupación de espacio.
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormHelperText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import { SiteProps } from "../dashboard/SiteProps";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function FromEspacioOcupacion(props) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");
  const [sedes, setSedes] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [actividades, setActividades] = useState([]);

  const formik = useFormik({
    initialValues: {
      sede: "",
      bloque: "",
      espacio: "",
      actividad: "",
      fechaInicio: "",
      fechaFin: "",
      estado: 1, // siempre se envía como activo
    },
    validationSchema: Yup.object({
      sede: Yup.string().required("Seleccione una sede"),
      bloque: Yup.string().required("Seleccione un bloque"),
      espacio: Yup.string().required("Seleccione un espacio"),
      actividad: Yup.string().required("Seleccione una actividad"),
      fechaInicio: Yup.string().required("Ingrese la fecha de inicio"),
      fechaFin: Yup.string().required("Ingrese la fecha de fin"),
    }),
    onSubmit: (values) => {
      const payload = {
        id: methodName === "Add" ? null : props.selectedRow?.id,
        espacio: values.espacio,
        actividadOcupacion: values.actividad,
        fechaInicio: values.fechaInicio,
        fechaFin: values.fechaFin,
        estado: 1,
      };

      const url = `${SiteProps.urlbasev1}/espacio_ocupacion`;
      const method = methodName === "Add" ? axios.post : axios.put;
      const endpoint = methodName === "Add" ? url : `${url}/${payload.id}`;

      method(endpoint, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then(() => {
          props.setMessage({ open: true, severity: "success", text: "Guardado exitosamente" });
          props.reloadData();
          setOpen(false);
        })
        .catch(() => {
          props.setMessage({ open: true, severity: "error", text: "Error al guardar" });
        });
    },
  });

  useEffect(() => {
    axios.get(`${SiteProps.urlbasev1}/sede/minimal`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(res => setSedes(res.data));
  }, []);

  useEffect(() => {
    if (formik.values.sede) {
      axios.get(`${SiteProps.urlbasev1}/bloque/minimal/sede/${formik.values.sede}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }).then(res => setBloques(res.data));
    }
  }, [formik.values.sede]);

  useEffect(() => {
    if (formik.values.bloque) {
      axios.get(`${SiteProps.urlbasev1}/espacio/minimal/bloque/${formik.values.bloque}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }).then(res => setEspacios(res.data));
    }
  }, [formik.values.bloque]);

  useEffect(() => {
    if (open) {
      axios.get(`${SiteProps.urlbasev1}/actividad_ocupacion/minimal`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }).then(res => setActividades(res.data));
    }
  }, [open]);

  const create = () => {
    formik.resetForm();
    formik.setFieldValue("estado", 1);
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (!props.selectedRow || props.selectedRow.id === 0) {
      return props.setMessage({ open: true, severity: "error", text: "Seleccione una fila para actualizar." });
    }
    formik.setValues({
      sede: props.selectedRow.sede || "",
      bloque: props.selectedRow.bloque || "",
      espacio: props.selectedRow.espacio || "",
      actividad: props.selectedRow.actividad || "",
      fechaInicio: props.selectedRow.fechaInicio || "",
      fechaFin: props.selectedRow.fechaFin || "",
      estado: 1,
    });
    setMethodName("Update");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!props.selectedRow || props.selectedRow.id === 0) {
      return props.setMessage({ open: true, severity: "error", text: "Seleccione una fila para eliminar." });
    }
    axios.delete(`${SiteProps.urlbasev1}/espacio_ocupacion/${props.selectedRow.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        props.setMessage({ open: true, severity: "success", text: "Registro eliminado con éxito." });
        props.reloadData();
      })
      .catch(() => {
        props.setMessage({ open: true, severity: "error", text: "Error al eliminar." });
      });
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={create}>Agregar</Button>
        <Button variant="outlined" startIcon={<UpdateIcon />} onClick={update} sx={{ mx: 1 }}>Actualizar</Button>
        <Button variant="outlined" startIcon={<DeleteIcon />} onClick={deleteRow}>Eliminar</Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{methodName === "Add" ? "Agregar Registro" : "Actualizar Registro"}</DialogTitle>
        <DialogContent>
          {[{ label: "Sede", name: "sede", options: sedes }, { label: "Bloque", name: "bloque", options: bloques }, { label: "Espacio", name: "espacio", options: espacios }, { label: "Actividad", name: "actividad", options: actividades }].map(({ label, name, options }) => (
            <FormControl fullWidth margin="normal" key={name} error={formik.touched[name] && Boolean(formik.errors[name])}>
              <InputLabel>{label}</InputLabel>
              <Select
                name={name}
                value={formik.values[name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {options.map((item) => (
                  <MenuItem key={item.id} value={item.id}>{item.nombre}</MenuItem>
                ))}
              </Select>
              {formik.touched[name] && formik.errors[name] && (
                <FormHelperText>{formik.errors[name]}</FormHelperText>
              )}
            </FormControl>
          ))}

          <TextField
            fullWidth
            type="datetime-local"
            name="fechaInicio"
            label="Fecha de Inicio"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formik.values.fechaInicio}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fechaInicio && Boolean(formik.errors.fechaInicio)}
            helperText={formik.touched.fechaInicio && formik.errors.fechaInicio}
          />

          <TextField
            fullWidth
            type="datetime-local"
            name="fechaFin"
            label="Fecha de Fin"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formik.values.fechaFin}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fechaFin && Boolean(formik.errors.fechaFin)}
            helperText={formik.touched.fechaFin && formik.errors.fechaFin}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={formik.handleSubmit}>{methodName === "Add" ? "Agregar" : "Actualizar"}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}