import {Component, Input} from '@angular/core';
import {CommentComponent} from './comment-component/comment-component';
import {PlantComment} from '../../../Interfaces/Plants/plantComment';
import {TranslatePipe} from '@ngx-translate/core';
import {AuthService} from '../../../auth/auth-service';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {UpdateFieldComponent} from '../main-body-component/update-field-component/update-field-component';
import {UpdateField} from '../../../Interfaces/update-field';
import {PlantsCollectionService} from '../../plants-collection-service';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-comments-component',
  imports: [
    CommentComponent,
    TranslatePipe,
  ],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css', '../../../shared/Card.css']
})
export class CommentsComponent  {
  @Input() plantComments: PlantComment[] = [] as PlantComment[];
  @Input() plantId!: number;

  constructor(private authService: AuthService,
              private cookieService: CookieService,
              private modalService: NgbModal,
              private router: Router,
              private plantsCollectionService: PlantsCollectionService) {}

  addComment(): void {
    if (this.authService.isAuthenticated) {
      const modalRef: NgbModalRef = this.modalService.open(UpdateFieldComponent);

      modalRef.componentInstance.title = "Nowy komantarz";
      modalRef.componentInstance.saveText = "dodaj";
      modalRef.componentInstance.typeData = 'textarea';
      modalRef.componentInstance.updateField = {fieldName: 'komentarz'};

      modalRef.result.then(
        (result: UpdateField): void => {
          this.plantsCollectionService.addComment(this.plantId, result.fieldValue).subscribe(
            {
              next: (data: PlantComment): void => {
                this.plantComments = [...this.plantComments, data];
              },
              error: (): void => {}
            }
          );
        });
    } else {
      this.cookieService.set('oldUrl', this.router.url);
      this.router.navigate(['/user/login'])
    }
  }
}
