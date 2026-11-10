import { useEffect, useState } from 'react';
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import type { IProject } from '../types';

interface ProjectGalleryModalProps {
  open: boolean;
  project: IProject | null;
  initialIndex?: number;
  onClose: () => void;
}

const ProjectGalleryModal = ({
  open,
  project,
  initialIndex = 0,
  onClose,
}: ProjectGalleryModalProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);

  const images = project?.images ?? [];
  const total = images.length;

  useEffect(() => {
    if (!open || total <= 1) return undefined;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % total);
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + total) % total);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, total]);

  if (!project) return null;

  const currentImage = images[activeIndex] || images[0];

  const handlePrev = () => {
    if (total > 1) {
      setActiveIndex((prev) => (prev - 1 + total) % total);
    }
  };

  const handleNext = () => {
    if (total > 1) {
      setActiveIndex((prev) => (prev + 1) % total);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: 'background.paper',
            borderRadius: 2,
            overflow: 'hidden',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 2,
          px: { xs: 2, md: 3 },
        }}
      >
        <Box>
          <Typography variant="h3" sx={{ fontSize: { xs: '1.6rem', md: '2rem' } }}>
            {project.projectName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {project.projectDescription}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          {total > 0 && (
            <Chip
              icon={<PhotoCameraOutlinedIcon sx={{ fontSize: '1rem !important' }} />}
              label={`Foto ${activeIndex + 1} de ${total}`}
              sx={{ bgcolor: 'primary.light', fontWeight: 600 }}
            />
          )}
          <IconButton onClick={onClose} aria-label="Cerrar galería">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 1.5, md: 3 }, bgcolor: '#FFFFFF' }}>
        {total === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Este proyecto aún no tiene fotografías cargadas.
            </Typography>
          </Box>
        ) : (
          <Box>
            {/* Visor Principal */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: 300, sm: 440, md: 540 },
                bgcolor: '#FAF7F2',
                borderRadius: 2,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #EAE4DC',
              }}
            >
              <Box
                component="img"
                src={currentImage?.imageBase64}
                alt={currentImage?.imageName || project.projectName}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />

              {total > 1 && (
                <>
                  <IconButton
                    onClick={handlePrev}
                    aria-label="Foto anterior"
                    sx={{
                      position: 'absolute',
                      left: 12,
                      bgcolor: 'rgba(255, 255, 255, 0.88)',
                      '&:hover': { bgcolor: '#FFFFFF' },
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    }}
                  >
                    <ArrowBackIosNewIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    onClick={handleNext}
                    aria-label="Foto siguiente"
                    sx={{
                      position: 'absolute',
                      right: 12,
                      bgcolor: 'rgba(255, 255, 255, 0.88)',
                      '&:hover': { bgcolor: '#FFFFFF' },
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    }}
                  >
                    <ArrowForwardIosIcon fontSize="small" />
                  </IconButton>
                </>
              )}
            </Box>

            {/* Nombre de la foto actual */}
            <Box sx={{ mt: 1.5, textAlign: 'center' }}>
              <Typography variant="subtitle1" sx={{ letterSpacing: '0.18em' }}>
                {currentImage?.imageName || `Fotografía ${activeIndex + 1}`}
              </Typography>
            </Box>

            {/* Tira de miniaturas */}
            {total > 1 && (
              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  mt: 2.5,
                  pb: 0.5,
                  overflowX: 'auto',
                  justifyContent: { xs: 'flex-start', sm: 'center' },
                }}
              >
                {images.map((img, idx) => {
                  const isSelected = idx === activeIndex;
                  return (
                    <Box
                      key={img.imageId || idx}
                      onClick={() => setActiveIndex(idx)}
                      sx={{
                        width: 78,
                        height: 60,
                        flexShrink: 0,
                        borderRadius: 1,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: isSelected
                          ? '2.5px solid #B5A18E'
                          : '1px solid #EAE4DC',
                        opacity: isSelected ? 1 : 0.6,
                        transition: 'all 0.2s ease',
                        '&:hover': { opacity: 1 },
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
                  );
                })}
              </Stack>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProjectGalleryModal;
