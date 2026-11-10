import type { ReactNode } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import CameraEnhanceOutlinedIcon from '@mui/icons-material/CameraEnhanceOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import firmaImg from '../assets/firma.jpeg';
import ProjectCard from '../components/ProjectCard';
import ProposalForm from '../components/ProposalForm';
import type {
  IProject,
  IProposal,
  PageView,
  ProposalFormInput,
} from '../types';

interface ServiceItem {
  icon: ReactNode;
  title: string;
  description: string;
}

const SERVICES: ServiceItem[] = [
  {
    icon: <FavoriteBorderOutlinedIcon fontSize="large" />,
    title: 'Bodas & Casamientos',
    description:
      'Cobertura documental desde los preparativos hasta la fiesta, priorizando la emoción real y la luz natural.',
  },
  {
    icon: <AutoAwesomeOutlinedIcon fontSize="large" />,
    title: 'Quinceañeras & Books',
    description:
      'Sesiones exteriores y en estudio con dirección de pose relajada y estética editorial en tonos suaves.',
  },
  {
    icon: <CameraEnhanceOutlinedIcon fontSize="large" />,
    title: 'Maternidad, Familia & Marcas',
    description:
      'Retratos íntimos llenos de calidez y fotografía de producto pensada para destacar la identidad visual.',
  },
];

interface HomePageProps {
  projects: IProject[];
  proposals: IProposal[];
  onNavigate: (page: PageView) => void;
  onOpenGallery: (project: IProject, initialIndex?: number) => void;
  onSubmitProposal: (formData: ProposalFormInput) => IProposal;
}

const HomePage = ({
  projects,
  proposals,
  onNavigate,
  onOpenGallery,
  onSubmitProposal,
}: HomePageProps) => {
  const featuredProjects = projects.slice(0, 3);

  const scrollToProposalForm = () => {
    const el = document.getElementById('presupuesto-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box>
      {/* Hero Principal */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: { xs: 7, md: 11 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3} sx={{ alignItems: 'center', textAlign: 'center' }}>
            <Chip
              label="PORTAFOLIO FOTOGRÁFICO · FINE ART & EVENTOS"
              sx={{
                bgcolor: '#FFFFFF',
                border: '1px solid #EAE4DC',
                letterSpacing: '0.18em',
                fontSize: '0.72rem',
                fontWeight: 500,
              }}
            />

            <Box
              component="img"
              src={firmaImg}
              alt="Daiana Millena Fotógrafa"
              sx={{
                width: '100%',
                maxWidth: { xs: 320, sm: 460, md: 540 },
                height: 'auto',
                mixBlendMode: 'multiply',
              }}
            />

            <Typography
              variant="body1"
              sx={{ maxWidth: 680, fontSize: { xs: '1rem', md: '1.12rem' } }}
            >
              Cada historia merece ser contada con sensibilidad, luz suave y detalles
              que perduren en el tiempo. Explora mis proyectos fotográficos o solicita
              un presupuesto personalizado para tu próximo momento especial.
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ pt: 1, width: { xs: '100%', sm: 'auto' } }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<PhotoLibraryOutlinedIcon />}
                onClick={() => onNavigate('projects')}
              >
                Explorar Proyectos ({projects.length})
              </Button>

              <Button
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<RequestQuoteOutlinedIcon />}
                onClick={scrollToProposalForm}
              >
                Pedir Presupuesto
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                size="large"
                startIcon={<DashboardCustomizeOutlinedIcon />}
                onClick={() => onNavigate('dashboard')}
                sx={{
                  borderColor: 'secondary.dark',
                  color: 'text.primary',
                }}
              >
                Parte Privada (Dashboard)
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Sección de Especialidades */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Especialidades
          </Typography>
          <Typography
            variant="h2"
            sx={{ fontSize: { xs: '2.4rem', md: '3rem' } }}
          >
            Servicios Fotográficos
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {SERVICES.map((service) => (
            <Grid key={service.title} size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      bgcolor: 'primary.light',
                      color: 'text.primary',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    {service.icon}
                  </Box>
                  <Typography variant="h3" sx={{ fontSize: '1.75rem', mb: 1.5 }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body2">{service.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider />

      {/* Vista Previa de Proyectos Destacados */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'flex-end' },
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
              Portafolio Reciente
            </Typography>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: '2.4rem', md: '3rem' } }}
            >
              Proyectos Destacados
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onNavigate('projects')}
          >
            Ver Todos los Proyectos ({projects.length})
          </Button>
        </Stack>

        <Grid container spacing={3.5}>
          {featuredProjects.map((project) => (
            <Grid key={project.projectId} size={{ xs: 12, sm: 6, md: 4 }}>
              <ProjectCard project={project} onOpenGallery={onOpenGallery} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider />

      {/* Formulario Público de Pedir Presupuesto y Listado Público */}
      <Box sx={{ bgcolor: '#FDFBF9' }}>
        <Container maxWidth="lg">
          <ProposalForm
            proposals={proposals}
            onSubmitProposal={onSubmitProposal}
          />
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
