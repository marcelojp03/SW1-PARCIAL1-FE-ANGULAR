export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
  action?: {
    type: 'generate_class' | 'add_relationship' | 'modify_attribute' | 'create_diagram';
    data: any;
  };
}

export interface DiagramAction {
  type: 'ai_update_diagram';
  data: {
    canonical: any;
    syncfusion: any;
  };
}

export interface AiResponse {
  success: boolean;
  message: string;
  data?: {
    appliedOps: any[];
    canonical: any;
    syncfusion: any;
  };
}

export interface AiSuggestion {
  id: string;
  type: 'optimization' | 'correction' | 'enhancement';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  changes: any[];
}

export interface AiMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  metadata?: {
    confidence?: number;
    suggestions?: any[];
    context?: string;
  };
}

export interface AiChatRequest {
  projectId: string;
  message: string;
}

export interface AiChatContext {
  projectId: string;
  diagramData?: any;
  userPreferences?: any;
  sessionId?: string;
}