import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormMarca from "./FormMarca";
import GridMarca from "./GridMarca";
import { SiteProps } from "../dashboard/SiteProps";

export default function Marca(props) {
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 0,
    empresa: ""
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const messageData = {
    open: false,
    severity: "success",
    text: "",
  };

  const [message, setMessage] = React.useState(messageData);
  const [marcas, setMarcas] = React.useState([]);
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
      .get(`${SiteProps.urlbasev1}/marca`, {
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
  }, [paginationModel]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
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
      />
    </div>
  );
}
