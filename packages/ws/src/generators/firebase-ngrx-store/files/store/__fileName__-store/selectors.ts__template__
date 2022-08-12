import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { State, featureAdapter } from './state';
import { <%=className%>Model } from '@<%= domainProject %>';
import { Dictionary } from '@ngrx/entity';
import { defaultIfEmpty } from '@ngserveio/utilities';

export const selectFeatureState: MemoizedSelector<object, State> = createFeatureSelector<State>('<%= domain %>.entities.<%= fileName %>');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = featureAdapter.getSelectors(selectFeatureState);

export const isLoading = createSelector(
  selectFeatureState,
  (state: State) => state.loading
);

export const selectModelById = (id: string) => createSelector(
  selectEntities,
  (entities: Dictionary<<%=className%>Model>) => defaultIfEmpty<<%=className%>Model>(entities, id)
);
