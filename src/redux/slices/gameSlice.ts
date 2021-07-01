import { IQuestion, IResults } from './../../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { fetchQuestions } from '../thunks/gameThunks';
import { compareArrays } from '../../utils';

export interface GameState {
  questions: IQuestion[];
  error: string | undefined;
  isLoading: boolean;
  isGameRun: boolean;
  currentQuestionInd: number;
  answers: Array<Array<string>>;
  results: null | IResults;
}

export const initialState: GameState = {
  questions: [],
  error: undefined,
  isLoading: false,
  isGameRun: false,
  currentQuestionInd: 0,
  answers: [],
  results: null,
};

const { actions, reducer } = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setAnswer: (state, { payload }: PayloadAction<string>) => {
      const answer = state.answers[state.currentQuestionInd];
      if (
        state.questions[state.currentQuestionInd].type === 'boolean' ||
        !answer.length
      )
        state.answers[state.currentQuestionInd] = [payload];
      else {
        const ind = answer.indexOf(payload);
        if (ind === -1) {
          answer.push(payload);
        } else {
          state.answers[state.currentQuestionInd] = answer.filter(
            (ans) => ans !== payload
          );
        }
      }
    },
    setNextQuestion: (state) => {
      state.currentQuestionInd++;
    },
    setGameOver: (state) => {
      state.isGameRun = false;
      state.currentQuestionInd = 0;
      state.results = {
        all: { count: state.questions.length, correct: 0 },
        easy: { correct: 0, count: 0 },
        medium: { count: 0, correct: 0 },
        hard: { count: 0, correct: 0 },
      };

      for (let i = 0; i < state.questions.length; i++) {
        const question = state.questions[i];
        let correct_answers: string[];
        if (typeof question.correct_answer === 'string')
          correct_answers = [question.correct_answer];
        else correct_answers = question.correct_answer;
        const isCorrectAnswer = compareArrays<string>(
          correct_answers,
          state.answers[i]
        );
        state.results[question.difficulty].count++;
        if (isCorrectAnswer) {
          state.results.all.correct++;
          state.results[question.difficulty].correct++;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchQuestions.fulfilled, (state, { payload }) => {
      state.answers = Array.from({ length: payload.length }, () => []);
      state.isLoading = false;
      state.isGameRun = true;
      state.results = null;
      state.questions = payload;
    });
    builder.addCase(fetchQuestions.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchQuestions.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });
  },
});

export const { setNextQuestion, setGameOver, setAnswer } = actions;

export default reducer;

export const selectGameState = ({ game }: RootState) => game;
