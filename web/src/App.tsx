import { useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import theme from './config/theme';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProjectGalleryModal from './components/ProjectGalleryModal';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import DashboardPage from './pages/DashboardPage';
import BudgetListPage from './pages/BudgetListPage';
import BudgetProcessDetailPage from './pages/BudgetProcessDetailPage';
import ClientsDirectoryPage from './pages/ClientsDirectoryPage';
import ManageProjectsPage from './pages/ManageProjectsPage';
import { useProjects } from './hooks/useProjects';
import { useProposals } from './hooks/useProposals';
import type { IProject } from './types';

interface GalleryModalState {
  open: boolean;
  project: IProject | null;
  initialIndex: number;
}

const PublicRouteLayout = () => <Outlet />;

const PrivateRouteLayout = () => <Outlet />;

function App() {
  const [galleryModal, setGalleryModal] = useState<GalleryModalState>({
    open: false,
    project: null,
    initialIndex: 0,
  });

  const {
    projects,
    loading,
    projectsCount,
    totalPhotosCount,
    addProject,
    addPhotosToProject,
    removeProject,
  } = useProjects();

  const {
    proposals,
    events,
    clients,
    proposalsCount,
    eventsCount,
    clientsCount,
    submitProposal,
    updateProposal,
    removeProposal,
    advanceToEvent,
    addEventItem,
    removeEventItem,
    toggleItemDelivered,
    registerDeposit,
    setEventStage,
    saveEventDelivery,
  } = useProposals();

  const handleOpenGallery = (project: IProject, initialIndex = 0) => {
    setGalleryModal({
      open: true,
      project,
      initialIndex,
    });
  };

  const handleCloseGallery = () => {
    setGalleryModal((prev) => ({ ...prev, open: false }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box
          sx={{
            minHeight: '100svh',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.default',
          }}
        >
          <Navbar />

          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              {/* ==================== RUTAS PÚBLICAS ==================== */}
              <Route element={<PublicRouteLayout />}>
                <Route
                  path="/"
                  element={
                    <HomePage
                      projects={projects}
                      proposals={proposals}
                      onOpenGallery={handleOpenGallery}
                      onSubmitProposal={submitProposal}
                    />
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <ProjectsPage
                      projects={projects}
                      loading={loading}
                      totalPhotosCount={totalPhotosCount}
                      onOpenGallery={handleOpenGallery}
                    />
                  }
                />
              </Route>

              {/* ==================== RUTAS PRIVADAS ==================== */}
              <Route path="/private" element={<PrivateRouteLayout />}>
                <Route
                  index
                  element={<Navigate to="/private/dashboard" replace />}
                />
                <Route
                  path="dashboard"
                  element={
                    <DashboardPage
                      projects={projects}
                      proposals={proposals}
                      events={events}
                      projectsCount={projectsCount}
                      totalPhotosCount={totalPhotosCount}
                      proposalsCount={proposalsCount}
                      eventsCount={eventsCount}
                      clientsCount={clientsCount}
                      onRemoveProposal={removeProposal}
                      onOpenGallery={handleOpenGallery}
                    />
                  }
                />
                <Route
                  path="projects"
                  element={
                    <ManageProjectsPage
                      projects={projects}
                      projectsCount={projectsCount}
                      totalPhotosCount={totalPhotosCount}
                      onAddProject={addProject}
                      onAddPhotosToProject={addPhotosToProject}
                      onRemoveProject={removeProject}
                      onOpenGallery={handleOpenGallery}
                    />
                  }
                />
                <Route
                  path="clients"
                  element={<ClientsDirectoryPage clients={clients} />}
                />
                <Route
                  path="processes"
                  element={
                    <BudgetListPage
                      proposals={proposals}
                      events={events}
                      onSubmitProposal={submitProposal}
                      onRemoveProposal={removeProposal}
                    />
                  }
                />
                <Route
                  path="processes/:proposalId"
                  element={
                    <BudgetProcessDetailPage
                      proposals={proposals}
                      events={events}
                      onUpdateProposal={updateProposal}
                      onRemoveProposal={removeProposal}
                      onAdvanceToEvent={advanceToEvent}
                      onAddEventItem={addEventItem}
                      onRemoveEventItem={removeEventItem}
                      onToggleItemDelivered={toggleItemDelivered}
                      onRegisterDeposit={registerDeposit}
                      onSetEventStage={setEventStage}
                      onSaveEventDelivery={saveEventDelivery}
                    />
                  }
                />
              </Route>

              {/* Redirección por defecto */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>

          <Footer />

          {/* Modal de Galería de Fotos para la Parte Pública */}
          <ProjectGalleryModal
            key={`${galleryModal.project?.projectId || 'empty'}-${galleryModal.initialIndex}`}
            open={galleryModal.open}
            project={galleryModal.project}
            initialIndex={galleryModal.initialIndex}
            onClose={handleCloseGallery}
          />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
