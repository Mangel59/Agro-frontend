
/**
 * Presentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
import * as React from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormPresentacion from "./FormPresentacion";
import GridPresentacion from "./GridPresentacion";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente Presentacion.
 * @module Presentacion.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function Presentacion() {
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 0,
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: "",
  });
  const [Presentacion, setPresentacion] = React.useState([]);

  const reloadData = () => {
    axios.get(`${SiteProps.urlbasev1}/presentaciones`)
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setPresentacion(response.data.data);
        } else if (Array.isArray(response.data)) {
          setPresentacion(response.data);
        } else {
          console.error('La respuesta no es un array:', response.data);
          setMessage({
            open: true,
            severity: 'error',
            text: 'Error al cargar Presentación: respuesta no válida'
          });
        }
      })
      .catch((error) => {
        console.error('Error al cargar Presentación:', error);
        setMessage({
          open: true,
          severity: 'error',
          text: 'Error al cargar Presentación'
        });
      });
  };

  React.useEffect(() => {
    reloadData();
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Presentación</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormPresentacion
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
        Presentacion={Presentacion}
      />
      <GridPresentacion
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        Presentacion={Presentacion}
      />
    </div>
  );
}
