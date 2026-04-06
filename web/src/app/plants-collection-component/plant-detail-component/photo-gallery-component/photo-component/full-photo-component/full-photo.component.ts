import {Component, Input } from '@angular/core';
import {PhotoGallery} from '../../../../../Interfaces/Plants/photo-gallery';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-photo-component',
  imports: [
    DatePipe,
    TranslatePipe
  ],
  templateUrl: './full-photo.component.html',
  styleUrls: ['./full-photo.component.css', '../../../../../shared/Card.css']
})
export class FullPhotoComponent {
  @Input() photo!: PhotoGallery;
  @Input() photoUrl!: string;
  @Input() editing: boolean = false;

  constructor(public activeModal: NgbActiveModal) {}

  delete(): void {
    this.activeModal.close('delete');
  }

  close(): void {this.activeModal.dismiss('user-cancel');}

  photoSlide(direction: string): void {console.log(direction); this.activeModal.close(direction);}
  download(): void {
    const a: HTMLAnchorElement = document.createElement('a')
    a.href = this.photoUrl;
    a.download = this.photo.imagePath;
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }


}
