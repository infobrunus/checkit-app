import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { fadeInOut } from '../shared/animations';
import { Item } from '../shared/item-interface';
import { ItemService } from '../shared/item.service';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  animations: [fadeInOut]
})
export class TodoListComponent implements OnInit {
  items: Item[] = [];
  filteredItems: Item[] = [];

  newItemTitle = '';
  activeFilter = 'pendings';

  @ViewChildren(TodoItemComponent) todoItems!: QueryList<TodoItemComponent>;

  constructor(private itemService: ItemService) { }

  async ngOnInit(): Promise<void> {
    this.getItems();
    this.filteredItems = this.items;
  }

  async applyFilter(filter: string): Promise<void> {
    this.activeFilter = filter;
    this.getItems();
  }

  async getItems(): Promise<void> {
    const allItems = await this.itemService.getItems();
    this.items = allItems.sort((a, b) => {
      if (a.priority && !b.priority) {
        return -1;
      } else if (!a.priority && b.priority) {
        return 1;
      } else {
        return 0;
      }
    }).filter(item => {
      if (this.activeFilter === 'all') {
        return true;
      } else if (this.activeFilter === 'pendings') {
        return !item.checked;
      } else if (this.activeFilter === 'checked') {
        return item.checked;
      }
      return false;
    });
  }

  async onSearchChange(searchTerm: string): Promise<void> {
    if (!searchTerm.trim()) {
      this.filteredItems = this.items;
      return;
    }
    this.filteredItems = this.items.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  async addItem(title: string): Promise<void> {
    if (title.trim() === '') { return; }

    this.itemService.vibrate();
    const newItem: Item = { id: 0, title, checked: false, priority: false };
    this.items = await this.itemService.addItem(newItem);
    this.itemService.openSnackBar('Item added');
    this.getItems();
  }

  async updateItem(todo: Item): Promise<void> {
    await this.itemService.updateItem(todo);
    this.getItems();
  }

  async setPriority(item: Item): Promise<void> {
    const index = this.items.indexOf(item);
    this.items.splice(index, 1);

    if (!item.priority) {
      item.priority = true;
      this.items.unshift(item);
    } else {
      item.priority = false;
      const priorityItems = this.items.filter(i => i.priority);
      if (priorityItems.length > 0) {
        const lastPriorityItemIndex = this.items.indexOf(priorityItems[priorityItems.length - 1]);
        this.items.splice(lastPriorityItemIndex + 1, 0, item);
      } else {
        this.items.push(item);
      }
    }

    this.itemService.openSnackBar(item.priority ? 'Item marked as priority' : 'Item unmarked as priority');
    await this.itemService.updateItem(item);
  }

  async deleteItem(id: number): Promise<void> {
    this.items = await this.itemService.deleteItem(id);
    this.getItems();
  }

  cancelAllEditing(editingItemId: number): void {
    this.todoItems
      .toArray()
      .filter(
        (itemComponent) =>
          itemComponent.item.id !== editingItemId && itemComponent.isEditing
      )
      .forEach((itemComponent) => itemComponent.cancelEdit());
  }

  openCheckedSnackbar(checked: boolean): void {
    this.itemService.openSnackBar(checked ? 'Item checked :)' : 'Item unchecked');
  }

}
