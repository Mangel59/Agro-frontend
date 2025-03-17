
/**
 * TipoMovimiento componente principal.
 * @component
 * @returns {JSX.Element}
 */
import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoMovimiento from "./FormTipoMovimiento";
import GridTipoMovimiento from "./GridTipoMovimiento";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente TipoMovimiento.
 * @module TipoMovimiento.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function TipoMovimiento(props) {
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 0,
    empresa: 0,
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const messageData = {
    open: false,
    severity: "success",
    text: "",
  };

  const [message, setMessage] = React.useState(messageData);
  const [tiposMovimiento, setTiposMovimiento] = React.useState([]);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

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
      .get(`${SiteProps.urlbasev1}/tipo_movimiento`, {
        params: {
          page: paginationModel.page,
          size: paginationModel.pageSize,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setTiposMovimiento(response.data);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setTiposMovimiento(response.data.data);
        } else {
          console.error("La respuesta no es un array válido:", response.data);
          setMessage({
            open: true,
            severity: "error",
            text: "Error al cargar Tipos de Movimiento: respuesta no válida.",
          });
        }
      })
      .catch((error) => {
        console.error("Error al cargar Tipos de Movimiento:", error);
        if (error.response && error.response.status === 403) {
          setMessage({
            open: true,
            severity: "error",
            text: "Error: No tienes permisos para cargar los Tipos de Movimiento.",
          });
        } else {
          setMessage({
            open: true,
            severity: "error",
            text: `Error al cargar Tipos de Movimiento: ${error.message}`,
          });
        }
      });
  };

  React.useEffect(() => {
    reloadData();
  }, [paginationModel]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Tipo Movimiento</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormTipoMovimiento
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
        tiposMovimiento={tiposMovimiento}
      />
      <GridTipoMovimiento
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        tiposMovimiento={tiposMovimiento}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
      />
    </div>
  );
}
