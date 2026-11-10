import { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import logoIcon from '../assets/daiana millena.png';
import type { PageView } from '../types';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  projectsCount: number;
  proposalsCount: number;
}

const Navbar = ({
  currentPage,
  onNavigate,
  projectsCount,
  proposalsCount,
}: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const isDashboard = currentPage === 'dashboard';

  const handleNavClick = (page: PageView, sectionId?: string) => {
    setMobileOpen(false);
    onNavigate(page);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 72, md: 86 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* Logo & Marca */}
          <Box
            onClick={() => handleNavClick('home')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <Box
              component="img"
              src={logoIcon}
              alt="Daiana Millena Logo"
              sx={{
                height: { xs: 44, md: 54 },
                width: 'auto',
                objectFit: 'contain',
              }}
            />
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '1.5rem', md: '1.85rem' },
                  lineHeight: 1,
                  color: 'text.primary',
                }}
              >
                Daiana Millena
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.32em',
                  mt: 0.3,
                  display: 'block',
                }}
              >
                Fotógrafa
              </Typography>
            </Box>
          </Box>

          {/* Navegación Desktop */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', display: { xs: 'none', md: 'flex' } }}
          >
            <Button
              color="inherit"
              onClick={() => handleNavClick('home')}
              sx={{
                fontWeight: currentPage === 'home' ? 600 : 400,
                borderBottom:
                  currentPage === 'home'
                    ? '2px solid #D8C8B8'
                    : '2px solid transparent',
                borderRadius: 0,
                px: 2,
              }}
            >
              Inicio
            </Button>

            <Button
              color="inherit"
              onClick={() => handleNavClick('projects')}
              startIcon={<PhotoCameraOutlinedIcon fontSize="small" />}
              sx={{
                fontWeight: currentPage === 'projects' ? 600 : 400,
                borderBottom:
                  currentPage === 'projects'
                    ? '2px solid #D8C8B8'
                    : '2px solid transparent',
                borderRadius: 0,
                px: 2,
              }}
            >
              Proyectos ({projectsCount})
            </Button>

            <Button
              color="inherit"
              onClick={() => handleNavClick('home', 'presupuesto-section')}
              startIcon={<RequestQuoteOutlinedIcon fontSize="small" />}
              sx={{
                borderRadius: 0,
                px: 2,
              }}
            >
              Pedir Presupuesto
            </Button>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1.5 }} />

            {isDashboard ? (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<PublicOutlinedIcon />}
                onClick={() => handleNavClick('home')}
              >
                Volver a Web Pública
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<DashboardCustomizeOutlinedIcon />}
                onClick={() => handleNavClick('dashboard')}
                sx={{ position: 'relative' }}
              >
                Parte Privada
                {proposalsCount > 0 && (
                  <Chip
                    label={proposalsCount}
                    size="small"
                    sx={{
                      ml: 1,
                      height: 20,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      bgcolor: 'secondary.main',
                      color: 'text.primary',
                    }}
                  />
                )}
              </Button>
            )}
          </Stack>

          {/* Botón Menú Móvil */}
          <IconButton
            sx={{ display: { xs: 'flex', md: 'none' } }}
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Drawer Móvil */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: { width: 280, bgcolor: 'background.paper', p: 2 },
          },
        }}
      >
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontSize: '1.75rem' }}>
            Daiana Millena
          </Typography>
          <Typography variant="subtitle1" sx={{ fontSize: '0.68rem' }}>
            Fotógrafa
          </Typography>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <List>
          <ListItemButton
            selected={currentPage === 'home'}
            onClick={() => handleNavClick('home')}
          >
            <ListItemText primary="Inicio" />
          </ListItemButton>
          <ListItemButton
            selected={currentPage === 'projects'}
            onClick={() => handleNavClick('projects')}
          >
            <ListItemText primary={`Proyectos (${projectsCount})`} />
          </ListItemButton>
          <ListItemButton
            onClick={() => handleNavClick('home', 'presupuesto-section')}
          >
            <ListItemText primary="Pedir Presupuesto" />
          </ListItemButton>
        </List>
        <Divider sx={{ my: 2 }} />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={
            isDashboard ? (
              <PublicOutlinedIcon />
            ) : (
              <DashboardCustomizeOutlinedIcon />
            )
          }
          onClick={() => handleNavClick(isDashboard ? 'home' : 'dashboard')}
        >
          {isDashboard ? 'Volver a Web Pública' : 'Ir a Parte Privada'}
        </Button>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
