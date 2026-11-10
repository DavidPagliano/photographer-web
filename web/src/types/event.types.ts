export type EventProcessStage =
  | 'Evento Confirmado'
  | 'En Paquetes y Pagos'
  | 'En Etapa de Entrega'
  | 'Finalizado';

export interface IEventClientSnapshot {
  clientId: string;
  name: string;
  email: string;
  phone: string;
}

export interface IEventPackageItem {
  itemId: string;
  concept: string;
  price: number;
  paidAmount: number;
  isPaid: boolean;
  delivered: boolean;
}

export interface IEventDeposit {
  depositId: string;
  amount: number;
  date: string;
  method: string;
  targetItemId?: string;
  note: string;
}

export interface IEventDelivery {
  photosToDeliver: number;
  photosDelivered: number;
  deliveryLink: string;
  physicalDeliverables: string;
  isPhotosDelivered: boolean;
  isMoneySettled: boolean;
  deliveryNotes: string;
  deliveredAt?: string;
}

export interface IEvent {
  eventId: string;
  budgetId?: string;
  title: string;
  eventType: string;
  eventDate: string;
  location: string;
  stage: EventProcessStage;
  client: IEventClientSnapshot;
  packageName: string;
  packageItems: IEventPackageItem[];
  deposits: IEventDeposit[];
  totalPackageAmount: number;
  totalPaidAmount: number;
  pendingBalance: number;
  delivery: IEventDelivery;
  createdAt: string;
}

export const EVENT_STAGES: EventProcessStage[] = [
  'Evento Confirmado',
  'En Paquetes y Pagos',
  'En Etapa de Entrega',
  'Finalizado',
];

