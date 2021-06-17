export interface IQuestion {
  category: string;
  correct_answer: string | string[];
  difficulty: 'easy' | 'medium' | 'hard';
  incorrect_answers: string[];
  question: string;
  type: 'multiply' | 'boolean';
  variants: string[];
}

export interface IResponse {
  results: Omit<IQuestion, 'variants'>[];
  response_code: number;
}

export type IResults = {
  [key in IQuestion['difficulty'] | 'all']: { count: number; correct: number };
};
