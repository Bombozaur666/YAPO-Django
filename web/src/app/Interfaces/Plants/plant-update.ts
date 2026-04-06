import {Plant} from './plant';

export interface PlantUpdate {
  id: number;
  plant: Plant;
  fieldName: string;
  oldValue: string;
  newValue: string;
}
