import * as React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import StackButtons from "../StackButtons";
import MessageSnackBar from "../MessageSnackBar";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Formulario para crear, actualizar o eliminar un Tipo de Bloque.
 *
 * @module FormTipoBloque
 * @component
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.selectedRow - Objeto que representa el tipo de bloque seleccionado.
 * @param {Function} props.setSelectedRow - Función para actualizar el estado del tipo de bloque seleccionado.
 * @param {Function} props.addTipoBloque - Función para agregar un nuevo tipo de bloque.
 * @param {Function} props.updateTipoBloque - Función para actualizar un tipo de bloque existente.
 * @param {Function} props.reloadData - Función para recargar los datos después de una operación.
 *
 * @returns {JSX.Element} Componente React.
 */
/**
 * FormTipobloque componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * FormTipobloque componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * FormTipobloque componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * FormTipobloque componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * FormTipobloque componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * FormTipobloque componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * FormTipobloque componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * FormTipobloque componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * FormTipobloque componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * FormTipobloque componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * FormTipobloque componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * FormTipobloque componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * FormTipobloque componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * FormTipobloque componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * FormTipobloque componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * FormTipobloque componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * FormTipobloque componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * FormTipobloque componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * FormTipobloque componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * FormTipobloque componente principal.
 * @component
 * @returns {JSX.Element}
 */
export default function FormTipoBloque({
  selectedRow,
  setSelectedRow,
  addTipoBloque,
  updateTipoBloque,
  reloadData
}) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [message, setMessage] = React.useState({ open: false, severity: "info", text: "" });

  const url = `${SiteProps.urlbasev1}/tipo_bloque`;
  const token = localStorage.getItem("token");

  /**
   * Abre el formulario para crear un nuevo tipo de bloque.
   */
  const handleCreate = () => {
    setSelectedRow({ id: null, nombre: "", descripcion: "", estado: 1 });
    setMethodName("Add");
    setOpen(true);
  };

  /**
   * Abre el formulario para editar un tipo de bloque existente.
   */
  const handleUpdate = () => {
    if (!selectedRow || selectedRow.id === null) {
      setMessage({ open: true, severity: "error", text: "Seleccione un tipo de bloque para actualizar!" });
      return;
    }
    setMethodName("Update");
    setOpen(true);
  };

  /**
   * Elimina el tipo de bloque seleccionado.
   */
  const handleDelete = () => {
    if (!selectedRow || selectedRow.id === null) {
      setMessage({ open: true, severity: "error", text: "Seleccione un tipo de bloque para eliminar!" });
      return;
    }
    axios
      .delete(`${url}/${selectedRow.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Tipo de Bloque eliminado con éxito!" });
        reloadData();
      })
      .catch((error) => {
        const errorMessage = error.response ? error.response.data.message : error.message;
        setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar tipo_bloque! ${errorMessage}`
        });
      });
  };

  /**
   * Cierra el formulario de diálogo.
   */
  const handleClose = () => setOpen(false);

  /**
   * Envía el formulario al hacer clic en Guardar o Actualizar.
   * @param {React.FormEvent} event - Evento del formulario.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (methodName === "Add") {
      addTipoBloque(selectedRow);
    } else if (methodName === "Update") {
      updateTipoBloque(selectedRow);
    }
    setOpen(false);
    reloadData();
  };

  /**
   * Maneja los cambios en los campos del formulario.
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedRow((prevRow) => ({ ...prevRow, [name]: value }));
  };

  const methods = {
    create: handleCreate,
    update: handleUpdate,
    deleteRow: handleDelete,
  };

  return (
    <>
      <StackButtons methods={methods} />
      <MessageSnackBar message={message} setMessage={setMessage} />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName === "Add" ? "Crear Tipo de Bloque" : "Editar Tipo de Bloque"}</DialogTitle>
          <DialogContent>
            <DialogContentText>Completa la información del Tipo de Bloque.</DialogContentText>
            <TextField
              label="Nombre"
              name="nombre"
              fullWidth
              variant="outlined"
              margin="normal"
              value={selectedRow?.nombre || ""}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Descripción"
              name="descripcion"
              fullWidth
              variant="outlined"
              margin="normal"
              value={selectedRow?.descripcion || ""}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Estado"
              name="estado"
              type="number"
              fullWidth
              variant="outlined"
              margin="normal"
              value={selectedRow?.estado || 1}
              onChange={handleInputChange}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" color="primary" variant="contained">
              {methodName === "Add" ? "Guardar" : "Actualizar"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

FormTipoBloque.propTypes = {
  /**
   * Objeto que representa el tipo de bloque seleccionado.
   */
  selectedRow: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    estado: PropTypes.number,
  }),
  /**
   * Función para actualizar el estado del tipo de bloque seleccionado.
   */
  setSelectedRow: PropTypes.func.isRequired,
  /**
   * Función para agregar un nuevo tipo de bloque.
   */
  addTipoBloque: PropTypes.func.isRequired,
  /**
   * Función para actualizar un tipo de bloque existente.
   */
  updateTipoBloque: PropTypes.func.isRequired,
  /**
   * Función para recargar los datos.
   */
  reloadData: PropTypes.func.isRequired,
};
