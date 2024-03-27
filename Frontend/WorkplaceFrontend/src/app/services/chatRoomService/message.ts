export interface Message {
    messageId?: number;
    content: string;
    roomId: number;
    userId: number;
    userName?: string
  }