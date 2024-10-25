import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
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

export default function FormRkardex(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const create = () => {
    const row = {
      kar_id: 0,
      kar_fecha_hora: new Date(),
      kar_almacen_id: 0,
      kar_produccion_id: 0,
      kar_tipo_movimiento_id: 0,
      kar_descripcion: "",
      kar_estado: 0
    };
    props.setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
    console.log("create() " + JSON.stringify(row));
  };

  const update = () => {
    if (!props.selectedRow || !props.selectedRow.kar_id) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Seleccione una fila para actualizar!",
      });
      return;
    }
    setMethodName("Update");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!props.selectedRow || !props.selectedRow.kar_id) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Seleccione una fila para eliminar!",
      });
      return;
    }
    props.deleteKardex(props.selectedRow.kar_id);
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = props.selectedRow;

    if (methodName === "Add") {
      props.addKardex(formData);
    } else if (methodName === "Update") {
      props.updateKardex(formData);
    }

    setOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    props.setSelectedRow((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <React.Fragment>
      <Box display="flex" justifyContent="right" mb={2}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={create}
          style={{ marginRight: "10px" }}
        >
          ADD
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<UpdateIcon />}
          onClick={update}
          style={{ marginRight: "10px" }}
        >
          UPDATE
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<DeleteIcon />}
          onClick={deleteRow}
        >
          DELETE
        </Button>
      </Box>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Kardex</DialogTitle>
         <DialogContent>
           <DialogContentText>Completa el formulario.</DialogContentText>

           {/* Campo de fecha */}
           <FormControl fullWidth>
             <TextField
              autoFocus
              required
              id="kar_fecha_hora"
              name="kar_fecha_hora"
              label="Fecha y Hora (mm/dd/yyyy)"
              type="datetime-local"
              fullWidth
              variant="standard"
              margin="normal"
              value={props.selectedRow.kar_fecha_hora?.toISOString().substring(0, 16) || ""}
              onChange={handleChange}
            />
          </FormControl>

          {/* Select Almacén */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="almacen-select-label">Almacén</InputLabel>
            <Select
              labelId="almacen-select-label"
              id="kar_almacen_id"
              name="kar_almacen_id"
              value={props.selectedRow.kar_almacen_id || ""}
              onChange={handleChange}
            >
              {props.almacen.map((alm) => (
                <MenuItem key={alm.alm_id} value={alm.alm_id}>
                  {alm.alm_nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Select Producción */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="produccion-select-label">Producción</InputLabel>
            <Select
              labelId="produccion-select-label"
              id="kar_produccion_id"
              name="kar_produccion_id"
              value={props.selectedRow.kar_produccion_id || ""}
              onChange={handleChange}
            >
              {props.produccion.map((prod) => (
                <MenuItem key={prod.pro_id} value={prod.pro_id}>
                  {prod.pro_nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Select Tipo Movimiento */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="tipo-movimiento-select-label">Tipo Movimiento</InputLabel>
            <Select
              labelId="tipo-movimiento-select-label"
              id="kar_tipo_movimiento_id"
              name="kar_tipo_movimiento_id"
              value={props.selectedRow.kar_tipo_movimiento_id || ""}
              onChange={handleChange}
            >
              {props.tipoMovimiento.map((tipo) => (
                <MenuItem key={tipo.tim_id} value={tipo.tim_id}>
                  {tipo.tim_nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Descripción */}
          <FormControl fullWidth margin="normal">
            <TextField
              autoFocus
              required
              id="kar_descripcion"
              name="kar_descripcion"
              label="Descripción"
              fullWidth
              variant="standard"
              value={props.selectedRow.kar_descripcion || ""}
              onChange={handleChange}
            />
          </FormControl>

          {/* Estado */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="estado-select-label">Estado</InputLabel>
            <Select
              labelId="estado-select-label"
              id="kar_estado"
              name="kar_estado"
              value={props.selectedRow.kar_estado || ""}
              onChange={handleChange}
            >
              {props.estado.map((estado) => (
                <MenuItem key={estado.est_id} value={estado.est_id}>
                  {estado.est_nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button type="submit">{methodName}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}


