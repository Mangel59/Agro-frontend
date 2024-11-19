import * as React from "react";
import axios from "axios";  // Usa axios directamente
import MessageSnackBar from "../MessageSnackBar";
import FormTipoMovimiento from "./FormTipoMovimiento";
import GridTipoMovimiento from "./GridTipoMovimiento";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * El componente TipoMovimiento gestiona el módulo de tipomovimientoss, integrando el formulario
 * y la tabla de datos.
 * 
 * @componente
 * @param {object} props - Propiedades pasadas al componente.
 * @returns {JSX.Element} El módulo de gestión de TipoMovimientos.
 */
export default function TipoMovimiento(props) {
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 0,
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const messageData = {
    open: false,
    severity: "success",
    text: "",
  };

  const [message, setMessage] = React.useState(messageData);
  const [tipomovimientos, setTipoMovimientos] = React.useState([]);

  /**
   * Recarga los datos de las TipoMovimientos desde el servidor.
   */
  const reloadData = () => {
    axios
      .get(`${SiteProps.urlbasev1}/tipomovimientos`)
      .then((response) => {
        const tipomovimientoData = response.data.map((item) => ({
          ...item,
          id: item.id,
        }));
        setTipoMovimientos(tipomovimientoData);
      })
      .catch((error) => {
        console.error("Error al buscar TipoMovimientos!", error);
      });

  };

  React.useEffect(() => {
    reloadData();  // Llama a reloadData para cargar los datos iniciales
  }, []);


  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormTipoMovimiento
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}  // Pasa reloadData como prop a FormTipoMovimiento
        tipomovimientos={tipomovimientos}

      />
      <GridTipoMovimiento
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        tipomovimientos={tipomovimientos}
      />
    </div>
  );
}

