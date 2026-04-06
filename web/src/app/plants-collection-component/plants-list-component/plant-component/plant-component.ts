import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Plant} from '../../../Interfaces/Plants/plant';
import {PlantsCollectionService} from '../../plants-collection-service';
import {TranslatePipe} from '@ngx-translate/core';


@Component({
  selector: 'app-plant-component',
  imports: [
    TranslatePipe
  ],
  templateUrl: './plant-component.html',
  styleUrl: './plant-component.css'
})
export class PlantComponent {
  @Input() plant!: Plant;
  @Input() selectedPlant: number = 0;
  @Output() plantsChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private plantCollectionService: PlantsCollectionService) {
  }
  selectPlant():void {this.plantsChange.emit(this.plant.id)}

  get avatarPath(): string {return this.plantCollectionService.avatarPath(this.plant);}
}
