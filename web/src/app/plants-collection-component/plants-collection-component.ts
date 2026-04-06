import {Component, OnInit} from '@angular/core';
import {PlantsCollectionService} from './plants-collection-service';
import {Localization, LocalizationWithoutPlants} from '../Interfaces/Plants/localization';
import {Plant} from '../Interfaces/Plants/plant';
import {LocalizationsComponent} from './localizations-component/localizations-component';
import {PlantDetailComponent} from './plant-detail-component/plant-detail-component';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {PlantsListComponent} from './plants-list-component/plants-list-component';
import {Note} from '../Interfaces/Plants/note';
import Swal from 'sweetalert2';
import {colors} from '../shared/setup/colors';

@Component({
  selector: 'app-plants-collection-component',
  imports: [
    LocalizationsComponent,
    PlantsListComponent,
    PlantDetailComponent,
    TranslatePipe,
    PlantsListComponent
  ],
  templateUrl: './plants-collection-component.html',
  styleUrl: './plants-collection-component.css'
})
export class PlantsCollectionComponent implements OnInit {
  protected localizations: Localization[] = [];

  protected initialized: boolean = false;

  protected selectedPlant: number|null = null;
  protected selectedLocalization: number |null = null;

  protected localizationsWithoutPlants: LocalizationWithoutPlants[] = [];
  protected showPlants: Plant[] = [];
  protected plant: Plant = {} as Plant;

  constructor(private  plantsCollectionService: PlantsCollectionService,
              private translate: TranslateService) {}

  ngOnInit(): void {
    this.plantsCollectionService.locationsFetch().subscribe(
      {
        next: (data: Localization[]): void => {
          this.localizations = data;
          this.localizationsWithoutPlants = this.localizationList();
          this.initialized = true;
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
              background: colors['main-secondary-color'],
            })
          });
        }
      }
    );
  }

  selectPlant(id: number): void {
    this.selectedPlant = id;
    this.plant = {...this.showPlants.find((_plant: Plant): boolean => _plant.id === id)!};
  }

  localizationChange(id: number): void {
    this.selectedPlant = null;
    this.plant = {} as Plant;
    this.selectedLocalization = id;
    this.showPlants = this.preparePlants(id);
  }

  preparePlants(id : number): Plant[] {
    return this.localizations.find((_localization: Localization): boolean => _localization.id === id)!.plants;
  }

  localizationList(): LocalizationWithoutPlants[] {
    return this.localizations.map(({ plants, ...rest }: Localization) => rest);
  }

  localizationUpdateOrCreate(localization: Localization): void {
    const index: number = this.localizations.findIndex((_localization: Localization): boolean => _localization.id === localization.id);
    if (index === -1) {
      this.localizations = [...this.localizations, localization];
      this.localizationsWithoutPlants = this.localizationList();
    }
    else {
      this.localizations = this.localizations.map((_localization: Localization, _index: number): Localization =>
        _index === index ? localization : _localization
      );
      this.localizationsWithoutPlants = this.localizationList();
    }
  }

  createPlant(newPlant: Plant): void {
    const _localization = this.localizations.find((localizations: Localization): boolean => localizations.id === this.selectedLocalization);
    if (_localization) {
      if (!_localization.plants) {
        _localization.plants = [] as Plant[];
      }
      _localization.plants.push(newPlant);
    }

    this.showPlants = this.preparePlants(this.selectedLocalization!);
  }

  localizationRemove(localization: LocalizationWithoutPlants): void {
    this.localizations = this.localizations.filter((_localization: Localization): boolean => _localization.id !== localization.id);
    this.localizationsWithoutPlants = this.localizationList();
    this.selectedLocalization = null;
    this.showPlants = [];
    this.translate.get([
      'alerts.localizationDelete.successTitle',
      'alerts.localizationDelete.successText',
      'alerts.localizationDelete.ok',
    ]).subscribe(translations => {
      Swal.fire({
        title: translations['alerts.localizationDelete.successTitle'],
        text: translations['alerts.localizationDelete.successText'],
        icon: "success",
        confirmButtonText: translations['alerts.localizationDelete.ok'],
        confirmButtonColor: colors['action-button'],
        background: colors['main-secondary-color'],
      })
    });
  }

  onRemovePlant(plant: Plant): void {
    this.plantsCollectionService.removePlant(plant.id).subscribe({
      next: ():void => {
        this.localizations = this.localizations.map((_localization: Localization): Localization =>
          _localization.id === this.selectedLocalization!
            ? { ..._localization, plants: _localization.plants.filter((_plant: Plant): boolean => _plant.id !== plant.id) }
            : _localization
        );
        this.localizationsWithoutPlants = this.localizationList();
        this.showPlants =  this.preparePlants(this.selectedLocalization!);
        this.selectedPlant = null;

        this.translate.get([
          'alerts.deletePlant.successTitle',
          'alerts.deletePlant.successText',
          'alerts.deletePlant.ok',
        ]).subscribe(translations => {
          Swal.fire({
            title: translations['alerts.deletePlant.successTitle'],
            text: translations['alerts.deletePlant.successText'],
            icon: "success",
            confirmButtonText: translations['alerts.deletePlant.ok'],
            confirmButtonColor: colors['action-button'],
            background: colors['main-secondary-color'],
          })
        });
      },
      error: (): void => {
        this.translate.get([
          'alerts.deletePlant.failureSuccess',
          'alerts.deletePlant.failureText',
          'alerts.deletePlant.ok',
        ]).subscribe(translations => {
          Swal.fire({
            title: translations['alerts.deletePlant.failureSuccess'],
            text: translations['alerts.deletePlant.failureText'],
            icon: "error",
            confirmButtonText: translations['alerts.deletePlant.ok'],
            confirmButtonColor: colors['action-button'],
            background: colors['main-secondary-color'],
          })
        });
      }
    })
  }

  onPlantAvatarChange(plant: Plant): void {
    this.localizations = this.localizations.map(
      (_localization: Localization): Localization =>
        _localization.id === this.selectedLocalization!
          ? { ..._localization, plants: _localization.plants.map((_plant: Plant): Plant =>
              _plant.id === plant.id
                ? { ..._plant, avatarPath: plant.avatarPath }
                : _plant),
          }
          : _localization
    );
    this.showPlants = this.preparePlants(this.selectedLocalization!);
  }

  onNoteChange(notes: Note[]): void {
    this. localizations = this.localizations.map((_localization: Localization): Localization => {
      if (_localization.id === this.selectedLocalization) {
        return {
          ..._localization,
          plants: _localization.plants.map((_plant: Plant): Plant =>
            _plant.id === this.selectedPlant
              ? { ..._plant, notes: [...notes] }
              : _plant
          )
        };
      }
      return _localization;
    });
    this.showPlants = this.preparePlants(this.selectedLocalization!);
    this.localizationsWithoutPlants = this.localizationList();
  }

  onPlantUpdate(plant: Plant): void {
    this.localizations = this.localizations.map((_localization: Localization): Localization => {
      if (_localization.id !== this.selectedLocalization) return _localization;
      return {
        ..._localization,
        plants: _localization.plants.map((_plant: Plant): Plant =>
          _plant.id === this.selectedPlant ? { ...plant } : _plant
        )
      };
    });
    this.showPlants =  this.preparePlants(this.selectedLocalization!);
    this.plant = {...plant};
  }
}
