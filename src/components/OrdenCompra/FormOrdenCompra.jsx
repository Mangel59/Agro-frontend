import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import StackButtons from "../StackButtons";
import { Formik, Form } from "formik";
import * as Yup from "yup";

// Validación Yup
const OrdenCompraSchema = Yup.object().shape({
  fechaHora: Yup.string().required("La fecha es obligatoria."),
  pedidoId: Yup.number().required("El pedido es obligatorio."),
  proveedorId: Yup.number().required("El proveedor es obligatorio."),
  descripcion: Yup.string(),
  estadoId: Yup.number().oneOf([0, 1], "Estado inválido"),
});

export default function FormOrdenCompra({ setMessage, selectedRow, setSelectedRow, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [pedidos, setPedidos] = React.useState([]);
  const [proveedores, setProveedores] = React.useState([]);

  const create = () => {
    setSelectedRow({
      id: 0,
      fechaHora: "",
      pedidoId: "",
      proveedorId: "",
      descripcion: "",
      estadoId: 1,
    });
    setMethodName("Agregar");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow || selectedRow.id === 0) {
      setMessage({ open: true, severity: "error", text: "Selecciona una fila para actualizar" });
      return;
    }
    setMethodName("Actualizar");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow?.id || selectedRow.id === 0) {
      setMessage({ open: true, severity: "error", text: "Selecciona una fila para eliminar" });
      return;
    }

    axios
      .delete(`/v1/orden_compra/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Orden eliminada con éxito!" });
        reloadData();
      })
      .catch((error) => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar: ${error.message}`,
        });
      });
  };

  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    axios.get("/v1/pedido")
      .then((res) => setPedidos(res.data))
      .catch((err) => console.error("❌ Error cargando pedidos:", err));

    axios.get("/v1/proveedor")
      .then((res) => {
        console.log("📦 Proveedores cargados:", res.data);
        setProveedores(res.data);
      })
      .catch((err) => console.error("❌ Error cargando proveedores:", err));
  }, []);

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <Formik
          initialValues={{
            fechaHora: selectedRow?.fechaHora || "",
            pedidoId: selectedRow?.pedidoId || "",
            proveedorId: selectedRow?.proveedorId || "",
            descripcion: selectedRow?.descripcion || "",
            estadoId: selectedRow?.estadoId ?? 1,
          }}
          enableReinitialize
          validationSchema={OrdenCompraSchema}
          onSubmit={(values, { setSubmitting }) => {
            const id = selectedRow?.id || 0;
            const url = methodName === "Agregar"
              ? "/v1/orden_compra"
              : `/v1/orden_compra/${id}`;
            const method = methodName === "Agregar" ? axios.post : axios.put;

            method(url, values)
              .then(() => {
                setMessage({
                  open: true,
                  severity: "success",
                  text: `Orden ${methodName === "Agregar" ? "creada" : "actualizada"} con éxito!`,
                });
                setSubmitting(false);
                setOpen(false);
                reloadData();
              })
              .catch((error) => {
                const errorMessage = error.response?.data?.message || error.message;
                setMessage({
                  open: true,
                  severity: "error",
                  text: `Error al guardar: ${errorMessage}`,
                });
                setSubmitting(false);
              });
          }}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form>
              <DialogTitle>{methodName} Orden de Compra</DialogTitle>
              <DialogContent>
                <DialogContentText>Completa el formulario.</DialogContentText>

                <FormControl fullWidth margin="normal">
                  <TextField
                    name="fechaHora"
                    label="Fecha y Hora"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    value={values.fechaHora}
                    onChange={handleChange}
                    error={touched.fechaHora && Boolean(errors.fechaHora)}
                    helperText={touched.fechaHora && errors.fechaHora}
                  />
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="pedidoId-label">Pedido</InputLabel>
                  <Select
                    labelId="pedidoId-label"
                    name="pedidoId"
                    value={values.pedidoId}
                    onChange={handleChange}
                    error={touched.pedidoId && Boolean(errors.pedidoId)}
                  >
                    {pedidos.length === 0 && (
                      <MenuItem disabled value="">
                        (No hay pedidos disponibles)
                      </MenuItem>
                    )}
                    {pedidos.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.descripcion || `#${p.id} - ${new Date(p.fechaHora).toLocaleDateString()}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="proveedorId-label">Proveedor</InputLabel>
                  <Select
                    labelId="proveedorId-label"
                    name="proveedorId"
                    value={values.proveedorId}
                    onChange={handleChange}
                    error={touched.proveedorId && Boolean(errors.proveedorId)}
                  >
                    {proveedores.length === 0 && (
                      <MenuItem disabled value="">
                        (No hay proveedores)
                      </MenuItem>
                    )}
                    {proveedores.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.nombre || `Proveedor ${p.id} - ${p.identificacion}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <TextField
                    name="descripcion"
                    label="Descripción"
                    value={values.descripcion}
                    onChange={handleChange}
                    error={touched.descripcion && Boolean(errors.descripcion)}
                    helperText={touched.descripcion && errors.descripcion}
                  />
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="estadoId-label">Estado</InputLabel>
                  <Select
                    labelId="estadoId-label"
                    name="estadoId"
                    value={values.estadoId}
                    onChange={handleChange}
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
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}

FormOrdenCompra.propTypes = {
  setMessage: PropTypes.func.isRequired,
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
