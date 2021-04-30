import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromTravelStatusActions from '@tms/actions/travel-status.actions';
import { AppState } from '@tms/reducers';
import { TravelsService } from '@tms/services';
import { map, mergeMap } from 'rxjs/operators';
import { TravelsViewService } from '../../views/pages/travels/travels-view/travels-view.service';

@Injectable()
export class TravelStatusEffects {
  @Effect()
  getTravelStatus = this.actions$.pipe(
    ofType<fromTravelStatusActions.GetTravelStatus>(fromTravelStatusActions.TravelStatusActionTypes.GetTravelStatus),
    mergeMap(() => {
      return this.travelsService.getTravelStatus();
    }),
    map((travelStatus) => new fromTravelStatusActions.StoreTravelStatus({ travelStatus }))
  );

  constructor(private actions$: Actions, private snackBar: MatSnackBar, private store: Store<AppState>, private travelsService: TravelsService, private travelsViewService: TravelsViewService) {}
}
