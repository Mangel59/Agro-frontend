import { Box } from '@mui/material';

export default function Contenido({ children }) {
  return (
    <Box
      component="main"
      sx={{
        pt: '72px',
        minHeight: 'calc(100vh - 72px)',
        bgcolor: 'transparent',   // ← no pintes otro fondo aquí
        p: 0, m: 0, borderRadius: 0, boxShadow: 'none', border: 0,
      }}
    >
      {children}
    </Box>
  );
}
