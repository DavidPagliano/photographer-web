import api from './api';
import type { IImage, IProject, ProjectFormInput } from '../types';

const STORAGE_KEY = 'dm_photography_projects_v1';

const createEditorialPlaceholder = (
  title: string,
  subtitle: string,
  bgStart: string,
  bgEnd: string,
  accent: string
): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="850" viewBox="0 0 1200 850">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgStart}" />
        <stop offset="100%" stop-color="${bgEnd}" />
      </linearGradient>
      <radialGradient id="glow" cx="70%" cy="30%" r="55%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.65" />
        <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="1200" height="850" fill="url(#bg)" />
    <rect width="1200" height="850" fill="url(#glow)" />
    <circle cx="860" cy="280" r="190" fill="${accent}" opacity="0.28" />
    <circle cx="360" cy="590" r="250" fill="#FFFFFF" opacity="0.22" />
    <rect x="70" y="70" width="1060" height="710" rx="12" fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.65" />
    <rect x="92" y="92" width="1016" height="666" rx="8" fill="none" stroke="#2D2D2D" stroke-width="0.8" opacity="0.18" />
    <g transform="translate(600, 390)" text-anchor="middle">
      <circle cx="0" cy="-75" r="34" fill="none" stroke="#2D2D2D" stroke-width="1.5" opacity="0.45" />
      <circle cx="0" cy="-75" r="14" fill="${accent}" opacity="0.7" />
      <text y="10" font-family="Georgia, serif" font-size="48" font-style="italic" fill="#2D2D2D" opacity="0.88">${title}</text>
      <text y="62" font-family="Montserrat, Arial, sans-serif" font-size="16" letter-spacing="6" fill="#555555">${subtitle.toUpperCase()}</text>
      <line x1="-80" y1="95" x2="80" y2="95" stroke="#2D2D2D" stroke-width="1" opacity="0.3" />
      <text y="130" font-family="Montserrat, Arial, sans-serif" font-size="13" letter-spacing="4" fill="#666666">DAIANA MILLENA · FOTÓGRAFA</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const DEFAULT_PROJECTS: IProject[] = [
  {
    projectId: 'boda-valeria-mateo',
    projectName: 'Boda de Valeria & Mateo',
    projectDescription:
      'Cobertura documental y artística al atardecer en estancia campestre. Luz cálida natural, emociones espontáneas y retratos íntimos de los novios.',
    createdAt: '2026-10-15T18:00:00.000Z',
    images: [
      {
        imageId: 'boda-vm-01',
        imageName: 'Votos bajo el altar de flores',
        imageBase64: createEditorialPlaceholder(
          'Valeria & Mateo',
          'Ceremonia al Atardecer',
          '#FAF7F2',
          '#E6C5C0',
          '#D8C8B8'
        ),
      },
      {
        imageId: 'boda-vm-02',
        imageName: 'Retrato en los jardines dorados',
        imageBase64: createEditorialPlaceholder(
          'Luz Dorada',
          'Sesión de Pareja',
          '#EFECE6',
          '#D8C8B8',
          '#E6C5C0'
        ),
      },
      {
        imageId: 'boda-vm-03',
        imageName: 'Primer baile bajo guirnaldas',
        imageBase64: createEditorialPlaceholder(
          'Primer Baile',
          'Recepción Nocturna',
          '#F4E3E0',
          '#D8C8B8',
          '#B5A18E'
        ),
      },
    ],
  },
  {
    projectId: 'quince-sofia-editorial',
    projectName: 'XV Años de Sofía · Editorial',
    projectDescription:
      'Book exterior de estilo fine-art con estética pastel y romántica, combinando arquitectura clásica y naturaleza en flor.',
    createdAt: '2026-10-28T15:30:00.000Z',
    images: [
      {
        imageId: 'xv-sofia-01',
        imageName: 'Retrato principal en escalinata',
        imageBase64: createEditorialPlaceholder(
          'Sofía · XV Años',
          'Book Fine Art',
          '#F4E3E0',
          '#EFECE6',
          '#E6C5C0'
        ),
      },
      {
        imageId: 'xv-sofia-02',
        imageName: 'Vestido en movimiento y luz suave',
        imageBase64: createEditorialPlaceholder(
          'Detalles en Pastel',
          'Sesión Exterior',
          '#FAF7F2',
          '#BCE0EA',
          '#E6C5C0'
        ),
      },
    ],
  },
  {
    projectId: 'maternidad-clara-luz',
    projectName: 'Dulce Espera · Clara & Familia',
    projectDescription:
      'Sesión de maternidad en estudio con luz de ventana, tonos crema arena y texturas orgánicas que transmiten calma y ternura.',
    createdAt: '2026-11-02T11:00:00.000Z',
    images: [
      {
        imageId: 'mat-clara-01',
        imageName: 'Contraluz en tonos arena',
        imageBase64: createEditorialPlaceholder(
          'Dulce Espera',
          'Maternidad en Estudio',
          '#FAF7F2',
          '#C8DBC8',
          '#D8C8B8'
        ),
      },
      {
        imageId: 'mat-clara-02',
        imageName: 'Retrato familiar íntimo',
        imageBase64: createEditorialPlaceholder(
          'Clara & Familia',
          'Retrato Natural',
          '#EFECE6',
          '#F5D6BA',
          '#D8C8B8'
        ),
      },
    ],
  },
];

