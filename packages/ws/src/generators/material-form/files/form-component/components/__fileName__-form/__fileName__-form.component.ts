import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
<% if (formControls.some(f => f.type === 'dd' || f.type === 'r')) {%>import { StringOrNumber } from '@ngserveio/utilities';<%}%>
import { ModeledFormGroup } from '@ngserveio/form-services';
import { <%=className%>Model, <%=propertyName%>Validator } from '<%=commonProjectImportPath%>';

@Component({
  selector: '<%=selector%>-<%=name%>-form',
  templateUrl: './<%=fileName%>-form.component.html',
  styleUrls: ['./<%=fileName%>-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class <%=className%>FormComponent {
  public <%=propertyName%>Form = new ModeledFormGroup<<%=className%>Model>({
    <% for(let i = 0; i < formControls.length; i++) { %>
      <%=formControls[i].inputName%>: new FormControl(null),<% } %>
  }, <%=propertyName%>Validator);

  <% for (const formControl of formControls.filter(f => f.type === 'dd' || f.type === 'r')) {%>
  public <%=formControl.inputName%>Options: { value: StringOrNumber, label: StringOrNumber }[] = [
    { label: 'Test Label', value: 'Test 1' }
  ];
  <%}%>

  public cancelHandler(): void {
    console.log('Cancelling');
  }
<% for (let i = 0; i < formControls.length; i++) { %>
  public get <%=formControls[i].inputName%>(): FormControl {
    return this.<%=propertyName%>Form.get('<%=formControls[i].inputName%>') as FormControl;
  }<% } %>
}
