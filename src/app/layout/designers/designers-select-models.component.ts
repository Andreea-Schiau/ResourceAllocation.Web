import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { HttpService } from 'src/app/shared/services/http-service';
import { Router, ActivatedRoute} from '@angular/router';
import { FormControl, FormArray, Form } from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-designers-select-models',
    templateUrl: './designers-select-models.component.html',
    styleUrls: ['./designers-select-models.component.scss'],
    animations: [routerTransition()]
})
export class DesignersSelectModelsComponent implements OnInit {
    form: any;
    formBuilder: any;

    constructor(public httpService: HttpService, public router: Router, private route: ActivatedRoute) {}

    public designer: any;
    public models: any;

    ngOnInit() {
        const designerId = this.route.snapshot.queryParamMap.get('designerId');

        this.httpService.getDesignerById(designerId).subscribe(result => {
            this.designer = result;

            this.httpService.getFashionModels().subscribe(result => {
                this.models = result;

                this.models.forEach(model => {
                    const foundItem = this.designer.favoriteArtists.find(x => x.artist.id === model.id);

                    if (foundItem !== undefined) {
                        model.isSelected = true;
                    } else {
                        model.isSelected = false;
                    }
                  });

            });
        });
    }

    saveFavoriteFashionModels() {

        const selectedModelsIds = [];

        this.models.forEach(model => {
            if (model.isSelected === true) {
                selectedModelsIds.push(model.id);
            }
          });

          console.log('set selected models ids');
          console.log(selectedModelsIds);

          this.designer.models = selectedModelsIds;

        this.httpService.setFavoriteArtists(this.designer.id, selectedModelsIds).subscribe(result => {
            this.router.navigate(['/designers']);
        });
    }
}
