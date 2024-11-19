import * as React from "react";
import axios from "axios";  // Usa axios directamente
import MessageSnackBar from "../MessageSnackBar";
import FormTipoProduccion from "./FormTipoProduccion";
import GridTipoProduccion from "./GridTipoProduccion";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * El componente Tipo Produccion gestiona el módulo de TipoProduccion, integrando el formulario
 * y la tabla de datos.
 * 
 * @componente
 * @param {object} props - Propiedades pasadas al componente.
 * @returns {JSX.Element} El módulo de gestión de Tipo Producciones.
 */
export default function TipoProduccion(props) {
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
  const [tipoproducciones, setTipoProducciones] = React.useState([]);

  /**
   * Recarga los datos de las TipoProducciones desde el servidor.
   */
  const reloadData = () => {
    axios
      .get(`${SiteProps.urlbasev1}/tipoproducciones`)
      .then((response) => {
        const tipoproduccionData = response.data.map((item) => ({
          ...item,
          id: item.id,
        }));
        setTipoProducciones(tipoproduccionData);
      })
      .catch((error) => {
        console.error("Error al buscar Tipo Producciones!", error);
      });

  };

  React.useEffect(() => {
    reloadData();  // Llama a reloadData para cargar los datos iniciales
  }, []);


  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormTipoProduccion
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}  // Pasa reloadData como prop a FormTipoProduccion
        tipoproducciones={tipoproducciones}

      />
      <GridTipoProduccion
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        tipoproducciones={tipoproducciones}
      />
    </div>
  );
}

