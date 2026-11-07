export type CourseType = {
  _id: string;
  nameRU: string;
  nameEN: string;
  order: number; // | null
  description: string;
  directions: string[];
  fitting: string[];
  difficulty: string;
  durationInDays: number;
  dailyDurationInMinutes: {
    from: number;
    to: number;
  };
  workouts: string[];
};

export type userType = {
  email: string;
  password: string;
};

export enum CourseInfo {
  durationInDays,
  dailyDurationInMinutes,
  difficulty,
}
