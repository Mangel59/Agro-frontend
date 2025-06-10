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

const validationSchema = Yup.object().shape({
  cantidad: Yup.number().required("La cantidad es obligatoria."),
  pedidoId: Yup.number().required("El pedido es obligatorio."),
  productoPresentacionId: Yup.number().required("La presentación es obligatoria."),
  estadoId: Yup.number().oneOf([0, 1], "Estado inválido"),
});

export default function FormArticuloPedido({ setMessage, selectedRow, setSelectedRow, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [pedidos, setPedidos] = React.useState([]);
  const [presentaciones, setPresentaciones] = React.useState([]);

  const create = () => {
    setSelectedRow({ id: 0, cantidad: "", pedidoId: "", productoPresentacionId: "", estadoId: 1 });
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

    axios.delete(`/v1/articulo-pedido/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Eliminado con éxito!" });
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
    axios.get("/v1/pedido").then(res => setPedidos(res.data));
    axios.get("/v1/producto_presentacion").then(res => setPresentaciones(res.data));
  }, []);

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <Formik
          initialValues={{
            cantidad: selectedRow?.cantidad || "",
            pedidoId: selectedRow?.pedidoId || "",
            productoPresentacionId: selectedRow?.productoPresentacionId || "",
            estadoId: selectedRow?.estadoId ?? 1,
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            const id = selectedRow?.id || 0;
            const url = methodName === "Agregar"
              ? "/v1/articulo-pedido"
              : `/v1/articulo-pedido/${id}`;
            const method = methodName === "Agregar" ? axios.post : axios.put;

            method(url, values)
              .then(() => {
                setMessage({
                  open: true,
                  severity: "success",
                  text: `Artículo ${methodName === "Agregar" ? "creado" : "actualizado"} con éxito!`,
                });
                setSubmitting(false);
                setOpen(false);
                reloadData();
              })
              .catch((error) => {
                setMessage({
                  open: true,
                  severity: "error",
                  text: `Error al guardar: ${error.message}`,
                });
                setSubmitting(false);
              });
          }}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form>
              <DialogTitle>{methodName} Artículo Pedido</DialogTitle>
              <DialogContent>
                <DialogContentText>Completa los datos del artículo.</DialogContentText>

                <FormControl fullWidth margin="normal">
                  <TextField
                    name="cantidad"
                    label="Cantidad"
                    type="number"
                    value={values.cantidad}
                    onChange={handleChange}
                    error={touched.cantidad && Boolean(errors.cantidad)}
                    helperText={touched.cantidad && errors.cantidad}
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
                    {pedidos.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.descripcion || `#${p.id}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="productoPresentacionId-label">Presentación</InputLabel>
                  <Select
                    labelId="productoPresentacionId-label"
                    name="productoPresentacionId"
                    value={values.productoPresentacionId}
                    onChange={handleChange}
                    error={touched.productoPresentacionId && Boolean(errors.productoPresentacionId)}
                  >
                    {presentaciones.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.nombre || `#${p.id}`}
                      </MenuItem>
                    ))}
                  </Select>
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

FormArticuloPedido.propTypes = {
  setMessage: PropTypes.func.isRequired,
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
