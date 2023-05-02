import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { Item } from '../shared/item-interface';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { TodoItemComponent } from './todo-item.component';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      declarations: [TodoItemComponent],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    component.item = { id: 1, title: 'Test Item', checked: false };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit update event when saveItem is called', async(() => {
    const updateSpy = spyOn(component.update, 'emit');
    component.saveItem();
    fixture.whenStable().then(() => {
      expect(updateSpy).toHaveBeenCalledWith(component.item);
    });
  }));

  it('should emit checked event when itemChecked is called', async(() => {
    const checkedSpy = spyOn(component.checked, 'emit');
    component.item.checked = true;
    component.itemChecked();
    fixture.whenStable().then(() => {
      expect(checkedSpy).toHaveBeenCalledWith(component.item.checked);
    });
  }));

  it('should emit delete event when deleteItem is called', async(() => {
    const deleteSpy = spyOn(component.delete, 'emit');
    component.deleteItem();
    fixture.whenStable().then(() => {
      expect(deleteSpy).toHaveBeenCalledWith(component.item.id);
    });
  }));

  it('should open confirmation dialog when openConfirmationDialog is called', async(() => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(true) } as any);
    component.openConfirmationDialog();
    fixture.whenStable().then(() => {
      expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmationDialogComponent);
    });
  }));

});
