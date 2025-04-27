# Voice Commands Documentation

## Overview
SyncUp supports voice commands for navigation and task management. The voice interface can be activated by clicking the microphone button in the bottom-right corner of any page.

## Available Commands

### Navigation Commands
Navigate to team member pages using any of these patterns:
- "Go to [member name]"
- "Navigate to [member name]"
- "Show [member name]"
- "Open [member name]"
- "View [member name]"

Example:
- "Go to John Smith"
- "Navigate to Sarah's page"
- "Show John"

### Action Item Commands
Add action items using any of these patterns:
- "Add action item [title] with description [description] due [date] priority [priority] for [member name]"
- "Create action item [title] with description [description] due [date] priority [priority] for [member name]"
- "New action item [title] with description [description] due [date] priority [priority] for [member name]"
- "Add task [title] with description [description] due [date] priority [priority] for [member name]"
- "Create task [title] with description [description] due [date] priority [priority] for [member name]"
- "New task [title] with description [description] due [date] priority [priority] for [member name]"

#### Optional Fields
- Description: If not provided, the title will be used as the description
- Due Date: If not provided, defaults to today. Can use:
  - "today"
  - "tomorrow"
  - Specific dates like "April 30th" or "next Monday"
- Priority: If not provided, defaults to "medium". Can use:
  - "high" (or "urgent", "important")
  - "medium"
  - "low" (or "minor", "not important")
- Member Name: If not provided and you're on a member's page, uses the current member

Examples:
- "Add action item Complete project documentation with description Review and update all project docs due tomorrow priority high for John"
- "Create task Review pull request priority high for Sarah"
- "New action item Schedule team meeting due next Monday"
- "Add task Update dashboard with description Add new metrics and charts"

### Notes
- If you're already on a member's page, you can omit the member name
- The system uses fuzzy matching for member names, so partial names will work
- Voice commands are case-insensitive
- The system will automatically stop listening after completing a command
- You can manually stop listening by clicking the microphone button again

## Browser Support
Voice commands are supported in the following browsers:
- Chrome (recommended)
- Edge
- Safari
- Firefox (with limited support)

## Troubleshooting
If you experience issues with voice commands:
1. Ensure your microphone is properly connected and enabled
2. Grant microphone permissions when prompted
3. Try using Chrome for the best experience
4. Check that you're in a quiet environment
5. Speak clearly and at a normal pace

## Technical Details
The voice recognition system uses:
- `react-speech-recognition` library for cross-browser compatibility
- Continuous listening mode for better command recognition
- Fuzzy matching algorithm for member name recognition
- Automatic transcript clearing after successful commands
