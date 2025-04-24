import * as React from "react";
import axios from "../axiosConfig"; // Asegúrate que la ruta es correcta

import MessageSnackBar from "../MessageSnackBar";
import FormDepartamento from "./FormDepartamento"; // Cambia a FormDepartamento
import GridDepartamento from "./GridDepartamento"; // Cambia a GridDepartamento

/**
 * Componente Departamento.
 */
export default function Departamento() {
  const [selectedRow, setSelectedRow] = React.useState({ id: 0, name: "" });
  const [message, setMessage] = React.useState({ open: false, severity: "success", text: "" });
  const [departamentos, setDepartamentos] = React.useState([]);

  React.useEffect(() => {
    console.log("Se ejecuta useEffect Departamento.jsx");
    axios.get('/api/v1/departamento/all')
      .then((response) => {
        setDepartamentos(response.data);
      })
      .catch((error) => {
        console.error("Error al buscar departamento:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar la lista de departamentos.",
        });
      });
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Departamento</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormDepartamento 
        setMessage={setMessage} 
        selectedRow={selectedRow} 
        setSelectedRow={setSelectedRow} 
        departamentos={departamentos} 
      />
      <GridDepartamento 
        selectedRow={selectedRow} 
        setSelectedRow={setSelectedRow} 
        departamentos={departamentos} 
      />
    </div>
  );
}
