import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PhotoCameraBackOutlinedIcon from '@mui/icons-material/PhotoCameraBackOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import { filesToBase64Images } from '../services/projectService';
import {
  createInitialProjectForm,
  PROPOSAL_STATUSES,
  type IClient,
  type IImage,
  type IProject,
  type IProposal,
  type PageView,
  type ProjectFormInput,
  type ProposalStatus,
} from '../types';

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

interface FeedbackMessage {
  type: 'success' | 'error';
  text: string;
}

interface DashboardPageProps {
  projects: IProject[];
  proposals: IProposal[];
  clients: IClient[];
  projectsCount: number;
  totalPhotosCount: number;
  proposalsCount: number;
  clientsCount: number;
  onAddProject: (payload: ProjectFormInput) => Promise<IProject>;
  onAddPhotosToProject: (
    projectId: string,
    newImages: IImage[]
  ) => Promise<IProject | null>;
  onRemoveProject: (projectId: string) => Promise<void>;
  onChangeProposalStatus: (proposalId: string, status: ProposalStatus) => void;
  onRemoveProposal: (proposalId: string) => void;
  onOpenGallery: (project: IProject, initialIndex?: number) => void;
  onNavigate: (page: PageView) => void;
}

const DashboardPage = ({
  projects,
  proposals,
  clients,
  projectsCount,
  totalPhotosCount,
  proposalsCount,
  clientsCount,
  onAddProject,
  onAddPhotosToProject,
  onRemoveProject,
  onChangeProposalStatus,
  onRemoveProposal,
  onOpenGallery,
  onNavigate,
}: DashboardPageProps) => {
  const [uploadMode, setUploadMode] = useState<'new' | 'existing'>('new');
  const [selectedExistingId, setSelectedExistingId] = useState<string>(
    projects[0]?.projectId || ''
  );
  const [projectForm, setProjectForm] = useState<ProjectFormInput>(
    createInitialProjectForm
  );
  const [stagedImages, setStagedImages] = useState<IImage[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const projectName = e.target.value;
    setProjectForm((prev) => ({
      ...prev,
      projectName,
      projectId: slugify(projectName) || `proyecto-${Date.now()}`,
    }));
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    setFeedback(null);
    try {
      const converted = await filesToBase64Images(files);
      setStagedImages((prev) => [...prev, ...converted]);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'No se pudieron procesar las imágenes seleccionadas.';
      setFeedback({
        type: 'error',
        text: message,
      });
    } finally {
      setUploadingFiles(false);
      e.target.value = '';
    }
  };

  const handleImageNameEdit = (imageId: string, newName: string) => {
    setStagedImages((prev) =>
      prev.map((img) =>
        img.imageId === imageId ? { ...img, imageName: newName } : img
      )
    );
  };

  const handleRemoveStagedImage = (imageId: string) => {
    setStagedImages((prev) => prev.filter((img) => img.imageId !== imageId));
  };

  const handlePublish = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);

    try {
      if (uploadMode === 'new') {
        if (
          !projectForm.projectName.trim() ||
          !projectForm.projectDescription.trim()
        ) {
          setFeedback({
            type: 'error',
            text: 'Completa el título y la descripción del proyecto.',
          });
          return;
        }
        if (stagedImages.length === 0) {
          setFeedback({
            type: 'error',
            text: 'Selecciona al menos una fotografía para subir al proyecto.',
          });
          return;
        }

        const finalProjectId =
          projectForm.projectId.trim() || slugify(projectForm.projectName);

        await onAddProject({
          projectId: finalProjectId,
          projectName: projectForm.projectName,
          projectDescription: projectForm.projectDescription,
          images: stagedImages,
        });

        setProjectForm(createInitialProjectForm());
        setStagedImages([]);
        setFeedback({
          type: 'success',
          text: '¡Proyecto y fotografías publicados! Ya están visibles en la página pública de Proyectos.',
        });
      } else {
        if (!selectedExistingId) {
          setFeedback({
            type: 'error',
            text: 'Selecciona el proyecto al que deseas agregar las fotos.',
          });
          return;
        }
        if (stagedImages.length === 0) {
          setFeedback({
            type: 'error',
            text: 'Selecciona al menos una fotografía nueva para subir.',
          });
          return;
        }

        await onAddPhotosToProject(selectedExistingId, stagedImages);
        setStagedImages([]);
        setFeedback({
          type: 'success',
          text: '¡Nuevas fotografías agregadas al proyecto exitosamente!',
        });
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al guardar el proyecto.';
      setFeedback({
        type: 'error',
        text: message,
      });
    }
  };

  return (
    <Box sx={{ pb: 9 }}>
      {/* Encabezado del Dashboard Privado */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: { xs: 4, md: 6 },
          mb: 5,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
            }}
          >
            <Box>
              <Chip
                label="PARTE PRIVADA · PANEL DE ADMINISTRACIÓN"
                size="small"
                sx={{
                  bgcolor: 'secondary.light',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  mb: 1,
                }}
              />
              <Typography
                variant="h2"
                sx={{ fontSize: { xs: '2.3rem', md: '3rem' } }}
              >
                Dashboard de Daiana Millena
              </Typography>
              <Typography variant="body2">
                Control de proyectos publicados, subida de fotografías, propuestas de
                presupuesto y cartera de clientes.
              </Typography>
            </Box>

            <Button
              variant="outlined"
              color="primary"
              startIcon={<PublicOutlinedIcon />}
              onClick={() => onNavigate('projects')}
            >
              Ver Página Pública de Proyectos
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Tarjetas de Conteo (KPIs: Projects, Propuestas, Clientes) */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card
              sx={{
                p: 1,
                borderLeft: '5px solid #D8C8B8',
                bgcolor: '#FFFFFF',
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box>
                    <Typography variant="h5" sx={{ mb: 0.5 }}>
                      Projects
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontFamily: '"Montserrat", sans-serif',
                        fontWeight: 700,
                        fontSize: '2.4rem',
                      }}
                    >
                      {projectsCount}
                    </Typography>
                    <Typography variant="body2">
                      {totalPhotosCount} fotografías publicadas en total
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      bgcolor: 'primary.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CollectionsBookmarkOutlinedIcon fontSize="medium" />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Card
              sx={{
                p: 1,
                borderLeft: '5px solid #E6C5C0',
                bgcolor: '#FFFFFF',
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box>
                    <Typography variant="h5" sx={{ mb: 0.5 }}>
                      Propuestas
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontFamily: '"Montserrat", sans-serif',
                        fontWeight: 700,
                        fontSize: '2.4rem',
                      }}
                    >
                      {proposalsCount}
                    </Typography>
                    <Typography variant="body2">
                      Presupuestos solicitados desde la web
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      bgcolor: 'secondary.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <RequestQuoteOutlinedIcon fontSize="medium" />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Card
              sx={{
                p: 1,
                borderLeft: '5px solid #C8DBC8',
                bgcolor: '#FFFFFF',
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box>
                    <Typography variant="h5" sx={{ mb: 0.5 }}>
                      Clientes
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontFamily: '"Montserrat", sans-serif',
                        fontWeight: 700,
                        fontSize: '2.4rem',
                      }}
                    >
                      {clientsCount}
                    </Typography>
                    <Typography variant="body2">
                      Contactos activos en cartera
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      bgcolor: '#E5EFE5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PeopleAltOutlinedIcon fontSize="medium" />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Sección de Subida de Fotos para la Página Pública de Projects */}
        <Card sx={{ mb: 5, p: { xs: 1, md: 2 } }}>
          <CardContent>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                mb: 3,
              }}
            >
              <Box>
                <Typography variant="subtitle1">
                  Publicador de Portafolio
                </Typography>
                <Typography variant="h3" sx={{ fontSize: '2rem' }}>
                  Subir Fotos a Proyectos Públicos
                </Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant={uploadMode === 'new' ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setUploadMode('new')}
                >
                  Crear Nuevo Proyecto
                </Button>
                <Button
                  size="small"
                  variant={uploadMode === 'existing' ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => {
                    setUploadMode('existing');
                    if (!selectedExistingId && projects[0]) {
                      setSelectedExistingId(projects[0].projectId);
                    }
                  }}
                >
                  Agregar a Proyecto Existente
                </Button>
              </Stack>
            </Stack>

            {feedback && (
              <Alert
                severity={feedback.type}
                sx={{ mb: 3 }}
                onClose={() => setFeedback(null)}
              >
                {feedback.text}
              </Alert>
            )}

            <Box component="form" onSubmit={handlePublish}>
              <Grid container spacing={2.5}>
                {uploadMode === 'new' ? (
                  <>
                    <Grid size={{ xs: 12, sm: 7 }}>
                      <TextField
                        fullWidth
                        required
                        label="Nombre del Proyecto"
                        value={projectForm.projectName}
                        onChange={handleNameChange}
                        placeholder="Ej: Boda de Camila & Joaquín"
                        size="small"
                        sx={{ bgcolor: '#FFFFFF' }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 5 }}>
                      <TextField
                        fullWidth
                        required
                        label="Identificador (Slug)"
                        value={projectForm.projectId}
                        onChange={(e) =>
                          setProjectForm((prev) => ({
                            ...prev,
                            projectId: e.target.value,
                          }))
                        }
                        placeholder="boda-camila-joaquin"
                        size="small"
                        sx={{ bgcolor: '#FFFFFF' }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        required
                        multiline
                        rows={2}
                        label="Descripción de la Sesión o Evento"
                        value={projectForm.projectDescription}
                        onChange={(e) =>
                          setProjectForm((prev) => ({
                            ...prev,
                            projectDescription: e.target.value,
                          }))
                        }
                        placeholder="Describe el estilo, locación y detalles de la sesión para mostrar en la galería pública..."
                        sx={{ bgcolor: '#FFFFFF' }}
                      />
                    </Grid>
                  </>
                ) : (
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      select
                      fullWidth
                      label="Selecciona el Proyecto Existente"
                      value={selectedExistingId}
                      onChange={(e) => setSelectedExistingId(e.target.value)}
                      size="small"
                      sx={{ bgcolor: '#FFFFFF' }}
                    >
                      {projects.map((proj) => (
                        <MenuItem key={proj.projectId} value={proj.projectId}>
                          {proj.projectName} ({proj.images?.length || 0} fotos actuales)
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}

                {/* Selector de Archivos de Imagen */}
                <Grid size={{ xs: 12 }}>
                  <Box
                    component="label"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 4,
                      border: '2px dashed #D8C8B8',
                      borderRadius: 2,
                      bgcolor: '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'background-color 0.2s ease',
                      '&:hover': {
                        bgcolor: '#FDFBF9',
                        borderColor: '#B5A18E',
                      },
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={handleFileSelect}
                    />
                    <CloudUploadOutlinedIcon
                      sx={{ fontSize: 44, color: 'primary.dark', mb: 1 }}
                    />
                    <Typography
                      variant="h5"
                      sx={{ color: 'text.primary', mb: 0.5 }}
                    >
                      {uploadingFiles
                        ? 'Procesando fotografías...'
                        : 'Haz clic aquí para seleccionar fotos desde tu computadora'}
                    </Typography>
                    <Typography variant="body2">
                      Puedes elegir múltiples imágenes JPG, PNG o WebP a la vez
                    </Typography>
                  </Box>
                </Grid>

                {/* Previsualización de Fotos Seleccionadas */}
                {stagedImages.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="h5" sx={{ mb: 1.5 }}>
                      Fotografías listas para publicar ({stagedImages.length})
                    </Typography>
                    <Grid container spacing={2}>
                      {stagedImages.map((img) => (
                        <Grid key={img.imageId} size={{ xs: 12, sm: 6, md: 3 }}>
                          <Paper
                            variant="outlined"
                            sx={{ p: 1.5, bgcolor: '#FFFFFF', borderRadius: 2 }}
                          >
                            <Box
                              sx={{
                                width: '100%',
                                height: 140,
                                borderRadius: 1,
                                overflow: 'hidden',
                                mb: 1.5,
                                bgcolor: '#EFECE6',
                              }}
                            >
                              <Box
                                component="img"
                                src={img.imageBase64}
                                alt={img.imageName}
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                            </Box>
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{ alignItems: 'center' }}
                            >
                              <TextField
                                fullWidth
                                size="small"
                                label="Título de foto"
                                value={img.imageName}
                                onChange={(e) =>
                                  handleImageNameEdit(img.imageId, e.target.value)
                                }
                              />
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleRemoveStagedImage(img.imageId)}
                                aria-label="Quitar foto"
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                )}

                <Grid size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<PhotoCameraBackOutlinedIcon />}
                    disabled={uploadingFiles}
                  >
                    {uploadMode === 'new'
                      ? 'Publicar Proyecto y Fotos en Galería Pública'
                      : 'Guardar Nuevas Fotos en el Proyecto'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* Pestañas de Gestión: Proyectos, Propuestas y Clientes */}
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={(_e, val: number) => setActiveTab(val)}
            sx={{
              bgcolor: 'background.paper',
              borderBottom: '1px solid',
              borderColor: 'divider',
              px: 2,
            }}
          >
            <Tab label={`Proyectos Publicados (${projectsCount})`} />
            <Tab label={`Propuestas / Presupuestos (${proposalsCount})`} />
            <Tab label={`Directorio de Clientes (${clientsCount})`} />
          </Tabs>

          <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#FFFFFF' }}>
            {/* TAB 0: PROYECTOS PUBLICADOS */}
            {activeTab === 0 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Portada</TableCell>
                      <TableCell>Proyecto</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell align="center">Fotos</TableCell>
                      <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projects.map((proj) => (
                      <TableRow key={proj.projectId} hover>
                        <TableCell sx={{ width: 90 }}>
                          {proj.images?.[0] ? (
                            <Box
                              component="img"
                              src={proj.images[0].imageBase64}
                              alt={proj.projectName}
                              onClick={() => onOpenGallery(proj, 0)}
                              sx={{
                                width: 68,
                                height: 50,
                                objectFit: 'cover',
                                borderRadius: 1,
                                cursor: 'pointer',
                                border: '1px solid #EAE4DC',
                              }}
                            />
                          ) : (
                            <Chip label="Sin foto" size="small" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {proj.projectName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {proj.projectId}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 340 }}>
                          <Typography variant="body2" noWrap>
                            {proj.projectDescription}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${proj.images?.length || 0} fotos`}
                            size="small"
                            sx={{ bgcolor: 'primary.light', fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ justifyContent: 'flex-end' }}
                          >
                            <Tooltip title="Ver fotos en modal">
                              <IconButton
                                size="small"
                                onClick={() => onOpenGallery(proj, 0)}
                              >
                                <VisibilityOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar proyecto">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => onRemoveProject(proj.projectId)}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* TAB 1: PROPUESTAS / PRESUPUESTOS */}
            {activeTab === 1 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Cliente</TableCell>
                      <TableCell>Servicio / Fecha</TableCell>
                      <TableCell>Paquete & Mensaje</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {proposals.map((prop) => (
                      <TableRow key={prop.proposalId} hover>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {prop.clientName}
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'block' }}>
                            {prop.clientEmail}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {prop.clientPhone}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={prop.eventType}
                            size="small"
                            sx={{ bgcolor: 'primary.light', mb: 0.5 }}
                          />
                          <Typography variant="caption" sx={{ display: 'block' }}>
                            Fecha: {prop.eventDate || 'Por definir'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {prop.location || 'Sin locación'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 320 }}>
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}
                          >
                            {prop.estimatedBudget}
                          </Typography>
                          <Typography variant="body2">{prop.message}</Typography>
                        </TableCell>
                        <TableCell sx={{ minWidth: 150 }}>
                          <TextField
                            select
                            size="small"
                            value={prop.status}
                            onChange={(e) =>
                              onChangeProposalStatus(
                                prop.proposalId,
                                e.target.value as ProposalStatus
                              )
                            }
                            fullWidth
                          >
                            {PROPOSAL_STATUSES.map((st) => (
                              <MenuItem key={st} value={st}>
                                {st}
                              </MenuItem>
                            ))}
                          </TextField>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Eliminar propuesta">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => onRemoveProposal(prop.proposalId)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* TAB 2: DIRECTORIO DE CLIENTES */}
            {activeTab === 2 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre del Cliente</TableCell>
                      <TableCell>Correo Electrónico</TableCell>
                      <TableCell>Teléfono</TableCell>
                      <TableCell>Último Servicio</TableCell>
                      <TableCell align="center">Presupuestos</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.clientId} hover>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {client.name}
                          </Typography>
                        </TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.phone || '—'}</TableCell>
                        <TableCell>
                          <Chip label={client.lastEventType} size="small" />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={client.proposalsCount}
                            size="small"
                            color="success"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default DashboardPage;
