export interface IClient {
  clientId: string;
  name: string;
  email: string;
  phone: string;
  proposalsCount: number;
  lastEventType: string;
  eventDate: string;
  lastLocation?: string;
  lastProposalId?: string;
  createdAt: string;
}
