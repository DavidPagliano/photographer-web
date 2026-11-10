import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import logoFallback from '../assets/daiana millena.png';
import type { IProject } from '../types';

interface ProjectCardProps {
  project: IProject;
  onOpenGallery: (project: IProject, initialIndex?: number) => void;
}

const ProjectCard = ({ project, onOpenGallery }: ProjectCardProps) => {
  const images = project?.images ?? [];
  const coverImage = images[0]?.imageBase64 || logoFallback;
  const photosCount = images.length;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0px 12px 28px rgba(181, 161, 142, 0.2)',
        },
      }}
    >
      {/* Imagen de portada clickeable para abrir el modal */}
      <Box
        onClick={() => onOpenGallery(project, 0)}
        sx={{
          position: 'relative',
          pt: '68%',
          cursor: 'pointer',
          overflow: 'hidden',
          bgcolor: '#EFECE6',
          '&:hover .cover-img': {
            transform: 'scale(1.04)',
          },
        }}
      >
        <CardMedia
          component="img"
          image={coverImage}
          alt={project.projectName}
          className="cover-img"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.45s ease',
          }}
        />
        <Chip
          icon={<CollectionsOutlinedIcon sx={{ fontSize: '1rem !important' }} />}
          label={`${photosCount} ${photosCount === 1 ? 'foto' : 'fotos'}`}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            fontWeight: 600,
            color: 'text.primary',
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: '1.75rem',
            mb: 0.75,
            cursor: 'pointer',
          }}
          onClick={() => onOpenGallery(project, 0)}
        >
          {project.projectName}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.projectDescription}
        </Typography>

        {/* Miniaturas rápidas para abrir directamente cualquier foto en el modal */}
        {images.length > 1 && (
          <Stack direction="row" spacing={1} sx={{ mt: 'auto', pt: 0.5 }}>
            {images.slice(0, 4).map((img, idx) => (
              <Box
                key={img.imageId || idx}
                onClick={() => onOpenGallery(project, idx)}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid #EAE4DC',
                  position: 'relative',
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 0.85 },
                }}
              >
                <Box
                  component="img"
                  src={img.imageBase64}
                  alt={img.imageName}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {idx === 3 && images.length > 4 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      bgcolor: 'rgba(45,45,45,0.6)',
                      color: '#FFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    +{images.length - 4}
                  </Box>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 1 }}>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          startIcon={<VisibilityOutlinedIcon />}
          onClick={() => onOpenGallery(project, 0)}
        >
          Ver Galería de Fotos
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