const getLocalProjects = (): IProject[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
      return DEFAULT_PROJECTS;
    }
    const parsed = JSON.parse(raw) as IProject[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PROJECTS;
  } catch {
    return DEFAULT_PROJECTS;
  }
};

const saveLocalProjects = (projects: IProject[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.warn('No se pudo guardar en localStorage (posible límite de tamaño):', err);
  }
};

export interface FetchProjectsResult {
  projects: IProject[];
  source: 'api' | 'local';
}

export const fetchProjects = async (): Promise<FetchProjectsResult> => {
  try {
    const response = await api.get<{ data: IProject[] }>('/projects', {
      params: { page: 1, limit: 50 },
    });
    const apiProjects = response.data?.data || [];
    if (apiProjects.length > 0) {
      saveLocalProjects(apiProjects);
      return { projects: apiProjects, source: 'api' };
    }
    const localProjects = getLocalProjects();
    return { projects: localProjects, source: 'api' };
  } catch {
    return { projects: getLocalProjects(), source: 'local' };
  }
};

export const createProject = async (
  payload: ProjectFormInput
): Promise<IProject> => {
  const cleanPayload: ProjectFormInput = {
    projectId: payload.projectId.trim(),
    projectName: payload.projectName.trim(),
    projectDescription: payload.projectDescription.trim(),
    images: payload.images || [],
  };

  try {
    const response = await api.post<IProject>('/projects', cleanPayload);
    const created = response.data;
    const current = getLocalProjects().filter(
      (p) => p.projectId !== created.projectId
    );
    saveLocalProjects([created, ...current]);
    return created;
  } catch {
    const fallbackProject: IProject = {
      ...cleanPayload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const current = getLocalProjects().filter(
      (p) => p.projectId !== cleanPayload.projectId
    );
    saveLocalProjects([fallbackProject, ...current]);
    return fallbackProject;
  }
};

export const updateProject = async (
  projectId: string,
  updateData: Partial<ProjectFormInput>
): Promise<IProject | null> => {
  try {
    const response = await api.put<IProject>(
      `/projects/${encodeURIComponent(projectId)}`,
      updateData
    );
    const updated = response.data;
    const current = getLocalProjects().map((p) =>
      p.projectId === projectId ? updated : p
    );
    saveLocalProjects(current);
    return updated;
  } catch {
    const current = getLocalProjects();
    let updatedItem: IProject | null = null;
    const nextList = current.map((p) => {
      if (p.projectId === projectId) {
        updatedItem = {
          ...p,
          ...updateData,
          updatedAt: new Date().toISOString(),
        };
        return updatedItem;
      }
      return p;
    });
    saveLocalProjects(nextList);
    return updatedItem;
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    await api.delete(`/projects/${encodeURIComponent(projectId)}`);
  } catch {
    // Continúa con eliminación local si la API no está disponible
  }
  const remaining = getLocalProjects().filter((p) => p.projectId !== projectId);
  saveLocalProjects(remaining);
};

export const filesToBase64Images = async (
  files: FileList | File[]
): Promise<IImage[]> => {
  const fileArray = Array.from(files || []);

  const convertSingleFile = (file: File, index: number): Promise<IImage> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () =>
        reject(new Error(`No se pudo leer el archivo ${file.name}`));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => {
          resolve({
            imageId: `img-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
            imageName: file.name.replace(/\.[^/.]+$/, ''),
            imageBase64: String(reader.result),
          });
        };
        img.onload = () => {
          const maxDim = 1400;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
          }
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.84);
          resolve({
            imageId: `img-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
            imageName: file.name.replace(/\.[^/.]+$/, ''),
            imageBase64: compressedBase64,
          });
        };
        img.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });

  return Promise.all(fileArray.map((file, idx) => convertSingleFile(file, idx)));
};
