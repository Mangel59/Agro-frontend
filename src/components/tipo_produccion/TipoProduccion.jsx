// TipoProduccion.jsx
import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoProduccion from "./FormTipoProduccion";
import GridTipoProduccion from "./GridTipoProduccion";
import { SiteProps } from "../dashboard/SiteProps";

export default function TipoProduccion(props) {
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 0,
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const [tiposProduccion, setTiposProduccion] = React.useState([]);
  const messageData = {
    open: false,
    severity: "success",
    text: "",
  };

  const [message, setMessage] = React.useState(messageData);
  const gridRef = React.useRef();

  const reloadData = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({
        open: true,
        severity: "error",
        text: "Error: Token de autenticación no encontrado.",
      });
      return;
    }

    axios
      .get(`${SiteProps.urlbasev1}/tipo_produccion`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTiposProduccion(response.data || []);
        gridRef.current.reloadData();
      })
      .catch((error) => {
        console.error("Error al cargar Tipos de Producción:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar Tipos de Producción",
        });
      });
  };

  React.useEffect(() => {
    reloadData();
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Tipo Producción</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormTipoProduccion
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
      />
      <GridTipoProduccion
        innerRef={gridRef}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
      />
    </div>
  );
}