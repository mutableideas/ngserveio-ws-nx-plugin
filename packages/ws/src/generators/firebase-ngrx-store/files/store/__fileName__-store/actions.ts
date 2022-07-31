import { Action } from '@ngrx/store';
import { <%=className%>Model } from '@<%= domainProject %>';

export enum ActionTypes {
  ADDED_<%=constantName%> = '[<%=className%>] added',
  QUERY_<%=constantName%>S = '[<%=className%>] query',
  MODIFIED_<%=constantName%> = '[<%=className%>] modified',
  REMOVED_<%=constantName%> = '[<%=className%>] removed',
  CLEAR_CACHE = '[<%=className%>] Clear Cache',
  CREATE_<%=constantName%> = '[<%=className%>] CREATE_<%=constantName%>',
  CREATE_<%=constantName%>_SUCCESS = '[<%=className%>] CREATE_<%=constantName%>_SUCCESS',
  PATCH_<%=constantName%> = '[<%=className%>] PATCH_<%=constantName%>',
  PATCH_<%=constantName%>_SUCCESS = '[<%=className%>] PATCH_<%=constantName%>_SUCCESS',
  REQUEST_FAILURE = '[<%=className%>] REQUEST_FAILURE'
}

export class Added<%=className%>Action implements Action {
  readonly type = ActionTypes.ADDED_<%=constantName%>;
  constructor(public payload: <%=className%>Model) { }
}

export class Query<%=className%>sAction implements Action {
  readonly type = ActionTypes.QUERY_<%=constantName%>S;
}

export class Update<%=className%>Action implements Action {
  readonly type = ActionTypes.MODIFIED_<%=constantName%>;
  constructor(public payload: <%=className%>Model) { }
}

export class Removed<%=className%>Action implements Action {
  readonly type = ActionTypes.REMOVED_<%=constantName%>;
  constructor(public payload: <%=className%>Model) { }
}

export class ClearCacheAction implements Action {
  public readonly type = ActionTypes.CLEAR_CACHE;
}

export class Create<%=className%>Action implements Action {
  public readonly type = ActionTypes.CREATE_<%=constantName%>;
  constructor(public payload: <%=className%>Model) { }
}

export class Create<%=className%>SuccessAction implements Action {
  public readonly type = ActionTypes.CREATE_<%=constantName%>_SUCCESS;
}

export class Patch<%=className%>Action implements Action {
  public readonly type = ActionTypes.PATCH_<%=constantName%>;
  constructor(public payload: { id: string, model: Partial<<%=className%>Model> }) { }
}

export class Patch<%=className%>SuccessAction implements Action {
  public readonly type = ActionTypes.PATCH_<%=constantName%>_SUCCESS;
}

export class RequestFailureAction implements Action {
  public readonly type = ActionTypes.REQUEST_FAILURE;
}

export type Actions = Added<%=className%>Action
  | ClearCacheAction
  | Create<%=className%>Action
  | Create<%=className%>SuccessAction
  | Update<%=className%>Action
  | Patch<%=className%>Action
  | Patch<%=className%>SuccessAction
  | Query<%=className%>sAction
  | Removed<%=className%>Action
  | RequestFailureAction;
