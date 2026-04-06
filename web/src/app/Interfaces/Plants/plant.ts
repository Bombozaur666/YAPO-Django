import {Localization} from './localization';
import {User} from '../Users/user';
import {Note} from './note';
import {PlantUpdate} from './plant-update';
import {PlantComment} from './plantComment';
import {PhotoGallery} from './photo-gallery';

export interface Plant {
  id: number;
  name: string
  species: string;
  purchaseDate: Date;
  purchaseLocalization: string;
  user: User;
  localization: Localization
  plantHistory: PlantUpdate[];
  notes: Note[];
  comments: PlantComment[];
  photoGallery: PhotoGallery[];
  fertilizationDate: Date;
  alive: boolean;
  shared: boolean;
  deathReason: string;
  wateringDate: Date;
  creationDate: Date;
  avatarPath: string;
  plantCondition: string;
  plantSoil: string;
  plantWatering: string;
  plantBerth: string;
  plantToxicity: string;
  plantLifeExpectancy: string;
}
