import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
export default function PerfilCard(props) {
  const { title, description, componentId, setCurrentModule } = props;
  const handleOpen = () => {
    setCurrentModule(componentId);
  };
//public/static/image/cards/contemplative-reptile.jpg
  return (
    <Card sx={{ maxWidth: 345, borderRadius: 2, boxShadow: 3 }}>
      <CardMedia
        sx={{ height: 140 }}
        image="static/image/cards/contemplative-reptile.jpg"
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description} - {componentId}
        </Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ flexGrow: 1 }} />
        <Button size="small" variant="contained" color="primary" onClick={handleOpen}>
          Open
        </Button>
      </CardActions>
    </Card>
  );
}