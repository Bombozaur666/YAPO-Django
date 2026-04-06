import {Plant} from './plant';

export interface Note {
  id: number;
  plant: Plant;
  note: string;
  noteDate: Date;
  editDate?: Date;
}
