import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Add type definitions for Speech Recognition API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

interface VoiceNavigationProps {
  teamMembers: Array<{
    id: string;
    name: string;
  }>;
  currentMember?: {
    id: string;
    name: string;
  };
  onAddActionItem?: (memberId: string, content: string) => void;
}

export default function VoiceNavigation({ 
  teamMembers, 
  currentMember,
  onAddActionItem 
}: VoiceNavigationProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleStartListening = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream after getting permission

      const recognitionInstance = await initializeRecognition();
      if (recognitionInstance) {
        recognitionInstance.start();
      }
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Microphone access denied. Please allow microphone access to use voice commands.');
    }
  };

  const initializeRecognition = async () => {
    try {
      // Check if the browser supports speech recognition
      if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        setError('Speech recognition is not supported in your browser');
        return null;
      }

      // Create speech recognition instance
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      // Configure recognition settings
      recognition.continuous = false; // Changed to false to prevent continuous listening issues
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: SpeechRecognitionEvent) => {
        console.error('Speech recognition error:', event.error);
        setError(`Error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        
        setTranscript(transcript);
        processVoiceCommand(transcript.toLowerCase());
      };

      return recognition;
    } catch (err) {
      console.error('Error initializing speech recognition:', err);
      setError('Failed to initialize speech recognition');
      return null;
    }
  };

  const processVoiceCommand = (command: string) => {
    // Normalize the command by removing extra spaces and converting to lowercase
    const normalizedCommand = command.trim().toLowerCase();

    // Check for navigation commands with more flexible patterns
    const navigationPatterns = [
      /go to (?:page )?(.+)/i,
      /navigate to (?:page )?(.+)/i,
      /show (?:page )?(.+)/i,
      /open (?:page )?(.+)/i,
      /view (?:page )?(.+)/i
    ];

    // Try each navigation pattern
    for (const pattern of navigationPatterns) {
      const match = normalizedCommand.match(pattern);
      if (match) {
        const nameToFind = match[1].trim();
        
        // Find the best matching team member
        const bestMatch = findBestNameMatch(nameToFind, teamMembers);
        if (bestMatch) {
          router.push(`/member/${bestMatch.id}`);
          return;
        }
      }
    }

    // Check for action item commands with more flexible patterns
    const actionItemPatterns = [
      /add action item (.+?)(?: for (.+))?/i,
      /create action item (.+?)(?: for (.+))?/i,
      /new action item (.+?)(?: for (.+))?/i,
      /add task (.+?)(?: for (.+))?/i,
      /create task (.+?)(?: for (.+))?/i,
      /new task (.+?)(?: for (.+))?/i,
      /add objective (.+?)(?: for (.+))?/i,
      /create objective (.+?)(?: for (.+))?/i,
      /new objective (.+?)(?: for (.+))?/i,
      /add project (.+?)(?: for (.+))?/i,
      /create project (.+?)(?: for (.+))?/i,
      /new project (.+?)(?: for (.+))?/i,
      /add milestone (.+?)(?: for (.+))?/i,
      /create milestone (.+?)(?: for (.+))?/i,
      /new milestone (.+?)(?: for (.+))?/i
    ];

    // Try each action item pattern
    for (const pattern of actionItemPatterns) {
      const match = normalizedCommand.match(pattern);
      if (match && onAddActionItem) {
        const [_, content, memberName] = match;
        
        // If we're on a member's page and no member name was specified, use the current member
        let targetMember = currentMember;
        
        // If a member name was specified, find the best match
        if (memberName) {
          targetMember = findBestNameMatch(memberName.trim(), teamMembers);
        }
        
        if (targetMember) {
          onAddActionItem(targetMember.id, content.trim());
          return;
        } else if (memberName) {
          // If a member name was specified but no match was found
          setError(`Could not find team member: ${memberName}`);
          return;
        } else {
          // If no member name was specified and we're not on a member's page
          setError('Please specify a team member or navigate to their page first');
          return;
        }
      }
    }
  };

  // Helper function to find the best matching team member name
  const findBestNameMatch = (searchName: string, members: Array<{ id: string; name: string }>) => {
    // Convert search name to lowercase for case-insensitive comparison
    const searchLower = searchName.toLowerCase();
    
    // First try exact match
    const exactMatch = members.find(member => 
      member.name.toLowerCase() === searchLower
    );
    if (exactMatch) return exactMatch;

    // Then try partial match (first name or last name)
    const partialMatch = members.find(member => {
      const memberNameLower = member.name.toLowerCase();
      return memberNameLower.includes(searchLower) || searchLower.includes(memberNameLower);
    });
    if (partialMatch) return partialMatch;

    // Finally try fuzzy match (split name into parts)
    const searchParts = searchLower.split(/\s+/);
    return members.find(member => {
      const memberParts = member.name.toLowerCase().split(/\s+/);
      return searchParts.some(part => 
        memberParts.some(memberPart => 
          memberPart.includes(part) || part.includes(memberPart)
        )
      );
    });
  };

  useEffect(() => {
    let recognition: SpeechRecognition | null = null;

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [teamMembers, router, onAddActionItem]);

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={() => isListening ? setIsListening(false) : handleStartListening()}
        className={`p-4 rounded-full shadow-lg ${
          isListening ? 'bg-red-500' : 'bg-blue-500'
        } text-white`}
        title={isListening ? 'Stop listening' : 'Start listening'}
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
      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
} 