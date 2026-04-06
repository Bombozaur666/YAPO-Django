import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {Note} from '../../../Interfaces/Plants/note';
import {NoteComponent} from './note/note-component';
import {NgbModal, NgbModalRef, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {AddNotesComponent} from './add-note-component/add-note-component';
import {PlantsCollectionService} from '../../plants-collection-service';
import {SlicePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import Swal from 'sweetalert2';
import {colors} from '../../../shared/setup/colors';

@Component({
  selector: 'app-notes-component',
  imports: [
    TranslatePipe,
    NoteComponent,
    NgbPagination,
    SlicePipe,
    FormsModule
  ],
  templateUrl: './notes-component.html',
  styleUrls: ['./notes-component.css', '../../../shared/Card.css']
})
export class NotesComponent {
  protected page: number = 1;
  protected pageSize: number = 5;
  @Input() plantId!: number;
  @Input() notes!: Note[];
  @Output() notesChanged: EventEmitter<Note[]> = new EventEmitter<Note[]>();

  constructor(private plantsCollectionService: PlantsCollectionService,
              private modalService: NgbModal,
              private translate: TranslateService) {}

  addNote(): void {
    const modalRef: NgbModalRef = this.modalService.open(AddNotesComponent);

    modalRef.result.then(
      (result: Note): void => {
        this.plantsCollectionService.addNote(this.plantId, result).subscribe({
          next: (data: Note): void => {
            this.notes.push(data);
            this.notesChanged.emit(this.notes);
          },
          error: (): void => {
            this.translate.get([
              'alerts.addNote.failureTitle',
              'alerts.addNote.failureText',
              'alerts.addNote.ok',
            ]).subscribe(translations => {
              Swal.fire({
                title: translations['alerts.addNote.failureTitle'],
                text: translations['alerts.addNote.failureText'],
                icon: "error",
                confirmButtonText: translations['alerts.addNote.ok'],
                confirmButtonColor: colors['action-button'],
                background: colors['main-secondary-color'],
              })
            });
          }
        });
      }
    );
  }

  onNoteChange(note: Note): void {
    this.plantsCollectionService.editNote(this.plantId, note).subscribe({
      next: (data: Note): void => {
        this.notes = this.notes.map((_note: Note): Note =>
          _note.id === note.id
            ? data
            :  _note
        );
        this.notesChanged.emit(this.notes);
      },
      error: (): void => {
        this.translate.get([
          'alerts.changeNote.failureTitle',
          'alerts.changeNote.failureText',
          'alerts.changeNote.ok',
        ]).subscribe(translations => {
          Swal.fire({
            title: translations['alerts.changeNote.failureTitle'],
            text: translations['alerts.changeNote.failureText'],
            icon: "error",
            confirmButtonText: translations['alerts.changeNote.ok'],
            confirmButtonColor: colors['action-button'],
            background: colors['main-secondary-color'],
          })
        });
      }
    });
  }

  onNoteDelete(note: Note): void {
    this.plantsCollectionService.deleteNote(this.plantId, note).subscribe({
      next: (): void => {
        this.notes = this.notes.filter((_note: Note): boolean =>
          _note.id !== note.id
        );
        this.notesChanged.emit(this.notes);

        this.translate.get([
          'alerts.noteDelete.successTitle',
          'alerts.noteDelete.successText',
          'alerts.noteDelete.ok',
        ]).subscribe(translations => {
          Swal.fire({
            title: translations['alerts.noteDelete.successTitle'],
            text: translations['alerts.noteDelete.successText'],
            icon: "success",
            confirmButtonText: translations['alerts.noteDelete.ok'],
            confirmButtonColor: colors['action-button'],
            background: colors['main-secondary-color'],
          })
        });
      },
      error: (): void => {
        this.translate.get([
          'alerts.noteDelete.failureSuccess',
          'alerts.noteDelete.failureText',
          'alerts.noteDelete.ok',
        ]).subscribe(translations => {
          Swal.fire({
            title: translations['alerts.noteDelete.failureSuccess'],
            text: translations['alerts.noteDelete.failureText'],
            icon: "error",
            confirmButtonText: translations['alerts.noteDelete.ok'],
            confirmButtonColor: colors['action-button'],
            background: colors['main-secondary-color'],
          })
        });
      }
    });
  }
}
