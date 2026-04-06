import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Note} from '../../../../Interfaces/Plants/note';
import {CommonModule, DatePipe} from '@angular/common';
import {NgbModal, NgbModalRef, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {AddNotesComponent} from '../add-note-component/add-note-component';
import Swal from 'sweetalert2';
import {colors} from '../../../../shared/setup/colors';

@Component({
  selector: 'tr[app-note-component]',
  imports: [DatePipe, CommonModule, NgbTooltip, TranslatePipe],
  templateUrl: './note-component.html',
  styleUrls: ['./note-component.css', '../../../../shared/Card.css'],
  host: { class: 'table-row' },
  hostDirectives: [],
})
export class NoteComponent {
  @Input() note!: Note;
  @Output()  noteChanged: EventEmitter<Note> = new EventEmitter<Note>();
  @Output() noteDelete: EventEmitter<Note> = new EventEmitter<Note>();
  constructor(private modalService: NgbModal,
              private translate: TranslateService) {}

  editNote(): void {
    const modalRef: NgbModalRef = this.modalService.open(AddNotesComponent);

    modalRef.componentInstance.note = this.note;

    modalRef.result.then((result: Note): void => {this.noteChanged.emit(result)});
  }

  deleteNote():void {
    this.translate.get([
      'alerts.noteDelete.title',
      'alerts.noteDelete.text',
      'alerts.noteDelete.confirmButton',
      'alerts.noteDelete.cancelButton',
    ]).subscribe(translations => {
      Swal.fire({
        title: translations['alerts.noteDelete.title'],
        text: translations['alerts.noteDelete.text'],
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: translations['alerts.noteDelete.confirmButton'],
        cancelButtonText: translations['alerts.noteDelete.cancelButton'],
        cancelButtonColor: colors['cancel-button'],
        confirmButtonColor: colors['action-button'],
        background: colors['main-secondary-color'],
      }).then((result): void => {
        if (result.isConfirmed) {
          this.noteDelete.emit(this.note);
        }
      });
    });
  }
}
