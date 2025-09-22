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

/* ==================== Helpers ==================== */
const toArray = (data) =>
  Array.isArray(data)
    ? data
    : Array.isArray(data?.content)
    ? data.content
    : Array.isArray(data?.data)
    ? data.data
    : [];

// Helper para validar números requeridos (acepta "" y lo transforma a undefined)
const numberRequired = (msg) =>
  Yup.number()
    .transform((v, orig) => (orig === "" || orig === null ? undefined : Number(orig)))
    .typeError(msg)
    .required(msg);

/* ==================== Schema ==================== */
const OrdenCompraSchema = Yup.object().shape({
  fechaHora: Yup.string().required("La fecha es obligatoria."),
  pedidoId: numberRequired("El pedido es obligatorio."),
  proveedorId: numberRequired("El proveedor es obligatorio."),
  descripcion: Yup.string(),
  // Ya NO validamos contra 0/1. Ahora es catálogo dinámico:
  estadoId: numberRequired("El estado es obligatorio."),
});

export default function FormOrdenCompra({
  setMessage,
  selectedRow,
  setSelectedRow,
  reloadData,
}) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [pedidos, setPedidos] = React.useState([]);
  const [proveedores, setProveedores] = React.useState([]);
  const [estados, setEstados] = React.useState([]); // 👈 Nuevos estados dinámicos

  /* ========== Acciones CRUD del toolbar ========== */
  const create = () => {
    setSelectedRow({
      id: 0,
      fechaHora: "",
      pedidoId: "",
      proveedorId: "",
      descripcion: "",
      estadoId: "", // 👈 vacío; el usuario debe seleccionar
    });
    setMethodName("Agregar");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow || !selectedRow.id) {
      setMessage({
        open: true,
        severity: "error",
        text: "Selecciona una fila para actualizar",
      });
      return;
    }
    setMethodName("Actualizar");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({
        open: true,
        severity: "error",
        text: "Selecciona una fila para eliminar",
      });
      return;
    }

    axios
      .delete(`/v1/orden-compra/${selectedRow.id}`)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: "Orden eliminada con éxito!",
        });
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

  /* ========== Cargar catálogos ========== */
  React.useEffect(() => {
    axios
      .get("/v1/items/pedido/0")
      .then((res) => setPedidos(toArray(res.data)))
      .catch(() => setPedidos([]));

    axios
      .get("/v1/items/proveedor/0")
      .then((res) => setProveedores(toArray(res.data)))
      .catch(() => setProveedores([]));

    // 👇 Estados dinámicos
    axios
      .get("/v1/items/orden_compra_estado/0")
      .then((res) => setEstados(toArray(res.data)))
      .catch(() => setEstados([]));
  }, []);

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <Formik
          initialValues={{
            fechaHora: selectedRow?.fechaHora || "",
            pedidoId: selectedRow?.pedidoId ?? "",
            proveedorId: selectedRow?.proveedorId ?? "",
            descripcion: selectedRow?.descripcion || "",
            estadoId: selectedRow?.estadoId ?? "", // 👈 sin default 0/1
          }}
          enableReinitialize
          validationSchema={OrdenCompraSchema}
          onSubmit={(values, { setSubmitting }) => {
            const id = selectedRow?.id || 0;
            const url =
              methodName === "Agregar" ? "/v1/orden-compra" : `/v1/orden-compra/${id}`;
            const method = methodName === "Agregar" ? axios.post : axios.put;

            // Asegurar tipos numéricos en ids
            const payload = {
              ...values,
              pedidoId: Number(values.pedidoId),
              proveedorId: Number(values.proveedorId),
              estadoId: Number(values.estadoId),
            };

            method(url, payload)
              .then(() => {
                setMessage({
                  open: true,
                  severity: "success",
                  text: `Orden ${
                    methodName === "Agregar" ? "creada" : "actualizada"
                  } con éxito!`,
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
          {({ values, errors, touched, handleChange, setFieldValue, isSubmitting }) => (
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

                <FormControl fullWidth margin="normal" error={touched.pedidoId && Boolean(errors.pedidoId)}>
                  <InputLabel id="pedidoId-label">Pedido</InputLabel>
                  <Select
                    labelId="pedidoId-label"
                    label="Pedido"
                    name="pedidoId"
                    value={values.pedidoId}
                    onChange={(e) => setFieldValue("pedidoId", Number(e.target.value))}
                  >
                    {pedidos.length === 0 && (
                      <MenuItem disabled value="">
                        (No hay pedidos disponibles)
                      </MenuItem>
                    )}
                    {pedidos.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.descripcion ?? `#${p.id}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  margin="normal"
                  error={touched.proveedorId && Boolean(errors.proveedorId)}
                >
                  <InputLabel id="proveedorId-label">Proveedor</InputLabel>
                  <Select
                    labelId="proveedorId-label"
                    label="Proveedor"
                    name="proveedorId"
                    value={values.proveedorId}
                    onChange={(e) => setFieldValue("proveedorId", Number(e.target.value))}
                  >
                    {proveedores.length === 0 && (
                      <MenuItem disabled value="">
                        (No hay proveedores)
                      </MenuItem>
                    )}
                    {proveedores.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name ?? p.nombre ?? `Proveedor ${p.id}`}
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

                {/* ====== Estado dinámico ====== */}
                <FormControl
                  fullWidth
                  margin="normal"
                  error={touched.estadoId && Boolean(errors.estadoId)}
                >
                  <InputLabel id="estadoId-label">Estado</InputLabel>
                  <Select
                    labelId="estadoId-label"
                    label="Estado"
                    name="estadoId"
                    value={values.estadoId}
                    onChange={(e) => setFieldValue("estadoId", Number(e.target.value))}
                  >
                    {estados.length === 0 && (
                      <MenuItem disabled value="">
                        (No hay estados configurados)
                      </MenuItem>
                    )}
                    {estados.map((it) => (
                      <MenuItem key={it.id} value={it.id}>
                        {it.nombre ?? it.name ?? it.descripcion ?? `Estado ${it.id}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </DialogContent>

              <DialogActions>
                <Button onClick={handleClose} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {methodName}
                </Button>
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
