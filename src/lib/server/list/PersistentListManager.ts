import { type List, type Item } from './schema';
import { delList, getListByListId, getListsByUser } from '../database/db';
import type { int64 } from '@mysql/xdevapi/types/lib/Protocol/ScalarValues';


export class PersistentListManager {
    private userId: string;
    private storagePrefix: string;

    constructor(userId: string, storagePrefix: string = 'list') {
        this.userId = userId;
        this.storagePrefix = storagePrefix;
    }

    // Generate unique IDs
    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private getStorageKey(listDbid: string): string {
        return `${this.storagePrefix}:${this.userId}:${listDbid}`;
    }

    private getUserListsKey(): string {
        return `${this.storagePrefix}:${this.userId}:all`;
    }

    // Create a new list
    async createList(title?: string): Promise<List> {
        const list: List = {
            created: new Date(),
            dbid: this.generateId(),
            editable: true,
            id: Date.now(),
            items: [],
            owner: this.userId,
            title: title
        };

        await this.saveList(list);
        await this.addListToUserIndex(list.dbid);
        
        return list;
    }

    // Get all lists for the current user
    async getAllLists(userId:number): Promise<List[]> {
        try {
            // const indexKey = this.getUserListsKey();
            // const result = await window.storage.get(indexKey);
            const lists : List[] = await getListsByUser(userId) as unknown as List[];
            
            // if (!result) {
            //     return [];
            // }

            // const listDbids: string[] = JSON.parse(result.value);
            // const lists: List[] = [];

            // for (const dbid of listDbids) {
            //     const list = await this.getList(dbid);
            //     if (list) {
            //         lists.push(list);
            //     }
            // }

            return lists;
        } catch (error) {
            console.error('Error getting all lists:', error);
            return [];
        }
    }

    

    // Get a specific list
    async getList(listId: number, userId: number): Promise<List | null> {
        try {
            // const key = this.getStorageKey(listDbid);
            // const result = await window.storage.get(key);
            const lists : List[] = await getListByListId(listId, userId) as unknown as List[];
            
            // if (!result) {
            //     return null;
            // }

            // const list = JSON.parse(result.value);
            // // Convert date strings back to Date objects
            // list.created = new Date(list.created);
            // list.items = list.items.map((item: any) => ({
            //     ...item,
            //     created: new Date(item.created),
            //     due: new Date(item.due)
            // }));

            return lists[0];
        } catch (error) {
            console.error('Error getting list:', error);
            return null;
        }
    }

    // Update a list
    async updateList(list: List): Promise<boolean> {
        if (list.owner !== this.userId) {
            console.error('Cannot update list owned by another user');
            return false;
        }

        if (!list.editable) {
            console.error('List is not editable');
            return false;
        }

        return await this.saveList(list);
    }

    // Delete a list
    async deleteList(listDbid: number, userId: number): Promise<int64> {
        try {
            const list = await this.getList(listDbid, userId);
            
            if (!list) {
                console.error('List not found');
                return -1;
            }

            if (list.owner !== this.userId) {
                console.error('Cannot delete list owned by another user');
                return -1;
            }

            if (!list.editable) {
                console.error('List is not editable');
                return -1;
            }

            // const key = this.getStorageKey(listDbid);
            // await window.storage.delete(key);
            // await this.removeListFromUserIndex(listDbid);
            // const lists : List[] = await getListByListId(listId, userId) as unknown as List[];
            const result : int64 = await delList({owner: userId, id: listDbid});


            return result;
        } catch (error) {
            console.error('Error deleting list:', error);
            return -1;
        }
    }

    // Add an item to a list
    async addItem(listId: string, userId: number, itemData: Partial<Item>): Promise<Item | null> {
        try {
            // const list = await this.getList(listDbid);
            const lists : List[] = await getListByListId(listId, userId) as unknown as List[];

            
            if (!lists) {
                console.error('List not found');
                return null;
            }

            if (!lists[0].editable) {
                console.error('List is not editable');
                return null;
            }

            const item: Item = {
                created: new Date(),
                dbid: this.generateId(),
                due: itemData.due || new Date(),
                editable: itemData.editable !== undefined ? itemData.editable : true,
                flag: itemData.flag || 0,
                id: Date.now(),
                priority: itemData.priority || 0,
                sequence: list.items.length,
                status: itemData.status || 0,
                text: itemData.text || ''
            };

            lists[0].items.push(item);
            await this.saveList(lists[0]);

            return item;
        } catch (error) {
            console.error('Error adding item:', error);
            return null;
        }
    }

