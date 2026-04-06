import {Plant} from './plant';

export interface PhotoGallery {
  id: number;
  plant: Plant;
  visible: boolean;
  createdAt: Date;
  date?: Date;
  imagePath: string;
  title?: string;
  description?: string;
}
