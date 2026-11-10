import api from './api';
import type {
  EventProcessStage,
  IClient,
  IEvent,
  IEventDelivery,
  IEventPackageItem,
  IProposal,
  ProposalFormInput,
  ProposalStatus,
} from '../types';

const PROPOSALS_STORAGE_KEY = 'dm_photography_proposals_v1';
const EVENTS_STORAGE_KEY = 'dm_photography_events_v1';

export const buildDefaultPackageItems = (
  packageName: string
): IEventPackageItem[] => {
  const normalized = packageName.toLowerCase();

  if (normalized.includes('básico') || normalized.includes('basico')) {
    return [
      {
        itemId: 'item-cobertura-2h',
        concept: 'Cobertura Fotográfica (2 hs)',
        price: 85000,
        paidAmount: 0,
        isPaid: false,
        delivered: false,
      },
      {
        itemId: 'item-edicion-50',
        concept: 'Edición Fine-Art (50 fotografías digitales)',
        price: 45000,
        paidAmount: 0,
        isPaid: false,
        delivered: false,
      },
    ];
  }

  if (normalized.includes('premium')) {
    return [
      {
        itemId: 'item-cobertura-full',
        concept: 'Cobertura Fotográfica Completa del Evento',
        price: 240000,
        paidAmount: 0,
        isPaid: false,
        delivered: false,
      },
      {
        itemId: 'item-sesion-previa',
        concept: 'Sesión Pre-Evento / Book Exterior',
        price: 85000,
        paidAmount: 0,
        isPaid: false,
        delivered: false,
      },
      {
        itemId: 'item-fotolibro',
        concept: 'Fotolibro Impreso 30x30 + Caja Artesanal',
        price: 120000,
        paidAmount: 0,
        isPaid: false,
        delivered: false,
      },
      {
        itemId: 'item-pendrive-galeria',
        concept: 'Pendrive + Galería Web Alta Resolución (300+ fotos)',
        price: 55000,
        paidAmount: 0,
        isPaid: false,
        delivered: false,
      },
    ];
  }

  return [
    {
      itemId: 'item-cobertura-4h',
      concept: 'Cobertura Fotográfica (4 hs)',
      price: 150000,
      paidAmount: 0,
      isPaid: false,
      delivered: false,
    },
    {
      itemId: 'item-edicion-120',
      concept: 'Edición y Revelado Digital (120 fotos)',
      price: 65000,
      paidAmount: 0,
      isPaid: false,
      delivered: false,
    },
    {
      itemId: 'item-galeria-online',
      concept: 'Galería Online Privada para Invitados',
      price: 35000,
      paidAmount: 0,
      isPaid: false,
      delivered: false,
    },
  ];
};

export const recalculateEventTotals = (event: IEvent): IEvent => {
  const packageItems = event.packageItems.map((it) => ({
    ...it,
    paidAmount: 0,
    isPaid: false,
  }));

  let unassignedPool = 0;

  for (const dep of event.deposits) {
    if (dep.targetItemId) {
      const target = packageItems.find((it) => it.itemId === dep.targetItemId);
      if (target) {
        const needed = Math.max(0, target.price - target.paidAmount);
        const applied = Math.min(needed, dep.amount);
        target.paidAmount += applied;
        unassignedPool += dep.amount - applied;
      } else {
        unassignedPool += dep.amount;
      }
    } else {
      unassignedPool += dep.amount;
    }
  }

  for (const item of packageItems) {
    if (unassignedPool <= 0) break;
    const needed = Math.max(0, item.price - item.paidAmount);
    if (needed > 0) {
      const applied = Math.min(needed, unassignedPool);
      item.paidAmount += applied;
      unassignedPool -= applied;
    }
  }

  for (const item of packageItems) {
    item.isPaid = item.paidAmount >= item.price && item.price >= 0;
  }

  const totalPackageAmount = packageItems.reduce((sum, it) => sum + it.price, 0);
  const totalPaidAmount = event.deposits.reduce((sum, d) => sum + d.amount, 0);
  const pendingBalance = Math.max(0, totalPackageAmount - totalPaidAmount);

  return {
    ...event,
    packageItems,
    totalPackageAmount,
    totalPaidAmount,
    pendingBalance,
    delivery: {
      ...event.delivery,
      isMoneySettled: totalPackageAmount > 0 && pendingBalance === 0,
    },
  };
};

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
    status: 'Avanzado a Evento',
    linkedEventId: 'evt-1001',
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

