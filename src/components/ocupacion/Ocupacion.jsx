import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormOcupacion from "./FormOcupacion";
import GridOcupacion from "./GridOcupacion";

export default function Ocupacion() {
  const [selectedRow, setSelectedRow] = useState({});
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });

  // Data
  const [ocupaciones, setOcupaciones] = useState([]);

  // Paginación (el backend es 0-based)
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const reloadData = async (pageArg = page, sizeArg = pageSize) => {
    const token = localStorage.getItem("token");
    const headers = { headers: { Authorization: `Bearer ${token}` } };

    try {
      setLoading(true);

      const { data } = await axios.get("/v1/ocupacion", {
        ...headers,
        params: {
          page: pageArg, // 0-based
          size: sizeArg,
          // sort: "id,desc", // <- si lo necesitas
        },
      });

      // Estructura esperada:
      // { content: [...], page: { size, number, totalElements, totalPages } }
      const content = Array.isArray(data?.content) ? data.content : [];
      const meta = data?.page ?? { size: sizeArg, number: pageArg, totalElements: 0 };

      const mapped = content.map((o) => ({
        ...o,
        // Muestra provisionalmente el ID si aún no tienes el nombre
        tipoActividadNombre: `${o.tipoActividadId}`,
      }));

      setOcupaciones(mapped);
      setRowCount(meta.totalElements ?? 0);
      setPage(meta.number ?? pageArg);
      setPageSize(meta.size ?? sizeArg);
    } catch (err) {
      console.error("❌ Error al cargar Actividad ocupaciones:", err);
      setMessage({
        open: true,
        severity: "error",
        text: "Error al cargar Actividad ocupaciones",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadData(0, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handlers para el grid
  const handlePageChange = (newPage) => {
    setPage(newPage);
    reloadData(newPage, pageSize);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(0);
    reloadData(0, newPageSize);
  };

  return (
    <div>
      <h1> Ocupaciones</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormOcupacion
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={() => reloadData(page, pageSize)}
      />

      <GridOcupacion
        ocupaciones={ocupaciones}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        // Paginación
        page={page}
        pageSize={pageSize}
        rowCount={rowCount}
        loading={loading}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
