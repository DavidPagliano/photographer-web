import { useState } from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import theme from './config/theme';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProjectGalleryModal from './components/ProjectGalleryModal';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import DashboardPage from './pages/DashboardPage';
import { useProjects } from './hooks/useProjects';
import { useProposals } from './hooks/useProposals';
import type { IProject, PageView } from './types';

interface GalleryModalState {
  open: boolean;
  project: IProject | null;
  initialIndex: number;
}

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
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
    clients,
    proposalsCount,
    clientsCount,
    submitProposal,
    changeProposalStatus,
    removeProposal,
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
      <Box
        sx={{
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
        }}
      >
        <Navbar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          projectsCount={projectsCount}
          proposalsCount={proposalsCount}
        />

        <Box component="main" sx={{ flexGrow: 1 }}>
          {currentPage === 'home' && (
            <HomePage
              projects={projects}
              proposals={proposals}
              onNavigate={setCurrentPage}
              onOpenGallery={handleOpenGallery}
              onSubmitProposal={submitProposal}
            />
          )}

          {currentPage === 'projects' && (
            <ProjectsPage
              projects={projects}
              loading={loading}
              totalPhotosCount={totalPhotosCount}
              onOpenGallery={handleOpenGallery}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'dashboard' && (
            <DashboardPage
              projects={projects}
              proposals={proposals}
              clients={clients}
              projectsCount={projectsCount}
              totalPhotosCount={totalPhotosCount}
              proposalsCount={proposalsCount}
              clientsCount={clientsCount}
              onAddProject={addProject}
              onAddPhotosToProject={addPhotosToProject}
              onRemoveProject={removeProject}
              onChangeProposalStatus={changeProposalStatus}
              onRemoveProposal={removeProposal}
              onOpenGallery={handleOpenGallery}
              onNavigate={setCurrentPage}
            />
          )}
        </Box>

        <Footer onNavigate={setCurrentPage} />

        {/* Modal de Galería de Fotos para la Parte Pública */}
        <ProjectGalleryModal
          key={`${galleryModal.project?.projectId || 'empty'}-${galleryModal.initialIndex}`}
          open={galleryModal.open}
          project={galleryModal.project}
          initialIndex={galleryModal.initialIndex}
          onClose={handleCloseGallery}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;

