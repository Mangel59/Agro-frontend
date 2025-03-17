
/**
 * FormUnidad componente principal.
 * @component
 * @returns {JSX.Element}
 */
import * as React from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import StackButtons from "../StackButtons";
import { SiteProps } from "../dashboard/SiteProps";
import PropTypes from 'prop-types';

/**
 * Componente FormUnidad.
 * @module FormUnidad.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function FormUnidad(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [empresas, setEmpresas] = React.useState([]); // Estado para las empresas

  // Función para cargar las empresas al abrir el formulario
  const loadEmpresas = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Error: Token de autenticación no encontrado.",
      });
      return;
    }

    axios
      .get(`${SiteProps.urlbasev1}/empresas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Respuesta recibida de /empresas:", response.data);
        
        if (response.data && Array.isArray(response.data.data)) {
          setEmpresas(response.data.data);
        } else {
          console.error("La respuesta del servidor no es válida. Respuesta recibida:", response.data);
          props.setMessage({
            open: true,
            severity: "error",
            text: "Error al cargar empresas: respuesta no válida.",
          });
        }
      })
      .catch((error) => {
        const errorMessage = error.response
          ? `Código de error: ${error.response.status}, Mensaje: ${error.response.data.message || error.response.data}`
          : error.message;
        console.error("Error al cargar empresas:", errorMessage);
        props.setMessage({
          open: true,
          severity: "error",
          text: `Error al cargar empresas: ${errorMessage}`,
        });
      });
  };

  const create = () => {
    const row = {
      id: 0,
      nombre: "",
      descripcion: "",
      estado: 0,
      empresa: "" // Inicializamos empresa con una cadena vacía
    };
    props.setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
    loadEmpresas(); // Cargar empresas al abrir el formulario
  };

  const update = () => {
    if (!props.selectedRow || props.selectedRow.id === 0) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Selecciona una fila para actualizar",
      });
      return;
    }
    setMethodName("Update");
    setOpen(true);
    loadEmpresas(); // Cargar empresas al abrir el formulario
  };

  const deleteRow = () => {
    if (props.selectedRow.id === 0) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Selecciona una fila para eliminar",
      });
      return;
    }
    const id = props.selectedRow.id;
    const url = `${SiteProps.urlbasev1}/unidad/${id}`;
    const token = localStorage.getItem("token");

    if (!token) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Error: Token de autenticación no encontrado.",
      });
      return;
    }

    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        props.setMessage({
          open: true,
          severity: "success",
          text: "Unidad eliminada con éxito!",
        });
        props.reloadData();
      })
      .catch((error) => {
        const errorMessage = error.response ? error.response.data.message : error.message;
        props.setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar Unidad: ${errorMessage}`,
        });
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const id = props.selectedRow?.id || 0;

    const validatePayload = (data) => {
      if (!data.nombre || !data.descripcion || !data.empresa) {
        props.setMessage({
          open: true,
          severity: "error",
          text: "Datos inválidos. Revisa el formulario.",
        });
        return false;
      }
      return true;
    };

    if (!validatePayload(formJson)) return;

    const url = methodName === "Add" ? `${SiteProps.urlbasev1}/unidad` : `${SiteProps.urlbasev1}/unidad/${id}`;
    const token = localStorage.getItem("token");

    if (!token) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Error: Token de autenticación no encontrado.",
      });
      return;
    }

    const axiosMethod = methodName === "Add" ? axios.post : axios.put;

    axiosMethod(url, formJson, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        props.setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Unidad creada con éxito!" : "Unidad actualizada con éxito!",
        });
        setOpen(false);
        props.reloadData();
      })
      .catch((error) => {
        const errorMessage = error.response ? error.response.data.message : error.message;
        props.setMessage({
          open: true,
          severity: "error",
          text: `Error al ${methodName === "Add" ? "crear" : "actualizar"} Unidad: ${errorMessage}`,
        });
      });
  };

  return (
    <React.Fragment>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Unidad</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>
          <FormControl fullWidth margin="normal">
            <TextField
              autoFocus
              required
              id="nombre"
              name="nombre"
              label="Nombre"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.nombre || ""}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="descripcion"
              name="descripcion"
              label="Descripción"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.descripcion || ""}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="empresa-label">Empresa</InputLabel>
            <Select
              labelId="empresa-label"
              id="empresa"
              name="empresa"
              value={props.selectedRow?.empresa || ""}
              label="Empresa"
              onChange={(event) =>
                props.setSelectedRow({ ...props.selectedRow, empresa: event.target.value })
              }
            >
              {empresas.map((empresa) => (
                <MenuItem key={empresa.id} value={empresa.id}>
                  {empresa.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel
              id="estado-label"
              sx={{
                backgroundColor: "white",
                padding: "0 8px",
              }}
            >
              Estado
            </InputLabel>
            <Select
              labelId="estado-label"
              id="estado"
              name="estado"
              defaultValue={props.selectedRow?.estado || ""}
              fullWidth
            >
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit">{methodName}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
  
}
FormUnidad.propTypes = {
  setMessage: PropTypes.func.isRequired,
  selectedRow: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    estado: PropTypes.number,
    empresa: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
