// import * as React from 'react';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';

// export default function Reportes(props) {
//   return (
//     <Card sx={{ maxWidth: 345 }}>
//       <CardMedia
//         sx={{ height: 140 }}
//         image="https://www.salesforce.com/mx/blog/wp-content/uploads/sites/11/2023/09/reporte-de-ventas.jpg" 
//         title="Placeholder Image"
//       />
//       <CardContent>
//         <Typography gutterBottom variant="h5" component="div">
//           Reportes
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           Reportes de todo el inventario necesario que deseas descargar.
//         </Typography>
//       </CardContent>
//       <CardActions>
    
//         <Button size="small">Ver mas</Button>
//       </CardActions>
//     </Card>
//   );
// }



import * as React from 'react';
import ReportViewer from './ReportViewer'; // Importamos el componente ReportViewer

export default function Reportes() {
  return (
    <ReportViewer />
  );
}
