import type {
  IClient,
  IProposal,
  ProposalFormInput,
  ProposalStatus,
} from '../types';

const PROPOSALS_STORAGE_KEY = 'dm_photography_proposals_v1';

const DEFAULT_PROPOSALS: IProposal[] = [
  {
    proposalId: 'prop-1001',
    clientName: 'Camila Fernández',
    clientEmail: 'camila.fernandez@email.com',
    clientPhone: '+54 9 11 4582-9103',
    eventType: 'Boda / Casamiento',
    eventDate: '2026-12-12',
    location: 'Pilar, Buenos Aires',
    estimatedBudget: 'Pack Premium (Cobertura Completa + Fotolibro)',
    message:
      'Hola Daiana! Nos encantó tu estilo cálido y natural. Nos casamos al aire libre a las 17 hs y queremos presupuesto para ceremonia, fiesta y sesión previa.',
    status: 'Aprobado',
    createdAt: '2026-11-01T14:20:00.000Z',
  },
  {
    proposalId: 'prop-1002',
    clientName: 'Lucía Gómez',
    clientEmail: 'lucia.gomez@email.com',
    clientPhone: '+54 9 11 6234-1188',
    eventType: 'Quinceañera / 15 Años',
    eventDate: '2026-11-28',
    location: 'San Isidro, Buenos Aires',
    estimatedBudget: 'Pack Estándar (Cobertura Media - 4 hs)',
    message:
      'Quisiera pedir presupuesto para el book exterior de los 15 años de mi hija Martina en tonos pastel.',
    status: 'En revisión',
    createdAt: '2026-11-05T10:15:00.000Z',
  },
  {
    proposalId: 'prop-1003',
    clientName: 'Santiago Rivas',
    clientEmail: 'santiago.rivas@marca.com',
    clientPhone: '+54 9 11 3390-7741',
    eventType: 'Fotografía de Producto / Marca',
    eventDate: '2026-11-21',
    location: 'Palermo, CABA',
    estimatedBudget: 'Pack Básico (Sesión Express - 2 hs)',
    message:
      'Necesitamos fotos editoriales para nuestra nueva colección de cerámica artesanal y velas aromáticas.',
    status: 'Pendiente',
    createdAt: '2026-11-08T17:45:00.000Z',
  },
];

export const getProposals = (): IProposal[] => {
  try {
    const raw = localStorage.getItem(PROPOSALS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(
        PROPOSALS_STORAGE_KEY,
        JSON.stringify(DEFAULT_PROPOSALS)
      );
      return DEFAULT_PROPOSALS;
    }
    const parsed = JSON.parse(raw) as IProposal[];
    return Array.isArray(parsed) ? parsed : DEFAULT_PROPOSALS;
  } catch {
    return DEFAULT_PROPOSALS;
  }
};

export const saveProposals = (proposals: IProposal[]): void => {
  try {
    localStorage.setItem(PROPOSALS_STORAGE_KEY, JSON.stringify(proposals));
  } catch (err) {
    console.warn('Error al guardar propuestas en localStorage:', err);
  }
};

export const createProposal = (input: ProposalFormInput): IProposal => {
  const current = getProposals();
  const newProposal: IProposal = {
    proposalId: `prop-${Date.now()}`,
    clientName: input.clientName.trim(),
    clientEmail: input.clientEmail.trim(),
    clientPhone: input.clientPhone.trim(),
    eventType: input.eventType,
    eventDate: input.eventDate,
    location: input.location.trim(),
    estimatedBudget: input.estimatedBudget,
    message: input.message.trim(),
    status: 'Pendiente',
    createdAt: new Date().toISOString(),
  };

  const updated = [newProposal, ...current];
  saveProposals(updated);
  return newProposal;
};

export const updateProposalStatus = (
  proposalId: string,
  status: ProposalStatus
): IProposal[] => {
  const current = getProposals();
  const updated = current.map((item) =>
    item.proposalId === proposalId ? { ...item, status } : item
  );
  saveProposals(updated);
  return updated;
};

export const deleteProposal = (proposalId: string): IProposal[] => {
  const current = getProposals();
  const updated = current.filter((item) => item.proposalId !== proposalId);
  saveProposals(updated);
  return updated;
};

export const deriveClientsFromProposals = (
  proposals: IProposal[]
): IClient[] => {
  const clientMap = new Map<string, IClient>();

  proposals.forEach((proposal) => {
    const key = (proposal.clientEmail || proposal.clientName)
      .toLowerCase()
      .trim();
    const existing = clientMap.get(key);
    if (!existing) {
      clientMap.set(key, {
        clientId: `cli-${key.replace(/[^a-z0-9]/g, '')}`,
        name: proposal.clientName,
        email: proposal.clientEmail,
        phone: proposal.clientPhone,
        proposalsCount: 1,
        lastEventType: proposal.eventType,
        createdAt: proposal.createdAt,
      });
    } else {
      existing.proposalsCount += 1;
    }
  });

  return Array.from(clientMap.values());
};
