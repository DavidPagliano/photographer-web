import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
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
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import type {
  EventProcessStage,
  IEvent,
  IEventDelivery,
  IProposal,
  ProposalStatus,
} from '../types';

type DepositMethod = 'Transferencia' | 'Efectivo' | 'Tarjeta' | 'MercadoPago';

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

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount || 0);

interface BudgetProcessDetailPageProps {
  proposals: IProposal[];
  events: IEvent[];
  onUpdateProposal: (proposalId: string, changes: Partial<IProposal>) => void;
  onRemoveProposal: (proposalId: string) => void;
  onAdvanceToEvent: (
    proposalId: string,
    initialDeposit?: number
  ) => IEvent | null;
  onAddEventItem: (eventId: string, concept: string, price: number) => void;
  onRemoveEventItem: (eventId: string, itemId: string) => void;
  onToggleItemDelivered: (eventId: string, itemId: string) => void;
  onRegisterDeposit: (
    eventId: string,
    depositInput: {
      amount: number;
      method: string;
      targetItemId?: string;
      note: string;
    }
  ) => void;
  onSetEventStage: (eventId: string, stage: EventProcessStage) => void;
  onSaveEventDelivery: (
    eventId: string,
    deliveryChanges: Partial<IEventDelivery>
  ) => void;
}

