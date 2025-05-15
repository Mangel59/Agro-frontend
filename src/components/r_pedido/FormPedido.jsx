import React, { useEffect, useState } from "react";
import {
  Box, Grid, FormControl, InputLabel, MenuItem,
  Select, OutlinedInput, Button
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DataPedidosService } from "../r_pedido/Pedido";

export default function FormPedido() {
  const [data, setData] = useState({
    paises: [], departamentos: [], municipios: [], sedes: [],
    bloques: [], espacios: [], almacenes: [], unidades: []
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
  }, []);

  const initialValues = {
    pais: "", departamento: "", municipio: "",
    sede: "", bloque: "", espacio: "",
    almacen: "", unidad: ""
  };

  const validationSchema = Yup.object().shape({
    pais: Yup.string().required("Requerido"),
    departamento: Yup.string().required("Requerido"),
    municipio: Yup.string().required("Requerido"),
    sede: Yup.string().required("Requerido"),
    bloque: Yup.string().required("Requerido"),
    espacio: Yup.string().required("Requerido"),
    almacen: Yup.string().required("Requerido"),
    unidad: Yup.string().required("Requerido"),
  });

  const generarPDF = (valores) => {
    const getNombre = (arr, id, campo) => arr.find(x => x.id === Number(id))?.[campo] || "";
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Resumen de Pedido", 14, 20);
    const datos = [
      ["País", getNombre(data.paises, valores.pais, "paisI")],
      ["Departamento", getNombre(data.departamentos, valores.departamento, "departamentoI")],
      ["Municipio", getNombre(data.municipios, valores.municipio, "municipioI")],
      ["Sede", getNombre(data.sedes, valores.sede, "sedeI")],
      ["Bloque", getNombre(data.bloques, valores.bloque, "bloqueI")],
      ["Espacio", getNombre(data.espacios, valores.espacio, "espacioI")],
      ["Almacén", getNombre(data.almacenes, valores.almacen, "almacenI")],
      ["Unidad", getNombre(data.unidades, valores.unidad, "unidadI")]
    ];
    autoTable(doc, {
      startY: 30,
      head: [["Campo", "Valor"]],
      body: datos,
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

          const renderSelect = (name, label, options, campo) => (
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
                      {option[campo]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          );

          return (
            <Form>
              <Grid container spacing={2}>
                {renderSelect("pais", "País", data.paises, "paisI")}
                {renderSelect("departamento", "Departamento", departamentosFiltrados, "departamentoI")}
                {renderSelect("municipio", "Municipio", municipiosFiltrados, "municipioI")}
                {renderSelect("sede", "Sede", sedesFiltradas, "sedeI")}
                {renderSelect("bloque", "Bloque", bloquesFiltrados, "bloqueI")}
                {renderSelect("espacio", "Espacio", espaciosFiltrados, "espacioI")}
                {renderSelect("almacen", "Almacén", almacenesFiltrados, "almacenI")}
                {renderSelect("unidad", "Unidad", data.unidades, "unidadI")}
                <Grid item xs={12}>
                  <Button type="submit" fullWidth variant="contained" color="primary">
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
