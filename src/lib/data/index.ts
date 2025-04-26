import { TeamMemberRepository } from './team-member-repository';
import { ObjectiveRepository } from './objective-repository';
import { ActionItemRepository } from './action-item-repository';

export const teamMemberRepository = new TeamMemberRepository();
export const objectiveRepository = new ObjectiveRepository();
export const actionItemRepository = new ActionItemRepository(); 