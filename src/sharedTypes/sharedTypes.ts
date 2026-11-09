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
  courseCompleted: boolean;
  workoutsProgress: WorkoutProgressType[];
};

export type WorkoutProgressType = {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
};

export type WorkoutType = {
  _id: string;
  name: string;
  video: string;
  exercises: [
    {
      name: string;
      quantity: number;
      _id: string;
    },
  ];
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