const DEFAULT_EVENTS: IEvent[] = [
  recalculateEventTotals({
    eventId: 'evt-1001',
    budgetId: 'prop-1001',
    title: 'Boda / Casamiento · Camila Fernández',
    eventType: 'Boda / Casamiento',
    eventDate: '2026-12-12',
    location: 'Pilar, Buenos Aires',
    stage: 'En Paquetes y Pagos',
    client: {
      clientId: 'cli-camilafernandez',
      name: 'Camila Fernández',
      email: 'camila.fernandez@email.com',
      phone: '+54 9 11 4582-9103',
    },
    packageName: 'Pack Premium (Cobertura Completa + Fotolibro)',
    packageItems: buildDefaultPackageItems(
      'Pack Premium (Cobertura Completa + Fotolibro)'
    ),
    deposits: [
      {
        depositId: 'dep-2001',
        amount: 240000,
        date: '2026-11-03',
        method: 'Transferencia',
        targetItemId: 'item-cobertura-full',
        note: 'Seña inicial cobertura completa',
      },
      {
        depositId: 'dep-2002',
        amount: 85000,
        date: '2026-11-07',
        method: 'MercadoPago',
        targetItemId: 'item-sesion-previa',
        note: 'Pago sesión pre-boda exterior',
      },
    ],
    totalPackageAmount: 500000,
    totalPaidAmount: 325000,
    pendingBalance: 175000,
    delivery: {
      photosToDeliver: 300,
      photosDelivered: 45,
      deliveryLink: 'https://drive.google.com/drive/boda-camila-adelanto',
      physicalDeliverables: 'Fotolibro 30x30 + Pendrive en Caja Artesanal',
      isPhotosDelivered: false,
      isMoneySettled: false,
      deliveryNotes: 'Entregado adelanto de sesión pre-boda (45 fotos). Restan fotos de ceremonia y fotolibro.',
    },
    createdAt: '2026-11-02T16:00:00.000Z',
  }),
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

export const getEvents = (): IEvent[] => {
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(DEFAULT_EVENTS));
      return DEFAULT_EVENTS;
    }
    const parsed = JSON.parse(raw) as IEvent[];
    return Array.isArray(parsed) ? parsed : DEFAULT_EVENTS;
  } catch {
    return DEFAULT_EVENTS;
  }
};

export const saveEvents = (events: IEvent[]): void => {
  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.warn('Error al guardar eventos en localStorage:', err);
  }
};

