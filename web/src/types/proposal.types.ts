export type ProposalStatus =
  | 'Pendiente'
  | 'En revisión'
  | 'Aprobado'
  | 'Avanzado a Evento'
  | 'Rechazado';

export interface IBudgetItem {
  itemId: string;
  concept: string;
  price: number;
}

export interface IProposal {
  proposalId: string;
  budgetId?: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventType: string;
  eventDate: string;
  location: string;
  estimatedBudget: string;
  items?: IBudgetItem[];
  totalAmount?: number;
  message: string;
  status: ProposalStatus;
  linkedEventId?: string;
  createdAt: string;
}

export type ProposalFormInput = Omit<
  IProposal,
  'proposalId' | 'status' | 'createdAt'
>;

export const EVENT_TYPES: string[] = [
  'Boda / Casamiento',
  'Quinceañera / 15 Años',
  'Book Personal / Retrato',
  'Maternidad y Familia',
  'Evento Social / Corporativo',
  'Fotografía de Producto / Marca',
];

export const BUDGET_RANGES: string[] = [
  'Pack Básico (Sesión Express - 2 hs)',
  'Pack Estándar (Cobertura Media - 4 hs)',
  'Pack Premium (Cobertura Completa + Fotolibro)',
  'Presupuesto a Medida',
];

export const PROPOSAL_STATUSES: ProposalStatus[] = [
  'Pendiente',
  'En revisión',
  'Aprobado',
  'Avanzado a Evento',
  'Rechazado',
];

export const createInitialProposalForm = (): ProposalFormInput => ({
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  eventType: EVENT_TYPES[0],
  eventDate: '',
  location: '',
  estimatedBudget: BUDGET_RANGES[1],
  message: '',
});

