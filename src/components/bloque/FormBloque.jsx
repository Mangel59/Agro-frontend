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
import Drawer from '@mui/material/Drawer'; // Para el menú flotante
import MenuIcon from '@mui/icons-material/Menu'; // Ícono de menú para abrir/cerrar

export default function FormBloque(props) {
  const [open, setOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false); // Controlar el estado del menú
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
      nombre: "",
      descripcion: "",
      sedeId: 0,
      numeroPisos: 0,
      geolocalizacion: {
        type: "Point",
        coordinates: [0, 0],
      },
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
    props.deleteBloque(props.selectedRow.id);
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = props.selectedRow;

    if (methodName === "Add") {
      props.addBloque(formData);
    } else if (methodName === "Update") {
      props.updateBloque(formData);
    }

    setOpen(false);
  };

  // Controlar el abrir/cerrar del menú
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <React.Fragment>
      {/* Botón para abrir el menú */}
      <Button onClick={toggleDrawer(true)} sx={{ position: 'fixed', top: '10px', left: '10px' }}>
        <MenuIcon />
      </Button>

      {/* Menú flotante */}
      <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            backgroundColor: '#fff', // Fondo blanco
            height: '100vh', // Altura completa de la pantalla
            borderRight: '1px solid #ddd', // Borde claro
            padding: 2,
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Sombra para destacar el menú
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          {/* Aquí puedes agregar más contenido del menú */}
          <p>Menú flotante</p>
        </Box>
      </Drawer>

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
        <DialogTitle>Bloque</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>

          <FormControl fullWidth>
            <TextField
              autoFocus
              required
              id="nombre"
              name="nombre"
              label="Nombre"
              fullWidth
              variant="standard"
              margin="normal"
              value={props.selectedRow?.nombre || ''}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              required
              id="descripcion"
              name="descripcion"
              label="Descripción"
              fullWidth
              variant="standard"
              margin="normal"
              value={props.selectedRow?.descripcion || ''}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              required
              id="numeroPisos"
              name="numeroPisos"
              label="Número de Pisos"
              fullWidth
              variant="standard"
              margin="normal"
              value={props.selectedRow?.numeroPisos || ''}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="geolocalizacion-type-label">Tipo de Geolocalización</InputLabel>
            <Select
              labelId="geolocalizacion-type-label"
              id="geolocalizacion_type"
              name="geolocalizacion_type"
              value={props.selectedRow?.geolocalizacion.type || "Point"}
              onChange={(event) => {
                const type = event.target.value;
                props.setSelectedRow((prevRow) => ({
                  ...prevRow,
                  geolocalizacion: {
                    ...prevRow.geolocalizacion,
                    type,
                  },
                }));
              }}
            >
              <MenuItem value="Point">Point</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <TextField
              required
              id="latitud"
              name="latitud"
              label="Latitud"
              fullWidth
              variant="standard"
              margin="normal"
              value={props.selectedRow?.geolocalizacion.coordinates[1] || ''}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              required
              id="longitud"
              name="longitud"
              label="Longitud"
              fullWidth
              variant="standard"
              margin="normal"
              value={props.selectedRow?.geolocalizacion.coordinates[0] || ''}
              onChange={handleInputChange}
            />
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
