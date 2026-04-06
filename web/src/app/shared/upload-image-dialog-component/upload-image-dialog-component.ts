import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-upload-image-dialog-component',
  imports: [CommonModule,
    TranslatePipe,
    FormsModule,
  ],
  templateUrl: './upload-image-dialog-component.html',
  styleUrls: ['./upload-image-dialog-component.css', '../Card.css']
})
export class UploadImageDialogComponent {
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  @Input() circled: boolean = false;
  @Input() modalTitle: string = '' ;

  constructor(public activeModal: NgbActiveModal) {}


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  close(): void { this.activeModal.dismiss('user-cancel');}

  save(): void {this.activeModal.close(this.selectedFile);}
}
