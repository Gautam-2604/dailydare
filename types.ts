export type Dare = {
    id: number;
    title: string;
    category: string;
    difficulty: string;
    points: number;
    timeLimit: string;
    participants: number;
    startDate: Date;
    Category: String;
    endsAt: Date;
    isCompleted: String
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