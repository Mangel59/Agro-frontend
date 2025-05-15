import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, FormControl,
  InputLabel, Select, MenuItem
} from "@mui/material";
import StackButtons from "../StackButtons";
import { SiteProps } from "../dashboard/SiteProps";

export default function FormMunicipio({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [paises, setPaises] = React.useState([]);

  const initialData = {
    nombre: "",
    codigo: "",
    acronimo: "",
    estado: "",
    pais: ""
  };

  const [formData, setFormData] = React.useState(initialData);

  const empresaId = JSON.parse(localStorage.getItem("user"))?.empresa?.id;

  React.useEffect(() => {
    axios.get(`${SiteProps.urlbasev1}/pais`)
      .then((res) => {
        setPaises(res.data);
      })
      .catch((err) => {
        console.error("Error cargando países:", err);
        setMessage({ open: true, severity: "error", text: "Error cargando países" });
      });
  }, []);

  const create = () => {
    setFormData(initialData);
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un Municipio para editar." });
      return;
    }

    setFormData({
      nombre: selectedRow.nombre || "",
      codigo: selectedRow.codigo || "",
      acronimo: selectedRow.acronimo || "",
      estado: selectedRow.estado?.id?.toString() || "",
      pais: selectedRow.pais?.id?.toString() || ""
    });

    setMethodName("Update");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un Municipio para eliminar." });
      return;
    }

    axios.put(`${SiteProps.urlbasev1}/pais/${selectedRow.id}`, {
      ...selectedRow,
      estado: { id: 2 }
    })
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Municipio marcado como inactivo." });
        setSelectedRow({});
        reloadData();
      })
      .catch(err => {
        setMessage({ open: true, severity: "error", text: `Error al eliminar: ${err.message}` });
      });
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!empresaId || !formData.pais) {
      setMessage({ open: true, severity: "error", text: "Debe seleccionar empresa y país." });
      return;
    }

    const payload = {
      nombre: formData.nombre,
      codigo: parseInt(formData.codigo),
      acronimo: formData.acronimo.toUpperCase(),
      empresa: { id: empresaId },
      estado: { id: parseInt(formData.estado) },
      pais: { id: parseInt(formData.pais) }
    };

    const url = `${SiteProps.urlbasev1}/municipio`;
    const method = methodName === "Add" ? axios.post : axios.put;
    const endpoint = methodName === "Add" ? url : `${url}/${selectedRow.id}`;

    method(endpoint, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Municipio creado con éxito!" : "Municipio actualizado con éxito!"
        });
        setOpen(false);
        setSelectedRow({});
        reloadData();
      })
      .catch(err => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error: ${err.message || "Network Error"}`
        });
      });
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Municipio</DialogTitle>
          <DialogContent>
            <DialogContentText>Formulario para gestionar Municipio</DialogContentText>

            <TextField
              fullWidth margin="dense" required
              name="nombre" label="Nombre del Municipio"
              value={formData.nombre}
              onChange={handleChange}
            />
            <TextField
              fullWidth margin="dense" required
              name="codigo" label="Código"
              type="number"
              value={formData.codigo}
              onChange={handleChange}
            />
            <TextField
              fullWidth margin="dense" required
              name="acronimo" label="Acrónimo"
              inputProps={{ maxLength: 3 }}
              value={formData.acronimo}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="dense" required>
              <InputLabel>País</InputLabel>
              <Select
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                label="País"
              >
                <MenuItem value="">Seleccione...</MenuItem>
                {paises.map((pais) => (
                  <MenuItem key={pais.id} value={pais.id}>
                    {pais.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                label="Estado"
              >
                <MenuItem value="">Seleccione...</MenuItem>
                <MenuItem value="1">Activo</MenuItem>
                <MenuItem value="2">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit">{methodName}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

FormMunicipio.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
