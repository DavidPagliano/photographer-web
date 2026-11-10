import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { filesToBase64Images } from '../services/projectService';
import type { IImage, IProject, ProjectFormInput } from '../types';

type UploadMode = 'new' | 'existing';

interface ManageProjectsPageProps {
  projects: IProject[];
  projectsCount: number;
  totalPhotosCount: number;
  onAddProject: (newProjectData: ProjectFormInput) => Promise<IProject>;
  onAddPhotosToProject: (
    projectId: string,
    newImages: IImage[]
  ) => Promise<IProject | null>;
  onRemoveProject: (projectId: string) => Promise<void>;
  onOpenGallery: (project: IProject, initialIndex?: number) => void;
}

const ManageProjectsPage = ({
  projects,
  projectsCount,
  totalPhotosCount,
  onAddProject,
  onAddPhotosToProject,
  onRemoveProject,
  onOpenGallery,
}: ManageProjectsPageProps) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadMode, setUploadMode] = useState<UploadMode>('new');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects[0]?.projectId || ''
  );
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [previewImages, setPreviewImages] = useState<IImage[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const handleFilesSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const converted = await filesToBase64Images(files);
      setPreviewImages((prev) => [...prev, ...converted]);
      setFeedback(null);
    } catch {
      setFeedback({
        type: 'error',
        message: 'No se pudieron procesar algunas imágenes seleccionadas.',
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddUrlImage = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    const newImage: IImage = {
      imageId: `img-url-${Date.now()}`,
      imageName: `Foto ${previewImages.length + 1}`,
      imageBase64: trimmed,
    };
    setPreviewImages((prev) => [...prev, newImage]);
    setImageUrlInput('');
  };

  const handleRemovePreview = (indexToRemove: number) => {
    setPreviewImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handlePublishPhotos = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (previewImages.length === 0) {
      setFeedback({
        type: 'error',
        message: 'Debes subir o agregar al menos 1 fotografía antes de publicar.',
      });
      return;
    }

    setUploading(true);
    try {
      if (uploadMode === 'new') {
        if (!projectName.trim() || !projectDescription.trim()) {
          setFeedback({
            type: 'error',
            message: 'Completa el título y la descripción del nuevo proyecto.',
          });
          setUploading(false);
          return;
        }

        const slug =
          projectName
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || `proyecto-${Date.now()}`;

        await onAddProject({
          projectId: `${slug}-${Date.now().toString().slice(-4)}`,
          projectName: projectName.trim(),
          projectDescription: projectDescription.trim(),
          images: previewImages,
        });

        setProjectName('');
        setProjectDescription('');
        setPreviewImages([]);
        setFeedback({
          type: 'success',
          message:
            '¡Proyecto creado exitosamente! Tus fotos ya están disponibles en la galería pública.',
        });
      } else {
        const targetId = selectedProjectId || projects[0]?.projectId;
        if (!targetId) {
          setFeedback({
            type: 'error',
            message: 'Selecciona un proyecto existente.',
          });
          setUploading(false);
          return;
        }

        await onAddPhotosToProject(targetId, previewImages);
        setPreviewImages([]);
        setFeedback({
          type: 'success',
          message:
            '¡Nuevas fotografías añadidas al proyecto y visibles en la galería pública!',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'Ocurrió un error al publicar las fotografías.',
      });
    } finally {
      setUploading(false);
    }
  };

  const filteredProjects = projects.filter((proj) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      proj.projectName.toLowerCase().includes(q) ||
      proj.projectDescription.toLowerCase().includes(q) ||
      proj.projectId.toLowerCase().includes(q)
    );
  });

  return (
    <Box sx={{ pt: { xs: 4, md: 5 }, pb: 10 }}>
      <Container maxWidth="lg">
        {/* Barra superior con botón hacia la vista pública */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            mb: 3.5,
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Chip
              label={`${projectsCount} Proyectos`}
              sx={{ bgcolor: 'primary.light', fontWeight: 600 }}
            />
            <Chip
              label={`${totalPhotosCount} Fotos publicadas`}
              sx={{ bgcolor: 'secondary.light', fontWeight: 600 }}
            />
          </Stack>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<PublicOutlinedIcon />}
            onClick={() => navigate('/projects')}
            sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}
          >
            Ver Galería Pública de Proyectos
          </Button>
        </Stack>

        <Grid container spacing={4}>
          {/* Columna Izquierda: Formulario de Subida de Fotos */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                bgcolor: 'background.paper',
                border: '1px solid #EAE4DC',
                borderRadius: 2,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', mb: 1 }}
              >
                <AddPhotoAlternateOutlinedIcon color="primary" />
                <Typography variant="h3" sx={{ fontSize: '1.6rem' }}>
                  Subir Fotos a Proyectos
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Crea un proyecto nuevo o añade fotos a uno existente para mostrarlas en
                la página pública de Proyectos.
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                <Button
                  size="small"
                  variant={uploadMode === 'new' ? 'contained' : 'outlined'}
                  onClick={() => setUploadMode('new')}
                >
                  Crear Proyecto Nuevo
                </Button>
                <Button
                  size="small"
                  variant={uploadMode === 'existing' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setUploadMode('existing');
                    if (!selectedProjectId && projects[0]) {
                      setSelectedProjectId(projects[0].projectId);
                    }
                  }}
                >
                  Agregar a Existente
                </Button>
              </Stack>

              {feedback && (
                <Alert
                  severity={feedback.type}
                  sx={{ mb: 2.5 }}
                  onClose={() => setFeedback(null)}
                >
                  {feedback.message}
                </Alert>
              )}

              <Box component="form" onSubmit={handlePublishPhotos}>
                <Stack spacing={2.5}>
                  {uploadMode === 'new' ? (
                    <>
                      <TextField
                        label="Nombre del Proyecto *"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Ej: Boda Sofía & Tomás"
                        size="small"
                        fullWidth
                      />
                      <TextField
                        label="Descripción del Proyecto *"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder="Describe los detalles y estética de la sesión..."
                        size="small"
                        multiline
                        rows={3}
                        fullWidth
                      />
                    </>
                  ) : (
                    <FormControl size="small" fullWidth>
                      <InputLabel id="select-project-label">
                        Seleccionar Proyecto
                      </InputLabel>
                      <Select
                        labelId="select-project-label"
                        label="Seleccionar Proyecto"
                        value={selectedProjectId}
                        onChange={(e: SelectChangeEvent) =>
                          setSelectedProjectId(e.target.value)
                        }
                      >
                        {projects.map((proj) => (
                          <MenuItem key={proj.projectId} value={proj.projectId}>
                            {proj.projectName} ({proj.images?.length || 0} fotos)
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  <Box
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      border: '2px dashed #D8C8B8',
                      borderRadius: 2,
                      p: 2.5,
                      textAlign: 'center',
                      bgcolor: '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                      '&:hover': { bgcolor: '#FAF6F2' },
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={handleFilesSelect}
                    />
                    <CloudUploadOutlinedIcon
                      sx={{ fontSize: 36, color: 'text.secondary', mb: 0.5 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: 'text.primary' }}
                    >
                      Seleccionar fotos desde tu dispositivo
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      JPG, PNG o WEBP (selección múltiple)
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1}>
                    <TextField
                      label="O pegar URL de imagen"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      size="small"
                      fullWidth
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddUrlImage}
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      Añadir URL
                    </Button>
                  </Stack>

                  {previewImages.length > 0 && (
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, mb: 1, display: 'block' }}
                      >
                        Fotos listas para publicar ({previewImages.length}):
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ overflowX: 'auto', pb: 1 }}
                      >
                        {previewImages.map((imgItem, idx) => (
                          <Box
                            key={`${imgItem.imageId}-${idx}`}
                            sx={{
                              position: 'relative',
                              width: 68,
                              height: 68,
                              borderRadius: 1,
                              overflow: 'hidden',
                              flexShrink: 0,
                              border: '1px solid #EAE4DC',
                            }}
                          >
                            <Box
                              component="img"
                              src={imgItem.imageBase64}
                              alt={imgItem.imageName}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleRemovePreview(idx)}
                              sx={{
                                position: 'absolute',
                                top: 2,
                                right: 2,
                                bgcolor: 'rgba(0,0,0,0.6)',
                                color: '#fff',
                                p: 0.25,
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                              }}
                            >
                              <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={uploading}
                    fullWidth
                  >
                    {uploading
                      ? 'Procesando fotos...'
                      : uploadMode === 'new'
                        ? 'Publicar Proyecto en Web Pública'
                        : 'Guardar Fotos en el Proyecto'}
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Grid>

          {/* Columna Derecha: Tabla de Proyectos Activos */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                bgcolor: 'background.paper',
                border: '1px solid #EAE4DC',
                borderRadius: 2,
                height: '100%',
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{
                  justifyContent: 'space-between',
                  alignItems: { xs: 'stretch', sm: 'center' },
                  mb: 2.5,
                }}
              >
                <Typography variant="h3" sx={{ fontSize: '1.6rem' }}>
                  Proyectos en Galería Pública
                </Typography>

                <TextField
                  placeholder="Buscar proyecto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  sx={{ minWidth: 200, bgcolor: '#FFFFFF' }}
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
              </Stack>

              <TableContainer sx={{ bgcolor: '#FFFFFF', borderRadius: 1.5 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#FAF7F2' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Portada</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Proyecto</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Fotos</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        Acciones
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProjects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No se encontraron proyectos.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProjects.map((proj) => (
                        <TableRow key={proj.projectId} hover>
                          <TableCell>
                            <Box
                              component="img"
                              src={proj.images?.[0]?.imageBase64}
                              alt={proj.projectName}
                              sx={{
                                width: 52,
                                height: 40,
                                objectFit: 'cover',
                                borderRadius: 1,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: 'text.primary' }}
                            >
                              {proj.projectName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: 'block',
                                maxWidth: 260,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {proj.projectDescription}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`${proj.images?.length || 0} fotos`}
                              size="small"
                              sx={{ bgcolor: 'primary.light', fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Abrir visor de fotos">
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
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ManageProjectsPage;

