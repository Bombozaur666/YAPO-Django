import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Localization, LocalizationWithoutPlants} from '../../Interfaces/Plants/localization';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {LocalizationChangeComponent} from './localization-change-componennt/localization-change.component';
import {PlantsCollectionService} from '../plants-collection-service';
import Swal from 'sweetalert2';
import {colors} from '../../shared/setup/colors';

@Component({
  selector: 'app-localizations-component',
  imports: [
    TranslatePipe
  ],
  templateUrl: './localizations-component.html',
  styleUrl: './localizations-component.css'
})
export class LocalizationsComponent {
  protected selectedLocalization: LocalizationWithoutPlants = {"name": ""};
  @Input() localizations: LocalizationWithoutPlants[] = [];
  @Output() localizationUpdateOrCreate: EventEmitter<Localization> = new EventEmitter<Localization>();
  @Output() localizationRemove: EventEmitter<LocalizationWithoutPlants> = new EventEmitter<LocalizationWithoutPlants>();
  @Output() localizationsChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private modalService: NgbModal,
              private  plantsCollectionService: PlantsCollectionService,
              private translate: TranslateService) {}
  selectLocalization(localization: LocalizationWithoutPlants): void {
    this.selectedLocalization = localization;
    this.localizationsChange.emit(localization.id);
  }

  editOrCreateLocalization(isEdit: boolean): void {
    const modalRef: NgbModalRef = this.modalService.open(LocalizationChangeComponent);
    if (isEdit) {
      modalRef.componentInstance.localization = this.selectedLocalization
      modalRef.componentInstance.title = 'collections.localizations.editLocalization';
    } else {
      modalRef.componentInstance.title = 'collections.localizations.addLocalization';
    }

    modalRef.result.then(
      (result:{"mode": "add"|"delete" , localization: LocalizationWithoutPlants}): void => {
        if (result.mode === "add") {
          this.plantsCollectionService.localizationUpdateOrCreate(result.localization).subscribe({
              next: (data: Localization): void => {this.localizationUpdateOrCreate.emit(data);},
              error: (error: any): void => {console.log(error.message);}
            }
          );
        } else if (result.mode==="delete") {
          this.plantsCollectionService.removeLocalization(result.localization).subscribe({
            next: (): void => {this.localizationRemove.emit(result.localization);},
            error: (): void => {
              this.translate.get([
                'alerts.localizationDelete.failureTitle',
                'alerts.localizationDelete.failureText',
                'alerts.localizationDelete.ok',
              ]).subscribe(translations => {
                Swal.fire({
                  title: translations['alerts.localizationDelete.failureTitle'],
                  text: translations['alerts.localizationDelete.failureText'],
                  icon: "success",
                  confirmButtonText: translations['alerts.localizationDelete.ok'],
                  confirmButtonColor: colors['action-button'],
                  background: colors['main-secondary-color'],
                })
              });
            }
          })
        }
      }
    );
  }
}
