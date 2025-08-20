import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormProductoCategoria from "./FormProductoCategoria";
import GridProductoCategoria from "./GridProductoCategoria";

export default function ProductoCategoria() {
  const [selectedRow, setSelectedRow] = useState({ id: 0 });
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [categorias, setCategorias] = useState([]);
  const [formOpen, setFormOpen] = useState(false);

  const reloadData = () => {
    axios.get('/v1/producto_categoria')
      .then(res => {
        const data = res.data.map(item => ({
          ...item,
          estadoId: item.estado?.id || item.estadoId,
        }));
        setCategorias(data);
      })
      .catch(err => {
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar categorías"
        });
      });
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div>
      <h1>Categorías de Producto</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormProductoCategoria
        open={formOpen}
        setOpen={setFormOpen}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />

      <GridProductoCategoria
        rows={categorias}
        selectedRow={selectedRow}
        setSelectedRow={(row) => {
          setSelectedRow(row);
          setFormOpen(true);
        }}
      />
    </div>
  );
}
