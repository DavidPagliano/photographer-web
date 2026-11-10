import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import ProjectCard from '../components/ProjectCard';
import type { IProject, PageView } from '../types';

interface ProjectsPageProps {
  projects: IProject[];
  loading: boolean;
  totalPhotosCount: number;
  onOpenGallery: (project: IProject, initialIndex?: number) => void;
  onNavigate: (page: PageView) => void;
}

const ProjectsPage = ({
  projects,
  loading,
  totalPhotosCount,
  onOpenGallery,
  onNavigate,
}: ProjectsPageProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredProjects = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter(
      (p) =>
        p.projectName?.toLowerCase().includes(query) ||
        p.projectDescription?.toLowerCase().includes(query)
    );
  }, [projects, searchTerm]);

  const handleGoToQuote = () => {
    onNavigate('home');
    setTimeout(() => {
      const el = document.getElementById('presupuesto-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <Box sx={{ pb: 9 }}>
      {/* Encabezado de la Página de Proyectos */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: { xs: 5, md: 7 },
          mb: 5,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Galería Pública
              </Typography>
              <Typography
                variant="h1"
                sx={{ fontSize: { xs: '2.8rem', md: '3.6rem' } }}
              >
                Nuestros Proyectos
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, maxWidth: 620 }}>
                Haz clic en cualquier proyecto o miniatura para abrir el visor modal de
                fotografías en pantalla grande.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
              <Chip
                label={`${projects.length} Proyectos`}
                sx={{ bgcolor: 'primary.light', fontWeight: 600 }}
              />
              <Chip
                label={`${totalPhotosCount} Fotografías`}
                sx={{ bgcolor: 'secondary.light', fontWeight: 600 }}
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<AddPhotoAlternateOutlinedIcon />}
                onClick={() => onNavigate('dashboard')}
              >
                Subir Fotos (Dashboard)
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Barra de Búsqueda y Acción de Presupuesto */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            mb: 4,
          }}
        >
          <TextField
            placeholder="Buscar proyecto por título o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ minWidth: { sm: 360 }, bgcolor: '#FFFFFF' }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            variant="outlined"
            color="primary"
            startIcon={<RequestQuoteOutlinedIcon />}
            onClick={handleGoToQuote}
          >
            Solicitar Presupuesto para mi Evento
          </Button>
        </Stack>

        {loading ? (
          <Box sx={{ py: 10, textAlign: 'center' }}>
            <CircularProgress color="primary" />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Cargando galería de proyectos...
            </Typography>
          </Box>
        ) : filteredProjects.length === 0 ? (
          <Box
            sx={{
              py: 8,
              px: 3,
              textAlign: 'center',
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: '1px solid #EAE4DC',
            }}
          >
            <Typography variant="h3" sx={{ mb: 1 }}>
              No se encontraron proyectos
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Prueba con otro término de búsqueda o sube un nuevo proyecto desde el
              Dashboard privado.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onNavigate('dashboard')}
            >
              Ir al Dashboard a Subir Fotos
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3.5}>
            {filteredProjects.map((project) => (
              <Grid key={project.projectId} size={{ xs: 12, sm: 6, md: 4 }}>
                <ProjectCard project={project} onOpenGallery={onOpenGallery} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ProjectsPage;
