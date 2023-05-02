import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Item } from '../shared/item-interface';
import { ItemService } from '../shared/item.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit {
  @Input() item: Item;
  @Output() update = new EventEmitter<Item>();
  @Output() delete = new EventEmitter<number>();
  @Output() cancelAllEditing = new EventEmitter<number>();
  @Output() editStart = new EventEmitter<number>();
  @Output() checked = new EventEmitter<boolean>();
  @Output() priority = new EventEmitter<Item>();

  isEditing = false;
  originalTitle = '';

  @ViewChild('editInput', { static: false }) editInput!: ElementRef;

  constructor(private dialog: MatDialog, private itemService: ItemService) {
    this.item = { id: 0, title: '', checked: false, priority: false };
  }

  ngOnInit(): void { }

  async saveItem(): Promise<void> {
    this.itemService.vibrate();
    this.isEditing = false;
    this.update.emit(this.item);
    this.itemService.openSnackBar('Item saved');
  }

  async saveItemOnEnter(): Promise<void> {
    if (this.item.title.trim() !== '') {
      await this.saveItem();
    }
  }

  async editItem(): Promise<void> {
    this.editStart.emit(this.item.id);
    this.originalTitle = this.item.title;
    this.isEditing = true;
    setTimeout(() => this.editInput.nativeElement.focus(), 0);
  }

  isTitleEmpty(): boolean {
    return this.item.title.trim() === '';
  }

  async cancelEdit(): Promise<void> {
    this.item.title = this.originalTitle;
    this.isEditing = false;
  }
  
  async itemChecked(): Promise<void> {
    this.itemService.vibrate();
    this.update.emit(this.item);
    this.checked.emit(this.item.checked);
  }

  async deleteItem(): Promise<void> {
    this.delete.emit(this.item.id);
    this.itemService.openSnackBar('Item deleted');
  }

  async openConfirmationDialog(): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
  
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) await this.deleteItem();
    });
  }

  async togglePriority(): Promise<void> {
    this.priority.emit(this.item);
  }

}
