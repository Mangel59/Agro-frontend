import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoInventario from "./FormTipoInventario";
import GridTipoInventario from "./GridTipoInventario";

export default function TipoInventario() {
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estadoId: 1,
  };

  const [selectedRow, setSelectedRow] = useState(row);
  const [message, setMessage] = useState({
    open: false,
    severity: "success",
    text: "",
  });
  const [tipos, setTipos] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [rowCount, setRowCount] = useState(0);
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });

  const reloadData = () => {
    axios.get("/v1/tipo_inventario")
      .then((res) => {
        const filas = res.data.map((item) => ({
          ...item,
          estadoId: item.estado?.id || item.estadoId,
        }));
        setTipos(filas);
        setRowCount(filas.length);
      })
      .catch(() => {
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar tipos de inventario",
        });
      });
  };

  useEffect(() => {
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
        tipos={tipos}
      />

      <GridTipoInventario
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        tipos={tipos}
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
