import axios from "../axiosConfig";

/** Normaliza: [] ó { content: [] } */
export const unwrap = (d) => (Array.isArray(d) ? d : d?.content ?? []);

/** Dedup por id */
export const uniqById = (arr) =>
  Array.from(new Map(arr.map((o) => [o.id, o])).values());

/**
 * Crea loaders para el modal de filtros o cascadas
 * @param {{ headers: { Authorization: string }}} headers - cabeceras auth
 * @param {{ empresaId?: string|number|null }} opts
 * @returns Record<string, (values)=>Promise<Array<{value,label}>>>
 */
export const makeLoaders = (headers, opts = {}) => {
  const empresaIdNum =
    opts.empresaId != null && opts.empresaId !== ""
      ? Number(opts.empresaId)
      : null;

  /** País */
  const getPaises = async () => {
    const { data } = await axios.get("/v1/pais", {
      ...headers,
      params: { page: 0, size: 1000 },
    });
    return unwrap(data).map((p) => ({ value: p.id, label: p.nombre }));
  };

  /** Departamento (depende de paisId) */
  const getDepartamentos = async (values) => {
    if (!values.paisId) return [];
    const { data } = await axios.get("/v1/departamento", {
      ...headers,
      params: { page: 0, size: 1000 },
    });
    const list = unwrap(data).filter(
      (d) => Number(d.paisId) === Number(values.paisId)
    );
    return list.map((d) => ({ value: d.id, label: d.nombre }));
  };

  /** Municipio (depende de deptoId) */
  const getMunicipios = async (values) => {
    if (!values.deptoId) return [];
    const { data } = await axios.get("/v1/municipio", {
      ...headers,
      params: { departamentoId: values.deptoId, page: 0, size: 1000 },
    });
    const list = unwrap(data);
    return list.map((m) => ({ value: m.id, label: m.nombre }));
  };

  /** Sede (depende de municipioId; opcional empresaId) */
  const getSedes = async (values) => {
    if (!values.municipioId) return [];
    const { data } = await axios.get("/v1/sede", {
      ...headers,
      params: { /* municipioId: values.municipioId, */ page: 0, size: 2000 },
    });

    // Si el backend ya filtra por municipioId, descomenta la línea de arriba y elimina estos filtros.
    const raw = unwrap(data);
    const municipioIdNum = Number(values.municipioId);
    const itemsTienenEmpresa = raw.some(
      (s) => s.empresaId != null && !Number.isNaN(Number(s.empresaId))
    );

    const filtered = raw.filter((s) => {
      const sameMunicipio = Number(s.municipioId) === municipioIdNum;
      if (!sameMunicipio) return false;
      if (itemsTienenEmpresa && empresaIdNum != null) {
        return Number(s.empresaId) === empresaIdNum;
      }
      return true;
    });

    return uniqById(filtered).map((s) => ({ value: s.id, label: s.nombre }));
  };

  /** Bloque (depende de sedeId) */
  const getBloques = async (values) => {
    if (!values.sedeId) return [];
    const { data } = await axios.get("/v1/bloque", {
      ...headers,
      params: { sedeId: values.sedeId, page: 0, size: 2000 },
    });
    let list = unwrap(data);
    // Si el backend NO filtra por sedeId, descomenta:
    // list = list.filter((b) => String(b.sedeId) === String(values.sedeId));
    list = uniqById(list);
    return list.map((b) => ({ value: b.id, label: b.nombre }));
  };

  /** Espacio (depende de bloqueId) */
  const getEspacios = async (values) => {
    if (!values.bloqueId) return [];
    const { data } = await axios.get("/v1/espacio", {
      ...headers,
      params: { bloqueId: values.bloqueId, page: 0, size: 2000 },
    });
    let list = unwrap(data);
    // Si el backend NO filtra por bloqueId, descomenta:
    // list = list.filter((e) => String(e.bloqueId) === String(values.bloqueId));
    list = uniqById(list);
    return list.map((e) => ({ value: e.id, label: e.nombre }));
  };

  /** Sección (depende de espacioId) */
  const getSecciones = async (values) => {
    if (!values.espacioId) return [];
    const { data } = await axios.get("/v1/seccion", {
      ...headers,
      params: { espacioId: values.espacioId, page: 0, size: 2000 },
    });
    let list = unwrap(data);
    // Si el backend NO filtra por espacioId:
    // list = list.filter((s) => String(s.espacioId) === String(values.espacioId));
    list = uniqById(list);
    return list.map((s) => ({ value: s.id, label: s.nombre }));
  };

  /** Subsección (depende de seccionId) */
  const getSubsecciones = async (values) => {
    if (!values.seccionId) return [];
    const { data } = await axios.get("/v1/subseccion", {
      ...headers,
      params: { seccionId: values.seccionId, page: 0, size: 2000 },
    });
    let list = unwrap(data);
    // Si el backend NO filtra por seccionId:
    // list = list.filter((ss) => String(ss.seccionId) === String(values.seccionId));
    list = uniqById(list);
    return list.map((ss) => ({ value: ss.id, label: ss.nombre }));
  };

  return {
    getPaises,
    getDepartamentos,
    getMunicipios,
    getSedes,
    getBloques,
    getEspacios,
    getSecciones,
    getSubsecciones,
  };
};
