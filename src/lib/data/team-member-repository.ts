import { BaseRepository } from './base-repository';
import { TeamMember, Database } from '../types';

export class TeamMemberRepository extends BaseRepository<'team_members'> {
  constructor() {
    super('team_members');
  }

  async findAll(): Promise<TeamMember[]> {
    return this.executeQuery(this.client.select('*'));
  }

  async findById(id: string): Promise<TeamMember | null> {
    return this.executeQuery(this.client.select('*').eq('id', id).single());
  }

  async findByManagerId(managerId: string): Promise<TeamMember[]> {
    return this.executeQuery(this.client.select('*').eq('manager_id', managerId));
  }

  async create(data: Database['public']['Tables']['team_members']['Insert']): Promise<TeamMember> {
    return this.executeQuery(this.client.insert(data).select().single());
  }

  async update(id: string, data: Database['public']['Tables']['team_members']['Update']): Promise<TeamMember> {
    return this.executeQuery(this.client.update(data).eq('id', id).select().single());
  }

  async delete(id: string): Promise<void> {
    await this.executeQuery(this.client.delete().eq('id', id));
  }
} 