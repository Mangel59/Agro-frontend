import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormKardex from "./FromKardex";
import GridKardex from "./GridKardex";
import GridArticuloKardex from "./GridArticuloKardex";
import FormArticuloKardex from "./FormArticuloKardex";
import ReKardex from "../RKardex/Rkardex";
import { Box, Typography, Button, Dialog, useTheme } from "@mui/material";

export default function Kardex() {
  const [kardexes, setKardexes] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");

  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  // Artículos
  const [articuloItems, setArticuloItems] = useState([]);
  const [selectedArticulo, setSelectedArticulo] = useState({});
  const [reloadArticulos, setReloadArticulos] = useState(false);

  // Catálogos para resolver nombres en grillas
  const [almacenes, setAlmacenes] = useState([]);
  const [producciones, setProducciones] = useState([]);
  const [tiposMovimiento, setTiposMovimiento] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);

  const theme = useTheme();

  // Paginación Kardex
  const [kardexPage, setKardexPage] = useState({ page: 0, size: 10 });
  const [totalKardex, setTotalKardex] = useState(0);
  const [loadingKardex, setLoadingKardex] = useState(false);

  // Paginación Artículos
  const [articuloPage, setArticuloPage] = useState({ page: 0, size: 10 });
  const [totalArticulos, setTotalArticulos] = useState(0);
  const [loadingArticulos, setLoadingArticulos] = useState(false);

  // Normalizador
  const toArray = (d) =>
    Array.isArray(d) ? d : (d?.content ?? d?.items ?? d?.data ?? d?.results ?? []);

  // ------- Cargar catálogos una vez -------
  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const [rAlm, rProd, rTmov, rPres] = await Promise.all([
          axios.get("/v1/items/almacen/0"),
          axios.get("/v1/items/produccion/0"),
          axios.get("/v1/items/tipo_movimiento/0"),
          axios.get("/v1/items/producto_presentacion/0"),
        ]);
        setAlmacenes(toArray(rAlm.data));
        setProducciones(toArray(rProd.data));
        setTiposMovimiento(toArray(rTmov.data));
        setPresentaciones(toArray(rPres.data));
      } catch (e) {
        // si algo falla, al menos deja arrays vacíos para no romper el render
        setAlmacenes([]); setProducciones([]); setTiposMovimiento([]); setPresentaciones([]);
      }
    };
    loadCatalogs();
  }, []);

  // ------- CRUD listas -------
  const reloadData = () => {
    setLoadingKardex(true);
    axios
      .get("/v1/kardex", { params: { page: kardexPage.page, size: kardexPage.size } })
      .then((res) => {
        const rows = toArray(res.data);
        const total =
          Number(res.data?.totalElements ?? res.data?.page?.totalElements ?? rows.length);
        setKardexes(rows);
        setTotalKardex(total);
        if (rows.length > 0 && !selectedRow) setSelectedRow(rows[0]);
      })
      .catch(() => {
        setMessage({ open: true, severity: "error", text: "Error al cargar kardexes" });
        setKardexes([]); setTotalKardex(0);
      })
      .finally(() => setLoadingKardex(false));
  };

  const loadArticulos = (kardexId) => {
    if (!kardexId) { setArticuloItems([]); setTotalArticulos(0); return; }
    setLoadingArticulos(true);
    axios
      .get(`/v1/articulo-kardex`, {
        params: { kardexId, page: articuloPage.page, size: articuloPage.size },
      })
      .then((res) => {
        const rows = toArray(res.data);
        const total =
          Number(res.data?.totalElements ?? res.data?.page?.totalElements ?? rows.length);
        setArticuloItems(rows);
        setTotalArticulos(total);
      })
      .catch(() => { setArticuloItems([]); setTotalArticulos(0); })
      .finally(() => setLoadingArticulos(false));
  };

  // Effects
  useEffect(() => { reloadData(); }, [kardexPage.page, kardexPage.size]);
  useEffect(() => {
    if (selectedRow) loadArticulos(selectedRow.id);
    else { setArticuloItems([]); setTotalArticulos(0); }
  }, [selectedRow, reloadArticulos, articuloPage.page, articuloPage.size]);

  // Estilos
  const containerKardex = {
    backgroundColor: theme.palette.mode === "dark" ? "#1e2a2c" : "#c9e6fe",
    padding: 3,
    borderRadius: 2,
  };
  const containerArticulos = {
    backgroundColor: theme.palette.mode === "dark" ? "#2c383b" : "#caddf3",
    padding: 2,
    borderRadius: 2,
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* KARDEX */}
      <Box sx={{ ...containerKardex, mb: 4 }}>
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Gestión de Kardex</Typography>
          <Button variant="contained" onClick={() => setSearchDialogOpen(true)}>
            Buscar reporte
          </Button>
        </Box>

        <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
          <Button variant="contained" color="primary" onClick={() => { setFormMode("create"); setFormOpen(true); }}>
            + Agregar
          </Button>
          <Button variant="outlined" onClick={() => { setFormMode("edit"); setFormOpen(true); }} disabled={!selectedRow}>
            Actualizar
          </Button>
          <Button
            variant="outlined" color="error" disabled={!selectedRow}
            onClick={async () => {
              if (!selectedRow) return;
              if (!window.confirm("¿Eliminar el Kardex seleccionado?")) return;
              try {
                await axios.delete(`/v1/kardex/${selectedRow.id}`);
                setMessage({ open: true, severity: "success", text: "Kardex eliminado correctamente." });
                setSelectedRow(null);
                reloadData();
              } catch {
                setMessage({ open: true, severity: "error", text: "Error al eliminar el Kardex." });
              }
            }}
          >
            Eliminar
          </Button>
        </Box>

        <FormKardex
          open={formOpen}
          setOpen={setFormOpen}
          formMode={formMode}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          reloadData={reloadData}
          setMessage={setMessage}
        />

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>Lista de Kardex</Typography>
          <GridKardex
            kardexes={kardexes}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            loading={loadingKardex}
            paginationModel={kardexPage}
            setPaginationModel={setKardexPage}
            rowCount={totalKardex}
            // 👇 catálogos para mostrar nombres en vez de ids
            almacenes={almacenes}
            producciones={producciones}
            tiposMovimiento={tiposMovimiento}
          />
        </Box>
      </Box>

      {/* ARTÍCULOS */}
      {selectedRow && (
        <Box sx={{ ...containerArticulos, mt: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Artículos del Kardex seleccionado</Typography>
            <Box display="flex" gap={2}>
              <FormArticuloKardex
                selectedRow={selectedArticulo}
                kardexId={selectedRow?.id || ""}
                setSelectedRow={setSelectedArticulo}
                setMessage={setMessage}
                reloadData={() => setReloadArticulos((prev) => !prev)}
              />
            </Box>
          </Box>

          <GridArticuloKardex
            items={articuloItems}
            setSelectedRow={setSelectedArticulo}
            loading={loadingArticulos}
            paginationModel={articuloPage}
            setPaginationModel={setArticuloPage}
            rowCount={totalArticulos}
            // 👇 catálogo para resolver "Presentación"
            presentaciones={presentaciones}
          />
        </Box>
      )}

      <Dialog open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)} fullWidth maxWidth="lg">
        <ReKardex setOpen={setSearchDialogOpen} />
      </Dialog>

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
