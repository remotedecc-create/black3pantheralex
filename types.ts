
export enum Sender {
  SYSTEM = 'SYSTEM',
  USER = 'USER',
  LINK = 'BLACK3PANTHER',
}

export interface TerminalMessage {
  id: string;
  sender: Sender;
  content: string;
  timestamp: Date;
  sources?: Array<{ title: string; uri: string }>;
  isError?: boolean;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}
