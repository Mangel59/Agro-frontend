import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormProducto from "./FormProducto";
import GridProducto from "./GridProducto";

export default function Producto() {
  const [selectedRow, setSelectedRow] = useState({});
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [productos, setProductos] = useState([]);

  const reloadData = async () => {
    try {
      const [resProductos, resCategorias, resUnidades, resIngredientes] = await Promise.all([
        axios.get("/v1/producto"),
        axios.get("/v1/producto_categoria"),
        axios.get("/v1/unidad"),
        axios.get("v1/ingrediente-presentacion-producto")
      ]);

      const mapCategorias = Object.fromEntries(
        resCategorias.data.map((cat) => [cat.id, cat.nombre])
      );
      const mapUnidades = Object.fromEntries(
        resUnidades.data.map((u) => [u.id, u.nombre])
      );
      const mapIngredientes = Object.fromEntries(
        resIngredientes.data.map((i) => [i.id, i.nombre])
      );
      const mapEstados = {
        1: "Activo",
        2: "Inactivo"
      };

      const productosConNombres = resProductos.data.map((p) => ({
        ...p,
        productoCategoriaNombre: mapCategorias[p.productoCategoriaId] || "(sin categoría)",
        unidadMinimaNombre: mapUnidades[p.unidadMinimaId] || "(sin unidad)",
        estadoNombre: mapEstados[p.estadoId] || "(desconocido)",
        ingredientePresentacionNombre: mapIngredientes[p.ingredientePresentacionProductoId] || "(sin ingrediente)"
      }));

      setProductos(productosConNombres);
    } catch (err) {
      console.error(" Error al cargar productos:", err);
      setMessage({
        open: true,
        severity: "error",
        text: "Error al cargar productos",
      });
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div>
      <h1>Gestión de Productos</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormProducto
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />
      <GridProducto
        productos={productos}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
