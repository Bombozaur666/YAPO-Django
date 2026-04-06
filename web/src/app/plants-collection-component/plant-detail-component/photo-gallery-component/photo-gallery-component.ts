import {Component, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {PhotoGallery} from '../../../Interfaces/Plants/photo-gallery';
import {PhotoComponent} from './photo-component/photo-component';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {PlantsCollectionService} from '../../plants-collection-service';
import {UploadPhotoGalleryComponent} from './upload-photo-gallery-component/upload-photo-gallery-component';
import {PhotoGalleryRequest} from '../../../Interfaces/Plants/PhotoGalleryRequest';
import {Plant} from '../../../Interfaces/Plants/plant';
import Swal from 'sweetalert2';
import {colors} from '../../../shared/setup/colors';

@Component({
  selector: 'app-photo-gallery-component',
  imports: [
    TranslatePipe,
    PhotoComponent
  ],
  templateUrl: './photo-gallery-component.html',
  styleUrls: ['./photo-gallery-component.css', '../../../shared/Card.css']
})
export class PhotoGalleryComponent {
  @Input() photoGallery: PhotoGallery[] = [] as PhotoGallery[];
  @Input() plantId!: number;
  @Output() plantUpdate: EventEmitter<Plant> = new EventEmitter();
  @Output() photoRemove: EventEmitter<PhotoGallery> = new EventEmitter();

  @ViewChildren(PhotoComponent) photoComponents!: QueryList<PhotoComponent>;
  @Input() editing: boolean = false;

  constructor(private modalService: NgbModal,
              private plantsCollectionService: PlantsCollectionService,
              private translate: TranslateService) {}

  uploadPhoto(): void {
    const modalRef: NgbModalRef = this.modalService.open(UploadPhotoGalleryComponent);

    modalRef.componentInstance.circled = false;
    modalRef.componentInstance.modalTitle = 'profile.settings.editAvatarTitle';

    modalRef.result.then(
      (result: PhotoGalleryRequest): void => {
        this.plantsCollectionService.addPhoto(result, this.plantId).subscribe({
          next: (data: Plant): void => {this.plantUpdate.emit(data);},
          error: (): void => {
            this.translate.get([
              'alerts.uploadPhoto.failureTitle',
              'alerts.uploadPhoto.failureText',
              'alerts.uploadPhoto.ok',
            ]).subscribe(translations => {
              Swal.fire({
                title: translations['alerts.uploadPhoto.failureTitle'],
                text: translations['alerts.uploadPhoto.failureText'],
                icon: "error",
                confirmButtonText: translations['alerts.uploadPhoto.ok'],
                confirmButtonColor: colors['action-button'],
                background: colors['main-secondary-color'],
              })
            });
          }
        });
      }
    );
  }

  navigatePhoto(photo: PhotoGallery, direction: 'next' | 'prev'): PhotoGallery{
    const index: number = this.photoGallery.findIndex((_photoGallery: PhotoGallery): boolean => _photoGallery === photo);

    if (index === -1) {return photo;}

    if (direction === 'next') {return (index === this.photoGallery.length - 1) ? photo : this.photoGallery[index + 1];}
    else {return (index === 0) ? photo : this.photoGallery[index - 1];}
  }

  onPhotoSlide(change: {photo: PhotoGallery; direction: 'next' | 'prev'}): void {
    let newPhoto: PhotoGallery = this.navigatePhoto(change.photo, change.direction);

    const component: PhotoComponent = this.photoComponents.find((_photoComponent: PhotoComponent): boolean => _photoComponent.photo.id === newPhoto.id)!;

    component.onClick();
  }

  onPhotoRemove(photo: PhotoGallery): void {this.photoRemove.emit(photo);}
}
