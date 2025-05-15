
import React, { useEffect, useState } from "react";
import {
  Box, Grid, TextField, FormControl, InputLabel, MenuItem,
  Select, OutlinedInput, Button
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { DataPedidosService } from "../Kardex/kardex";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Formkardex() {
  const [data, setData] = useState({
    paises: [], departamentos: [], municipios: [], sedes: [],
    bloques: [], espacios: [], almacenes: [], unidades: [],
    productos: [], tipos_movimiento: [], movimientos: [], presentaciones: []
  });

  useEffect(() => {
    DataPedidosService.cargarPaises().then(paises => setData(d => ({ ...d, paises })));
    DataPedidosService.cargarDepartamentos().then(departamentos => setData(d => ({ ...d, departamentos })));
    DataPedidosService.cargarMunicipios().then(municipios => setData(d => ({ ...d, municipios })));
    DataPedidosService.cargarSedes().then(sedes => setData(d => ({ ...d, sedes })));
    DataPedidosService.cargarBloques().then(bloques => setData(d => ({ ...d, bloques })));
    DataPedidosService.cargarEspacios().then(espacios => setData(d => ({ ...d, espacios })));
    DataPedidosService.cargarAlmacenes().then(almacenes => setData(d => ({ ...d, almacenes })));
    DataPedidosService.cargarUnidades().then(unidades => setData(d => ({ ...d, unidades })));
    DataPedidosService.cargarProductos().then(productos => setData(d => ({ ...d, productos })));
    DataPedidosService.cargarTiposMovimiento().then(tipos_movimiento => setData(d => ({ ...d, tipos_movimiento })));
    DataPedidosService.cargarMovimientos().then(movimientos => setData(d => ({ ...d, movimientos })));
    DataPedidosService.cargarPresentaciones().then(presentaciones => setData(d => ({ ...d, presentaciones })));
  }, []);

  const initialValues = {
    nombre: "", apellido: "", fecha_inicio: "", fecha_fin: "",
    pais: "", departamento: "", municipio: "", sede: "", bloque: "", espacio: "",
    almacen: "", unidad: "", producto: "", tipo_movimiento: "",
    movimiento: "", producto_presentacion: ""
  };

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required("Requerido"),
    apellido: Yup.string().required("Requerido"),
    fecha_inicio: Yup.string().required("Requerido"),
    fecha_fin: Yup.string().required("Requerido"),
    pais: Yup.string().required("Requerido"),
    departamento: Yup.string().required("Requerido"),
    municipio: Yup.string().required("Requerido"),
    sede: Yup.string().required("Requerido"),
    bloque: Yup.string().required("Requerido"),
    espacio: Yup.string().required("Requerido"),
    almacen: Yup.string().required("Requerido"),
    unidad: Yup.string().required("Requerido"),
    producto: Yup.string().required("Requerido"),
    tipo_movimiento: Yup.string().required("Requerido"),
    movimiento: Yup.string().required("Requerido"),
    producto_presentacion: Yup.string().required("Requerido"),
  });

  const generarPDF = (valores) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Resumen de Pedido", 14, 20);
    const datos = Object.entries(valores).map(([campo, valor]) => [campo, valor]);
    autoTable(doc, {
      startY: 30,
      head: [["Campo", "Valor"]],
      body: datos
    });
    doc.save("pedido.pdf");
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, p: 3, bgcolor: "white", borderRadius: 2, boxShadow: 3 }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={generarPDF}
      >
        {({ values, handleChange, touched, errors }) => {
          const departamentosFiltrados = data.departamentos.filter(d => d.pais_id === Number(values.pais));
          const municipiosFiltrados = data.municipios.filter(m => m.departamento_id === Number(values.departamento));
          const sedesFiltradas = data.sedes.filter(s => s.municipio_id === Number(values.municipio));
          const bloquesFiltrados = data.bloques.filter(b => b.sede_id === Number(values.sede));
          const espaciosFiltrados = data.espacios.filter(e => e.bloque_id === Number(values.bloque));
          const almacenesFiltrados = data.almacenes.filter(a => a.espacio_id === Number(values.espacio));

          return (
            <Form>
              <Grid container spacing={2}>
                {[
                  ["nombre", "Nombre"],
                  ["apellido", "Apellido"],
                  ["fecha_inicio", "Fecha y hora inicial", "datetime-local"],
                  ["fecha_fin", "Fecha y hora final", "datetime-local"]
                ].map(([name, label, type = "text"]) => (
                  <Grid item xs={12} sm={6} key={name}>
                    <TextField
                      fullWidth
                      label={label}
                      name={name}
                      type={type}
                      value={values[name]}
                      onChange={handleChange}
                      error={Boolean(touched[name] && errors[name])}
                      helperText={touched[name] && errors[name]}
                      InputLabelProps={type === "datetime-local" ? { shrink: true } : {}}
                    />
                  </Grid>
                ))}

                {[
                  ["pais", "País", data.paises, "paisI"],
                  ["departamento", "Departamento", departamentosFiltrados, "departamentoI"],
                  ["municipio", "Municipio", municipiosFiltrados, "municipioI"],
                  ["sede", "Sede", sedesFiltradas, "sedeI"],
                  ["bloque", "Bloque", bloquesFiltrados, "bloqueI"],
                  ["espacio", "Espacio", espaciosFiltrados, "espacioI"],
                  ["almacen", "Almacén", almacenesFiltrados, "almacenI"],
                  ["unidad", "Unidad", data.unidades, "unidadI"],
                  ["producto", "Producto", data.productos, "productoI"],
                  ["tipo_movimiento", "Tipo Movimiento", data.tipos_movimiento, "tipoI"],
                  ["movimiento", "Movimiento", data.movimientos, "movimientoI"],
                  ["producto_presentacion", "Presentación", data.presentaciones, "descripcion"]
                ].map(([name, label, options, campo]) => (
                  <Grid item xs={12} sm={6} key={name}>
                    <FormControl fullWidth error={Boolean(touched[name] && errors[name])}>
                      <InputLabel>{label}</InputLabel>
                      <Select
                        name={name}
                        value={values[name]}
                        onChange={handleChange}
                        input={<OutlinedInput label={label} />}
                      >
                        <MenuItem value="">
                          <em>Seleccione {label}</em>
                        </MenuItem>
                        {options.map((option, i) => (
                          <MenuItem key={option.id || i} value={option.id}>
                            {option[campo] || option.nombre || `${option.nombre1 || ""} ${option.nombre2 || ""}`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Button fullWidth type="submit" variant="contained" color="primary">
                    Generar PDF
                  </Button>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
}
