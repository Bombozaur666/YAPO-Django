import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Plant} from '../../Interfaces/Plants/plant';
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {AddPlantComponent} from './add-plant-component/add-plant-component';
import {PlantsCollectionService} from '../plants-collection-service';
import {PlantComponent} from './plant-component/plant-component';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {colors} from '../../shared/setup/colors';

@Component({
  selector: 'app-plants-list-component',
  imports: [
    TranslatePipe,
    PlantComponent
  ],
  templateUrl: './plants-list-component.html',
  styleUrl: './plants-list-component.css'
})
export class PlantsListComponent {
  @Input() plants: Plant[] = [];
  selectedPlant: number = -1;
  @Output() plantsChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() createPlant: EventEmitter<Plant> = new EventEmitter<Plant>();
  @Input() localizationId: number | undefined = undefined;

  constructor(private plantCollectionService: PlantsCollectionService,
              private modalService: NgbModal,
              private translate: TranslateService) {
  }

  selectPlant(plantId: number): void {
    this.plantsChange.emit(plantId);
    this.selectedPlant = plantId;
  }

  onUploadPlant(plant: Plant): void {
    plant.localization = {
      ...plant.localization,
      id: this.localizationId!
    };
    this.plantCollectionService.createPlant(plant).subscribe(
      {
        next: (_plant: Plant):void => {
          this.createPlant.emit(_plant);
        },
        error: (): void => {
          this.translate.get([
            'alerts.uploadPlant.failureSuccess',
            'alerts.uploadPlant.failureText',
            'alerts.uploadPlant.ok',
          ]).subscribe(translations => {
            Swal.fire({
              title: translations['alerts.uploadPlant.failureSuccess'],
              text: translations['alerts.uploadPlant.failureText'],
              icon: "error",
              confirmButtonText: translations['alerts.uploadPlant.ok'],
              confirmButtonColor: colors['action-button'],
              background: colors['main-secondary-color'],
            })
          });
        }
      }
    )
  }

  addPlant(): void {
    const modalRef: NgbModalRef = this.modalService.open(AddPlantComponent, {size: 'lg'});

    modalRef.result.then((result: Plant): void => {this.onUploadPlant(result);}
    );
  }
}
