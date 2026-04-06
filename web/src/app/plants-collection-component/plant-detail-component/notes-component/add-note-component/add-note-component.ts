import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {Note} from '../../../../Interfaces/Plants/note';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-add-note-component',
  imports: [
    TranslatePipe,
    FormsModule
  ],
  templateUrl: './add-note-component.html',
  styleUrls: ['./add-note-component.css', '../../../../shared/Card.css']
})
export class AddNotesComponent {
  @Output() addNote: EventEmitter<Note> = new EventEmitter();
  @Input() note: Note = {} as Note;

  constructor(public activeModal: NgbActiveModal) {}

  close(): void { this.activeModal.dismiss('user-cancel');}

  save(): void {this.activeModal.close(this.note);}
}
