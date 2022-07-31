import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction
} from '@angular/fire/compat/firestore';
import { <%=className%>Model } from '@<%=domain%>/common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf, from } from 'rxjs';
import { catchError, concatMap, map, mergeMap } from 'rxjs/operators';
import * as <%=className%>Actions from './actions';
import { covertPartialToDotPathKeys } from '@ngserveio/utilities';

@Injectable()
export class <%=className%>Effects {
  private collection: AngularFirestoreCollection = this.afs.collection<<%=className%>Model>('<%=name%>');

  constructor(private afs: AngularFirestore,
              private actions$: Actions) { }
  
  public query<%=className%>sEffect$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<<%=className%>Actions.Query<%=className%>sAction>(<%=className%>Actions.ActionTypes.QUERY_<%=constantName%>S),
    concatMap(() => {
      return this.collection.stateChanges().pipe(
        mergeMap(actions => actions as DocumentChangeAction<<%=className%>Model>[]),
        map(action => {
          return {
            type: `[<%=className%>] ${action.type}`, // action.type = 'added' | 'modified' | 'removed'
            payload: {
              id: action.payload.doc.id,
              ...action.payload.doc.data(),
            } as <%=className%>Model
          } as Action;
        })
        // catchError(err => observableOf(new NotificationActions.AddErrorNotificationAction({ message: err })))
      );
    }))
  );

  public create<%=className%>Action$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<<%=className%>Actions.Create<%=className%>Action>(<%=className%>Actions.ActionTypes.CREATE_<%=constantName%>),
    concatMap(({ payload }) => {
      return from(this.collection.add(payload)).pipe(
        concatMap(() => [
          new <%=className%>Actions.Create<%=className%>SuccessAction()
        ] as Action[]), 
        // catchError(err => [
        //   new NotificationActions.AddErrorNotificationAction(err),
        //   new <%=className%>Actions.RequestFailureAction()
        // ] as Action[])
      );
    })
  ));

  public patch<%=className%>Action$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<<%=className%>Actions.Patch<%=className%>Action>(<%=className%>Actions.ActionTypes.PATCH_<%=constantName%>),
    mergeMap(({ payload }) => {
      const patchUpdates = covertPartialToDotPathKeys(payload.model);
      return from(
        this.afs.doc(`<%=name%>/${payload.id}`).update(patchUpdates)
      ).pipe(
        concatMap(() => [
          new <%=className%>Actions.Patch<%=className%>SuccessAction(),
        ] as Action[]),
        // catchError(err => [
        //   new NotificationActions.AddErrorNotificationAction(err),
        //   new <%=className%>Actions.RequestFailureAction()
        // ] as Action[])
      );
    })
  ));
}
