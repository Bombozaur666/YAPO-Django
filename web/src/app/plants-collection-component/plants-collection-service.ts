import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Localization, LocalizationWithoutPlants} from '../Interfaces/Plants/localization';
import {Observable} from 'rxjs';
import {Plant} from '../Interfaces/Plants/plant';
import {Note} from '../Interfaces/Plants/note';
import {UpdateField} from '../Interfaces/update-field';
import {PhotoGalleryRequest} from '../Interfaces/Plants/PhotoGalleryRequest';
import {PhotoGallery} from '../Interfaces/Plants/photo-gallery';
import {host} from '../shared/setup/host';
import {PlantComment} from '../Interfaces/Plants/plantComment';

@Injectable({
  providedIn: 'root'
})
export class PlantsCollectionService {
  protected baseUrl: string = `${host.protocol}${host.hostname}:${host.port}/`;
  constructor(private httpClient: HttpClient) {}

  locationsFetch():  Observable<Localization[]> {
    return this.httpClient.get<Localization[]>(`${this.baseUrl}localization/`);
  }

  localizationUpdateOrCreate(localization: LocalizationWithoutPlants): Observable<Localization>{
    if (localization.id !== null) { return this.httpClient.post<Localization>(`${this.baseUrl}localization/create-localization`, localization,{withCredentials: true});}
    else {return this.httpClient.post<Localization>(`${ this.baseUrl}localization/${localization.id}`, localization,{withCredentials: true});}
  }

  createPlant(plant: Plant): Observable<Plant> {
    return this.httpClient.post<Plant>(`${this.baseUrl}plants/create-plant`, plant, {withCredentials: true});
  }

  removeLocalization(localization: LocalizationWithoutPlants): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.baseUrl}localization/${localization.id}`);
  }

  updatePlantAvatar(file: File, plantID: number): Observable<Plant> {
    const form = new FormData();
    form.append('file', file);
    return this.httpClient.post<Plant>(`${this.baseUrl}plants/avatar/` + plantID, form);
  }

  avatarPath(plant: Plant): string {
    return `${this.baseUrl}plants/avatar/${plant.avatarPath}`;
  }

  photoPath(plantId: number, photoName: string): string{
    return `${this.baseUrl}plants/${plantId}/photo/${photoName}`
  }

  removePlant(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}plants/${id}`);
  }

  addNote(plantId: number, note: Note): Observable<Note> {
    return this.httpClient.post<Note>(`${this.baseUrl}plants/${plantId}/note`, note);
  }

  editNote(plantId: number, note: Note): Observable<Note> {
    return this.httpClient.patch<Note>(`${this.baseUrl}plants/${plantId}/note`, note);
  }

  deleteNote(plantId: number, note: Note): Observable<any>{
    return this.httpClient.delete(`${this.baseUrl}plants/${plantId}/note/${note.id}`);
  }

  updatePlantField(result: UpdateField, plantId: number): Observable<Plant> {
    return this.httpClient.patch<Plant>(`${this.baseUrl}plants/${plantId}/update`, result)
  }

  addPhoto(photo: PhotoGalleryRequest, plantId: number): Observable<Plant> {
    const form = new FormData();

    form.append('image', photo.image!);
    if (photo.title) {form.append('title', photo.title);}
    if (photo.date) {form.append('date', new Date(photo.date).toISOString());}
    if (photo.description) {form.append('description', photo.description);}

    return this.httpClient.post<Plant>(`${this.baseUrl}plants/${plantId}/photo`, form)
  }

  getPhoto(photoPath: string): Observable<Blob> {
    return this.httpClient.get(photoPath, {responseType: 'blob'});
  }

  removePhoto(photo: PhotoGallery, plantId: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}plants/${plantId}/photo/${photo.id}`);
  }

  addComment(plantId: number,comment: string): Observable<PlantComment> {
    return this.httpClient.post<PlantComment>(`${this.baseUrl}plants/${plantId}/comment`, comment);
  }
}
