
/**
 * Unidad componente principal.
 * @component
 * @returns {JSX.Element}
 */
import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormUnidad from "./FormUnidad";
import GridUnidad from "./GridUnidad";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente Unidad.
 * @module Unidad.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function Unidad() {
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 0,
    empresa: ""
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: "",
  });

  const [unidades, setUnidades] = React.useState([]);

  // Estado para filtros
  const [filterModel, setFilterModel] = React.useState({
    items: [],
  });

  // Estado para ordenamiento (AHORA USADO correctamente)
  const [sortModel, setSortModel] = React.useState([]);

  // Estado para paginación
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

  const [rowCount, setRowCount] = React.useState(0);

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
      .get(`${SiteProps.urlbasev1}/unidad`, {
        params: {
          page: paginationModel.page,
          size: paginationModel.pageSize,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setUnidades(response.data.data);
          setRowCount(response.data.totalCount || response.data.data.length);
        } else if (Array.isArray(response.data)) {
          setUnidades(response.data);
          setRowCount(response.data.length);
        } else {
          console.error("La respuesta no es un array:", response.data);
          setMessage({
            open: true,
            severity: "error",
            text: "Error al cargar Unidades: respuesta no válida",
          });
        }
      })
      .catch((error) => {
        console.error("Error al cargar Unidades:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar Unidades",
        });
      });
  };

  React.useEffect(() => {
    reloadData();
  }, [paginationModel]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Unidad</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormUnidad
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
        unidades={unidades}
      />
      <GridUnidad
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        unidades={unidades}
        rowCount={rowCount}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        filterModel={filterModel}
        setFilterModel={setFilterModel}
        sortModel={sortModel}                // ✅ Añadido
        setSortModel={setSortModel}
      />
    </div>
  );
}
