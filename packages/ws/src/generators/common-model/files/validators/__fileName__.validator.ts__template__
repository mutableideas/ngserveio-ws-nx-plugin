import { emptyOrWhiteSpace, propertyValidators, required, validate } from '@ngserveio/you-good';
import { <%=className %>Model } from "../models/<%=fileName%>.model";

export const <%=propertyName%>Validator = validate<<%=className %>Model>({
  <% for(const formControl of formControls) {%>
  <%=formControl.inputName%>: propertyValidators(p => p.<%=formControl.inputName%>, [ required, emptyOrWhiteSpace ]),<%}%>
});