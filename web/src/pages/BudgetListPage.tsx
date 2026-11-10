import { useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  Collapse,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import BudgetCard from '../components/BudgetCard';
import type {
  IEvent,
  IProposal,
  ProposalFormInput,
  ProposalStatus,
} from '../types';

const EVENT_TYPES: string[] = [
  'Boda / Casamiento',
  'Quinceañera (15 Años)',
  'Sesión Pre-Boda / Pareja',
  'Retrato / Book Personal',
  'Maternidad & Familia',
  'Evento Corporativo / Producto',
];

const BUDGET_RANGES: string[] = [
  'Pack Esencial ($150.000 - $280.000 ARS)',
  'Pack Experiencia ($280.000 - $450.000 ARS)',
  'Pack Signature Completo (+$450.000 ARS)',
  'A convenir / Personalizado',
];

interface BudgetListPageProps {
  proposals: IProposal[];
  events: IEvent[];
  onSubmitProposal: (formData: ProposalFormInput) => IProposal;
  onRemoveProposal: (proposalId: string) => void;
}

const INITIAL_NEW_BUDGET: ProposalFormInput = {
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  eventType: EVENT_TYPES[0],
  eventDate: '',
  location: '',
  estimatedBudget: BUDGET_RANGES[1],
  message: '',
};

const BudgetListPage = ({
  proposals,
  events,
  onSubmitProposal,
  onRemoveProposal,
}: BudgetListPageProps) => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showNewForm, setShowNewForm] = useState<boolean>(false);
  const [newBudgetForm, setNewBudgetForm] =
    useState<ProposalFormInput>(INITIAL_NEW_BUDGET);
  const [formFeedback, setFormFeedback] = useState<string>('');

  const getLinkedEvent = (proposal: IProposal): IEvent | undefined =>
    events.find(
      (evt) =>
        evt.eventId === proposal.linkedEventId ||
        evt.budgetId === proposal.proposalId
    );

  const filteredProposals = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return proposals.filter((proposal) => {
      const matchesStatus =
        statusFilter === 'ALL' || proposal.status === statusFilter;
      const matchesSearch =
        !query ||
        proposal.clientName.toLowerCase().includes(query) ||
        proposal.clientEmail.toLowerCase().includes(query) ||
        proposal.eventType.toLowerCase().includes(query) ||
        (proposal.location || '').toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [proposals, searchTerm, statusFilter]);

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewBudgetForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateBudget = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !newBudgetForm.clientName.trim() ||
      !newBudgetForm.clientEmail.trim() ||
      !newBudgetForm.message.trim()
    ) {
      return;
    }

    const created = onSubmitProposal(newBudgetForm);
    setNewBudgetForm(INITIAL_NEW_BUDGET);
    setShowNewForm(false);
    setFormFeedback(
      `Presupuesto de ${created.clientName} creado correctamente. Puedes hacer clic en "Editar / Proceso del Evento" para gestionar su avance.`
    );
  };

  return (
    <Box sx={{ pt: { xs: 4, md: 5 }, pb: 10 }}>
      <Container maxWidth="lg">
        {/* Barra de Filtros y Búsqueda */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'center' },
            mb: 4,
          }}
        >
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {(
              [
                { key: 'ALL', label: 'Todos' },
                {
                  key: 'Pendiente',
                  label: 'Pendientes',
                },
                {
                  key: 'En revisión',
                  label: 'En Revisión',
                },
                {
                  key: 'Aprobado',
                  label: 'Aprobados',
                },
                {
                  key: 'Avanzado a Evento',
                  label: 'En Evento',
                },
              ] as { key: 'ALL' | ProposalStatus; label: string }[]
            ).map((item) => (
              <Chip
                key={item.key}
                label={item.label}
                clickable
                onClick={() => setStatusFilter(item.key)}
                color={statusFilter === item.key ? 'primary' : 'default'}
                variant={statusFilter === item.key ? 'filled' : 'outlined'}
                sx={{ fontWeight: statusFilter === item.key ? 700 : 500 }}
              />
            ))}
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <TextField
              placeholder="Buscar por cliente, evento o lugar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ minWidth: { md: 320 }, flexGrow: 1, bgcolor: '#FFFFFF' }}
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
            <Tooltip
              title={showNewForm ? 'Cerrar formulario' : 'Nuevo presupuesto'}
            >
              <IconButton
                onClick={() => setShowNewForm((prev) => !prev)}
                aria-label="Nuevo presupuesto"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'text.primary',
                  borderRadius: 1.5,
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                {showNewForm ? <CloseIcon /> : <AddIcon />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {formFeedback && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => setFormFeedback('')}
          >
            {formFeedback}
          </Alert>
        )}

        {/* Formulario colapsable para crear un presupuesto manual desde la parte privada */}
        <Collapse in={showNewForm}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              mb: 4,
              bgcolor: 'background.paper',
              border: '1px solid #EAE4DC',
              borderRadius: 2,
            }}
          >
            <Typography variant="h3" sx={{ fontSize: '1.8rem', mb: 2 }}>
              Registrar Nuevo Presupuesto
            </Typography>
            <Box component="form" onSubmit={handleCreateBudget}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label="Nombre del Cliente *"
                    name="clientName"
                    value={newBudgetForm.clientName}
                    onChange={handleFormChange}
                    size="small"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label="Email *"
                    name="clientEmail"
                    type="email"
                    value={newBudgetForm.clientEmail}
                    onChange={handleFormChange}
                    size="small"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label="Teléfono"
                    name="clientPhone"
                    value={newBudgetForm.clientPhone}
                    onChange={handleFormChange}
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    select
                    label="Tipo de Evento"
                    name="eventType"
                    value={newBudgetForm.eventType}
                    onChange={handleFormChange}
                    size="small"
                    fullWidth
                  >
                    {EVENT_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label="Fecha Estimada"
                    name="eventDate"
                    type="date"
                    value={newBudgetForm.eventDate}
                    onChange={handleFormChange}
                    size="small"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label="Lugar / Salón"
                    name="location"
                    value={newBudgetForm.location}
                    onChange={handleFormChange}
                    placeholder="Ej: Estancia Villa María, Pilar"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    label="Paquete / Presupuesto Estimado"
                    name="estimatedBudget"
                    value={newBudgetForm.estimatedBudget}
                    onChange={handleFormChange}
                    size="small"
                    fullWidth
                  >
                    {BUDGET_RANGES.map((range) => (
                      <MenuItem key={range} value={range}>
                        {range}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Notas / Detalles del Presupuesto *"
                    name="message"
                    value={newBudgetForm.message}
                    onChange={handleFormChange}
                    size="small"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ justifyContent: 'flex-end' }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => setShowNewForm(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                      Guardar Presupuesto
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Collapse>


        {/* Grilla de Cards de Presupuestos */}
        {filteredProposals.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              bgcolor: 'background.paper',
              border: '1px solid #EAE4DC',
              borderRadius: 2,
            }}
          >
            <Typography variant="h3" sx={{ mb: 1 }}>
              No se encontraron presupuestos
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Prueba cambiando el filtro de estado o crea un nuevo presupuesto.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setStatusFilter('ALL')}
            >
              Ver Todos los Presupuestos
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredProposals.map((proposal) => (
              <Grid key={proposal.proposalId} size={{ xs: 12, sm: 6, md: 4 }}>
                <BudgetCard
                  proposal={proposal}
                  linkedEvent={getLinkedEvent(proposal)}
                  onEditProcess={(id) => navigate(`/private/processes/${id}`)}
                  onDelete={onRemoveProposal}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default BudgetListPage;

