export type PuchiSummary = {
  totalPuchis: number;
  sentByMe: number;
  receivedByMe: number;
};

export type PuchiHistoryItem = {
  id: string;
  senderName: string;
  senderAvatar: string | null;
  sentByMe: boolean;
  createdAt: string;
};

export type PuchiHistoryPage = {
  items: PuchiHistoryItem[];
  partnerDisplayName: string;
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};
