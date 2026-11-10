import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import firmaImg from '../assets/firma.jpeg';

const Footer = () => {
  const navigate = useNavigate();

  const handleQuoteScroll = () => {
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById('presupuesto-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        pt: 7,
        pb: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              component="img"
              src={firmaImg}
              alt="Daiana Millena Fotógrafa"
              sx={{
                maxWidth: 240,
                height: 'auto',
                borderRadius: 1,
                mixBlendMode: 'multiply',
                mb: 1.5,
              }}
            />
            <Typography variant="body2" sx={{ maxWidth: 360 }}>
              Capturando momentos irrepetibles con una mirada artística, luz natural
              y estética atemporal para bodas, quinceañeras, retratos y marcas.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Navegación
            </Typography>
            <Stack spacing={1} sx={{ alignItems: 'flex-start' }}>
              <Button
                color="inherit"
                size="small"
                sx={{ p: 0, minWidth: 0 }}
                onClick={() => navigate('/')}
              >
                Inicio
              </Button>
              <Button
                color="inherit"
                size="small"
                sx={{ p: 0, minWidth: 0 }}
                onClick={() => navigate('/projects')}
              >
                Galería de Proyectos
              </Button>
              <Button
                color="inherit"
                size="small"
                sx={{ p: 0, minWidth: 0 }}
                onClick={handleQuoteScroll}
              >
                Solicitar Presupuesto
              </Button>
              <Button
                color="inherit"
                size="small"
                sx={{ p: 0, minWidth: 0 }}
                onClick={() => navigate('/private/dashboard')}
              >
                Acceso Privado (Dashboard)
              </Button>
              <Button
                color="inherit"
                size="small"
                sx={{ p: 0, minWidth: 0 }}
                onClick={() => navigate('/private/processes')}
              >
                Presupuestos y Procesos
              </Button>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Contacto & Estudio
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Buenos Aires, Argentina
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              contacto@daianamillena.com
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Atención con cita previa
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={handleQuoteScroll}
            >
              Pedir Presupuesto
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography variant="body2" sx={{ fontSize: '0.78rem' }}>
            © {new Date().getFullYear()} Daiana Millena Fotografía. Todos los derechos reservados.
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.78rem' }}>
            Estética Fine Art & Documental
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
