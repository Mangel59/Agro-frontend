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
  const messageData = {
    open: false,
    severity: "success",
    text: "",
  };

  const [message, setMessage] = React.useState(messageData);
  const [tiposProduccion, setTiposProduccion] = React.useState([]);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

  const reloadData = () => {
    axios
      .get(`${SiteProps.urlbasev1}/tipo_produccion`, {
        params: {
          page: paginationModel.page,
          size: paginationModel.pageSize,
        },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setTiposProduccion(response.data.data);
        } else if (Array.isArray(response.data)) {
          setTiposProduccion(response.data);
        } else {
          console.error("La respuesta no es un array:", response.data);
          setMessage({
            open: true,
            severity: "error",
            text: "Error al cargar Tipos de Producción: respuesta no válida",
          });
        }
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
  }, [paginationModel]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormTipoProduccion
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
        tiposProduccion={tiposProduccion}
      />
      <GridTipoProduccion
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        tiposProduccion={tiposProduccion}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
      />
    </div>
  );
}