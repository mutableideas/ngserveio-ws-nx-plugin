import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { featureReducer } from './reducer';
import { <%=className%>Effects } from './effects';

@NgModule({
  imports: [
    StoreModule.forFeature('<%= domain %>.entities.<%=fileName%>', featureReducer),
    EffectsModule.forFeature([ <%=className%>Effects ])
  ]
})
export class <%=className%>StoreModule { }