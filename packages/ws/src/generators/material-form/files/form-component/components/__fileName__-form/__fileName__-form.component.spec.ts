import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgServeMaterialFormsModule } from '@ngserveio/forms';

import { <%=className%>FormComponent } from './<%=fileName%>-form.component';

describe('<%=className%>FormComponent', () => {
  let component: <%=className%>FormComponent;
  let fixture: ComponentFixture<<%=className%>FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ <%=className%>FormComponent ],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        NgServeMaterialFormsModule,
        NoopAnimationsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(<%=className%>FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
