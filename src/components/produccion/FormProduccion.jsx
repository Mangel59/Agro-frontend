import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import {
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, InputLabel, Select, MenuItem, Box
} from "@mui/material";
import { SiteProps } from "../dashboard/SiteProps";
import { useFormik } from "formik";
import * as Yup from "yup";

function FormProduccion({ reloadProducciones, setMessage }) {
  const [open, setOpen] = useState(false);
  const [sedes, setSedes] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [tiposProduccion, setTiposProduccion] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ open: true, severity: "error", text: "No se encontró el token de autenticación." });
      return;
    }

    axios.get(`${SiteProps.urlbasev1}/sede/minimal`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setSedes(res.data));

    axios.get(`${SiteProps.urlbasev1}/tipo_produccion`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setTiposProduccion(res.data));
  }, [setMessage]);

  const formik = useFormik({
    initialValues: {
      nombre: "",
      descripcion: "",
      fechaInicio: "",
      fechaFinal: "",
      estado: 1,
      sede: "",
      bloque: "",
      espacio: "",
      tipoProduccion: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().trim().required("El nombre es obligatorio"),
      descripcion: Yup.string().trim().required("La descripción es obligatoria"),
      fechaInicio: Yup.string().required("Fecha de inicio requerida"),
      fechaFinal: Yup.string().required("Fecha final requerida"),
      estado: Yup.number().oneOf([0, 1]),
      sede: Yup.string().required("Seleccione una sede"),
      bloque: Yup.string().required("Seleccione un bloque"),
      espacio: Yup.string().required("Seleccione un espacio"),
      tipoProduccion: Yup.string().required("Seleccione tipo de producción"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const token = localStorage.getItem("token");
      try {
        await axios.post(`${SiteProps.urlbasev1}/producciones`, {
          nombre: values.nombre,
          descripcion: values.descripcion,
          fechaInicio: values.fechaInicio,
          fechaFinal: values.fechaFinal,
          estado: values.estado,
          espacio: values.espacio,
          tipoProduccion: values.tipoProduccion,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setMessage({ open: true, severity: "success", text: "Producción creada con éxito." });
        resetForm();
        setOpen(false);
        if (typeof reloadProducciones === "function") {
          setTimeout(() => reloadProducciones(), 100);
        }
      } catch (err) {
        setMessage({ open: true, severity: "error", text: "Error al crear la producción." });
      }
    },
  });

  const handleSedeChange = (sedeId) => {
    formik.setFieldValue("sede", sedeId);
    formik.setFieldValue("bloque", "");
    formik.setFieldValue("espacio", "");
    axios.get(`${SiteProps.urlbasev1}/bloque/sede/${sedeId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => setBloques(res.data));
  };

  const handleBloqueChange = (bloqueId) => {
    formik.setFieldValue("bloque", bloqueId);
    formik.setFieldValue("espacio", "");
    axios.get(`${SiteProps.urlbasev1}/espacio/bloque/${bloqueId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => setEspacios(res.data));
  };

  return (
    <>
      <Button startIcon={<AddIcon />} variant="outlined" onClick={() => setOpen(true)}>
        ADD
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Crear Producción</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Box sx={{ width: "100%" }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Sede</InputLabel>
                <Select
                  value={formik.values.sede}
                  onChange={(e) => handleSedeChange(e.target.value)}
                  onBlur={formik.handleBlur}
                  name="sede"
                  error={formik.touched.sede && Boolean(formik.errors.sede)}
                >
                  {sedes.map((s) => (
                    <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" disabled={!formik.values.sede}>
                <InputLabel>Bloque</InputLabel>
                <Select
                  value={formik.values.bloque}
                  onChange={(e) => handleBloqueChange(e.target.value)}
                  onBlur={formik.handleBlur}
                  name="bloque"
                  error={formik.touched.bloque && Boolean(formik.errors.bloque)}
                >
                  {bloques.map((b) => (
                    <MenuItem key={b.id} value={b.id}>{b.nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" disabled={!formik.values.bloque}>
                <InputLabel>Espacio</InputLabel>
                <Select
                  value={formik.values.espacio}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="espacio"
                  error={formik.touched.espacio && Boolean(formik.errors.espacio)}
                >
                  {espacios.map((e) => (
                    <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Tipo de Producción</InputLabel>
                <Select
                  value={formik.values.tipoProduccion}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="tipoProduccion"
                  error={formik.touched.tipoProduccion && Boolean(formik.errors.tipoProduccion)}
                >
                  {tiposProduccion.map((t) => (
                    <MenuItem key={t.id} value={t.id}>{t.nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                margin="normal"
                label="Nombre"
                name="nombre"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                helperText={formik.touched.nombre && formik.errors.nombre}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Descripción"
                name="descripcion"
                value={formik.values.descripcion}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
                helperText={formik.touched.descripcion && formik.errors.descripcion}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Fecha de Inicio"
                type="datetime-local"
                name="fechaInicio"
                value={formik.values.fechaInicio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                InputLabelProps={{ shrink: true }}
                error={formik.touched.fechaInicio && Boolean(formik.errors.fechaInicio)}
                helperText={formik.touched.fechaInicio && formik.errors.fechaInicio}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Fecha Final"
                type="datetime-local"
                name="fechaFinal"
                value={formik.values.fechaFinal}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                InputLabelProps={{ shrink: true }}
                error={formik.touched.fechaFinal && Boolean(formik.errors.fechaFinal)}
                helperText={formik.touched.fechaFinal && formik.errors.fechaFinal}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

FormProduccion.propTypes = {
  reloadProducciones: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
};

export default FormProduccion;
