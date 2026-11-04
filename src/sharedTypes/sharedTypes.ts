export type CourseType = {
  _id: string;
  nameRU: string;
  nameEN: string;
  order: number;
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
  username: string;
};
