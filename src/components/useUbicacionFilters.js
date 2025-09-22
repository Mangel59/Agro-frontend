// src/components/useUbicacionFilters.js
import { useEffect, useState } from "react";
import axios from "../components/axiosConfig";

/* ========================= Helpers comunes ========================= */
const asArray = (x) =>
  Array.isArray(x) ? x : (x && Array.isArray(x.content) ? x.content : []);

const uniqById = (arr) => {
  const map = new Map();
  for (const it of arr ?? []) map.set(String(it.id), it);
  return Array.from(map.values());
};

// Normalizadores de fecha
const __toReportDT = (val) => (val ? String(val).replace("T", " ") : "");
const __toSQLDate = (dt) => (dt ? String(dt).split("T")[0] : null);

// Mapea IDs de ubicación -> columnas SQL
export const DEFAULT_ALIASES = {
  pais_id: "pa.pais_id",
  departamento_id: "d.dep_id",
  municipio_id: "m.municipio_id",
  sede_id: "se.sede_id",
  bloque_id: "bl.bloque_id",
  espacio_id: "es.espacio_id",
  almacen_id: "a.almacen_id",
};

// Agrega condiciones de ubicación si existen ids
function __appendUbicacionConds(conds, src, aliases = DEFAULT_ALIASES) {
  if (!src) return;
  const keys = [
    "pais_id",
    "departamento_id",
    "municipio_id",
    "sede_id",
    "bloque_id",
    "espacio_id",
    "almacen_id",
  ];
  for (const k of keys) {
    const v = src[k];
    if (v !== undefined && v !== null && String(v) !== "") {
      const col = aliases[k] || k;
      conds.push(`AND ${col} = ${Number(v)}`);
    }
  }
}

// Agrega condiciones simples de rango fecha (YYYY-MM-DD o YYYY-MM-DDTHH:mm)
function __appendRangoFecha(conds, colDate, fecha_inicio, fecha_fin) {
  const ini = __toSQLDate(fecha_inicio);
  const fin = __toSQLDate(fecha_fin);
  if (ini && fin) conds.push(`AND ${colDate} BETWEEN "${ini}" AND "${fin}"`);
  else if (ini) conds.push(`AND DATE(${colDate}) >= "${ini}"`);
  else if (fin) conds.push(`AND DATE(${colDate}) <= "${fin}"`);
}

/* ========================= Hook principal ========================= */
/**
 * Hook unificado de filtros de Ubicación + (opcional) datos/estado para Pedido.
 * No renderiza JSX.
 */
