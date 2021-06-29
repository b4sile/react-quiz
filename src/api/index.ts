import { IQuestion, IResponse } from '../types';
import { shuffle } from '../utils';
import { decode } from 'html-entities';

export const api = {
  getQuestions: async (): Promise<IQuestion[] | null> => {
    const response = await fetch('https://opentdb.com/api.php?amount=10');
    const data = (await response.json()) as IResponse;
    if (data.response_code === 0) {
      data.results.forEach((res) => {
        res.category = decode(res.category);
        if (typeof res.correct_answer === 'string')
          res.correct_answer = decode(res.correct_answer);
        else res.correct_answer = res.correct_answer.map((ans) => decode(ans));
        res.incorrect_answers = res.incorrect_answers.map((ans) => decode(ans));
        res.question = decode(res.question);
      });

      return data.results.map((res) => {
        if (typeof res.correct_answer === 'string') {
          res.correct_answer = [res.correct_answer];
        }
        const correct_answers = res.correct_answer;
        return {
          ...res,
          variants: shuffle<string>([
            ...correct_answers,
            ...res.incorrect_answers,
          ]),
        };
      });
    }
    return null;
  },
};
