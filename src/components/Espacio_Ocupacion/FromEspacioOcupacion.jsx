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
// Agregar esta línea para importar Grid
import Grid from "@mui/material/Grid";

export default function FormEspacioOcuOcupacion(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'latitud' || name === 'longitud') {
      props.setSelectedRow((prevRow) => ({
        ...prevRow,
        geolocalizacion: {
          ...prevRow.geolocalizacion,
          coordinates: name === 'latitud' 
            ? [prevRow.geolocalizacion.coordinates[0], parseFloat(value)]
            : [parseFloat(value), prevRow.geolocalizacion.coordinates[1]],
        },
      }));
    } else {
      props.setSelectedRow((prevRow) => ({
        ...prevRow,
        [name]: value,
      }));
    }
  };

  const create = () => {
    const row = {
      id: 0,
      espacio: "",
      espacioacti: "",
      fechainicio: 0,
      fechafin:"",
      estado: 0
    };
    props.setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (!props.selectedRow || !props.selectedRow.id) {
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
    if (!props.selectedRow || !props.selectedRow.id) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Seleccione una fila para eliminar!",
      });
      return;
    }
    props.deleteEspacioOcu(props.selectedRow.id);
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = props.selectedRow;

    if (methodName === "Add") {
      props.addEspacioOcu(formData);
    } else if (methodName === "Update") {
      props.updateEspacioOcu(formData);
    }

    setOpen(false);
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
        <DialogTitle>Almacén Ocupacion </DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>

          {/* Campos de formulario para los datos del EspacioOcu */}
          <FormControl fullWidth>
            <TextField
              autoFocus
              required  
              id="espacio"
              name="espacio"
              label="Espacio"
              fullWidth
              variant="standard"
              margin="normal"
              value={props.selectedRow?.espacio || ''} 
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              autoFocus
              required  
              id="espacioacti"
              name="espacioacti"
              label="Espacio actividad"
              fullWidth
              variant="standard"
              margin="normal"
              value={props.selectedRow?.espacioacti || ''} 
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl >
          <Grid item xs={12} sm={6}>
                <TextField required id="fechainicio" 
                name="fechainicio" label="Fecha de Inicio" 
                type="date" fullWidth variant="standard" 
                defaultValue={props.selectedRow?.fechainicio || ""}
                 InputLabelProps={{ shrink: true }} />
              </Grid>
          </FormControl>
          <FormControl >
          <Grid item xs={12} sm={6}>
                <TextField required id="fechafin" 
                name="fechafin" label="Fecha de Fin" 
                type="date" fullWidth variant="standard" 
                defaultValue={props.selectedRow?.fechafin || ""}
                 InputLabelProps={{ shrink: true }} />
              </Grid>
          </FormControl>
          <FormControl fullWidth>
                  <InputLabel id="estado-label">Estado</InputLabel>
                  <Select labelId="estado-label" id="estado" name="estado" defaultValue={props.selectedRow?.estado || ""}>
                    <MenuItem value={1}>Activo</MenuItem>
                    <MenuItem value={0}>Inactivo</MenuItem>
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
