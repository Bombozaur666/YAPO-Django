import {Component, OnInit} from '@angular/core';
import {User} from '../../Interfaces/Users/user';
import {AuthService} from '../auth-service';
import {DatePipe} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {UploadImageDialogComponent} from '../../shared/upload-image-dialog-component/upload-image-dialog-component';
import {NgbModal, NgbModalModule, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {colors} from '../../shared/setup/colors';

@Component({
  selector: 'app-profile-component',
  imports: [
    DatePipe,
    TranslatePipe,
    NgbModalModule
  ],
  templateUrl: './profile-component.html',
  styleUrls: ['./profile-component.css', '../../shared/Card.css']
})
export class ProfileComponent implements OnInit {
  protected user!: User;
  protected avatarUrl!: string;

  constructor(private authService: AuthService,
              private modalService: NgbModal,
              private translate: TranslateService) {}

  ngOnInit(): void {
    this.authService.userProfile().subscribe({
        next: (data: User): void => {
          this.user = data;
          this.avatarUrl = this.authService.avatarPath(data);
          this.authService.setUser(data);
          },
        error: (): void => {
          this.translate.get([
            'alerts.dataFetching.failureTitle',
            'alerts.dataFetching.failureText',
            'alerts.dataFetching.ok',
          ]).subscribe(translations => {
            Swal.fire({
              title: translations['alerts.dataFetching.failureTitle'],
              text: translations['alerts.dataFetching.failureText'],
              icon: "error",
              confirmButtonText: translations['alerts.dataFetching.ok'],
              confirmButtonColor: colors['action-button'],
              background: colors['main-secondary-color']
            })
          });
        }
      }
    );
  }

  onAvatarUploaded(file: File): void {
    this.authService.avatarUpload(file).subscribe({
      next: (data: User): void => {
        this.user = data;
        this.avatarUrl = this.authService.avatarPath(data);},
    })
  }

  onAvatarEdit(): void {
    const modalRef: NgbModalRef = this.modalService.open(UploadImageDialogComponent);
    modalRef.componentInstance.circled = true;
    modalRef.componentInstance.modalTitle = 'profile.settings.editAvatarTitle';

    modalRef.result.then(
      (result: File): void => {this.onAvatarUploaded(result);}
    );
  }
}
