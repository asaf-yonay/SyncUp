import { useEffect, useState, useRef } from 'react';
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
  onTranscriptChange?: (transcript: string) => void;
  isListening?: boolean;
}

export default function VoiceNavigation({ 
  teamMembers, 
  currentMember,
  onAddActionItem,
  onTranscriptChange,
  isListening: controlledIsListening 
}: VoiceNavigationProps) {
  const [internalIsListening, setInternalIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Use controlled isListening if provided, otherwise use internal state
  const isListening = controlledIsListening ?? internalIsListening;

  useEffect(() => {
    if (controlledIsListening !== undefined) {
      if (controlledIsListening) {
        handleStartListening();
      } else {
        handleStopListening();
      }
    }
  }, [controlledIsListening]);

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

  const handleStopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
    }
  };

  // Store recognition instance in ref to access it across renders
  const recognition = useRef<SpeechRecognition | null>(null);

  const initializeRecognition = async () => {
    try {
      // Check if the browser supports speech recognition
      if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        setError('Speech recognition is not supported in your browser');
        return null;
      }

      // Create speech recognition instance
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();

      // Configure recognition settings
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onstart = () => {
        setInternalIsListening(true);
        setError(null);
      };

      recognition.current.onend = () => {
        setInternalIsListening(false);
      };

      recognition.current.onerror = (event: SpeechRecognitionEvent) => {
        console.error('Speech recognition error:', event.error);
        setError(`Error: ${event.error}`);
        setInternalIsListening(false);
      };

      recognition.current.onresult = (event: SpeechRecognitionEvent) => {
        const newTranscript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        
        setTranscript(newTranscript);
        onTranscriptChange?.(newTranscript);
        processVoiceCommand(newTranscript.toLowerCase());
      };

      return recognition.current;
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
          router.push(`/members/${bestMatch.id}`);
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
    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, []);

  return null; // Component is now headless, UI handled by parent
} 