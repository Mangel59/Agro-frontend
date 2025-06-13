import { Box } from "@mui/material";

export default function Layout({ children }) {
  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        overflowY: "auto",
        p: 2
      }}
    >
      {children}
    </Box>
  );
}