    // Update an item in a list
    async updateItem(listId: string, userId: number, itemDbid: string, updates: Partial<Item>): Promise<boolean> {
        try {
            // const list = await this.getList(listDbid);
            const lists : List[] = await getListByListId(listId, userId) as unknown as List[];
            
            if (!lists) {
                console.error('List not found');
                return false;
            }

            if (!lists[0].editable) {
                console.error('List is not editable');
                return false;
            }

            // const itemIndex = list.items.findIndex(item => item.dbid === itemDbid);
            const itemIndex = list.items.findIndex(item => item.dbid === itemDbid);
            
            if (itemIndex === -1) {
                console.error('Item not found');
                return false;
            }

            if (!list.items[itemIndex].editable) {
                console.error('Item is not editable');
                return false;
            }

            list.items[itemIndex] = {
                ...list.items[itemIndex],
                ...updates,
                dbid: itemDbid, // Preserve dbid
                created: list.items[itemIndex].created // Preserve created date
            };

            await this.saveList(list);
            return true;
        } catch (error) {
            console.error('Error updating item:', error);
            return false;
        }
    }

    // Delete an item from a list
    async deleteItem(listDbid: string, itemDbid: string): Promise<boolean> {
        try {
            const list = await this.getList(listDbid);
            
            if (!list) {
                console.error('List not found');
                return false;
            }

            if (!list.editable) {
                console.error('List is not editable');
                return false;
            }

            const itemIndex = list.items.findIndex(item => item.dbid === itemDbid);
            
            if (itemIndex === -1) {
                console.error('Item not found');
                return false;
            }

            if (!list.items[itemIndex].editable) {
                console.error('Item is not editable');
                return false;
            }

            list.items.splice(itemIndex, 1);
            
            // Update sequence numbers
            list.items.forEach((item, index) => {
                item.sequence = index;
            });

            await this.saveList(list);
            return true;
        } catch (error) {
            console.error('Error deleting item:', error);
            return false;
        }
    }

