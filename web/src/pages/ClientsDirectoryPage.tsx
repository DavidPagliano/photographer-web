import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import type { IClient } from '../types';

interface ClientsDirectoryPageProps {
  clients: IClient[];
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return (parts[0]?.[0] || 'C').toUpperCase();
  return `${parts[0]?.[0] || ''}${parts[parts.length - 1]?.[0] || ''}`.toUpperCase();
};

const formatEventDate = (dateStr?: string): string => {
  if (!dateStr || dateStr === 'Por definir') return 'Por definir';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }
  return dateStr;
};

const ClientsDirectoryPage = ({ clients }: ClientsDirectoryPageProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEventType, setSelectedEventType] = useState<string>('ALL');

  const eventTypes = useMemo(() => {
    const unique = new Set<string>();
    clients.forEach((client) => {
      if (client.lastEventType) unique.add(client.lastEventType);
    });
    return Array.from(unique);
  }, [clients]);

  const filteredClients = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return clients.filter((client) => {
      const matchesType =
        selectedEventType === 'ALL' ||
        client.lastEventType === selectedEventType;

      const matchesSearch =
        !query ||
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.phone.toLowerCase().includes(query) ||
        client.lastEventType.toLowerCase().includes(query) ||
        (client.eventDate || '').toLowerCase().includes(query) ||
        formatEventDate(client.eventDate).toLowerCase().includes(query) ||
        (client.lastLocation || '').toLowerCase().includes(query);

      return matchesType && matchesSearch;
    });
  }, [clients, searchTerm, selectedEventType]);

  return (
    <Box sx={{ pt: { xs: 4, md: 5 }, pb: 10 }}>
      <Container maxWidth="lg">
        {/* Buscador por Cliente o Evento y Filtros */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            mb: 3.5,
            bgcolor: 'background.paper',
            border: '1px solid #EAE4DC',
            borderRadius: 2,
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', md: 'center' },
            }}
          >
            <TextField
              placeholder="Buscar por cliente, email, teléfono, fecha o tipo de evento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              fullWidth
              sx={{ maxWidth: { md: 460 }, bgcolor: '#FFFFFF' }}
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

            <Stack
              direction="row"
              spacing={1}
              sx={{ flexWrap: 'wrap', gap: 1 }}
            >
              <Chip
                label="Todos"
                clickable
                onClick={() => setSelectedEventType('ALL')}
                color={selectedEventType === 'ALL' ? 'primary' : 'default'}
                variant={selectedEventType === 'ALL' ? 'filled' : 'outlined'}
                sx={{ fontWeight: selectedEventType === 'ALL' ? 700 : 500 }}
              />
              {eventTypes.map((type) => (
                <Chip
                  key={type}
                  label={type}
                  clickable
                  onClick={() => setSelectedEventType(type)}
                  color={selectedEventType === type ? 'primary' : 'default'}
                  variant={selectedEventType === type ? 'filled' : 'outlined'}
                  sx={{ fontWeight: selectedEventType === type ? 700 : 500 }}
                />
              ))}
            </Stack>
          </Stack>
        </Paper>

        {/* Tabla del Directorio de Clientes */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: '#FFFFFF',
            border: '1px solid #EAE4DC',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {filteredClients.length === 0 ? (
            <Box sx={{ py: 7, px: 3, textAlign: 'center' }}>
              <Typography variant="h3" sx={{ mb: 1 }}>
                No se encontraron clientes
              </Typography>
              <Typography variant="body2" sx={{ mb: 2.5 }}>
                No hay clientes que coincidan con “{searchTerm}”.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedEventType('ALL');
                }}
              >
                Limpiar Búsqueda
              </Button>
            </Box>
          ) : (
            <TableContainer sx={{ width: '100%', overflowX: 'hidden' }}>
              <Table sx={{ width: '100%', tableLayout: 'fixed' }}>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: '#FAF7F2',
                      '& th': {
                        py: 2,
                        px: 2,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'text.secondary',
                        whiteSpace: 'nowrap',
                        borderBottom: '1px solid #EAE4DC',
                      },
                    }}
                  >
                    <TableCell sx={{ width: '24%' }}>Cliente & Lugar</TableCell>
                    <TableCell sx={{ width: '25%' }}>Contacto</TableCell>
                    <TableCell sx={{ width: '22%' }}>Evento</TableCell>
                    <TableCell sx={{ width: '15%' }}>Fecha del Evento</TableCell>
                    <TableCell align="center" sx={{ width: '14%' }}>
                      Presupuestos
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow
                      key={client.clientId}
                      hover
                      sx={{
                        '&:last-child td': { borderBottom: 0 },
                        '& td': {
                          py: 2,
                          px: 2,
                          verticalAlign: 'middle',
                          borderBottom: '1px solid #F2ECE4',
                        },
                      }}
                    >
                      {/* Columna 1: Cliente + Lugar */}
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          sx={{ alignItems: 'center' }}
                        >
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: 'primary.light',
                              color: 'text.primary',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {getInitials(client.name)}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                color: 'text.primary',
                                fontSize: '0.92rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {client.name}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={0.5}
                              sx={{
                                alignItems: 'center',
                                color: 'text.secondary',
                                mt: 0.25,
                              }}
                            >
                              <PlaceOutlinedIcon
                                sx={{ fontSize: 14, flexShrink: 0 }}
                              />
                              <Typography
                                variant="caption"
                                sx={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {client.lastLocation || 'Ubicación por definir'}
                              </Typography>
                            </Stack>
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* Columna 2: Contacto (Email + Teléfono) */}
                      <TableCell>
                        <Stack spacing={0.4} sx={{ minWidth: 0 }}>
                          <Stack
                            direction="row"
                            spacing={0.75}
                            sx={{ alignItems: 'center', minWidth: 0 }}
                          >
                            <MailOutlineOutlinedIcon
                              sx={{
                                fontSize: 15,
                                color: 'text.secondary',
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'text.primary',
                                fontSize: '0.84rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {client.email}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={0.75}
                            sx={{ alignItems: 'center' }}
                          >
                            <PhoneOutlinedIcon
                              sx={{
                                fontSize: 15,
                                color: 'text.secondary',
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {client.phone || 'Sin teléfono'}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>

                      {/* Columna 3: Tipo de Evento */}
                      <TableCell>
                        <Chip
                          label={client.lastEventType}
                          size="small"
                          sx={{
                            bgcolor: 'secondary.light',
                            fontWeight: 600,
                            maxWidth: '100%',
                          }}
                        />
                      </TableCell>

                      {/* Columna 4: Fecha del Evento */}
                      <TableCell>
                        <Chip
                          icon={
                            <EventAvailableOutlinedIcon
                              sx={{ fontSize: '0.95rem !important' }}
                            />
                          }
                          label={formatEventDate(client.eventDate)}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: 600,
                            bgcolor: '#FAF7F2',
                            borderColor: '#E2D9CC',
                          }}
                        />
                      </TableCell>

                      {/* Columna 5: Cantidad de Presupuestos */}
                      <TableCell align="center">
                        <Chip
                          label={client.proposalsCount}
                          size="small"
                          sx={{
                            bgcolor: 'primary.light',
                            fontWeight: 700,
                            minWidth: 32,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ClientsDirectoryPage;
