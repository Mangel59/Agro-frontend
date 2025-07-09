import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid
} from "@mui/material";
import StackButtons from "../StackButtons";

export default function FormPresentacionproducto({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");

  const initialData = {
    productoId: "", nombre: "", unidadId: "",
    descripcion: "", estadoId: "", cantidad: "",
    marcaId: "", presentacionId: "", ingredienteId: ""
  };

  const [formData, setFormData] = useState(initialData);

  const [productos, setProductos] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);

  let empresaId = null;
  try {
    const rawToken = localStorage.getItem("token");
    const payload = JSON.parse(atob(rawToken.split(".")[1]));
    empresaId = payload.empresa?.id || null;
  } catch (e) {
    console.error("Error al leer empresaId desde el token", e);
  }

  useEffect(() => {
    axios.get("/v1/producto")
      .then(res => {
        setProductos(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("Error al cargar productos:", err);
        setProductos([]);
      });

    axios.get("/v1/unidad")
      .then(res => setUnidades(Array.isArray(res.data) ? res.data : []))
      .catch(() => setUnidades([]));

    axios.get("/v1/marca")
      .then(res => setMarcas(Array.isArray(res.data) ? res.data : []))
      .catch(() => setMarcas([]));

    axios.get("/v1/presentacion")
      .then(res => setPresentaciones(Array.isArray(res.data) ? res.data : []))
      .catch(() => setPresentaciones([]));

    axios.get("/v1/ingrediente")
      .then(res => setIngredientes(Array.isArray(res.data) ? res.data : []))
      .catch(() => setIngredientes([]));
  }, []);

  const create = () => {
    setFormData(initialData);
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona una presentación para editar." });
      return;
    }
    setFormData({
      productoId: selectedRow.productoId || "",
      nombre: selectedRow.nombre || "",
      unidadId: selectedRow.unidadId || "",
      descripcion: selectedRow.descripcion || "",
      estadoId: selectedRow.estadoId?.toString() || "",
      cantidad: selectedRow.cantidad || "",
      marcaId: selectedRow.marcaId || "",
      presentacionId: selectedRow.presentacionId || "",
      ingredienteId: selectedRow.ingredienteId || ""
    });
    setMethodName("Update");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona una presentación para eliminar." });
      return;
    }
    axios.delete(`/v1/producto_presentacion/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Eliminado correctamente." });
        setSelectedRow({});
        reloadData();
      })
      .catch(err => {
        setMessage({ open: true, severity: "error", text: `Error al eliminar: ${err.message}` });
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      productoId: parseInt(formData.productoId),
      unidadId: parseInt(formData.unidadId),
      estadoId: parseInt(formData.estadoId),
      cantidad: parseFloat(formData.cantidad),
      marcaId: parseInt(formData.marcaId),
      presentacionId: parseInt(formData.presentacionId),
      ingredienteId: parseInt(formData.ingredienteId),
      empresaId
    };

    const method = methodName === "Add" ? axios.post : axios.put;
    const url = methodName === "Add"
      ? "/v1/producto_presentacion"
      : `/v1/producto_presentacion/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Creado con éxito!" : "Actualizado con éxito!"
        });
        setOpen(false);
        setSelectedRow({});
        reloadData();
      })
      .catch(err => {
        setMessage({ open: true, severity: "error", text: `Error: ${err.message}` });
      });
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Producto Presentación</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Producto</InputLabel>
                  <Select name="productoId" value={formData.productoId} onChange={handleChange} label="Producto">
                    <MenuItem value="">Seleccione...</MenuItem>
                    {(Array.isArray(productos) ? productos : []).map(p => (
                      <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* el resto de campos siguen igual (unidades, estado, marca, etc.) */}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">{methodName}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

FormPresentacionproducto.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
