'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSpeechRecognition } from 'react-speech-recognition';
import { ActionItemData } from '@/types/action-items';

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
  onAddActionItem?: (memberId: string, data: ActionItemData) => void;
  onTranscriptChange?: (transcript: string) => void;
  onActionItemCreated?: () => void;
  isListening?: boolean;
  'data-voice-navigation'?: boolean;
  onCommand: (command: string) => void;
}

export default function VoiceNavigation({ 
  teamMembers, 
  currentMember,
  onAddActionItem,
  onTranscriptChange,
  onActionItemCreated,
  isListening: controlledIsListening,
  'data-voice-navigation': dataVoiceNavigation,
  onCommand
}: VoiceNavigationProps) {
  const router = useRouter();
  const [isBrowser, setIsBrowser] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    console.log('[VoiceNavigation] Component mounted');
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    if (!isBrowser) return;

    if (controlledIsListening !== undefined) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          
          if (controlledIsListening) {
            recognition.start();
          } else {
            recognition.stop();
            resetTranscript();
          }
        }
      } catch (error) {
        console.error('[VoiceNavigation] Speech recognition error:', error);
      }
    }
  }, [controlledIsListening, isBrowser, resetTranscript]);

  useEffect(() => {
    if (transcript) {
      onTranscriptChange?.(transcript);
      processVoiceCommand(transcript.toLowerCase());
    }
  }, [transcript]);

  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  // Expose processVoiceCommand to the parent component
  useEffect(() => {
    if (dataVoiceNavigation) {
      (window as any).processVoiceCommand = processVoiceCommand;
    }
    return () => {
      if (dataVoiceNavigation) {
        delete (window as any).processVoiceCommand;
      }
    };
  }, [dataVoiceNavigation]);

  const processVoiceCommand = (command: string) => {
    // Normalize the command by removing extra spaces and converting to lowercase
    const normalizedCommand = command.trim().toLowerCase();
    
    console.log('Processing voice command:', normalizedCommand);
    console.log('Current member:', currentMember);
    console.log('Team members:', teamMembers);

    // Check for action item commands first
    const actionItemPatterns = [
      // Simple patterns first
      /^action item (.+)$/i,
      /^task (.+)$/i,
      // More detailed patterns
      /^add action item (.+?)(?: with description (.+?))?(?: due (?:on )?(.+?))?(?: priority (.+?))?(?: for (.+?))?$/i,
      /^create action item (.+?)(?: with description (.+?))?(?: due (?:on )?(.+?))?(?: priority (.+?))?(?: for (.+?))?$/i,
      /^new action item (.+?)(?: with description (.+?))?(?: due (?:on )?(.+?))?(?: priority (.+?))?(?: for (.+?))?$/i,
      /^add task (.+?)(?: with description (.+?))?(?: due (?:on )?(.+?))?(?: priority (.+?))?(?: for (.+?))?$/i,
      /^create task (.+?)(?: with description (.+?))?(?: due (?:on )?(.+?))?(?: priority (.+?))?(?: for (.+?))?$/i,
      /^new task (.+?)(?: with description (.+?))?(?: due (?:on )?(.+?))?(?: priority (.+?))?(?: for (.+?))?$/i
    ];

    // Try each action item pattern
    for (const pattern of actionItemPatterns) {
      const match = normalizedCommand.match(pattern);
      if (match && onAddActionItem) {
        let title, description, dueDate, priority, memberName;
        
        // Handle simpler patterns
        if (pattern.toString().includes('^action item (.+)$') || pattern.toString().includes('^task (.+)$')) {
          title = match[1];
          // Use defaults for other fields
          description = title;
          dueDate = 'today';
          priority = 'medium';
          memberName = match[1];
        } else {
          const [, matchedTitle, matchedDescription, matchedDueDate, matchedPriority, matchedMemberName] = match;
          title = matchedTitle;
          description = matchedDescription;
          dueDate = matchedDueDate;
          priority = matchedPriority;
          memberName = matchedMemberName;
        }
        
        console.log('Action item command detected:', {
          title,
          description,
          dueDate,
          priority,
          memberName
        });
        
        // If we're on a member's page and no member name was specified, use the current member
        let targetMember = currentMember;
        console.log('Initial target member (from currentMember):', targetMember);
        
        // If a member name was specified, find the best match
        if (memberName) {
          console.log('Member name specified in command:', memberName);
          targetMember = findBestNameMatch(memberName.trim(), teamMembers);
          console.log('Found matching member from command:', targetMember);
        }
        
        if (targetMember) {
          console.log('Using target member:', targetMember);
          // Parse due date if provided
          let parsedDueDate = new Date();
          if (dueDate) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            switch(dueDate.toLowerCase()) {
              case 'today':
                parsedDueDate = today;
                break;
              case 'tomorrow':
                parsedDueDate = tomorrow;
                break;
              default:
                // Try to parse the date string
                const date = new Date(dueDate);
                if (!isNaN(date.getTime())) {
                  parsedDueDate = date;
                }
            }
          }

          // Normalize priority if provided
          let normalizedPriority = 'medium';
          if (priority) {
            const priorityLower = priority.toLowerCase();
            if (['high', 'urgent', 'important'].includes(priorityLower)) {
              normalizedPriority = 'high';
            } else if (['low', 'minor', 'not important'].includes(priorityLower)) {
              normalizedPriority = 'low';
            }
          }

          const actionItemData: ActionItemData = {
            title,
            description: description || title,
            due_date: dueDate || new Date().toISOString().split('T')[0],
            priority: (priority || 'medium') as 'low' | 'medium' | 'high'
          };
          console.log('Creating action item with data:', actionItemData);
          
          onAddActionItem(targetMember.id, actionItemData);
          resetTranscript();
          onActionItemCreated?.();
          return;
        } else {
          console.log('No target member found for action item');
        }
      }
    }

    // Check for navigation commands only if no action item was matched
    const navigationPatterns = [
      /^go to (?:page )?(.+)/i,
      /^navigate to (?:page )?(.+)/i,
      /^show (?:page )?(.+)/i,
      /^open (?:page )?(.+)/i,
      /^view (?:page )?(.+)/i
    ];

    // Try each navigation pattern
    for (const pattern of navigationPatterns) {
      const match = normalizedCommand.match(pattern);
      if (match) {
        const nameToFind = match[1].trim();
        console.log('Navigation command detected, looking for member:', nameToFind);
        
        // Find the best matching team member
        const bestMatch = findBestNameMatch(nameToFind, teamMembers);
        if (bestMatch) {
          console.log('Found matching member for navigation:', bestMatch);
          router.push(`/members/${bestMatch.id}`);
          resetTranscript();
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

  const handleSubmit = () => {
    const command = manualInput || transcript;
    if (command.trim()) {
      console.log('[VoiceNavigation] Command submitted:', command);
      onCommand(command);
      setManualInput('');
      resetTranscript();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isBrowser) {
    console.log('[VoiceNavigation] Not in browser environment, returning null');
    return null;
  }

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="voice-navigation">
        <div className="error-message">
          Your browser doesn't support speech recognition.
        </div>
        <div className="manual-input">
          <textarea
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your command here..."
            rows={3}
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    );
  }

  return (
    <div className="voice-navigation">
      <div className="manual-input">
        <textarea
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your command here..."
          rows={3}
        />
      </div>
      <div className="controls">
        <button
          onClick={() => {
            if (isListening) {
              SpeechRecognition.stopListening();
              console.log('[VoiceNavigation] Stopping speech recognition');
            } else {
              SpeechRecognition.startListening({ continuous: true });
              console.log('[VoiceNavigation] Starting speech recognition');
            }
          }}
          className={isListening ? 'listening' : ''}
        >
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
} 