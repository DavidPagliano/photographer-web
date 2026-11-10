import { useCallback, useMemo, useState } from 'react';
import {
  createProposal,
  deleteProposal,
  deriveClientsFromProposals,
  getProposals,
  updateProposalStatus,
} from '../services/proposalService';
import type { IProposal, ProposalFormInput, ProposalStatus } from '../types';

export const useProposals = () => {
  const [proposals, setProposals] = useState<IProposal[]>(() => getProposals());

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

  const removeProposal = useCallback((proposalId: string) => {
    const updated = deleteProposal(proposalId);
    setProposals(updated);
  }, []);

  const clients = useMemo(
    () => deriveClientsFromProposals(proposals),
    [proposals]
  );

  return {
    proposals,
    clients,
    proposalsCount: proposals.length,
    clientsCount: clients.length,
    submitProposal,
    changeProposalStatus,
    removeProposal,
  };
};
