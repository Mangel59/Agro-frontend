// TipoProduccion.jsx
import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoProduccion from "./FormTipoProduccion";
import GridTipoProduccion from "./GridTipoProduccion";
import { SiteProps } from "../dashboard/SiteProps";

export default function TipoProduccion() {
  const row = { id: 0, nombre: "", descripcion: "", estado: 0 };
  const [selectedRow, setSelectedRow] = React.useState(row);
  const [message, setMessage] = React.useState({ open: false, severity: "success", text: "" });
  const gridRef = React.useRef(null);

  const reloadData = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ open: true, severity: "error", text: "Error: Token de autenticación no encontrado." });
      return;
    }
    if (gridRef.current?.reloadData) gridRef.current.reloadData();
  };

  React.useEffect(() => { reloadData(); }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1 style={{ marginBottom: "1rem" }}>Gestión de Tipos de Producción</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormTipoProduccion
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
      />
      <GridTipoProduccion
        innerRef={gridRef}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}

