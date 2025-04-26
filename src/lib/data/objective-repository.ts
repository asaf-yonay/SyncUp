import { BaseRepository } from './base-repository';
import { Objective, Database } from '../types';

export class ObjectiveRepository extends BaseRepository<'objectives'> {
  constructor() {
    super('objectives');
  }

  async findAll(): Promise<Objective[]> {
    return this.executeQuery<Objective[]>(this.client.select('*'));
  }

  async findById(id: string): Promise<Objective> {
    return this.executeQuery<Objective>(this.client.select('*').eq('id', id).single());
  }

  async findByTeamMemberId(teamMemberId: string): Promise<Objective[]> {
    return this.executeQuery<Objective[]>(this.client.select('*').eq('team_member_id', teamMemberId));
  }

  async create(data: Database['public']['Tables']['objectives']['Insert']): Promise<Objective> {
    return this.executeQuery<Objective>(this.client.insert(data).select().single());
  }

  async update(id: string, data: Database['public']['Tables']['objectives']['Update']): Promise<Objective> {
    return this.executeQuery<Objective>(this.client.update(data).eq('id', id).select().single());
  }

  async delete(id: string): Promise<void> {
    await this.executeQuery(this.client.delete().eq('id', id));
  }
} 