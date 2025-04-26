import { TeamMember } from '../types';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface TreeNode {
  id: string;
  name: string;
  role: string;
  children: TreeNode[];
}

interface OrgChartProps {
  members: TeamMember[];
  currentUserId: string;
}

function OrgNode({ node, currentUserId, members }: { 
  node: TreeNode; 
  currentUserId: string;
  members: TeamMember[];
}) {
  const router = useRouter();
  const { user } = useAuth();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Node clicked:', node);
    console.log('Current user ID:', currentUserId);
    
    // Find the member in the full members list to check manager relationship
    const member = members.find(m => m.id === node.id);
    console.log('Found member:', member);
    
    if (!member) return;

    // Check if current user is the manager of this member
    if (member.managerId === currentUserId) {
      console.log('Authorized to view member');
      router.push(`/member/${node.id}`);
    } else {
      console.log('Not authorized to view member');
      alert('You are not authorized to view this member\'s details');
    }
  };

  return (
    <div 
      className={`border border-gray-200 p-4 m-4 rounded-lg bg-white inline-block min-w-[150px] cursor-pointer hover:shadow-md transition-shadow ${
        node.id === currentUserId ? 'border-blue-500 bg-blue-50' : ''
      }`}
      data-id={node.id}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          handleClick(e as any);
        }
      }}
    >
      <div className="font-bold mb-1">{node.name}</div>
      <div className="text-gray-600 text-sm">{node.role}</div>
      {node.children.length > 0 && (
        <div className="mt-5 pt-5 border-t border-gray-100">
          {node.children.map(child => (
            <OrgNode 
              key={child.id} 
              node={child} 
              currentUserId={currentUserId} 
              members={members}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrgChart({ members, currentUserId }: OrgChartProps) {
  const buildTree = (managerId: string | null): TreeNode[] => {
    return members
      .filter(member => member.managerId === managerId)
      .map(member => ({
        id: member.id,
        name: member.name,
        role: member.role,
        children: buildTree(member.id)
      }));
  };

  // Find the root (manager with no managerId)
  const rootNode = members.find(m => !m.managerId);
  if (!rootNode) return null;

  const tree = {
    id: rootNode.id,
    name: rootNode.name,
    role: rootNode.role,
    children: buildTree(rootNode.id)
  };

  return (
    <div className="w-full overflow-x-auto p-5">
      <OrgNode node={tree} currentUserId={currentUserId} members={members} />
    </div>
  );
} 