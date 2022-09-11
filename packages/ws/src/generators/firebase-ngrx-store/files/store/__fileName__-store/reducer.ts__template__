import { initialState, State, featureAdapter } from './state';
import { Actions, ActionTypes } from './actions';

const {
  ADDED_<%=constantName%>,
  CLEAR_CACHE,
  QUERY_<%=constantName%>S,
  MODIFIED_<%=constantName%>,
  REMOVED_<%=constantName%>,
  CREATE_<%=constantName%>,
  CREATE_<%=constantName%>_SUCCESS,
  PATCH_<%=constantName%>,
  PATCH_<%=constantName%>_SUCCESS,
  REQUEST_FAILURE
} = ActionTypes;

export function featureReducer(state: State = initialState, action: Actions) {
  switch (action.type) {
    case CREATE_<%=constantName%>:
    case PATCH_<%=constantName%>:
    case QUERY_<%=constantName%>S:
      return {
        ...state,
        loading: true
      };
    case ADDED_<%=constantName%>:
      return featureAdapter.addOne(action.payload, {
        ...state,
        loading: false
      });
    case MODIFIED_<%=constantName%>:
      return featureAdapter.updateOne({
        id: action.payload.id,
        changes: action.payload
      }, {
        ...state,
        loading: false
      });
    case REMOVED_<%=constantName%>:
      return featureAdapter.removeOne(action.payload.id, {
        ...state,
        loading: false
      });
    case REQUEST_FAILURE:
    case PATCH_<%=constantName%>_SUCCESS:
    case CREATE_<%=constantName%>_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case CLEAR_CACHE:
      return initialState;
    default:
      return state;
  }
};
