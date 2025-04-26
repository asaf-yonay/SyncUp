import { BaseRepository } from './base-repository';
import { ActionItem, Database } from '../types';

export class ActionItemRepository extends BaseRepository<'action_items'> {
  constructor() {
    super('action_items');
  }

  async findAll(): Promise<ActionItem[]> {
    return this.executeQuery<ActionItem[]>(this.client.select('*'));
  }

  async findById(id: string): Promise<ActionItem> {
    return this.executeQuery<ActionItem>(this.client.select('*').eq('id', id).single());
  }

  async findByObjectiveId(objectiveId: string): Promise<ActionItem[]> {
    return this.executeQuery<ActionItem[]>(this.client.select('*').eq('objective_id', objectiveId));
  }

  async create(data: Database['public']['Tables']['action_items']['Insert']): Promise<ActionItem> {
    return this.executeQuery<ActionItem>(this.client.insert(data).select().single());
  }

  async update(id: string, data: Database['public']['Tables']['action_items']['Update']): Promise<ActionItem> {
    return this.executeQuery<ActionItem>(this.client.update(data).eq('id', id).select().single());
  }

  async delete(id: string): Promise<void> {
    await this.executeQuery(this.client.delete().eq('id', id));
  }
} 