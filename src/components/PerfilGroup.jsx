/**
 * Componente PerfilGroup.
 * @module PerfilGroup
 * @component
 */
const PerfilGroup = ({ setCurrentModule }) => {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center" p={2}>
      <Card sx={{ minWidth: 275, m: 2 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Personas
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Gestión de personas - persona
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => setCurrentModule(<Persona />)}>OPEN</Button>
        </CardActions>
      </Card>
      
      <Card sx={{ minWidth: 275, m: 2 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Empresas
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Gestión de empresas - empresa
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => setCurrentModule(<Empresa />)}>OPEN</Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default PerfilGroup;