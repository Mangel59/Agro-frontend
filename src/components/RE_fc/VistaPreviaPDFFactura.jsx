import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

export default function VistaPreviaPDFFactura({ url }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "80vh",
        border: "1px solid #ccc",
        overflow: "hidden"
      }}
    >
      <iframe
        title="Vista previa PDF Factura"
        src={url}
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </Box>
  );
}

VistaPreviaPDFFactura.propTypes = {
  url: PropTypes.string.isRequired
};