    // Sort items by a specific field
    async sortItems(
        listDbid: string, 
        sortBy: keyof Item, 
        order: 'asc' | 'desc' = 'asc'
    ): Promise<boolean> {
        try {
            const list = await this.getList(listDbid);
            
            if (!list) {
                console.error('List not found');
                return false;
            }

            if (!list.editable) {
                console.error('List is not editable');
                return false;
            }

            list.items.sort((a, b) => {
                let aVal = a[sortBy];
                let bVal = b[sortBy];

                // Handle Date objects
                if (aVal instanceof Date && bVal instanceof Date) {
                    aVal = aVal.getTime();
                    bVal = bVal.getTime();
                }

                // Handle string comparison
                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    return order === 'asc' 
                        ? aVal.localeCompare(bVal)
                        : bVal.localeCompare(aVal);
                }

                // Handle numeric and boolean comparison
                if (aVal < bVal) return order === 'asc' ? -1 : 1;
                if (aVal > bVal) return order === 'asc' ? 1 : -1;
                return 0;
            });

            // Update sequence numbers after sorting
            list.items.forEach((item, index) => {
                item.sequence = index;
            });

            await this.saveList(list);
            return true;
        } catch (error) {
            console.error('Error sorting items:', error);
            return false;
        }
    }

    // Reorder a single item to a new position
    async reorderItem(listDbid: string, itemDbid: string, newSequence: number): Promise<boolean> {
        try {
            const list = await this.getList(listDbid);
            
            if (!list) {
                console.error('List not found');
                return false;
            }

            if (!list.editable) {
                console.error('List is not editable');
                return false;
            }

            const itemIndex = list.items.findIndex(item => item.dbid === itemDbid);
            
            if (itemIndex === -1) {
                console.error('Item not found');
                return false;
            }

            if (!list.items[itemIndex].editable) {
                console.error('Item is not editable');
                return false;
            }

            // Clamp newSequence to valid range
            newSequence = Math.max(0, Math.min(newSequence, list.items.length - 1));

            // Remove item from current position
            const [item] = list.items.splice(itemIndex, 1);
            
            // Insert at new position
            list.items.splice(newSequence, 0, item);

            // Update all sequence numbers
            list.items.forEach((item, index) => {
                item.sequence = index;
            });

            await this.saveList(list);
            return true;
        } catch (error) {
            console.error('Error reordering item:', error);
            return false;
        }
    }

    // Sort items by multiple criteria
    async sortItemsMultiple(
        listDbid: string,
        sortCriteria: Array<{ field: keyof Item; order: 'asc' | 'desc' }>
    ): Promise<boolean> {
        try {
            const list = await this.getList(listDbid);
            
            if (!list) {
                console.error('List not found');
                return false;
            }

            if (!list.editable) {
                console.error('List is not editable');
                return false;
            }

            list.items.sort((a, b) => {
                for (const criterion of sortCriteria) {
                    let aVal = a[criterion.field];
                    let bVal = b[criterion.field];

                    // Handle Date objects
                    if (aVal instanceof Date && bVal instanceof Date) {
                        aVal = aVal.getTime();
                        bVal = bVal.getTime();
                    }

                    let comparison = 0;

                    // Handle string comparison
                    if (typeof aVal === 'string' && typeof bVal === 'string') {
                        comparison = aVal.localeCompare(bVal);
                    } else {
                        // Handle numeric and boolean comparison
                        if (aVal < bVal) comparison = -1;
                        else if (aVal > bVal) comparison = 1;
                    }

                    if (comparison !== 0) {
                        return criterion.order === 'asc' ? comparison : -comparison;
                    }
                }
                return 0;
            });

            // Update sequence numbers after sorting
            list.items.forEach((item, index) => {
                item.sequence = index;
            });

            await this.saveList(list);
            return true;
        } catch (error) {
            console.error('Error sorting items with multiple criteria:', error);
            return false;
        }
    }

    // Get items sorted by current sequence (useful after manual reordering)
    async getItemsSorted(listDbid: string): Promise<Item[]> {
        try {
            const list = await this.getList(listDbid);
            
            if (!list) {
                return [];
            }

            return [...list.items].sort((a, b) => a.sequence - b.sequence);
        } catch (error) {
            console.error('Error getting sorted items:', error);
            return [];
        }
    }

    // Private helper methods
    private async saveList(list: List): Promise<boolean> {
        try {
            const key = this.getStorageKey(list.dbid);
            const result = await window.storage.set(key, JSON.stringify(list));
            return result !== null;
        } catch (error) {
            console.error('Error saving list:', error);
            return false;
        }
    }

    private async addListToUserIndex(listDbid: string): Promise<void> {
        try {
            const indexKey = this.getUserListsKey();
            let listDbids: string[] = [];

            try {
                const result = await window.storage.get(indexKey);
                if (result) {
                    listDbids = JSON.parse(result.value);
                }
            } catch (error) {
                // Index doesn't exist yet
            }

            if (!listDbids.includes(listDbid)) {
                listDbids.push(listDbid);
                await window.storage.set(indexKey, JSON.stringify(listDbids));
            }
        } catch (error) {
            console.error('Error adding list to index:', error);
        }
    }

    private async removeListFromUserIndex(listDbid: string): Promise<void> {
        try {
            const indexKey = this.getUserListsKey();
            const result = await window.storage.get(indexKey);
            
            if (!result) {
                return;
            }

            let listDbids: string[] = JSON.parse(result.value);
            listDbids = listDbids.filter(id => id !== listDbid);
            
            await window.storage.set(indexKey, JSON.stringify(listDbids));
        } catch (error) {
            console.error('Error removing list from index:', error);
        }
    }
}

// Example usage:
/*
const manager = new PersistentListManager('user123');

// Create a list
const myList = await manager.createList('Shopping List');

// Add items
await manager.addItem(myList.dbid, {
    text: 'Buy milk',
    priority: 1,
    due: new Date('2025-11-01')
});

await manager.addItem(myList.dbid, {
    text: 'Buy bread',
    priority: 3,
    due: new Date('2025-11-02')
});

// Get all lists
const allLists = await manager.getAllLists();

// Update an item
await manager.updateItem(myList.dbid, itemDbid, {
    text: 'Buy organic milk',
    status: 1
});

// Sort items by priority (ascending)
await manager.sortItems(myList.dbid, 'priority', 'asc');

// Sort by due date (descending)
await manager.sortItems(myList.dbid, 'due', 'desc');

// Sort by multiple criteria (priority first, then due date)
await manager.sortItemsMultiple(myList.dbid, [
    { field: 'priority', order: 'asc' },
    { field: 'due', order: 'asc' }
]);

// Reorder a specific item to position 0 (move to top)
await manager.reorderItem(myList.dbid, itemDbid, 0);

// Get items in sequence order
const sortedItems = await manager.getItemsSorted(myList.dbid);

// Delete an item
await manager.deleteItem(myList.dbid, itemDbid);

// Delete a list
await manager.deleteList(myList.dbid);
*/