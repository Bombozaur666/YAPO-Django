import {Component, Input} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {PlantUpdate} from '../../../Interfaces/Plants/plant-update';import {UpdateComponent} from './update/update-component';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SlicePipe} from '@angular/common';

@Component({
  selector: 'app-updates-component',
  imports: [
    TranslatePipe,
    UpdateComponent,
    NgbPagination,
    ReactiveFormsModule,
    FormsModule,
    SlicePipe
  ],
  templateUrl: './updates-component.html',
  styleUrls: ['./updates-component.css', '../../../shared/Card.css']
})
export class UpdatesComponent {
  protected page: number = 1;
  protected pageSize: number = 5;
  @Input() updates!: PlantUpdate[];
}
