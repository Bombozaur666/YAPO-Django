import {Component, Input} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {PlantUpdate} from '../../../../Interfaces/Plants/plant-update';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'tr[app-update-component]',
  imports: [
    TranslatePipe,
    DatePipe
  ],
  templateUrl: './update-component.html',
  styleUrls: ['./update-component.css', '../../../../shared/Card.css']
})
export class UpdateComponent {
  @Input() update!: PlantUpdate;

  protected dateFields: string[] = ['purchaseDate', 'fertilizationDate', 'wateringDate', 'creationDate'];
  protected choiceFields: string[] = ['plantCondition', 'plantSoil', 'plantWatering', 'plantBerth', 'plantToxicity', 'plantLifeExpectancy'];
  protected boolFields: string[] = ['alive', 'shared'];
}
