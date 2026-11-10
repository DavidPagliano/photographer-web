export interface IImage {
  imageId: string;
  imageName: string;
  imageBase64: string;
}

export interface IProject {
  _id?: string;
  projectId: string;
  projectName: string;
  projectDescription: string;
  images: IImage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectFormInput {
  projectId: string;
  projectName: string;
  projectDescription: string;
  images: IImage[];
}

export const createInitialProjectForm = (): ProjectFormInput => ({
  projectId: '',
  projectName: '',
  projectDescription: '',
  images: [],
});

