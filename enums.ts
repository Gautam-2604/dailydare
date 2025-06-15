export enum UserLevel{
    Beginner = 'Beginner',
    Intermediate  = 'Intermediate',
    Advanced = 'Advanced',
    Master = 'Master'

}
export enum categories {
    Programming = 'Programming',
    Language = 'Language',
    Music = 'Music',
    Art = 'Art',
    Science = 'Science',
    Fitness = 'Fitness'
}

export const categoriesArray = [
    'Programming',
    'Language',
    'Music',
    'Art',
    'Science',
    'Fitness'
] as const;

export type Category = typeof categoriesArray[number];

export enum Difficulty {
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard'
}

export const difficultiesArray = [
    'Easy',
    'Medium',
    'Hard'
] as const;

export type DifficultyType = typeof difficultiesArray[number];

export const difficultyDetails = [
    { name: 'Easy', color: '#4FFFB0', points: 50 },
    { name: 'Medium', color: '#FFD700', points: 100 },
    { name: 'Hard', color: '#FF6B6B', points: 200 },
];

export enum TimeLimit {
    OneHour = '1 hour',
    ThreeHours = '3 hours',
    SixHours = '6 hours',
    OneDay = '1 day',
    ThreeDays = '3 days',
    OneWeek = '1 week'
}

export const timeLimitsArray = [
    '1 hour',
    '3 hours',
    '6 hours',
    '1 day',
    '3 days',
    '1 week'
] as const;

export type TimeLimitType = typeof timeLimitsArray[number];