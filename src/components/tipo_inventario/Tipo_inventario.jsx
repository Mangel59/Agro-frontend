import React from "react";
import axios from "../axiosConfig.js";
import MessageSnackBar from "../MessageSnackBar.jsx";
import FormTipoInventario from "./FormTipoInventario";
import GridTipoInventario from "./GridTipoInventario";
import { SiteProps } from "../dashboard/SiteProps";

export default function TipoInventario() {
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estadoId: 1,
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: "",
  });
  const [tipos, setTipos] = React.useState([]);
  const [rowCount, setRowCount] = React.useState(0);
  const [sortModel, setSortModel] = React.useState([]);
  const [filterModel, setFilterModel] = React.useState({ items: [] });

  const reloadData = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({
        open: true,
        severity: "error",
        text: "Token no encontrado.",
      });
      return;
    }

    axios
      .get(`${SiteProps.urlbasev1}/tipo_inventario`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setTipos(response.data);
          setRowCount(response.data.length);
        } else {
          setMessage({
            open: true,
            severity: "error",
            text: "Respuesta inesperada del servidor.",
          });
        }
      })
      .catch((error) => {
        const msg =
          error.response?.status === 403
            ? "No tienes permiso para ver los tipos de inventario."
            : `Error al cargar: ${error.message}`;
        setMessage({ open: true, severity: "error", text: msg });
      });
  };

  React.useEffect(() => {
    reloadData();
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Tipo de Inventario</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormTipoInventario
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
      />

      <GridTipoInventario
        tipos={tipos}
        rowCount={rowCount}
        loading={false}
        paginationModel={{ page: 0, pageSize: 5 }}
        setPaginationModel={() => {}}
        sortModel={sortModel}
        setSortModel={setSortModel}
        setFilterModel={setFilterModel}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
