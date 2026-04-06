import {Plant} from './plant';

export interface Localization {
  id?: number;
  name: string;
  plants: Plant[];
}

export type LocalizationWithoutPlants = Omit<Localization, 'plants'>;
