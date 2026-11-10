import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    // Fondos: Blanco puro + Cremita suave para superficies
    background: {
      default: '#FFFFFF', // Fondo principal blanco
      paper: '#FAF7F2',   // Fondo "cremita" suave para Cards, Modales y Secciones
    },
    // Color Principal: Crema Arena / Champagne pastel
    primary: {
      light: '#EFECE6',   // Crema muy claro (ideal para fondos de hover suaves)
      main: '#D8C8B8',    // Crema arena principal
      dark: '#B5A18E',    // Tono más intenso para estados :hover o bordes
      contrastText: '#2D2D2D', // Gris oscuro para que el texto sobre crema se lea perfecto
    },
    // Color Secundario: Rosa pastel empolvado (armoniza con el crema)
    secondary: {
      light: '#F4E3E0',
      main: '#E6C5C0',
      dark: '#C99E98',
      contrastText: '#2D2D2D',
    },
    // Textos en tonalidades grises de alta legibilidad
    text: {
      primary: '#2D2D2D',   // Gris carbón suave (reemplaza al negro puro)
      secondary: '#666666', // Gris medio para párrafos descriptivos y subtítulos
      disabled: '#9E9E9E',  // Gris claro para elementos inactivos
    },
    // Colores pasteles inspirados en el obturador de la Imagen 2
    info: {
      main: '#BCE0EA', // Celeste pastel
      contrastText: '#2D2D2D',
    },
    success: {
      main: '#C8DBC8', // Verde salvia pastel
      contrastText: '#2D2D2D',
    },
    warning: {
      main: '#F5D6BA', // Durazno/Amarillo pastel
      contrastText: '#2D2D2D',
    },
    error: {
      main: '#E8B4B8', // Coral/Rosa pastel
      contrastText: '#2D2D2D',
    },
    divider: '#EAE4DC', // Línea divisoria en tono crema agrisado
  },

  typography: {
    // Fuente base para toda la web (lectura limpia)
    fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',

    // H1 y H2 usando la caligrafía fina de la primera imagen
    h1: {
      fontFamily: '"Great Vibes", cursive',
      fontWeight: 400,
      fontSize: '4rem',
      color: '#2D2D2D',
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: '"Great Vibes", cursive',
      fontWeight: 400,
      fontSize: '3rem',
      color: '#2D2D2D',
    },
    // H3 usando la cursiva con más cuerpo de la segunda imagen
    h3: {
      fontFamily: '"Dancing Script", cursive',
      fontWeight: 600,
      fontSize: '2.25rem',
      color: '#2D2D2D',
    },
    // H4 a H6 con el estilo de "F O T Ó G R A F A" (espaciado amplio y elegante)
    h4: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 400,
      fontSize: '1.25rem',
      letterSpacing: '0.25em',
      textTransform: 'uppercase',
      color: '#2D2D2D',
    },
    h5: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 500,
      fontSize: '1rem',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: '#666666',
    },
    subtitle1: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 300,
      fontSize: '0.9rem',
      letterSpacing: '0.35em', // Imita exactamente el tracking del subtítulo del logo
      textTransform: 'uppercase',
      color: '#666666',
    },
    body1: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.7,
      color: '#4A4A4A', // Gris intermedio muy cómodo para leer bloques largos
    },
    body2: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#666666',
    },
    button: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 500,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
    },
  },

  shape: {
    borderRadius: 8, // Bordes ligeramente suavizados pero sobrios
  },

  components: {
    // Ajustes para que los botones cremita se vean de alta gama y sin sombras pesadas
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          padding: '10px 28px',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(181, 161, 142, 0.25)',
          },
        },
        contained: {
          backgroundColor: '#D8C8B8',
          color: '#2D2D2D',
          '&:hover': {
            backgroundColor: '#C5B29F',
          },
        },
        outlined: {
          borderColor: '#D8C8B8',
          color: '#2D2D2D',
          '&:hover': {
            backgroundColor: '#FAF7F2',
            borderColor: '#B5A18E',
          },
        },
      },
    },
    // Las tarjetas usan el fondo cremita suave con un borde casi imperceptible
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FAF7F2',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
          border: '1px solid #F0EAE1',
        },
      },
    },
    // Navbar blanca limpia con línea inferior cremita
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(8px)',
          color: '#2D2D2D',
          boxShadow: 'none',
          borderBottom: '1px solid #F0EAE1',
        },
      },
    },
  },
});

export default theme;
