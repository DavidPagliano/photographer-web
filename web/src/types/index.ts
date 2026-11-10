export type PageView = 'home' | 'projects' | 'dashboard';

export interface IImage {
  imageId: string;
  imageName: string;
  imageBase64: string;
}

export interface IProject {
  _id?: string;
  projectId: string;
  projectName: string;
  projectDescription: string;
  images: IImage[];
  createdAt?: string;
  updatedAt?: string;
}

export type ProposalStatus = 'Pendiente' | 'En revisión' | 'Aprobado';

export interface IProposal {
  proposalId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventType: string;
  eventDate: string;
  location: string;
  estimatedBudget: string;
  message: string;
  status: ProposalStatus;
  createdAt: string;
}

export type ProposalFormInput = Omit<
  IProposal,
  'proposalId' | 'status' | 'createdAt'
>;

export interface ProjectFormInput {
  projectId: string;
  projectName: string;
  projectDescription: string;
  images: IImage[];
}

export interface IClient {
  clientId: string;
  name: string;
  email: string;
  phone: string;
  proposalsCount: number;
  lastEventType: string;
  createdAt: string;
}

export interface IDashboardStats {
  projectsCount: number;
  totalPhotosCount: number;
  proposalsCount: number;
  clientsCount: number;
}

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
];

export const createInitialProjectForm = (): ProjectFormInput => ({
  projectId: '',
  projectName: '',
  projectDescription: '',
  images: [],
});

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