export const createProposal = (input: ProposalFormInput): IProposal => {
  const current = getProposals();
  const proposalId = `prop-${Date.now()}`;
  const newProposal: IProposal = {
    proposalId,
    budgetId: proposalId,
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

  // Sincronizar en segundo plano con la API (/api/budgets) si está encendida
  api
    .post('/budgets', {
      budgetId: proposalId,
      clientName: newProposal.clientName,
      clientEmail: newProposal.clientEmail,
      clientPhone: newProposal.clientPhone,
      eventType: newProposal.eventType,
      eventDate: newProposal.eventDate,
      location: newProposal.location,
      estimatedBudget: newProposal.estimatedBudget,
      message: newProposal.message,
    })
    .catch(() => {});

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

  api.put(`/budgets/${encodeURIComponent(proposalId)}`, { status }).catch(() => {});
  return updated;
};

export const updateProposalDetails = (
  proposalId: string,
  changes: Partial<IProposal>
): { proposals: IProposal[]; events: IEvent[] } => {
  const currentProposals = getProposals();
  let linkedEventId: string | undefined;

  const updatedProposals = currentProposals.map((item) => {
    if (item.proposalId !== proposalId) return item;
    const merged: IProposal = { ...item, ...changes };
    linkedEventId = merged.linkedEventId;
    return merged;
  });
  saveProposals(updatedProposals);

  let updatedEvents = getEvents();
  if (linkedEventId) {
    updatedEvents = updatedEvents.map((ev) => {
      if (ev.eventId !== linkedEventId) return ev;
      return {
        ...ev,
        title:
          changes.eventType || changes.clientName
            ? `${changes.eventType || ev.eventType} · ${changes.clientName || ev.client.name}`
            : ev.title,
        eventType: changes.eventType ?? ev.eventType,
        eventDate: changes.eventDate ?? ev.eventDate,
        location: changes.location ?? ev.location,
        packageName: changes.estimatedBudget ?? ev.packageName,
        client: {
          ...ev.client,
          name: changes.clientName ?? ev.client.name,
          email: changes.clientEmail ?? ev.client.email,
          phone: changes.clientPhone ?? ev.client.phone,
        },
      };
    });
    saveEvents(updatedEvents);
  }

  api.put(`/budgets/${encodeURIComponent(proposalId)}`, changes).catch(() => {});
  return { proposals: updatedProposals, events: updatedEvents };
};

export const deleteProposal = (proposalId: string): IProposal[] => {
  const current = getProposals();
  const updated = current.filter((item) => item.proposalId !== proposalId);
  saveProposals(updated);

  api.delete(`/budgets/${encodeURIComponent(proposalId)}`).catch(() => {});
  return updated;
};

/**
 * Etapa 1 -> Etapa 2: Avanza un Presupuesto a la etapa de Evento con su paquete dinámico y depósitos
 */
export const advanceProposalToEvent = (
  proposalId: string,
  initialDepositAmount = 0
): { proposals: IProposal[]; events: IEvent[]; createdEvent: IEvent } => {
  const proposals = getProposals();
  const target = proposals.find((p) => p.proposalId === proposalId);
  if (!target) {
    throw new Error('No se encontró el presupuesto seleccionado');
  }

  const eventId = `evt-${Date.now()}`;
  const packageItems = buildDefaultPackageItems(target.estimatedBudget);

  const initialDeposits =
    initialDepositAmount > 0
      ? [
          {
            depositId: `dep-${Date.now()}`,
            amount: initialDepositAmount,
            date: new Date().toISOString().slice(0, 10),
            method: 'Transferencia',
            targetItemId: packageItems[0]?.itemId,
            note: 'Seña inicial al avanzar presupuesto a evento',
          },
        ]
      : [];

  const rawEvent: IEvent = {
    eventId,
    budgetId: target.proposalId,
    title: `${target.eventType} · ${target.clientName}`,
    eventType: target.eventType,
    eventDate: target.eventDate || 'Por definir',
    location: target.location || 'Por definir',
    stage: 'En Paquetes y Pagos',
    client: {
      clientId: `cli-${target.clientEmail.replace(/[^a-z0-9]/gi, '').toLowerCase()}`,
      name: target.clientName,
      email: target.clientEmail,
      phone: target.clientPhone,
    },
    packageName: target.estimatedBudget,
    packageItems,
    deposits: initialDeposits,
    totalPackageAmount: 0,
    totalPaidAmount: 0,
    pendingBalance: 0,
    delivery: {
      photosToDeliver: target.estimatedBudget.toLowerCase().includes('premium')
        ? 300
        : 120,
      photosDelivered: 0,
      deliveryLink: '',
      physicalDeliverables: target.estimatedBudget.toLowerCase().includes('premium')
        ? 'Fotolibro 30x30 + Pendrive en Caja'
        : 'Galería Digital Alta Resolución',
      isPhotosDelivered: false,
      isMoneySettled: false,
      deliveryNotes: '',
    },
    createdAt: new Date().toISOString(),
  };

  const createdEvent = recalculateEventTotals(rawEvent);
  const nextEvents = [createdEvent, ...getEvents()];
  saveEvents(nextEvents);

  const nextProposals: IProposal[] = proposals.map((p) =>
    p.proposalId === proposalId
      ? {
          ...p,
          status: 'Avanzado a Evento',
          linkedEventId: eventId,
        }
      : p
  );
  saveProposals(nextProposals);

  api
    .post(`/budgets/${encodeURIComponent(proposalId)}/advance-to-event`, {
      initialDepositAmount,
    })
    .catch(() => {});

  return {
    proposals: nextProposals,
    events: nextEvents,
    createdEvent,
  };
};

/**
 * Agrega dinámicamente una nueva cosa/ítem al paquete de un evento
 */
export const addPackageItemToEvent = (
  eventId: string,
  concept: string,
  price: number
): IEvent[] => {
  const current = getEvents();
  const next = current.map((ev) => {
    if (ev.eventId !== eventId) return ev;
    const newItem: IEventPackageItem = {
      itemId: `item-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      concept: concept.trim(),
      price: Number(price),
      paidAmount: 0,
      isPaid: false,
      delivered: false,
    };
    return recalculateEventTotals({
      ...ev,
      packageItems: [...ev.packageItems, newItem],
    });
  });
  saveEvents(next);

  api
    .post(`/events/${encodeURIComponent(eventId)}/package-items`, {
      concept,
      price,
    })
    .catch(() => {});

  return next;
};

/**
 * Quita un ítem del paquete de un evento y recalcula totales
 */
export const removePackageItemFromEvent = (
  eventId: string,
  itemId: string
): IEvent[] => {
  const current = getEvents();
  const next = current.map((ev) => {
    if (ev.eventId !== eventId) return ev;
    return recalculateEventTotals({
      ...ev,
      packageItems: ev.packageItems.filter((it) => it.itemId !== itemId),
    });
  });
  saveEvents(next);

  api
    .delete(
      `/events/${encodeURIComponent(eventId)}/package-items/${encodeURIComponent(itemId)}`
    )
    .catch(() => {});

  return next;
};

/**
 * Registra un depósito o pago en un evento (para un ítem específico del paquete o general)
 */
export const addDepositToEvent = (
  eventId: string,
  depositInput: {
    amount: number;
    method: string;
    targetItemId?: string;
    note: string;
  }
): IEvent[] => {
  const current = getEvents();
  const next = current.map((ev) => {
    if (ev.eventId !== eventId) return ev;
    const newDeposit = {
      depositId: `dep-${Date.now()}`,
      amount: Number(depositInput.amount),
      date: new Date().toISOString().slice(0, 10),
      method: depositInput.method || 'Transferencia',
      targetItemId: depositInput.targetItemId || undefined,
      note: depositInput.note.trim(),
    };
    return recalculateEventTotals({
      ...ev,
      deposits: [...ev.deposits, newDeposit],
    });
  });
  saveEvents(next);

  api
    .post(`/events/${encodeURIComponent(eventId)}/deposits`, depositInput)
    .catch(() => {});

  return next;
};

/**
 * Marca o desmarca un ítem del paquete como entregado
 */
export const toggleEventItemDelivered = (
  eventId: string,
  itemId: string
): IEvent[] => {
  const current = getEvents();
  const next = current.map((ev) => {
    if (ev.eventId !== eventId) return ev;
    return {
      ...ev,
      packageItems: ev.packageItems.map((it) =>
        it.itemId === itemId ? { ...it, delivered: !it.delivered } : it
      ),
    };
  });
  saveEvents(next);

  api
    .patch(
      `/events/${encodeURIComponent(eventId)}/package-items/${encodeURIComponent(itemId)}/toggle-delivered`
    )
    .catch(() => {});

  return next;
};

/**
 * Cambia la etapa del evento ("Evento Confirmado" -> "En Paquetes y Pagos" -> "En Etapa de Entrega" -> "Finalizado")
 */
export const changeEventStage = (
  eventId: string,
  stage: EventProcessStage
): IEvent[] => {
  const current = getEvents();
  const next = current.map((ev) =>
    ev.eventId === eventId ? { ...ev, stage } : ev
  );
  saveEvents(next);

  api
    .patch(`/events/${encodeURIComponent(eventId)}/stage`, { stage })
    .catch(() => {});

  return next;
};

/**
 * Actualiza los datos de la Etapa de Entrega (fotos entregadas, link, notas, entregables físicos)
 */
export const updateEventDelivery = (
  eventId: string,
  deliveryInput: Partial<IEventDelivery>
): IEvent[] => {
  const current = getEvents();
  const next = current.map((ev) => {
    if (ev.eventId !== eventId) return ev;
    const updatedDelivery: IEventDelivery = {
      ...ev.delivery,
      ...deliveryInput,
    };
    const nextStage: EventProcessStage =
      updatedDelivery.isPhotosDelivered && updatedDelivery.isMoneySettled
        ? 'Finalizado'
        : ev.stage === 'En Paquetes y Pagos'
          ? 'En Etapa de Entrega'
          : ev.stage;

    return {
      ...ev,
      stage: nextStage,
      delivery: updatedDelivery,
    };
  });
  saveEvents(next);

  api
    .put(`/events/${encodeURIComponent(eventId)}/delivery`, deliveryInput)
    .catch(() => {});

  return next;
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
        eventDate: proposal.eventDate || 'Por definir',
        lastLocation: proposal.location || 'Por definir',
        lastProposalId: proposal.proposalId,
        createdAt: proposal.createdAt,
      });
    } else {
      existing.proposalsCount += 1;
      if (!existing.eventDate || existing.eventDate === 'Por definir') {
        existing.eventDate = proposal.eventDate || 'Por definir';
      }
    }
  });

  return Array.from(clientMap.values());
};
