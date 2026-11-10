import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createProject,
  deleteProject,
  fetchProjects,
  updateProject,
} from '../services/projectService';
import type { IImage, IProject, ProjectFormInput } from '../types';

export const useProjects = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'api' | 'local'>('api');

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchProjects();
      setProjects(result.projects);
      setSource(result.source);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar los proyectos';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetchProjects()
      .then((result) => {
        if (!active) return;
        setProjects(result.projects);
        setSource(result.source);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message =
          err instanceof Error ? err.message : 'Error al cargar los proyectos';
        setError(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const addProject = useCallback(async (projectPayload: ProjectFormInput) => {
    const created = await createProject(projectPayload);
    setProjects((prev) => [
      created,
      ...prev.filter((item) => item.projectId !== created.projectId),
    ]);
    return created;
  }, []);

  const addPhotosToProject = useCallback(
    async (projectId: string, newImages: IImage[]) => {
      const target = projects.find((item) => item.projectId === projectId);
      if (!target) {
        throw new Error('No se encontró el proyecto seleccionado');
      }
      const mergedImages: IImage[] = [...(target.images || []), ...newImages];
      const updated = await updateProject(projectId, {
        projectName: target.projectName,
        projectDescription: target.projectDescription,
        images: mergedImages,
      });
      if (updated) {
        setProjects((prev) =>
          prev.map((item) => (item.projectId === projectId ? updated : item))
        );
      }
      return updated;
    },
    [projects]
  );

  const removePhotoFromProject = useCallback(
    async (projectId: string, imageId: string) => {
      const target = projects.find((item) => item.projectId === projectId);
      if (!target) return null;
      const filteredImages = (target.images || []).filter(
        (img) => img.imageId !== imageId
      );
      const updated = await updateProject(projectId, {
        projectName: target.projectName,
        projectDescription: target.projectDescription,
        images: filteredImages,
      });
      if (updated) {
        setProjects((prev) =>
          prev.map((item) => (item.projectId === projectId ? updated : item))
        );
      }
      return updated;
    },
    [projects]
  );

  const removeProject = useCallback(async (projectId: string) => {
    await deleteProject(projectId);
    setProjects((prev) => prev.filter((item) => item.projectId !== projectId));
  }, []);

  const totalPhotosCount = useMemo(
    () =>
      projects.reduce(
        (sum, project) =>
          sum + (Array.isArray(project.images) ? project.images.length : 0),
        0
      ),
    [projects]
  );

  return {
    projects,
    loading,
    error,
    source,
    projectsCount: projects.length,
    totalPhotosCount,
    refreshProjects: loadProjects,
    addProject,
    addPhotosToProject,
    removePhotoFromProject,
    removeProject,
  };
};
