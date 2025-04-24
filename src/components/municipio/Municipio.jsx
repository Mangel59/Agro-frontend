import * as React from "react";
import axios from "../axiosConfig"; // Asegúrate que la ruta es correcta

import MessageSnackBar from "../MessageSnackBar";
import FormMunicipio from "./FormMunicipio";
import GridMunicipio from "./GridMunicipio";

/**
 * Componente Municipio.
 */
export default function Municipio() {
  const [selectedRow, setSelectedRow] = React.useState({ id: 0, name: "" });
  const [message, setMessage] = React.useState({ open: false, severity: "success", text: "" });
  const [municipios, setMunicipios] = React.useState([]);

  React.useEffect(() => {
    console.log("Se ejecuta useEffect Municipio.jsx");
    axios.get('/api/v1/municipio/all')
      .then((response) => {
        setMunicipios(response.data);
      })
      .catch((error) => {
        console.error("Error al buscar municipio:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar la lista de municipios.",
        });
      });
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Municipio</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormMunicipio setMessage={setMessage} selectedRow={selectedRow} setSelectedRow={setSelectedRow} municipios={municipios} />
      <GridMunicipio selectedRow={selectedRow} setSelectedRow={setSelectedRow} municipios={municipios} />
    </div>
  );
}
