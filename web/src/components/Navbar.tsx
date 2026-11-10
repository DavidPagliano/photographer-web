import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import logoIcon from '../assets/daiana millena.png';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isPrivateRoute = location.pathname.startsWith('/private');
  const isHome = location.pathname === '/';
  const isProjects = location.pathname === '/projects';
  const isDashboard = location.pathname === '/private/dashboard';
  const isProcesses = location.pathname.startsWith('/private/processes');
  const isClients = location.pathname === '/private/clients';
  const isPrivateProjects = location.pathname === '/private/projects';

  const handleNavClick = (path: string, sectionId?: string) => {
    setMobileOpen(false);
    navigate(path);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
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
            onClick={() => handleNavClick(isPrivateRoute ? '/private/dashboard' : '/')}
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
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
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
                {isPrivateRoute && (
                  <Chip
                    label="PRIVADO"
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      bgcolor: 'primary.light',
                    }}
                  />
                )}
              </Stack>
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.32em',
                  mt: 0.3,
                  display: 'block',
                }}
              >
                {isPrivateRoute ? 'Gestión & Estudio' : 'Fotógrafa'}
              </Typography>
            </Box>
          </Box>

          {/* Navegación Desktop */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', display: { xs: 'none', md: 'flex' } }}
          >
            {isPrivateRoute ? (
              <>
                <Button
                  color="inherit"
                  startIcon={<DashboardCustomizeOutlinedIcon fontSize="small" />}
                  onClick={() => handleNavClick('/private/dashboard')}
                  sx={{
                    fontWeight: isDashboard ? 600 : 400,
                    borderBottom: isDashboard
                      ? '2px solid #D8C8B8'
                      : '2px solid transparent',
                    borderRadius: 0,
                    px: 2,
                  }}
                >
                  Dashboard
                </Button>

                <Button
                  color="inherit"
                  startIcon={<AccountTreeOutlinedIcon fontSize="small" />}
                  onClick={() => handleNavClick('/private/processes')}
                  sx={{
                    fontWeight: isProcesses ? 600 : 400,
                    borderBottom: isProcesses
                      ? '2px solid #D8C8B8'
                      : '2px solid transparent',
                    borderRadius: 0,
                    px: 2,
                  }}
                >
                  Presupuestos
                </Button>

                <Button
                  color="inherit"
                  startIcon={<PeopleAltOutlinedIcon fontSize="small" />}
                  onClick={() => handleNavClick('/private/clients')}
                  sx={{
                    fontWeight: isClients ? 600 : 400,
                    borderBottom: isClients
                      ? '2px solid #D8C8B8'
                      : '2px solid transparent',
                    borderRadius: 0,
                    px: 2,
                  }}
                >
                  Clientes
                </Button>

                <Button
                  color="inherit"
                  startIcon={<CollectionsOutlinedIcon fontSize="small" />}
                  onClick={() => handleNavClick('/private/projects')}
                  sx={{
                    fontWeight: isPrivateProjects ? 600 : 400,
                    borderBottom: isPrivateProjects
                      ? '2px solid #D8C8B8'
                      : '2px solid transparent',
                    borderRadius: 0,
                    px: 2,
                  }}
                >
                  Proyectos
                </Button>

                <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1.5 }} />

                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<PublicOutlinedIcon />}
                  onClick={() => handleNavClick('/')}
                >
                  Volver a Web Pública
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={() => handleNavClick('/')}
                  sx={{
                    fontWeight: isHome ? 600 : 400,
                    borderBottom: isHome
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
                  onClick={() => handleNavClick('/projects')}
                  startIcon={<PhotoCameraOutlinedIcon fontSize="small" />}
                  sx={{
                    fontWeight: isProjects ? 600 : 400,
                    borderBottom: isProjects
                      ? '2px solid #D8C8B8'
                      : '2px solid transparent',
                    borderRadius: 0,
                    px: 2,
                  }}
                >
                  Proyectos
                </Button>

                <Button
                  color="inherit"
                  onClick={() => handleNavClick('/', 'presupuesto-section')}
                  startIcon={<RequestQuoteOutlinedIcon fontSize="small" />}
                  sx={{
                    borderRadius: 0,
                    px: 2,
                  }}
                >
                  Pedir Presupuesto
                </Button>

                <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1.5 }} />

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<DashboardCustomizeOutlinedIcon />}
                  onClick={() => handleNavClick('/private/dashboard')}
                >
                  Parte Privada
                </Button>
              </>
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
            {isPrivateRoute ? 'Parte Privada' : 'Fotógrafa'}
          </Typography>
        </Box>
        <Divider sx={{ mb: 1 }} />
        {isPrivateRoute ? (
          <List>
            <ListItemButton
              selected={isDashboard}
              onClick={() => handleNavClick('/private/dashboard')}
            >
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton
              selected={isProcesses}
              onClick={() => handleNavClick('/private/processes')}
            >
              <ListItemText primary="Presupuestos" />
            </ListItemButton>
            <ListItemButton
              selected={isClients}
              onClick={() => handleNavClick('/private/clients')}
            >
              <ListItemText primary="Clientes" />
            </ListItemButton>
            <ListItemButton
              selected={isPrivateProjects}
              onClick={() => handleNavClick('/private/projects')}
            >
              <ListItemText primary="Proyectos" />
            </ListItemButton>
          </List>
        ) : (
          <List>
            <ListItemButton
              selected={isHome}
              onClick={() => handleNavClick('/')}
            >
              <ListItemText primary="Inicio" />
            </ListItemButton>
            <ListItemButton
              selected={isProjects}
              onClick={() => handleNavClick('/projects')}
            >
              <ListItemText primary="Proyectos" />
            </ListItemButton>
            <ListItemButton
              onClick={() => handleNavClick('/', 'presupuesto-section')}
            >
              <ListItemText primary="Pedir Presupuesto" />
            </ListItemButton>
          </List>
        )}
        <Divider sx={{ my: 2 }} />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={
            isPrivateRoute ? (
              <PublicOutlinedIcon />
            ) : (
              <DashboardCustomizeOutlinedIcon />
            )
          }
          onClick={() =>
            handleNavClick(isPrivateRoute ? '/' : '/private/dashboard')
          }
        >
          {isPrivateRoute ? 'Volver a Web Pública' : 'Ir a Parte Privada'}
        </Button>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
