import {User} from '../Users/user';
import {Plant} from './plant';

export interface PlantComment {
  id: number;
  user: User;
  plant: Plant;
  visible: boolean;
  creationDate: Date;
  editDate?: Date;
  comment: string;
}
