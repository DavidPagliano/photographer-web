import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import {
  BUDGET_RANGES,
  createInitialProposalForm,
  EVENT_TYPES,
  type IProposal,
  type ProposalFormInput,
  type ProposalStatus,
} from '../types';

interface ProposalFormProps {
  proposals: IProposal[];
  onSubmitProposal: (formData: ProposalFormInput) => IProposal;
}

const getStatusColor = (
  status: ProposalStatus
): 'success' | 'info' | 'warning' => {
  if (status === 'Aprobado') return 'success';
  if (status === 'En revisión') return 'info';
  return 'warning';
};

const ProposalForm = ({
  proposals = [],
  onSubmitProposal,
}: ProposalFormProps) => {
  const [formData, setFormData] = useState<ProposalFormInput>(
    createInitialProposalForm
  );
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    if (
      !formData.clientName.trim() ||
      !formData.clientEmail.trim() ||
      !formData.message.trim()
    ) {
      setFormError(
        'Por favor completa tu nombre, correo y el detalle de lo que buscas.'
      );
      return;
    }

    onSubmitProposal(formData);
    setFormData(createInitialProposalForm());
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 6000);
  };

  return (
    <Box id="presupuesto-section" sx={{ py: { xs: 6, md: 9 } }}>
      <Grid container spacing={5} sx={{ alignItems: 'flex-start' }}>
        {/* Columna Izquierda: Formulario de Solicitud de Presupuesto */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: { xs: 1, sm: 2 } }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Propuestas & Consultas
              </Typography>
              <Typography
                variant="h2"
                sx={{ fontSize: { xs: '2.3rem', md: '2.8rem' }, mb: 1 }}
              >
                Pedir Presupuesto
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Cuéntame sobre tu evento o sesión ideal. Al enviarlo, tu solicitud
                quedará registrada en el mural de presupuestos y en el panel de gestión.
              </Typography>

              {submittedSuccess && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  ¡Tu solicitud de presupuesto fue guardada con éxito! Ya puedes verla
                  reflejada en la lista pública y en el Dashboard privado.
                </Alert>
              )}

              {formError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {formError}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      required
                      label="Tu Nombre Completo"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleChange}
                      placeholder="Ej: Valentina Morales"
                      size="small"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      required
                      type="email"
                      label="Correo Electrónico"
                      name="clientEmail"
                      value={formData.clientEmail}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      size="small"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Teléfono / WhatsApp"
                      name="clientPhone"
                      value={formData.clientPhone}
                      onChange={handleChange}
                      placeholder="+54 9 11 ..."
                      size="small"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Fecha Estimada"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      slotProps={{ inputLabel: { shrink: true } }}
                      size="small"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      select
                      fullWidth
                      label="Tipo de Sesión / Evento"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      size="small"
                    >
                      {EVENT_TYPES.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Ciudad / Locación"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Ej: Palermo, CABA"
                      size="small"
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      select
                      fullWidth
                      label="Paquete / Presupuesto Estimado"
                      name="estimatedBudget"
                      value={formData.estimatedBudget}
                      onChange={handleChange}
                      size="small"
                    >
                      {BUDGET_RANGES.map((range) => (
                        <MenuItem key={range} value={range}>
                          {range}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={3}
                      label="Detalles de tu Propuesta o Consulta"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Cuéntame horarios aproximados, cantidad de invitados o ideas que tengas en mente..."
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      endIcon={<SendOutlinedIcon />}
                    >
                      Guardar y Enviar Presupuesto
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Columna Derecha: Presupuestos Guardados (Vista Pública) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
              Solicitudes Recientes
            </Typography>
            <Typography variant="h3" sx={{ fontSize: '2rem' }}>
              Presupuestos Solicitados ({proposals.length})
            </Typography>
            <Typography variant="body2">
              Aquí se muestran en tiempo real las consultas y presupuestos enviados
              por los clientes junto con su estado actual de reserva.
            </Typography>
          </Box>

          <Stack spacing={2} sx={{ maxHeight: 540, overflowY: 'auto', pr: 0.5 }}>
            {proposals.map((item) => (
              <Card
                key={item.proposalId}
                sx={{
                  bgcolor: '#FFFFFF',
                  border: '1px solid #EAE4DC',
                }}
              >
                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <PersonOutlineIcon fontSize="small" color="action" />
                      <Typography
                        variant="h5"
                        sx={{ color: 'text.primary', fontWeight: 600 }}
                      >
                        {item.clientName}
                      </Typography>
                    </Stack>
                    <Chip
                      label={item.status}
                      color={getStatusColor(item.status)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Stack>

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 0.5, sm: 2 }}
                    sx={{ mb: 1 }}
                  >
                    <Chip
                      label={item.eventType}
                      size="small"
                      variant="outlined"
                      sx={{ alignSelf: 'flex-start', borderColor: '#D8C8B8' }}
                    />
                    {item.eventDate && (
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                        <EventAvailableOutlinedIcon
                          sx={{ fontSize: 16, color: 'text.secondary' }}
                        />
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          {item.eventDate}
                        </Typography>
                      </Stack>
                    )}
                    {item.location && (
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                        <PlaceOutlinedIcon
                          sx={{ fontSize: 16, color: 'text.secondary' }}
                        />
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          {item.location}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>

                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.primary',
                      fontWeight: 500,
                      fontSize: '0.82rem',
                      mb: 0.75,
                    }}
                  >
                    {item.estimatedBudget}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    “{item.message}”
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProposalForm;
