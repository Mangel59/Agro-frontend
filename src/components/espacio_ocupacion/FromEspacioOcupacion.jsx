
/**
 * FromEspacioOcupacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
import * as React from "react";
import PropTypes from "prop-types";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente FromEspacioOcupacion.
 * @module FromEspacioOcupacion.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function FromEspacioOcupacion(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [sedes, setSedes] = React.useState([]);
  const [bloques, setBloques] = React.useState([]);
  const [espacios, setEspacios] = React.useState([]);
  const [actividades, setActividades] = React.useState([]);
  const selectedRow = props.selectedRow || {};

  React.useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/sede/minimal`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSedes(response.data || []);
      } catch (error) {
        console.error("Error al cargar sedes:", error);
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar las sedes.",
        });
      }
    };

    fetchSedes();
  }, []);

  React.useEffect(() => {
    if (!selectedRow.sede) return;

    const fetchBloques = async () => {
      try {
        const response = await axios.get(
          `${SiteProps.urlbasev1}/bloque/minimal/sede/${selectedRow.sede}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setBloques(response.data || []);
      } catch (error) {
        console.error("Error al cargar bloques:", error);
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar los bloques.",
        });
      }
    };

    fetchBloques();
  }, [selectedRow.sede]);

  React.useEffect(() => {
    if (!selectedRow.bloque) return;

    const fetchEspacios = async () => {
      try {
        const response = await axios.get(
          `${SiteProps.urlbasev1}/espacio/minimal/bloque/${selectedRow.bloque}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setEspacios(response.data || []);
      } catch (error) {
        console.error("Error al cargar espacios:", error);
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar los espacios.",
        });
      }
    };

    fetchEspacios();
  }, [selectedRow.bloque]);

  React.useEffect(() => {
    if (open) {
      const fetchActividades = async () => {
        try {
          const actividadesRes = await axios.get(
            `${SiteProps.urlbasev1}/actividad_ocupacion/minimal`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          setActividades(actividadesRes.data || []);
        } catch (error) {
          console.error("Error al cargar actividades:", error);
          props.setMessage({
            open: true,
            severity: "error",
            text: "Error al cargar actividades.",
          });
        }
      };

      fetchActividades();
    }
  }, [open]);

  const formatDateTime = (date) => {
    const d = new Date(date);
    return d.toISOString().slice(0, 19);
  };

  const create = () => {
    const row = {
      id: 0,
      espacio: "",
      actividadOcupacion: "",
      fechaInicio: "",
      fechaFin: "",
      estado: 1,
    };
    props.setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow || selectedRow.id === 0) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Seleccione una fila para actualizar.",
      });
      return;
    }
    setMethodName("Update");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow || selectedRow.id === 0) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Seleccione una fila para eliminar.",
      });
      return;
    }
    axios
      .delete(`${SiteProps.urlbasev1}/espacio_ocupacion/${selectedRow.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        props.setMessage({
          open: true,
          severity: "success",
          text: "Registro eliminado con éxito.",
        });
        props.reloadData();
      })
      .catch((error) => {
        console.error("Error al eliminar el registro:", error);
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al eliminar el registro. Intente nuevamente.",
        });
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const payload = {
      id: selectedRow.id || null,
      espacio: selectedRow.espacio,
      actividadOcupacion: selectedRow.actividad,
      fechaInicio: formatDateTime(selectedRow.fechaInicio),
      fechaFin: formatDateTime(selectedRow.fechaFin),
      estado: selectedRow.estado,
    };

    const url = `${SiteProps.urlbasev1}/espacio_ocupacion`;
    const method = methodName === "Add" ? axios.post : axios.put;
    const endpoint = methodName === "Add" ? url : `${url}/${selectedRow.id}`;

    method(endpoint, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        props.setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Registro creado con éxito." : "Registro actualizado con éxito.",
        });
        props.reloadData();
        handleClose();
      })
      .catch((error) => {
        console.error("Error al enviar datos:", error);
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al enviar datos. Intente nuevamente.",
        });
      });
  };

  return (
    <React.Fragment>
      {/* Botones de acción */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={create}>
          Agregar
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<UpdateIcon />}
          onClick={update}
          style={{ marginLeft: "10px" }}
        >
          Actualizar
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<DeleteIcon />}
          onClick={deleteRow}
          style={{ marginLeft: "10px" }}
        >
          Eliminar
        </Button>
      </Box>

      {/* Formulario modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{methodName === "Add" ? "Agregar Registro" : "Actualizar Registro"}</DialogTitle>
        <DialogContent>
          {/* Campos de selección y texto */}
          {/* ... (como en tu código actual) */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancelar</Button>
          <Button onClick={handleSubmit} color="primary">{methodName === "Add" ? "Agregar" : "Actualizar"}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

// ✅ Validación de props con PropTypes
FromEspacioOcupacion.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
