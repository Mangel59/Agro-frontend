import * as React from "react";
import axios from "../axiosConfig";

import MessageSnackBar from "../MessageSnackBar";
import FormPais from "./FormPais";
import GridPais from "./GridPais";

/**
 * Componente País.
 */
export default function Pais() {
  const [selectedRow, setSelectedRow] = React.useState({ id: 0, name: "" });
  const [message, setMessage] = React.useState({ open: false, severity: "success", text: "" });
  const [paises, setPaises] = React.useState([]);

  const reloadData = () => {
    console.log("Reloading data in Pais.jsx");
    axios.get('/api/v1/pais/all')
      .then((response) => {
        setPaises(response.data);
      })
      .catch((error) => {
        console.error("Error al buscar país:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar la lista de países.",
        });
      });
  };

  React.useEffect(() => {
    reloadData();
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>País</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormPais 
        setMessage={setMessage} 
        selectedRow={selectedRow} 
        setSelectedRow={setSelectedRow} 
        paises={paises} 
        reloadData={reloadData}  // ✅ ahora sí pasamos reloadData
      />
      <GridPais 
        selectedRow={selectedRow} 
        setSelectedRow={setSelectedRow} 
        paises={paises}           // ✅ nombre correcto paises
      />
    </div>
  );
}