export default function useUbicacionFilters({
  empresaId = null,
  headers = {},
  autoselectSingle = true,
  initialForm = {},
} = {}) {
  /* ---------- Ubicación (cascada) ---------- */
  const [form, setForm] = useState({
    pais_id: "",
    departamento_id: "",
    municipio_id: "",
    sede_id: "",
    bloque_id: "",
    espacio_id: "",
    almacen_id: "",
    ...initialForm,
  });

  const [data, setData] = useState({
    paises: [],
    departamentos: [],
    municipios: [],
    sedes: [],
    bloques: [],
    espacios: [],
    almacenes: [],
  });

  const limpiarCamposDesde = (campo) => {
    const orden = [
      "pais_id",
      "departamento_id",
      "municipio_id",
      "sede_id",
      "bloque_id",
      "espacio_id",
      "almacen_id",
    ];
    const i = orden.indexOf(campo);
    if (i === -1) return;
    setForm((prev) => {
      const next = { ...prev };
      for (const c of orden.slice(i + 1)) next[c] = "";
      return next;
    });
  };

  const handleChange = (field) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [field]: value }));
  };

  // Países
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get("/v1/pais", headers);
        if (!mounted) return;
        setData((d) => ({ ...d, paises: asArray(res.data) }));
      } catch {
        setData((d) => ({ ...d, paises: [] }));
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // País -> Departamentos
  useEffect(() => {
    if (!form.pais_id) {
      setData((d) => ({
        ...d,
        departamentos: [],
        municipios: [],
        sedes: [],
        bloques: [],
        espacios: [],
        almacenes: [],
      }));
      return;
    }
    limpiarCamposDesde("pais_id");
    (async () => {
      try {
        const res = await axios.get("/v1/departamento", headers);
        const list = asArray(res.data).filter(
          (dep) => Number(dep.paisId) === Number(form.pais_id)
        );
        const unique = uniqById(list);
        setData((d) => ({ ...d, departamentos: unique }));
        if (autoselectSingle && unique.length === 1) {
          setForm((f) => ({ ...f, departamento_id: String(unique[0].id) }));
        }
      } catch {
        setData((d) => ({ ...d, departamentos: [] }));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.pais_id]);

  // Depto -> Municipios
  useEffect(() => {
    if (!form.departamento_id) {
      setData((d) => ({
        ...d,
        municipios: [],
        sedes: [],
        bloques: [],
        espacios: [],
        almacenes: [],
      }));
      return;
    }
    limpiarCamposDesde("departamento_id");
    (async () => {
      try {
        const res = await axios.get(
          `/v1/municipio?departamentoId=${form.departamento_id}`,
          headers
        );
        const list = asArray(res.data);
        setData((d) => ({ ...d, municipios: list }));
        if (autoselectSingle && list.length === 1) {
          setForm((f) => ({ ...f, municipio_id: String(list[0].id) }));
        }
      } catch {
        setData((d) => ({ ...d, municipios: [] }));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.departamento_id]);

  // Municipio -> Sedes (filtra por empresa cuando la data lo permite)
  useEffect(() => {
    if (!form.municipio_id) {
      setData((d) => ({
        ...d,
        sedes: [],
        bloques: [],
        espacios: [],
        almacenes: [],
      }));
      return;
    }
    limpiarCamposDesde("municipio_id");
    (async () => {
      try {
        const res = await axios.get("/v1/sede", headers);
        const raw = asArray(res.data);
        const municipioId = Number(form.municipio_id);
        const empresaNum = empresaId != null ? Number(empresaId) : null;
        const itemsTienenEmpresa = raw.some((s) => s.empresaId != null);

        const filtered = raw.filter((s) => {
          const sameMun = Number(s.municipioId) === municipioId;
          if (!sameMun) return false;
          if (itemsTienenEmpresa && empresaNum != null) {
            return Number(s.empresaId) === empresaNum;
          }
          return true;
        });

        const list = uniqById(filtered);
        setData((d) => ({ ...d, sedes: list }));
        if (autoselectSingle && list.length === 1) {
          setForm((f) => ({ ...f, sede_id: String(list[0].id) }));
        }
      } catch {
        setData((d) => ({ ...d, sedes: [] }));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.municipio_id, empresaId]);

  // Sede -> Bloques
  useEffect(() => {
    if (!form.sede_id) {
      setData((d) => ({ ...d, bloques: [], espacios: [], almacenes: [] }));
      return;
    }
    limpiarCamposDesde("sede_id");
    (async () => {
      try {
        const res = await axios.get("/v1/bloque", headers);
        let list = asArray(res.data).filter(
          (b) => String(b.sedeId) === String(form.sede_id)
        );
        list = uniqById(list);
        setData((d) => ({ ...d, bloques: list }));
        if (autoselectSingle && list.length === 1) {
          setForm((f) => ({ ...f, bloque_id: String(list[0].id) }));
        }
      } catch {
        setData((d) => ({ ...d, bloques: [] }));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.sede_id]);

  // Bloque -> Espacios
  useEffect(() => {
    if (!form.bloque_id) {
      setData((d) => ({ ...d, espacios: [], almacenes: [] }));
      return;
    }
    limpiarCamposDesde("bloque_id");
    (async () => {
      try {
        const res = await axios.get("/v1/espacio", headers);
        let list = asArray(res.data).filter(
          (e) => String(e.bloqueId) === String(form.bloque_id)
        );
        list = uniqById(list);
        setData((d) => ({ ...d, espacios: list }));
        if (autoselectSingle && list.length === 1) {
          setForm((f) => ({ ...f, espacio_id: String(list[0].id) }));
        }
      } catch {
        setData((d) => ({ ...d, espacios: [] }));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.bloque_id]);

  // Espacio -> Almacenes
  useEffect(() => {
    if (!form.espacio_id) {
      setData((d) => ({ ...d, almacenes: [] }));
      return;
    }
    limpiarCamposDesde("espacio_id");
    (async () => {
      try {
        const res = await axios.get("/v1/almacen", headers);
        let list = asArray(res.data).filter(
          (a) => String(a.espacioId) === String(form.espacio_id)
        );
        list = uniqById(list);
        setData((d) => ({ ...d, almacenes: list }));
        if (autoselectSingle && list.length === 1) {
          setForm((f) => ({ ...f, almacen_id: String(list[0].id) }));
        }
      } catch {
        setData((d) => ({ ...d, almacenes: [] }));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.espacio_id]);

  const resetTodo = () => {
    setForm({
      pais_id: "",
      departamento_id: "",
      municipio_id: "",
      sede_id: "",
      bloque_id: "",
      espacio_id: "",
      almacen_id: "",
    });
    setData((d) => ({
      ...d,
      departamentos: [],
      municipios: [],
      sedes: [],
      bloques: [],
      espacios: [],
      almacenes: [],
    }));
  };

  /* ---------- Pedido (estado + listas) ---------- */
  const [pedido, setPedido] = useState({
    pedido_id: "",
    categoria_estado_id: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  const handlePedidoChange = (field) => (e) => {
    const value = e?.target ? e.target.value : e;
    setPedido((p) => ({ ...p, [field]: value }));
  };

  const [pedidos, setPedidos] = useState([]);
  const [categoriasEstado, setCategoriasEstado] = useState([]);

  useEffect(() => {
    axios
      .get("/v1/pedido", headers)
      .then((r) => setPedidos(asArray(r.data)))
      .catch(() => setPedidos([]));
    axios
      .get("/v1/items/estado_categoria/0", headers)
      .then((r) => setCategoriasEstado(asArray(r.data)))
      .catch(() => setCategoriasEstado([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- API del hook ---------- */
  return {
    // ubicación
    form,
    setForm,
    data,
    handleChange,
    limpiarCamposDesde,
    resetTodo,

    // pedido (4 campos + listas)
    pedido,
    setPedido,
    handlePedidoChange,
    pedidos,
    categoriasEstado,
  };
}

/* ========================= Builders reutilizables ========================= */
/** PEDIDO (empresa completa) — SOLO 4 variables + ubicación */
export function buildPedidoCondicionEmpresa({
  empresaId,
  pedido_id,
  categoria_estado_id,
  fecha_inicio,
  fecha_fin,
  ubicacion = {}, // {pais_id,...,almacen_id}
  aliases = DEFAULT_ALIASES,
  colFecha = "p.ped_fecha_hora",
}) {
  const conds = [];
  conds.push(`p.ped_empresa_id = ${Number(empresaId)}`);
  if (pedido_id) conds.push(`AND p.ped_id = ${Number(pedido_id)}`);
  if (categoria_estado_id)
    conds.push(`AND est.est_estado_categoria_id = ${Number(categoria_estado_id)}`);
  __appendRangoFecha(conds, colFecha, fecha_inicio, fecha_fin);
  __appendUbicacionConds(conds, ubicacion, aliases);
  const condicion = {};
  conds.forEach((c, i) => (condicion[String(i)] = c));
  return { condicion };
}

/** PEDIDO (específico) — requiere pedido_id + categoria_estado_id */
export function buildPedidoReporteEspecifico({
  empresaId,
  pedido_id,
  categoria_estado_id,
  fecha_inicio,
  fecha_fin,
  logoPath,
}) {
  return {
    emp_id: Number(empresaId),
    ped_id: Number(pedido_id),
    categoria_estado_id: Number(categoria_estado_id),
    logo_empresa: logoPath,
    ...(fecha_inicio ? { fecha_inicio: __toReportDT(fecha_inicio) } : {}),
    ...(fecha_fin ? { fecha_fin: __toReportDT(fecha_fin) } : {}),
  };
}

/** FACTURA — fechas + producto_id + producto_categoria_id + ubicación */
export function buildFacturaCondicionEmpresa({
  empresaId,
  fecha_inicio,
  fecha_fin,
  producto_id,
  producto_categoria_id,
  ubicacion = {},
  aliases = DEFAULT_ALIASES,
  colFecha = "f.fact_fecha",
}) {
  const conds = [];
  conds.push(`f.emp_id = ${Number(empresaId)}`);
  if (producto_id) conds.push(`AND f.prod_id = ${Number(producto_id)}`);
  if (producto_categoria_id) conds.push(`AND f.prod_cat_id = ${Number(producto_categoria_id)}`);
  __appendRangoFecha(conds, colFecha, fecha_inicio, fecha_fin);
  __appendUbicacionConds(conds, ubicacion, aliases);
  const condicion = {};
  conds.forEach((c, i) => (condicion[String(i)] = c));
  return { condicion };
}

/** KARDEX — fechas + categoria_estado_id + pedido_id + ubicación */
export function buildKardexCondicionEmpresa({
  empresaId,
  fecha_inicio,
  fecha_fin,
  categoria_estado_id,
  pedido_id,
  ubicacion = {},
  aliases = DEFAULT_ALIASES,
  colFecha = "k.kdx_fecha",
}) {
  const conds = [];
  conds.push(`k.emp_id = ${Number(empresaId)}`);
  if (categoria_estado_id) conds.push(`AND k.est_categoria_id = ${Number(categoria_estado_id)}`);
  if (pedido_id) conds.push(`AND k.ped_id = ${Number(pedido_id)}`);
  __appendRangoFecha(conds, colFecha, fecha_inicio, fecha_fin);
  __appendUbicacionConds(conds, ubicacion, aliases);
  const condicion = {};
  conds.forEach((c, i) => (condicion[String(i)] = c));
  return { condicion };
}

/** ORDEN COMPRA — fechas + categoria_estado_id + pedido_id + ubicación */
export function buildOrdenCompraCondicionEmpresa({
  empresaId,
  fecha_inicio,
  fecha_fin,
  categoria_estado_id,
  pedido_id,
  ubicacion = {},
  aliases = DEFAULT_ALIASES,
  colFecha = "oc.oc_fecha",
}) {
  const conds = [];
  conds.push(`oc.emp_id = ${Number(empresaId)}`);
  if (categoria_estado_id)
    conds.push(`AND est.est_estado_categoria_id = ${Number(categoria_estado_id)}`);
  if (pedido_id) conds.push(`AND oc.ped_id = ${Number(pedido_id)}`);
  __appendRangoFecha(conds, colFecha, fecha_inicio, fecha_fin);
  __appendUbicacionConds(conds, ubicacion, aliases);
  const condicion = {};
  conds.forEach((c, i) => (condicion[String(i)] = c));
  return { condicion };
}

/** PRODUCTOS VENCIDOS — fechas + categoria_estado_id + pedido_id + ubicación */
export function buildProductoVencidoCondicionEmpresa({
  empresaId,
  fecha_inicio,
  fecha_fin,
  categoria_estado_id,
  pedido_id,
  ubicacion = {},
  aliases = DEFAULT_ALIASES,
  colFecha = "pv.venc_fecha",
}) {
  const conds = [];
  conds.push(`pv.emp_id = ${Number(empresaId)}`);
  if (categoria_estado_id) conds.push(`AND pv.est_categoria_id = ${Number(categoria_estado_id)}`);
  if (pedido_id) conds.push(`AND pv.ped_id = ${Number(pedido_id)}`);
  __appendRangoFecha(conds, colFecha, fecha_inicio, fecha_fin);
  __appendUbicacionConds(conds, ubicacion, aliases);
  const condicion = {};
  conds.forEach((c, i) => (condicion[String(i)] = c));
  return { condicion };
}
