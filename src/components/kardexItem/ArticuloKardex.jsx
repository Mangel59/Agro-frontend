import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormArticuloKardex from "./FormArticuloKardex.jsx";
import GridArticuloKardex from "./GridArticuloKardex.jsx";

export default function ArticuloKardex() {
  const [selectedRow, setSelectedRow] = useState({});
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [items, setItems] = useState([]);

  const reloadData = async () => {
    try {
      const [resItems, resPresentaciones] = await Promise.all([
        axios.get("/v1/articulo-kardex"),
        axios.get("/v1/producto_presentacion"),
      ]);

      const mapPresentaciones = Object.fromEntries(
        resPresentaciones.data.map((p) => [p.id, p.nombre])
      );

      const itemsConNombres = resItems.data.map((item) => ({
        ...item,
        productoPresentacionNombre: mapPresentaciones[item.productoPresentacionId] || "(sin nombre)",
      }));

      setItems(itemsConNombres);
    } catch (err) {
      setMessage({ open: true, severity: "error", text: "Error al cargar datos" });
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <>
      <h1>Gestión de Artículos Kardex</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormArticuloKardex
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />
      <GridArticuloKardex
        items={items}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </>
  );
}
