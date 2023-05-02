import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Item } from './item-interface';

@Injectable({
  providedIn: 'root'
})

export class ItemService {
  items: Item[] = JSON.parse(localStorage.getItem('items') as string) || [
    { id: 1, title: 'Task default :)', checked: false, priority: false },
  ];
  lastId = this.items.length ? this.items[this.items.length - 1].id : 0;

  constructor(private snackBar: MatSnackBar) { }

  async getItems(): Promise<Item[]> {
    return this.items;
  }

  async addItem(item: Item): Promise<Item[]> {
    item.id = ++this.lastId;
    this.items.push(item);
    await this.saveItems();
    return this.items;
  }

  async updateItem(item: Item): Promise<Item[]> {
    const index = this.items.findIndex(t => t.id === item.id);
    this.items[index] = item;
    await this.saveItems();
    return this.items;
  }

  async deleteItem(id: number): Promise<Item[]> {
    this.items = this.items.filter(t => t.id !== id);
    await this.saveItems();
    return this.items;
  }

  private async saveItems(): Promise<void> {
    localStorage.setItem('items', JSON.stringify(this.items));
  }

  vibrate() {
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  }

  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 1500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
