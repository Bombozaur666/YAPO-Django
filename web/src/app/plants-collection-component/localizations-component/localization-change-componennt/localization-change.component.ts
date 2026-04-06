import {Component, Input} from '@angular/core';
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {LocalizationWithoutPlants} from '../../../Interfaces/Plants/localization';
import {FormsModule} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
import {colors} from '../../../shared/setup/colors';

@Component({
  selector: 'app-localization-change-component',
  imports: [
    TranslatePipe,
    FormsModule
  ],
  templateUrl: './localization-change.component.html',
  styleUrls: ['./localization-change.component.css', '../../../shared/Card.css']
})
export class LocalizationChangeComponent {
  @Input() localization: LocalizationWithoutPlants = {"name": ""};
  @Input() title: string = "";

  constructor(public activeModal: NgbActiveModal,
              private translate: TranslateService) {}

  close(): void { this.activeModal.dismiss('user-cancel');}

  save(): void {this.activeModal.close({"mode": "add", "localization": this.localization});}

  delete(): void {
    this.translate.get([
      'alerts.localizationDelete.title',
      'alerts.localizationDelete.text',
      'alerts.localizationDelete.confirmButton',
      'alerts.localizationDelete.cancelButton',
    ]).subscribe(translations => {
      Swal.fire({
        title: translations['alerts.localizationDelete.title'],
        text: translations['alerts.localizationDelete.text'],
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: translations['alerts.localizationDelete.confirmButton'],
        cancelButtonText: translations['alerts.localizationDelete.cancelButton'],
        cancelButtonColor: colors['cancel-button'],
        confirmButtonColor: colors['action-button'],
        background: colors['main-secondary-color'],
      }).then((result): void => {
        if (result.isConfirmed) {
          this.activeModal.close({"mode": "delete", "localization": this.localization});
        }
      });
    });
  }
}
