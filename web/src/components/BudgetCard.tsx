import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import type { IEvent, IProposal } from '../types';

interface BudgetCardProps {
  proposal: IProposal;
  linkedEvent?: IEvent;
  onEditProcess: (proposalId: string) => void;
  onDelete: (proposalId: string) => void;
}

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount || 0);

const getProgressInfo = (proposal: IProposal, linkedEvent?: IEvent) => {
  if (!linkedEvent) {
    if (proposal.status === 'Aprobado') {
      return {
        stepLabel: 'Etapa 1: Presupuesto Aprobado (Listo para Evento)',
        progress: 40,
        color: 'info' as const,
      };
    }
    if (proposal.status === 'En revisión') {
      return {
        stepLabel: 'Etapa 1: Presupuesto en Revisión',
        progress: 25,
        color: 'warning' as const,
      };
    }
    if (proposal.status === 'Rechazado') {
      return {
        stepLabel: 'Presupuesto Rechazado',
        progress: 0,
        color: 'error' as const,
      };
    }
    return {
      stepLabel: 'Etapa 1: Presupuesto Inicial',
      progress: 15,
      color: 'warning' as const,
    };
  }

  if (linkedEvent.stage === 'Finalizado') {
    return {
      stepLabel: 'Etapa 3: Evento y Entrega Finalizados ✓',
      progress: 100,
      color: 'success' as const,
    };
  }

  if (linkedEvent.stage === 'En Etapa de Entrega') {
    return {
      stepLabel: 'Etapa 3: En Etapa de Entrega (Fotos / Saldo)',
      progress: 82,
      color: 'info' as const,
    };
  }

  return {
    stepLabel: `Etapa 2: ${linkedEvent.stage}`,
    progress: 60,
    color: 'primary' as const,
  };
};

const BudgetCard = ({
  proposal,
  linkedEvent,
  onEditProcess,
  onDelete,
}: BudgetCardProps) => {
  const progressInfo = getProgressInfo(proposal, linkedEvent);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#FFFFFF',
        border: '1px solid #EAE4DC',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0px 10px 24px rgba(181, 161, 142, 0.18)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1.5 }}>
        {/* Encabezado: Cliente y Estado */}
        <Stack
          direction="row"
          sx={{
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 1.5,
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <PersonOutlineIcon fontSize="small" color="action" />
            <Box>
              <Typography
                variant="h5"
                sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.95rem' }}
              >
                {proposal.clientName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {proposal.clientEmail}
              </Typography>
            </Box>
          </Stack>

          <Chip
            label={proposal.status}
            size="small"
            color={
              proposal.status === 'Avanzado a Evento' ||
              proposal.status === 'Aprobado'
                ? 'success'
                : proposal.status === 'En revisión'
                  ? 'info'
                  : 'warning'
            }
            sx={{ fontWeight: 600 }}
          />
        </Stack>

        {/* Tipo de Evento, Fecha y Lugar */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}
        >
          <Chip
            label={proposal.eventType}
            size="small"
            sx={{ bgcolor: 'primary.light', fontWeight: 600 }}
          />
          {proposal.eventDate && (
            <Chip
              icon={<EventAvailableOutlinedIcon sx={{ fontSize: '0.95rem !important' }} />}
              label={proposal.eventDate}
              size="small"
              variant="outlined"
            />
          )}
          {proposal.location && (
            <Chip
              icon={<PlaceOutlinedIcon sx={{ fontSize: '0.95rem !important' }} />}
              label={proposal.location}
              size="small"
              variant="outlined"
            />
          )}
        </Stack>

        {/* Paquete y Mensaje */}
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}
        >
          {linkedEvent ? linkedEvent.packageName : proposal.estimatedBudget}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontStyle: 'italic',
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          “{proposal.message}”
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        {/* Avance Propio del Proceso */}
        <Box sx={{ bgcolor: '#FAF7F2', p: 1.5, borderRadius: 1.5 }}>
          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 0.75,
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              {progressInfo.stepLabel}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {progressInfo.progress}%
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={progressInfo.progress}
            color={progressInfo.color}
            sx={{ height: 7, borderRadius: 4, bgcolor: '#EAE4DC', mb: 1 }}
          />

          {linkedEvent ? (
            <Stack
              direction="row"
              sx={{
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: 'text.secondary',
              }}
            >
              <span>
                Abonado: <strong>{formatCurrency(linkedEvent.totalPaidAmount)}</strong>{' '}
                / {formatCurrency(linkedEvent.totalPackageAmount)}
              </span>
              <span>
                Fotos: <strong>{linkedEvent.delivery.photosDelivered}</strong>/
                {linkedEvent.delivery.photosToDeliver}
              </span>
            </Stack>
          ) : (
            <Typography variant="caption" color="text.secondary">
              Pendiente de avanzar a Evento (Paquetes, Depósitos y Entrega)
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions
        sx={{
          px: 2,
          pb: 2,
          pt: 0.5,
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="small"
          startIcon={<EditOutlinedIcon />}
          endIcon={<ArrowForwardOutlinedIcon />}
          onClick={() => onEditProcess(proposal.proposalId)}
        >
          Editar / Proceso del Evento
        </Button>

        <Tooltip title="Eliminar presupuesto">
          <IconButton
            color="error"
            size="small"
            onClick={() => onDelete(proposal.proposalId)}
            aria-label="Eliminar presupuesto"
            sx={{ border: '1px solid #F4E3E0', borderRadius: 1.5, p: 0.9 }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default BudgetCard;

