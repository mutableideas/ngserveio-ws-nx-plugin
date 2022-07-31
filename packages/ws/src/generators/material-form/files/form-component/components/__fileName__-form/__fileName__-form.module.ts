import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
<% if (controlTypes.has('t')) {%>import { MatInputModule } from '@angular/material/input';<%}%>
<% if (controlTypes.has('dd')) {%>import { MatSelectModule } from '@angular/material/select';<%}%>
<% if (controlTypes.has('c')) {%>import { MatCheckboxModule } from '@angular/material/checkbox';<%}%>
<% if (controlTypes.has('r')) {%>import { MatRadioModule } from '@angular/material/radio';<%}%>
import { NgServeMaterialFormsModule } from '@ngserveio/forms';
import { <%=className%>FormComponent } from './<%=fileName%>-form.component';


@NgModule({
  declarations: [<%=className%>FormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    <% if (controlTypes.has('t')) {%>MatInputModule,<%}%>
    <% if (controlTypes.has('dd')) {%>MatSelectModule,<%}%>
    <% if (controlTypes.has('c')) {%>MatCheckboxModule,<%}%>
    <% if (controlTypes.has('r')) {%>MatRadioModule,<%}%>
    NgServeMaterialFormsModule
  ],
  exports: [
    <%=className%>FormComponent
  ]
})
export class <%=className%>FormComponentModule {}