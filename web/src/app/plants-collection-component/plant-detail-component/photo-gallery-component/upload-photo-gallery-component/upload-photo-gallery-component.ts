import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {PhotoGalleryRequest} from '../../../../Interfaces/Plants/PhotoGalleryRequest';

@Component({
  selector: 'app-upload-image-dialog-component',
  imports: [CommonModule,
    TranslatePipe,
    FormsModule,
  ],
  templateUrl: './upload-photo-gallery-component.html',
  styleUrls: ['./upload-photo-gallery-component.css', '../../../../shared/Card.css']
})
export class UploadPhotoGalleryComponent {
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  @Input() circled: boolean = false;
  @Input() modalTitle: string = '' ;
  @Input() photoGalleryRequest: PhotoGalleryRequest = {} as PhotoGalleryRequest;

  constructor(public activeModal: NgbActiveModal) {}


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result;
      reader.readAsDataURL(this.selectedFile);
      this.photoGalleryRequest.image = input.files[0];
    }
  }

  close(): void { this.activeModal.dismiss('user-cancel');}

  save(): void {this.activeModal.close(this.photoGalleryRequest);}
}
