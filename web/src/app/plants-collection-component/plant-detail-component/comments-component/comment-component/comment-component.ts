import {Component, Input, OnInit} from '@angular/core';
import {PlantComment} from '../../../../Interfaces/Plants/plantComment';
import {DatePipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {AuthService} from '../../../../auth/auth-service';

@Component({
  selector: 'app-comment-component',
  imports: [
    TranslatePipe,
    DatePipe
  ],
  templateUrl: './comment-component.html',
  styleUrls: ['./comment-component.css', '../../../../shared/Card.css']
})
export class CommentComponent implements OnInit {
  @Input() plantComment!: PlantComment;
  protected avatarPath!: string;

  constructor(protected authService: AuthService,) {
  }

  ngOnInit(): void {
    this.avatarPath = this.authService.avatarPath(this.plantComment.user);
  }

  editComment() {

  }

  removeComment() {

  }
}
