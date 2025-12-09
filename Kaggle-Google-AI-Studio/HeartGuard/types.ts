export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export enum AppMode {
  QA = 'qa',
  LEARNING = 'learning',
  QUIZ = 'quiz',
  SIMULATION = 'simulation',
  CASE_MANAGEMENT = 'case_management'
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
  isError?: boolean;
  groundingChunks?: GroundingChunk[];
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  mode: AppMode;
}

export interface SimulationProfile {
  name: string;
  age: number;
  bp: string;
  scenario: string;
  personality: string;
  behavioralRules: string;
}