import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {Plant} from '../../../Interfaces/Plants/plant';
import {UploadImageDialogComponent} from '../../../shared/upload-image-dialog-component/upload-image-dialog-component';
import {PlantsCollectionService} from '../../plants-collection-service';
import {NgbModal, NgbModalModule, NgbModalRef, NgbTooltip, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {UpdateFieldComponent} from './update-field-component/update-field-component';
import {UpdateField} from '../../../Interfaces/update-field';
import {DatePipe} from '@angular/common';
import {PlantCondition} from '../../../Interfaces/Plants/enums/plantCondition';
import {PlantSoil} from '../../../Interfaces/Plants/enums/PlantSoil';
import {PlantWatering} from '../../../Interfaces/Plants/enums/PlantWatering';
import {PlantBerth} from '../../../Interfaces/Plants/enums/PlantBerth';
import {PlantToxicity} from '../../../Interfaces/Plants/enums/PlantToxicity';
import {PlantLifeExpectancy} from '../../../Interfaces/Plants/enums/PlantLifeExpectancy';
import Swal from 'sweetalert2'
import {host} from '../../../shared/setup/host';
import {colors} from '../../../shared/setup/colors';

@Component({
  selector: 'app-main-body-component',
  imports: [
    TranslatePipe,
    NgbModalModule,
    NgbTooltipModule,
    DatePipe
  ],
  templateUrl: './main-body-component.html',
  styleUrls: ['./main-body-component.css', '../../../shared/Card.css']
})
export class MainBodyComponent {
  protected selectedRow: string = '';
  @Input() plant: Plant = {} as Plant;
  @Input() editMode: boolean = false;
  @Output() plantAvatarChange: EventEmitter<Plant> = new EventEmitter();
  @Output() removePlant: EventEmitter<Plant> = new EventEmitter();
  @Output() plantUpdate: EventEmitter<Plant> = new EventEmitter();
  @ViewChild('sharePlantTooltip') tooltip!: NgbTooltip;

  constructor(private plantsCollectionService: PlantsCollectionService,
              private modalService: NgbModal,
              private translate: TranslateService) {}

  get avatarPath(): string {return this.plantsCollectionService.avatarPath(this.plant);}

  onPlantAvatarChange(plantAvatar: File): void {
    this.plantsCollectionService.updatePlantAvatar(plantAvatar, this.plant.id).subscribe({
      next: (data: Plant): void => {
        this.plant = data;
        return this.plantAvatarChange.emit(data);
      },
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
  };

  onAvatarEdit(): void {
    const modalRef: NgbModalRef = this.modalService.open(UploadImageDialogComponent);

    modalRef.componentInstance.circled = false;
    modalRef.componentInstance.modalTitle = 'profile.settings.editAvatarTitle';

    modalRef.result.then((result: File): void => {this.onPlantAvatarChange(result);});
  }

  onRemovePlant(): void {
    this.translate.get([
      'alerts.deletePlant.title',
      'alerts.deletePlant.text',
      'alerts.deletePlant.confirmButton',
      'alerts.deletePlant.cancelButton',
    ]).subscribe(translations => {
      Swal.fire({
        title: translations['alerts.deletePlant.title'],
        text: translations['alerts.deletePlant.text'],
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: translations['alerts.deletePlant.confirmButton'],
        cancelButtonText: translations['alerts.deletePlant.cancelButton'],
        cancelButtonColor: colors['cancel-button'],
        confirmButtonColor: colors['action-button'],
        background: colors['main-secondary-color'],
      }).then((result): void => {
        if (result.isConfirmed) {
          this.removePlant.emit(this.plant);
        }
      });
    });
  }


  updateField(name: string, value: any, typeData: string, options?: PlantLifeExpectancy[] | PlantCondition[] | PlantSoil[] | PlantWatering[] | PlantBerth[] | PlantToxicity[]): void {
    const modalRef: NgbModalRef = this.modalService.open(UpdateFieldComponent);

    modalRef.componentInstance.title = "collections.plants.details." + name;
    modalRef.componentInstance.saveText = "collections.plants.details.updateField.save";
    modalRef.componentInstance.typeData = typeData;
    modalRef.componentInstance.updateField = {fieldName: name, fieldValue: value};
    options
      ? modalRef.componentInstance.options = options
      : null;

    modalRef.result.then(
      (result: UpdateField): void => {
        this.plantsCollectionService.updatePlantField(result, this.plant.id).subscribe({
          next: (data: Plant): void => {
            this.plantUpdate.emit(data);
          },
          error: (): void => {
            this.translate.get([
              'alerts.updatePlant.failureTitle',
              'alerts.updatePlant.failureText',
              'alerts.updatePlant.ok',
            ]).subscribe(translations => {
              Swal.fire({
                title: translations['alerts.updatePlant.failureTitle'],
                text: translations['alerts.updatePlant.failureText'],
                icon: "error",
                confirmButtonText: translations['alerts.updatePlant.ok'],
                confirmButtonColor: colors['action-button'],
                background: colors['main-secondary-color'],
              })
            });
          }
        })
      });
  }

  async sharePlant(): Promise<void> {
    try {
      await navigator.clipboard.writeText(`${host.hostname}/share/plant?plantId=${this.plant.id}`);

      this.tooltip.open();

      setTimeout((): void => {
        this.tooltip.close();
      }, 3000);

    } catch (err) {
      console.error('Błąd podczas kopiowania linku: ', err);
    }
  }

  protected readonly plantConditions: PlantCondition[] = Object.values(PlantCondition);
  protected readonly plantSoil: PlantSoil[] = Object.values(PlantSoil);
  protected readonly plantWatering: PlantWatering[] = Object.values(PlantWatering);
  protected readonly plantBerth: PlantBerth[] = Object.values(PlantBerth);
  protected readonly plantToxicity: PlantToxicity[] = Object.values(PlantToxicity);
  protected readonly plantLifeExpectancy: PlantLifeExpectancy[] = Object.values(PlantLifeExpectancy);


}
