import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PhotoGallery} from '../../../../Interfaces/Plants/photo-gallery';
import {PlantsCollectionService} from '../../../plants-collection-service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FullPhotoComponent} from './full-photo-component/full-photo.component';

@Component({
  selector: 'app-photo-component',
  imports: [],
  templateUrl: './photo-component.html',
  styleUrls: ['./photo-component.css', '../../../../shared/Card.css']
})
export class PhotoComponent implements OnInit {
  @Input() photo!: PhotoGallery;
  @Input() plantId!: number;
  @Output() photoSlide: EventEmitter<{ photo: PhotoGallery, direction: 'next' | 'prev' }> = new EventEmitter();
  @Output() photoRemove: EventEmitter<PhotoGallery> = new EventEmitter();

  protected photoUrl!: string;
  @Input() editing: boolean = false;

  constructor(private plantsCollectionService: PlantsCollectionService,
              private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getPhotoImage();
  }

  getPhotoImage(): void {
    this.plantsCollectionService.getPhoto(this.photoPath).subscribe({
      next: (blob: Blob): void => {
        this.photoUrl = URL.createObjectURL(blob);
      }
    })
  }

  get photoPath(): string {return this.plantsCollectionService.photoPath(this.plantId, this.photo.imagePath);}

  onClick(): void {
    const modalRef: NgbModalRef = this.modalService.open(FullPhotoComponent);
    modalRef.componentInstance.photo = this.photo;
    modalRef.componentInstance.editing = this.editing;
    modalRef.componentInstance.photoUrl = this.photoUrl;
    modalRef.result.then(
      (result: 'next' | 'prev' | 'delete'): void => {
        if (result === 'delete') {
          this.plantsCollectionService.removePhoto(this.photo, this.plantId).subscribe({
            next: (): void=> {
              this.photoRemove.emit(this.photo);
            }
          });

        }
        else {this.photoSlide.emit({photo: this.photo, direction: result});}
      }
    );
  }
}
