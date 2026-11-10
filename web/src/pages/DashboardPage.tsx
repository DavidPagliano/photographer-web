import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import BudgetCard from '../components/BudgetCard';
import type { IEvent, IProject, IProposal } from '../types';

interface DashboardPageProps {
  projects: IProject[];
  proposals: IProposal[];
  events: IEvent[];
  projectsCount: number;
  totalPhotosCount: number;
  proposalsCount: number;
  eventsCount: number;
  clientsCount: number;
  onRemoveProposal: (proposalId: string) => void;
  onOpenGallery: (project: IProject, initialIndex?: number) => void;
}

const DashboardPage = ({
  projects,
  proposals,
  events,
  projectsCount,
  totalPhotosCount,
  proposalsCount,
  eventsCount,
  clientsCount,
  onRemoveProposal,
  onOpenGallery,
}: DashboardPageProps) => {
  const navigate = useNavigate();

  const recentProposals = proposals.slice(0, 3);
  const recentProjects = projects.slice(0, 4);

  const getLinkedEvent = (proposal: IProposal): IEvent | undefined =>
    events.find(
      (evt) =>
        evt.eventId === proposal.linkedEventId ||
        evt.budgetId === proposal.proposalId
    );

  return (
    <Box sx={{ pt: { xs: 4, md: 5 }, pb: 10 }}>
      <Container maxWidth="lg">
        {/* Tarjetas de Conteo (KPIs) */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              onClick={() => navigate('/private/projects')}
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.dark',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontSize: '0.7rem' }}>
                      Proyectos Publicados
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{ fontSize: '2.7rem', lineHeight: 1.1, my: 0.5 }}
                    >
                      {projectsCount}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'primary.dark' }}>
                      {totalPhotosCount} fotos · Gestionar →
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      width: 52,
                      height: 52,
                      bgcolor: 'primary.light',
                      color: 'text.primary',
                    }}
                  >
                    <CollectionsOutlinedIcon />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              onClick={() => navigate('/private/processes')}
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.dark',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontSize: '0.7rem' }}>
                      Presupuestos (Etapa 1)
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{ fontSize: '2.7rem', lineHeight: 1.1, my: 0.5 }}
                    >
                      {proposalsCount}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'primary.dark' }}>
                      Gestionar avances →
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      width: 52,
                      height: 52,
                      bgcolor: 'secondary.light',
                      color: 'text.primary',
                    }}
                  >
                    <RequestQuoteOutlinedIcon />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              onClick={() => navigate('/private/processes')}
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.dark',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontSize: '0.7rem' }}>
                      Eventos en Proceso
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{ fontSize: '2.7rem', lineHeight: 1.1, my: 0.5 }}
                    >
                      {eventsCount}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'primary.dark' }}>
                      Paquetes y entregas →
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      width: 52,
                      height: 52,
                      bgcolor: '#E3EDE6',
                      color: 'text.primary',
                    }}
                  >
                    <EventAvailableOutlinedIcon />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              onClick={() => navigate('/private/clients')}
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.dark',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontSize: '0.7rem' }}>
                      Clientes Registrados
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{ fontSize: '2.7rem', lineHeight: 1.1, my: 0.5 }}
                    >
                      {clientsCount}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'primary.dark' }}>
                      Ver directorio →
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      width: 52,
                      height: 52,
                      bgcolor: '#EFECE6',
                      color: 'text.primary',
                    }}
                  >
                    <PeopleAltOutlinedIcon />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Sección: Presupuestos Recientes y Avances */}
        <Box sx={{ mb: 6 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              mb: 2.5,
            }}
          >
            <Box>
              <Typography variant="subtitle1">Flujo de Trabajo</Typography>
              <Typography variant="h3" sx={{ fontSize: '2rem' }}>
                Presupuestos Recientes y Avances
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="primary"
              endIcon={<ArrowForwardOutlinedIcon />}
              onClick={() => navigate('/private/processes')}
            >
              Ver Todos los Presupuestos
            </Button>
          </Stack>

          <Grid container spacing={3}>
            {recentProposals.map((proposal) => (
              <Grid key={proposal.proposalId} size={{ xs: 12, md: 4 }}>
                <BudgetCard
                  proposal={proposal}
                  linkedEvent={getLinkedEvent(proposal)}
                  onEditProcess={(id) => navigate(`/private/processes/${id}`)}
                  onDelete={onRemoveProposal}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 5 }} />

        {/* Sección: Proyectos y Portafolio Público */}
        <Box sx={{ mb: 4 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              mb: 2.5,
            }}
          >
            <Box>
              <Typography variant="subtitle1">Galería Pública</Typography>
              <Typography variant="h3" sx={{ fontSize: '2rem' }}>
                Proyectos Publicados en la Web
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddPhotoAlternateOutlinedIcon />}
              onClick={() => navigate('/private/projects')}
            >
              Gestionar Proyectos y Subir Fotos
            </Button>
          </Stack>

          <Grid container spacing={3}>
            {recentProjects.map((proj) => (
              <Grid key={proj.projectId} size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  elevation={0}
                  onClick={() => onOpenGallery(proj, 0)}
                  sx={{
                    bgcolor: '#FFFFFF',
                    border: '1px solid #EAE4DC',
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={proj.images?.[0]?.imageBase64}
                    alt={proj.projectName}
                    sx={{
                      width: '100%',
                      height: 140,
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <Box sx={{ p: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        mb: 0.5,
                      }}
                    >
                      {proj.projectName}
                    </Typography>
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Chip
                        label={`${proj.images?.length || 0} fotos`}
                        size="small"
                        sx={{ bgcolor: 'primary.light', fontSize: '0.72rem' }}
                      />
                      <Typography variant="caption" color="primary.main">
                        Ver fotos →
                      </Typography>
                    </Stack>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardPage;
