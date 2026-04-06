import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ShareService} from '../share.service';
import {Plant} from '../../Interfaces/Plants/plant';
import Swal from 'sweetalert2';
import {colors} from '../../shared/setup/colors';
import {MainBodyComponent} from '../../plants-collection-component/plant-detail-component/main-body-component/main-body-component';
import {
  CommentsComponent
} from '../../plants-collection-component/plant-detail-component/comments-component/comments.component';
import {
  PhotoGalleryComponent
} from '../../plants-collection-component/plant-detail-component/photo-gallery-component/photo-gallery-component';

@Component({
  selector: 'app-share-component',
  imports: [
    TranslatePipe,
    MainBodyComponent,
    CommentsComponent,
    PhotoGalleryComponent
  ],
  templateUrl: './share-plant.component.html',
  styleUrl: './share-plant.component.css'
})
export class SharePlantComponent implements OnInit{
  protected plant!: Plant;

  protected loading: boolean = true;

  constructor(private route: ActivatedRoute,
              private shareService: ShareService,
              private translate: TranslateService) {}

  ngOnInit(): void {
    let plantId = this.route.snapshot.queryParamMap.get('plantId');

    this.shareService.getPlant(plantId).subscribe({
      next: (data: Plant): void => {
        this.plant = data;
        this.loading = false;
      },
      error: ():void => {
        this.loading = false;
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
            background: colors['main-secondary-color'],
          })
        });
      }
    });
  }
}