const BudgetProcessDetailContent = ({
  proposalId,
  proposals,
  events,
  onUpdateProposal,
  onRemoveProposal,
  onAdvanceToEvent,
  onAddEventItem,
  onRemoveEventItem,
  onToggleItemDelivered,
  onRegisterDeposit,
  onSetEventStage,
  onSaveEventDelivery,
}: BudgetProcessDetailPageProps & { proposalId?: string }) => {
  const navigate = useNavigate();

  const proposal = proposals.find((p) => p.proposalId === proposalId);
  const linkedEvent = events.find(
    (evt) =>
      (proposal && evt.eventId === proposal.linkedEventId) ||
      evt.budgetId === proposalId
  );

  // Estado local para edición del presupuesto
  const [clientName, setClientName] = useState<string>(
    proposal?.clientName || ''
  );
  const [clientEmail, setClientEmail] = useState<string>(
    proposal?.clientEmail || ''
  );
  const [clientPhone, setClientPhone] = useState<string>(
    proposal?.clientPhone || ''
  );
  const [eventType, setEventType] = useState<string>(
    proposal?.eventType || EVENT_TYPES[0]
  );
  const [eventDate, setEventDate] = useState<string>(
    proposal?.eventDate || ''
  );
  const [location, setLocation] = useState<string>(proposal?.location || '');
  const [estimatedBudget, setEstimatedBudget] = useState<string>(
    proposal?.estimatedBudget || BUDGET_RANGES[0]
  );
  const [status, setStatus] = useState<ProposalStatus>(
    proposal?.status || 'Pendiente'
  );
  const [message, setMessage] = useState<string>(proposal?.message || '');

  // Estado para avanzar a evento y gestionar paquetes/depósitos
  const [initialDepositInput, setInitialDepositInput] = useState<string>('');
  const [newItemConcept, setNewItemConcept] = useState<string>('');
  const [newItemPrice, setNewItemPrice] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [depositMethod, setDepositMethod] =
    useState<DepositMethod>('Transferencia');
  const [depositNote, setDepositNote] = useState<string>('');
  const [depositTargetItem, setDepositTargetItem] = useState<string>('');

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  if (!proposal) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: 'center',
            bgcolor: 'background.paper',
            border: '1px solid #EAE4DC',
            borderRadius: 2,
          }}
        >
          <Typography variant="h3" sx={{ mb: 1 }}>
            Presupuesto no encontrado
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            El presupuesto solicitado no existe o fue eliminado.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={() => navigate('/private/processes')}
          >
            Volver a Lista de Presupuestos
          </Button>
        </Paper>
      </Container>
    );
  }

  // Determinar paso activo del Stepper (0: Presupuesto, 1: Evento y Paquetes, 2: Entrega)
  const activeStep = !linkedEvent
    ? 0
    : linkedEvent.stage === 'En Etapa de Entrega' ||
        linkedEvent.stage === 'Finalizado'
      ? 2
      : 1;

  const handleSaveBudget = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim()) {
      setFeedback({
        type: 'error',
        message: 'El nombre y el email del cliente son obligatorios.',
      });
      return;
    }

    onUpdateProposal(proposal.proposalId, {
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientPhone: clientPhone.trim(),
      eventType,
      eventDate,
      location: location.trim(),
      estimatedBudget,
      status,
      message: message.trim(),
    });

    setFeedback({
      type: 'success',
      message: 'Datos del presupuesto actualizados correctamente.',
    });
  };

  const handleDeleteBudget = () => {
    onRemoveProposal(proposal.proposalId);
    navigate('/private/processes');
  };

  const handleAdvanceBudget = () => {
    const parsedInitial = Number(initialDepositInput) || 0;
    const createdEvent = onAdvanceToEvent(proposal.proposalId, parsedInitial);
    if (createdEvent) {
      setStatus('Avanzado a Evento');
      setInitialDepositInput('');
      setFeedback({
        type: 'success',
        message:
          '¡Presupuesto confirmado! Se creó el proceso del evento con su paquete dinámico y etapa de entrega.',
      });
    }
  };

  const handleAddDynamicItem = () => {
    if (!linkedEvent) return;
    const price = Number(newItemPrice);
    if (!newItemConcept.trim() || !price || price <= 0) {
      setFeedback({
        type: 'error',
        message:
          'Ingresa el concepto y un precio mayor a 0 para el ítem del paquete.',
      });
      return;
    }

    onAddEventItem(linkedEvent.eventId, newItemConcept.trim(), price);
    setNewItemConcept('');
    setNewItemPrice('');
    setFeedback({
      type: 'success',
      message: 'Ítem agregado dinámicamente al paquete del evento.',
    });
  };

  const handleAddDepositSubmit = () => {
    if (!linkedEvent) return;
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) {
      setFeedback({
        type: 'error',
        message: 'Ingresa un monto válido para registrar el pago o depósito.',
      });
      return;
    }

    onRegisterDeposit(linkedEvent.eventId, {
      amount,
      method: depositMethod,
      note: depositNote.trim() || 'Pago parcial de paquete',
      targetItemId: depositTargetItem || undefined,
    });

    setDepositAmount('');
    setDepositNote('');
    setDepositTargetItem('');
    setFeedback({
      type: 'success',
      message:
        'Depósito registrado. Se actualizaron los saldos del paquete y de la etapa de entrega.',
    });
  };

  return (
    <Box sx={{ pb: 10 }}>
      {/* Encabezado Superior */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: { xs: 4, md: 5 },
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              mb: 3,
            }}
          >
            <Box>
              <Button
                size="small"
                color="inherit"
                startIcon={<ArrowBackOutlinedIcon />}
                onClick={() => navigate('/private/processes')}
                sx={{ mb: 1, px: 0 }}
              >
                Volver a Lista de Presupuestos
              </Button>
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: 'center', flexWrap: 'wrap' }}
              >
                <Typography
                  variant="h1"
                  sx={{ fontSize: { xs: '2.2rem', md: '3rem' } }}
                >
                  Proceso: {proposal.clientName}
                </Typography>
                <Chip
                  label={proposal.status}
                  color={
                    proposal.status === 'Avanzado a Evento' ||
                    proposal.status === 'Aprobado'
                      ? 'success'
                      : proposal.status === 'En revisión'
                        ? 'info'
                        : 'warning'
                  }
                  sx={{ fontWeight: 700 }}
                />
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                sx={{ mt: 1, flexWrap: 'wrap', color: 'text.secondary' }}
              >
                <Typography variant="body2">
                  Evento: <strong>{proposal.eventType}</strong>
                </Typography>
                {proposal.eventDate && (
                  <Typography variant="body2">
                    Fecha: <strong>{proposal.eventDate}</strong>
                  </Typography>
                )}
                {proposal.location && (
                  <Typography variant="body2">
                    Lugar: <strong>{proposal.location}</strong>
                  </Typography>
                )}
              </Stack>
            </Box>

            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={handleDeleteBudget}
            >
              Eliminar Presupuesto
            </Button>
          </Stack>

          {/* Stepper Visual del Proceso */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              bgcolor: '#FFFFFF',
              border: '1px solid #EAE4DC',
              borderRadius: 2,
            }}
          >
            <Stepper activeStep={activeStep} alternativeLabel>
              <Step completed={Boolean(linkedEvent)}>
                <StepLabel>
                  <strong>Etapa 1: Presupuesto</strong>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    Cotización inicial, lugar y datos del cliente
                  </Typography>
                </StepLabel>
              </Step>
              <Step
                completed={
                  linkedEvent?.stage === 'En Etapa de Entrega' ||
                  linkedEvent?.stage === 'Finalizado'
                }
              >
                <StepLabel>
                  <strong>Etapa 2: Posible Evento, Paquetes y Pagos</strong>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    Ítems dinámicos según el paquete y señas/depósitos
                  </Typography>
                </StepLabel>
              </Step>
              <Step completed={linkedEvent?.stage === 'Finalizado'}>
                <StepLabel>
                  <strong>Etapa 3: Etapa de Entrega</strong>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    Entrega de fotos editadas, álbumes y saldo final
                  </Typography>
                </StepLabel>
              </Step>
            </Stepper>
          </Paper>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {feedback && (
          <Alert
            severity={feedback.type}
            sx={{ mb: 3 }}
            onClose={() => setFeedback(null)}
          >
            {feedback.message}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* COLUMNA IZQUIERDA: Etapa 1 - Editar Datos del Presupuesto */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                bgcolor: 'background.paper',
                border: '1px solid #EAE4DC',
                borderRadius: 2,
                mb: 3,
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                Etapa 1
              </Typography>
              <Typography variant="h3" sx={{ fontSize: '1.85rem', mb: 2.5 }}>
                Editar Datos del Presupuesto
              </Typography>

              <Box component="form" onSubmit={handleSaveBudget}>
                <Stack spacing={2}>
                  <TextField
                    label="Nombre del Cliente *"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    size="small"
                    fullWidth
                    required
                  />

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      label="Email *"
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      size="small"
                      fullWidth
                      required
                    />
                    <TextField
                      label="Teléfono / WhatsApp"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      select
                      label="Tipo de Evento"
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      size="small"
                      fullWidth
                    >
                      {EVENT_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      label="Fecha del Evento"
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      size="small"
                      fullWidth
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  </Stack>

                  <TextField
                    label="Lugar / Salón del Evento"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej: Estancia Villa María, Pilar"
                    size="small"
                    fullWidth
                  />

                  <TextField
                    select
                    label="Paquete / Presupuesto Estimado"
                    value={estimatedBudget}
                    onChange={(e) => setEstimatedBudget(e.target.value)}
                    size="small"
                    fullWidth
                  >
                    {BUDGET_RANGES.map((range) => (
                      <MenuItem key={range} value={range}>
                        {range}
                      </MenuItem>
                    ))}
                  </TextField>

                  <FormControl size="small" fullWidth>
                    <InputLabel>Estado del Presupuesto</InputLabel>
                    <Select
                      label="Estado del Presupuesto"
                      value={status}
                      onChange={(e: SelectChangeEvent) =>
                        setStatus(e.target.value as ProposalStatus)
                      }
                    >
                      <MenuItem value="Pendiente">Pendiente</MenuItem>
                      <MenuItem value="En revisión">En revisión</MenuItem>
                      <MenuItem value="Aprobado">Aprobado</MenuItem>
                      <MenuItem value="Rechazado">Rechazado</MenuItem>
                      <MenuItem value="Avanzado a Evento">
                        Avanzado a Evento
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="Mensaje / Notas del Presupuesto"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    multiline
                    rows={3}
                    size="small"
                    fullWidth
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveOutlinedIcon />}
                    fullWidth
                  >
                    Guardar Cambios del Presupuesto
                  </Button>
                </Stack>
              </Box>
            </Paper>

            {/* Acción para avanzar de Presupuesto a Evento si aún no fue avanzado */}
            {!linkedEvent && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: '#FFFFFF',
                  border: '2px solid #D8C8B8',
                  borderRadius: 2,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center', mb: 1 }}
                >
                  <EventAvailableOutlinedIcon color="primary" />
                  <Typography variant="h4" sx={{ fontSize: '1.25rem' }}>
                    ¿El cliente aprobó el presupuesto?
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Avanza este presupuesto a <strong>Evento</strong> para habilitar la
                  configuración dinámica de ítems del paquete, el control de
                  depósitos/señas y la etapa de entrega de fotos.
                </Typography>

                <Stack spacing={1.5}>
                  <TextField
                    label="Seña / Depósito Inicial (Opcional ARS)"
                    type="number"
                    size="small"
                    value={initialDepositInput}
                    onChange={(e) => setInitialDepositInput(e.target.value)}
                    placeholder="Ej: 100000"
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<EventAvailableOutlinedIcon />}
                    onClick={handleAdvanceBudget}
                    fullWidth
                  >
                    Confirmar Presupuesto y Avanzar a Evento
                  </Button>
                </Stack>
              </Paper>
            )}
          </Grid>

          {/* COLUMNA DERECHA: Etapa 2 (Paquetes y Pagos) y Etapa 3 (Entrega) */}
          <Grid size={{ xs: 12, lg: 7 }}>
            {!linkedEvent ? (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 4, md: 6 },
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  border: '1px dashed #D8C8B8',
                  borderRadius: 2,
                }}
              >
                <EventAvailableOutlinedIcon
                  sx={{ fontSize: 48, color: 'text.secondary', mb: 1.5 }}
                />
                <Typography variant="h3" sx={{ mb: 1 }}>
                  Proceso de Evento en Espera de Confirmación
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ maxWidth: 480, mx: 'auto', mb: 3 }}
                >
                  Este presupuesto se encuentra en la <strong>Etapa 1</strong>. Cuando
                  el cliente confirme, haz clic en el botón{' '}
                  <strong>“Confirmar Presupuesto y Avanzar a Evento”</strong> para
                  desbloquear los paquetes dinámicos, pagos por ítem y control de
                  entrega.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EventAvailableOutlinedIcon />}
                  onClick={handleAdvanceBudget}
                >
                  Avanzar Ahora a Proceso de Evento
                </Button>
              </Paper>
            ) : (
              <Stack spacing={3}>
                {/* Cabecera Financiera y Selector de Etapa del Evento */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    border: '1px solid #EAE4DC',
                    borderRadius: 2,
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1">
                        Etapa 2 · Proceso del Evento
                      </Typography>
                      <Typography variant="h3" sx={{ fontSize: '1.8rem' }}>
                        {linkedEvent.packageName}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: 'center', mt: 0.5 }}
                      >
                        <PlaceOutlinedIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          Lugar: <strong>{linkedEvent.location}</strong>
                        </Typography>
                      </Stack>
                    </Box>

                    <FormControl size="small" sx={{ minWidth: 230 }}>
                      <InputLabel>Etapa Actual del Evento</InputLabel>
                      <Select
                        label="Etapa Actual del Evento"
                        value={linkedEvent.stage}
                        onChange={(e: SelectChangeEvent) =>
                          onSetEventStage(
                            linkedEvent.eventId,
                            e.target.value as EventProcessStage
                          )
                        }
                        sx={{ bgcolor: '#FFFFFF' }}
                      >
                        <MenuItem value="Evento Confirmado">
                          1. Evento Confirmado
                        </MenuItem>
                        <MenuItem value="En Paquetes y Pagos">
                          2. En Paquetes y Pagos
                        </MenuItem>
                        <MenuItem value="En Etapa de Entrega">
                          3. En Etapa de Entrega
                        </MenuItem>
                        <MenuItem value="Finalizado">4. Finalizado</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>

                  {/* Barra de Progreso de Pagos */}
                  <Box sx={{ bgcolor: '#FFFFFF', p: 2, borderRadius: 1.5 }}>
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: 'space-between',
                        mb: 1,
                        flexWrap: 'wrap',
                        gap: 1,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        Total Paquete:{' '}
                        {formatCurrency(linkedEvent.totalPackageAmount)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'success.main', fontWeight: 700 }}
                      >
                        Abonado: {formatCurrency(linkedEvent.totalPaidAmount)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            linkedEvent.pendingBalance === 0
                              ? 'success.main'
                              : 'error.main',
                          fontWeight: 700,
                        }}
                      >
                        Saldo Pendiente:{' '}
                        {formatCurrency(linkedEvent.pendingBalance)}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={
                        linkedEvent.totalPackageAmount > 0
                          ? Math.min(
                              100,
                              Math.round(
                                (linkedEvent.totalPaidAmount /
                                  linkedEvent.totalPackageAmount) *
                                  100
                              )
                            )
                          : 0
                      }
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: '#EAE4DC',
                      }}
                    />
                  </Box>
                </Paper>

                {/* Ítems Dinámicos del Paquete */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    border: '1px solid #EAE4DC',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h4" sx={{ fontSize: '1.35rem', mb: 0.5 }}>
                    Ítems Dinámicos del Paquete ({linkedEvent.packageItems.length})
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Agrega o quita conceptos según lo que elija el cliente (cobertura,
                    álbum impreso, pre-boda, dron, horas extra) y controla cuánto se
                    fue pagando por cada ítem.
                  </Typography>

                  <TableContainer
                    sx={{ bgcolor: '#FFFFFF', borderRadius: 1.5, mb: 2.5 }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Concepto</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Precio</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Pagado</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>
                            Acción
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {linkedEvent.packageItems.map((item) => {
                          const isFullyPaid = item.paidAmount >= item.price;
                          return (
                            <TableRow key={item.itemId} hover>
                              <TableCell sx={{ fontWeight: 600 }}>
                                {item.concept}
                              </TableCell>
                              <TableCell>{formatCurrency(item.price)}</TableCell>
                              <TableCell>
                                <Chip
                                  label={formatCurrency(item.paidAmount)}
                                  size="small"
                                  color={isFullyPaid ? 'success' : 'warning'}
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={
                                    item.delivered
                                      ? 'Entregado'
                                      : isFullyPaid
                                        ? 'Pagado'
                                        : 'Pendiente'
                                  }
                                  size="small"
                                  color={
                                    item.delivered
                                      ? 'success'
                                      : isFullyPaid
                                        ? 'info'
                                        : 'default'
                                  }
                                  onClick={() =>
                                    onToggleItemDelivered(
                                      linkedEvent.eventId,
                                      item.itemId
                                    )
                                  }
                                  sx={{ cursor: 'pointer' }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Tooltip title="Quitar ítem del paquete">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      onRemoveEventItem(
                                        linkedEvent.eventId,
                                        item.itemId
                                      )
                                    }
                                  >
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Agregar Nuevo Ítem Dinámico */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <TextField
                      label="Nuevo concepto (Ej: Álbum extra, Dron, Hora adicional)"
                      size="small"
                      value={newItemConcept}
                      onChange={(e) => setNewItemConcept(e.target.value)}
                      fullWidth
                      sx={{ bgcolor: '#FFFFFF' }}
                    />
                    <TextField
                      label="Precio (ARS)"
                      type="number"
                      size="small"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      sx={{ minWidth: 150, bgcolor: '#FFFFFF' }}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={handleAddDynamicItem}
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      Sumar Ítem
                    </Button>
                  </Stack>
                </Paper>

                {/* Depósitos / Pagos y Etapa 3 de Entrega */}
                <Grid container spacing={3}>
                  {/* Depósitos y Pagos */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        bgcolor: 'background.paper',
                        border: '1px solid #EAE4DC',
                        borderRadius: 2,
                        height: '100%',
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: 'center', mb: 1.5 }}
                      >
                        <PaymentsOutlinedIcon color="primary" fontSize="small" />
                        <Typography variant="h4" sx={{ fontSize: '1.25rem' }}>
                          Registrar Depósito / Pago
                        </Typography>
                      </Stack>

                      <Stack spacing={1.5}>
                        <Stack direction="row" spacing={1}>
                          <TextField
                            label="Monto (ARS)"
                            type="number"
                            size="small"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            fullWidth
                            sx={{ bgcolor: '#FFFFFF' }}
                          />
                          <FormControl
                            size="small"
                            sx={{ minWidth: 135, bgcolor: '#FFFFFF' }}
                          >
                            <InputLabel>Método</InputLabel>
                            <Select
                              label="Método"
                              value={depositMethod}
                              onChange={(e: SelectChangeEvent) =>
                                setDepositMethod(e.target.value as DepositMethod)
                              }
                            >
                              <MenuItem value="Transferencia">
                                Transferencia
                              </MenuItem>
                              <MenuItem value="Efectivo">Efectivo</MenuItem>
                              <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                              <MenuItem value="MercadoPago">
                                MercadoPago
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Stack>

                        <FormControl
                          size="small"
                          fullWidth
                          sx={{ bgcolor: '#FFFFFF' }}
                        >
                          <InputLabel>Aplicar a ítem del paquete</InputLabel>
                          <Select
                            label="Aplicar a ítem del paquete"
                            value={depositTargetItem}
                            onChange={(e: SelectChangeEvent) =>
                              setDepositTargetItem(e.target.value)
                            }
                          >
                            <MenuItem value="">
                              Distribución automática en el paquete
                            </MenuItem>
                            {linkedEvent.packageItems.map((it) => (
                              <MenuItem key={it.itemId} value={it.itemId}>
                                {it.concept} (Falta:{' '}
                                {formatCurrency(
                                  Math.max(0, it.price - it.paidAmount)
                                )}
                                )
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <TextField
                          label="Nota del pago (Ej: Seña 50%, Cuota álbum)"
                          size="small"
                          value={depositNote}
                          onChange={(e) => setDepositNote(e.target.value)}
                          fullWidth
                          sx={{ bgcolor: '#FFFFFF' }}
                        />

                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleAddDepositSubmit}
                        >
                          Registrar Depósito
                        </Button>
                      </Stack>

                      {linkedEvent.deposits.length > 0 && (
                        <Box sx={{ mt: 2.5 }}>
                          <Divider sx={{ mb: 1.5 }} />
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 700, display: 'block', mb: 1 }}
                          >
                            Historial de Pagos ({linkedEvent.deposits.length}):
                          </Typography>
                          <Stack
                            spacing={0.75}
                            sx={{ maxHeight: 160, overflowY: 'auto' }}
                          >
                            {linkedEvent.deposits.map((dep) => (
                              <Stack
                                key={dep.depositId}
                                direction="row"
                                sx={{
                                  justifyContent: 'space-between',
                                  fontSize: '0.78rem',
                                  bgcolor: '#FFFFFF',
                                  p: 1,
                                  borderRadius: 1,
                                  border: '1px solid #EAE4DC',
                                }}
                              >
                                <span>
                                  <strong>{formatCurrency(dep.amount)}</strong> ·{' '}
                                  {dep.method} ({dep.note})
                                </span>
                                <span>{dep.date}</span>
                              </Stack>
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </Paper>
                  </Grid>

                  {/* Etapa 3: Entrega de Fotos, Material y Saldo */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        bgcolor: 'background.paper',
                        border: '1px solid #EAE4DC',
                        borderRadius: 2,
                        height: '100%',
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: 'center', mb: 1.5 }}
                      >
                        <LocalShippingOutlinedIcon
                          color="primary"
                          fontSize="small"
                        />
                        <Typography variant="h4" sx={{ fontSize: '1.25rem' }}>
                          Etapa 3: Control de Entrega
                        </Typography>
                      </Stack>

                      <Stack spacing={1.5}>
                        <Stack direction="row" spacing={1}>
                          <TextField
                            label="Fotos Entregadas"
                            type="number"
                            size="small"
                            value={linkedEvent.delivery.photosDelivered}
                            onChange={(e) =>
                              onSaveEventDelivery(linkedEvent.eventId, {
                                photosDelivered: Number(e.target.value),
                              })
                            }
                            fullWidth
                            sx={{ bgcolor: '#FFFFFF' }}
                          />
                          <TextField
                            label="Total a Entregar"
                            type="number"
                            size="small"
                            value={linkedEvent.delivery.photosToDeliver}
                            onChange={(e) =>
                              onSaveEventDelivery(linkedEvent.eventId, {
                                photosToDeliver: Number(e.target.value),
                              })
                            }
                            fullWidth
                            sx={{ bgcolor: '#FFFFFF' }}
                          />
                        </Stack>

                        <TextField
                          label="Entregables Físicos (Álbum, Pendrive, Caja)"
                          size="small"
                          value={linkedEvent.delivery.physicalDeliverables}
                          onChange={(e) =>
                            onSaveEventDelivery(linkedEvent.eventId, {
                              physicalDeliverables: e.target.value,
                            })
                          }
                          fullWidth
                          sx={{ bgcolor: '#FFFFFF' }}
                        />

                        <TextField
                          label="Link de Galería / Descarga"
                          size="small"
                          value={linkedEvent.delivery.deliveryLink}
                          onChange={(e) =>
                            onSaveEventDelivery(linkedEvent.eventId, {
                              deliveryLink: e.target.value,
                            })
                          }
                          placeholder="https://drive.google.com/..."
                          fullWidth
                          sx={{ bgcolor: '#FFFFFF' }}
                        />

                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ flexWrap: 'wrap', gap: 1, pt: 0.5 }}
                        >
                          <Chip
                            icon={<CheckCircleOutlineIcon />}
                            label={
                              linkedEvent.delivery.isMoneySettled
                                ? 'Dinero Saldado ✓'
                                : `Debe ${formatCurrency(linkedEvent.pendingBalance)}`
                            }
                            color={
                              linkedEvent.delivery.isMoneySettled
                                ? 'success'
                                : 'warning'
                            }
                            size="small"
                          />

                          <Chip
                            icon={<CheckCircleOutlineIcon />}
                            label={
                              linkedEvent.delivery.isPhotosDelivered
                                ? 'Fotos Entregadas ✓'
                                : 'Marcar Fotos Entregadas'
                            }
                            color={
                              linkedEvent.delivery.isPhotosDelivered
                                ? 'success'
                                : 'default'
                            }
                            onClick={() =>
                              onSaveEventDelivery(linkedEvent.eventId, {
                                isPhotosDelivered:
                                  !linkedEvent.delivery.isPhotosDelivered,
                                photosDelivered: !linkedEvent.delivery
                                  .isPhotosDelivered
                                  ? linkedEvent.delivery.photosToDeliver
                                  : linkedEvent.delivery.photosDelivered,
                              })
                            }
                            sx={{ cursor: 'pointer' }}
                            size="small"
                          />
                        </Stack>
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              </Stack>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const BudgetProcessDetailPage = (props: BudgetProcessDetailPageProps) => {
  const { proposalId } = useParams<{ proposalId: string }>();
  return (
    <BudgetProcessDetailContent
      key={proposalId || 'unknown'}
      proposalId={proposalId}
      {...props}
    />
  );
};

export default BudgetProcessDetailPage;
