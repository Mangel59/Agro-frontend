import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { SiteProps } from "./SiteProps";

export default function Copyright({
  fullWidth = true,
  seamlessAbove = true,
  ...props
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const softBg = isDark ? alpha(theme.palette.primary.light, 0.08) : "#e7f6f7";

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        width: fullWidth ? "100svw" : "100%",
        ml: fullWidth ? "calc(50% - 50svw)" : 0,
        mr: fullWidth ? "calc(50% - 50svw)" : 0,
        "@supports not (width: 100svw)": {
          width: fullWidth ? "100vw" : "100%",
          ml: fullWidth ? "calc(50% - 50vw)" : 0,
          mr: fullWidth ? "calc(50% - 50vw)" : 0,
        },
        bgcolor: softBg,
        py: 3,
        borderTop: "none !important",
        mt: seamlessAbove ? "-1px" : 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // esto centra todo horizontalmente
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {"Copyright © "}
        <Link
          color="inherit"
          href="https://inmero.co/"
          target="_blank"
          rel="noopener"
          sx={{
            fontWeight: 600,
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {SiteProps.appName}
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>

      {/* Textos de versión centrados */}
      <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
        Construcción de versionamiento 0.0.1
      </Typography>
    </Box>
  );
}
