import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface VoiceNavigationProps {
  teamMembers: Array<{
    id: string;
    name: string;
  }>;
  onAddActionItem?: (memberId: string, content: string) => void;
}

export default function VoiceNavigation({ teamMembers, onAddActionItem }: VoiceNavigationProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.log('Speech recognition not supported');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      
      setTranscript(transcript);
      processVoiceCommand(transcript.toLowerCase());
    };

    const processVoiceCommand = (command: string) => {
      // Navigate to team member's page
      teamMembers.forEach(member => {
        if (command.includes(`go to ${member.name.toLowerCase()}`)) {
          router.push(`/member/${member.id}`);
        }
      });

      // Add action item
      const addActionMatch = command.match(/add action item (.*?) for (.*)/i);
      if (addActionMatch && onAddActionItem) {
        const [_, content, memberName] = addActionMatch;
        const member = teamMembers.find(m => 
          m.name.toLowerCase() === memberName.toLowerCase()
        );
        if (member) {
          onAddActionItem(member.id, content);
        }
      }
    };

    return () => {
      recognition.stop();
    };
  }, [teamMembers, router, onAddActionItem]);

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={() => setIsListening(!isListening)}
        className={`p-4 rounded-full shadow-lg ${
          isListening ? 'bg-red-500' : 'bg-blue-500'
        } text-white`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </button>
      {transcript && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
          {transcript}
        </div>
      )}
    </div>
  );
} 