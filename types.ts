export type Dare = {
    id: number;
    title: string;
    category: string;
    difficulty: string;
    points: number;
    timeLimit: string;
    participants: number;
  };

  export interface FriendRequest {
    id: number;
    username: string;
    avatar?: string;
    mutualFriends: number;
    dateRequested: string;
    completedDares: number;
    points: number;
  }