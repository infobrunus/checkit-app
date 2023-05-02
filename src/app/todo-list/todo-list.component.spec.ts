import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ItemService } from '../shared/item.service';
import { TodoListComponent } from './todo-list.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let itemService: ItemService;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoListComponent],
      imports: [BrowserAnimationsModule],
      providers: [ItemService, MatSnackBar],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    itemService = TestBed.inject(ItemService);
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getItems on ngOnInit', async () => {
    spyOn(component, 'getItems');
    await component.ngOnInit();
    expect(component.getItems).toHaveBeenCalled();
  });

  it('should apply filter and update items list', async () => {
    spyOn(component, 'getItems');
    await component.applyFilter('all');
    expect(component.activeFilter).toEqual('all');
    expect(component.getItems).toHaveBeenCalled();
  });

  // Add more tests for other component methods
});
