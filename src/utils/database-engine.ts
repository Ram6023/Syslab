import { BTreeNode, QueryPlan, DatabaseResult } from '../core/types';

export interface DatabaseRecord {
  id: number;
  name: string;
  value: number;
  category: string;
}

export class DatabaseEngine {
  private data: DatabaseRecord[] = [];
  private btree: BTreeNode | null = null;
  private indexHits = 0;
  private indexMisses = 0;
  private diskReads = 0;

  constructor() {
    // Initialize with sample data
    this.data = [
      { id: 1, name: 'Record1', value: 100, category: 'A' },
      { id: 2, name: 'Record2', value: 200, category: 'B' },
      { id: 3, name: 'Record3', value: 150, category: 'A' },
      { id: 4, name: 'Record4', value: 300, category: 'C' },
      { id: 5, name: 'Record5', value: 250, category: 'B' },
    ];
    this.buildIndex();
  }

  buildIndex(): void {
    // Build B-Tree index on id field
    const keys = this.data.map(r => r.id).sort((a, b) => a - b);
    this.btree = this.buildBTree(keys, 0, keys.length - 1);
  }

  private buildBTree(keys: number[], start: number, end: number): BTreeNode {
    if (start > end) {
      return { keys: [], children: [], isLeaf: true };
    }

    const mid = Math.floor((start + end) / 2);
    const node: BTreeNode = {
      keys: [keys[mid]],
      children: [],
      isLeaf: start === end,
    };

    if (start < end) {
      node.children.push(this.buildBTree(keys, start, mid - 1));
      node.children.push(this.buildBTree(keys, mid + 1, end));
    }

    return node;
  }

  query(operation: 'SELECT' | 'PROJECT', condition?: { field: keyof DatabaseRecord; operator: string; value: string | number }): DatabaseResult {
    const startTime = performance.now();
    this.indexHits = 0;
    this.indexMisses = 0;
    this.diskReads = 0;

    let result: DatabaseRecord[] = [];
    let queryPlan: QueryPlan;

    if (operation === 'SELECT') {
      if (condition && condition.field === 'id') {
        // Use index for id lookups
        const indexResult = this.searchIndex(typeof condition.value === 'number' ? condition.value : parseInt(condition.value, 10));
        if (indexResult) {
          this.indexHits++;
          result = [this.data.find(r => r.id === condition.value)!].filter(Boolean);
        } else {
          this.indexMisses++;
          result = [];
        }
        queryPlan = {
          operation: 'INDEX_SCAN',
          cost: 1,
        };
      } else {
        // Full table scan
        this.diskReads = this.data.length;
        result = this.data.filter(record => {
          if (!condition) return true;
          const fieldValue = record[condition.field];
          switch (condition.operator) {
            case '=': return fieldValue === condition.value;
            case '>': return fieldValue > condition.value;
            case '<': return fieldValue < condition.value;
            case '>=': return fieldValue >= condition.value;
            case '<=': return fieldValue <= condition.value;
            default: return true;
          }
        });
        queryPlan = {
          operation: 'FULL_SCAN',
          cost: this.data.length,
        };
      }
    } else {
      // PROJECT operation
      this.diskReads = this.data.length;
      result = this.data;
      queryPlan = {
        operation: 'PROJECT',
        cost: this.data.length,
      };
    }

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    return {
      data: result,
      queryPlan,
      metrics: {
        executionTime: parseFloat(executionTime.toFixed(2)),
        diskReads: this.diskReads,
        indexHits: this.indexHits,
        indexMisses: this.indexMisses,
      },
    };
  }

  private searchIndex(key: number): boolean {
    return this.searchBTree(this.btree!, key);
  }

  private searchBTree(node: BTreeNode, key: number): boolean {
    if (!node || node.keys.length === 0) return false;

    for (let i = 0; i < node.keys.length; i++) {
      if (key === node.keys[i]) {
        return true;
      }
      if (key < node.keys[i]) {
        if (node.children[i]) {
          return this.searchBTree(node.children[i], key);
        }
        return false;
      }
    }

    if (node.children[node.keys.length]) {
      return this.searchBTree(node.children[node.keys.length], key);
    }

    return false;
  }

  getBTree(): BTreeNode | null {
    return this.btree;
  }

  getData(): DatabaseRecord[] {
    return this.data;
  }

  insert(record: DatabaseRecord): void {
    this.data.push(record);
    this.buildIndex();
  }
}
