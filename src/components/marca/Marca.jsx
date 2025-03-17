
/**
 * Marca componente principal.
 * @component
 * @returns {JSX.Element}
 */
import React from "react"; // ✅ Importación necesaria
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormMarca from "./FormMarca";
import GridMarca from "./GridMarca";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente Marca.
 * @module Marca.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function Marca() {
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 0,
    empresa: "",
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: "",
  });

  const [marcas, setMarcas] = React.useState([]);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });
  const [rowCount, setRowCount] = React.useState(0);
  const [sortModel, setSortModel] = React.useState([]); // ✅ ahora sí lo usas correctamente
  const [filterModel, setFilterModel] = React.useState({ items: [] });

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
      .get(`${SiteProps.urlbasev1}/marca`, {
        params: {
          page: paginationModel.page,
          size: paginationModel.pageSize,
          sort: sortModel[0]?.field,
          order: sortModel[0]?.sort,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setMarcas(response.data.data);
          setRowCount(response.data.totalCount || response.data.data.length);
        } else if (Array.isArray(response.data)) {
          setMarcas(response.data);
          setRowCount(response.data.length);
        } else {
          console.error("La respuesta no es un array:", response.data);
          setMessage({
            open: true,
            severity: "error",
            text: "Error al cargar Marcas: respuesta no válida",
          });
        }
      })
      .catch((error) => {
        console.error("Error al cargar Marcas:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar Marcas",
        });
      });
  };

  React.useEffect(() => {
    reloadData();
  }, [paginationModel, sortModel]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Marca</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormMarca
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
        marcas={marcas}
      />
      <GridMarca
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        marcas={marcas}
        rowCount={rowCount}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        filterModel={filterModel}
        setFilterModel={setFilterModel}
        sortModel={sortModel} 
        setSortModel={setSortModel}
      />
    </div>
  );  
}
