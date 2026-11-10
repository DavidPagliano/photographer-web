import { useCallback, useMemo, useState } from 'react';
import {
  addDepositToEvent,
  addPackageItemToEvent,
  advanceProposalToEvent,
  changeEventStage,
  createProposal,
  deleteProposal,
  deriveClientsFromProposals,
  getEvents,
  getProposals,
  removePackageItemFromEvent,
  toggleEventItemDelivered,
  updateEventDelivery,
  updateProposalDetails,
  updateProposalStatus,
} from '../services/proposalService';
import type {
  EventProcessStage,
  IEvent,
  IEventDelivery,
  IProposal,
  ProposalFormInput,
  ProposalStatus,
} from '../types';

export const useProposals = () => {
  const [proposals, setProposals] = useState<IProposal[]>(() => getProposals());
  const [events, setEvents] = useState<IEvent[]>(() => getEvents());

  const submitProposal = useCallback((proposalInput: ProposalFormInput) => {
    const created = createProposal(proposalInput);
    setProposals(getProposals());
    return created;
  }, []);

  const changeProposalStatus = useCallback(
    (proposalId: string, status: ProposalStatus) => {
      const updated = updateProposalStatus(proposalId, status);
      setProposals(updated);
    },
    []
  );

  const updateProposal = useCallback(
    (proposalId: string, changes: Partial<IProposal>) => {
      const result = updateProposalDetails(proposalId, changes);
      setProposals(result.proposals);
      setEvents(result.events);
    },
    []
  );

  const removeProposal = useCallback((proposalId: string) => {
    const updated = deleteProposal(proposalId);
    setProposals(updated);
  }, []);

  const advanceToEvent = useCallback(
    (proposalId: string, initialDepositAmount = 0) => {
      const result = advanceProposalToEvent(proposalId, initialDepositAmount);
      setProposals(result.proposals);
      setEvents(result.events);
      return result.createdEvent;
    },
    []
  );

  const addEventItem = useCallback(
    (eventId: string, concept: string, price: number) => {
      const updated = addPackageItemToEvent(eventId, concept, price);
      setEvents(updated);
    },
    []
  );

  const removeEventItem = useCallback((eventId: string, itemId: string) => {
    const updated = removePackageItemFromEvent(eventId, itemId);
    setEvents(updated);
  }, []);

  const toggleItemDelivered = useCallback((eventId: string, itemId: string) => {
    const updated = toggleEventItemDelivered(eventId, itemId);
    setEvents(updated);
  }, []);

  const registerDeposit = useCallback(
    (
      eventId: string,
      depositInput: {
        amount: number;
        method: string;
        targetItemId?: string;
        note: string;
      }
    ) => {
      const updated = addDepositToEvent(eventId, depositInput);
      setEvents(updated);
    },
    []
  );

  const setEventStage = useCallback(
    (eventId: string, stage: EventProcessStage) => {
      const updated = changeEventStage(eventId, stage);
      setEvents(updated);
    },
    []
  );

  const saveEventDelivery = useCallback(
    (eventId: string, deliveryInput: Partial<IEventDelivery>) => {
      const updated = updateEventDelivery(eventId, deliveryInput);
      setEvents(updated);
    },
    []
  );

  const clients = useMemo(
    () => deriveClientsFromProposals(proposals),
    [proposals]
  );

  return {
    proposals,
    events,
    clients,
    proposalsCount: proposals.length,
    eventsCount: events.length,
    clientsCount: clients.length,
    submitProposal,
    changeProposalStatus,
    updateProposal,
    removeProposal,
    advanceToEvent,
    addEventItem,
    removeEventItem,
    toggleItemDelivered,
    registerDeposit,
    setEventStage,
    saveEventDelivery,
  };
};
