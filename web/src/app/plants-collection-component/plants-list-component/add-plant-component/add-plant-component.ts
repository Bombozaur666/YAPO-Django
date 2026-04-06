import {Component, Input} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslatePipe} from "@ngx-translate/core";
import {Plant} from '../../../Interfaces/Plants/plant';
import {PlantCondition} from '../../../Interfaces/Plants/enums/plantCondition';
import {PlantSoil} from '../../../Interfaces/Plants/enums/PlantSoil';
import {PlantWatering} from '../../../Interfaces/Plants/enums/PlantWatering';
import {PlantBerth} from '../../../Interfaces/Plants/enums/PlantBerth';
import {PlantToxicity} from '../../../Interfaces/Plants/enums/PlantToxicity';
import {PlantLifeExpectancy} from '../../../Interfaces/Plants/enums/PlantLifeExpectancy';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Note} from '../../../Interfaces/Plants/note';
import {PhotoGallery} from '../../../Interfaces/Plants/photo-gallery';
import {PlantUpdate} from '../../../Interfaces/Plants/plant-update';

@Component({
  selector: 'app-add-plant-component',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        TranslatePipe
    ],
  templateUrl: './add-plant-component.html',
  styleUrls: ['../../../shared/Card.css', './add-plant-component.css']
})
export class AddPlantComponent{
  @Input() plant: Plant = {"alive": true,
                          "notes": [] as Note[],
                          "photoGallery": [] as PhotoGallery[],
                          "plantHistory": [] as PlantUpdate[]} as Plant;

  constructor(public activeModal: NgbActiveModal) {}


  protected readonly plantConditions: PlantCondition[] = Object.values(PlantCondition);
  protected readonly plantSoil: PlantSoil[] = Object.values(PlantSoil);
  protected readonly plantWatering: PlantWatering[] = Object.values(PlantWatering);
  protected readonly plantBerth: PlantBerth[] = Object.values(PlantBerth);
  protected readonly plantToxicity: PlantToxicity[] = Object.values(PlantToxicity);
  protected readonly plantLifeExpectancy: PlantLifeExpectancy[] = Object.values(PlantLifeExpectancy);

  close():void {this.activeModal.dismiss('user-cancel');}

  save():void {this.activeModal.close(this.plant);}
}
