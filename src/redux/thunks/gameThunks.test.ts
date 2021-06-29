import * as thunks from './gameThunks';
import * as apiModule from '../../api';
import { AsyncThunkAction, Dispatch } from '@reduxjs/toolkit';
import { IQuestion } from '../../types';

const question: IQuestion = {
  category: 'test',
  correct_answer: ['a'],
  difficulty: 'easy',
  question: 'Test question',
  incorrect_answers: ['b', 'c'],
  type: 'boolean',
  variants: ['a', 'b', 'c'],
};

jest.mock('../../api');

describe('gameThunk', () => {
  const api = apiModule as jest.Mocked<typeof apiModule>;

  afterAll(() => {
    jest.unmock('../../api');
  });

  describe('register', () => {
    let action: AsyncThunkAction<IQuestion[], void, {}>;
    let dispatch: Dispatch;
    let getState: () => unknown;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn();
      action = thunks.fetchQuestions();
    });

    it('calls api correctly', async () => {
      apiModule.api.getQuestions = jest.fn(() => Promise.resolve([question]));
      const res = await action(dispatch, getState, undefined);
      expect(api.api.getQuestions).toHaveBeenCalledTimes(1);
      expect(res.payload).toEqual([question]);
      expect(res.type).toBe('game/fetchQuestions/fulfilled');
    });

    it('calls api incorrectly', async () => {
      apiModule.api.getQuestions = jest.fn(() => Promise.resolve(null));
      const res = await action(dispatch, getState, undefined);
      expect(api.api.getQuestions).toHaveBeenCalledTimes(1);
      expect(res.payload).toEqual(undefined);
      expect(res.type).toBe('game/fetchQuestions/rejected');
    });
  });
});
