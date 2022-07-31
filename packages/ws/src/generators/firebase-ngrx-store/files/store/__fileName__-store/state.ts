import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { <%=className%>Model } from '@<%= domainProject %>';

export const featureAdapter: EntityAdapter<<%=className%>Model> = createEntityAdapter<<%=className%>Model>({
  selectId: model => model.id
});

export interface State extends EntityState<<%=className%>Model> {
  error?: any;
  loading: boolean;
}

export const initialState: State = featureAdapter.getInitialState({
  error: null,
  loading: false
});
