import { AnyAction } from 'redux';
import { IQuestion, IResults } from '../../types';
import reducer, {
  setNextQuestion,
  setGameOver,
  setAnswer,
  GameState,
} from './gameSlice';

export const initialState: GameState = {
  questions: [],
  error: undefined,
  isLoading: false,
  isGameRun: false,
  currentQuestionInd: 0,
  answers: [],
  results: null,
};

const question: IQuestion = {
  category: 'test',
  correct_answer: ['a'],
  difficulty: 'easy',
  question: 'Test question',
  incorrect_answers: ['b', 'c'],
  type: 'boolean',
  variants: ['a', 'b', 'c'],
};

const results: IResults = {
  all: { count: 1, correct: 1 },
  easy: { correct: 1, count: 1 },
  medium: { count: 0, correct: 0 },
  hard: { count: 0, correct: 0 },
};

describe('Game slice', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as AnyAction)).toEqual(initialState);
  });

  it('should increase current question index', () => {
    expect(reducer(undefined, setNextQuestion())).toEqual({
      ...initialState,
      currentQuestionInd: 1,
    });
  });

  it('should be one answer on boolean type question', () => {
    const prevState = {
      ...initialState,
      questions: [question],
      answers: [[], [], []],
    };
    const nextStateOne = {
      ...prevState,
      answers: [['a'], [], []],
    };
    const nextStateTwo = {
      ...prevState,
      answers: [['b'], [], []],
    };
    expect(reducer(prevState, setAnswer('a'))).toEqual(nextStateOne);
    expect(reducer(nextStateOne, setAnswer('b'))).toEqual(nextStateTwo);
  });

  it('should be several answers on multiply type question', () => {
    const prevState = {
      ...initialState,
      questions: [{ ...question, type: 'multiply' as IQuestion['type'] }],
      answers: [[], [], []],
    };
    const nextStateOne = {
      ...prevState,
      answers: [['a'], [], []],
    };
    const nextStateTwo = {
      ...prevState,
      answers: [['a', 'b'], [], []],
    };
    expect(reducer(prevState, setAnswer('a'))).toEqual(nextStateOne);
    expect(reducer(nextStateOne, setAnswer('b'))).toEqual(nextStateTwo);
    expect(reducer(nextStateTwo, setAnswer('b'))).toEqual(nextStateOne);
  });

  it('should set game over', () => {
    const prevState = {
      ...initialState,
      questions: [question],
      isGameRun: true,
      answers: [['a'], [], []],
    };
    const nextStateOne = {
      ...prevState,
      isGameRun: false,
      results,
      answers: [['a'], [], []],
    };
    expect(reducer(prevState, setGameOver())).toEqual(nextStateOne);
  });

  it('should set game over with transform and wrong answer', () => {
    const prevState = {
      ...initialState,
      questions: [{ ...question, correct_answer: question.correct_answer[0] }],
      isGameRun: true,
      answers: [['b'], [], []],
    };
    const nextStateOne = {
      ...prevState,
      isGameRun: false,
      results: {
        ...results,
        easy: { correct: 0, count: 1 },
        all: { count: 1, correct: 0 },
      },
      answers: [['b'], [], []],
    };
    expect(reducer(prevState, setGameOver())).toEqual(nextStateOne);
  });

  it('should set game run', () => {
    const prevState = {
      ...initialState,
      isGameRun: false,
      isLoading: true,
      results,
      answers: [],
    };
    const nextState = {
      ...prevState,
      questions: [question],
      isGameRun: true,
      isLoading: false,
      results: null,
      answers: [[]],
    };
    expect(
      reducer(prevState, {
        type: 'game/fetchQuestions/fulfilled',
        payload: [question],
      })
    ).toEqual(nextState);
  });

  it('should set error message', () => {
    const prevState = {
      ...initialState,
      isGameRun: false,
      isLoading: true,
      answers: [],
    };
    const nextState = {
      ...prevState,
      isLoading: false,
      error: 'Invalid response',
    };
    expect(
      reducer(prevState, {
        type: 'game/fetchQuestions/rejected',
        error: { message: 'Invalid response' },
      })
    ).toEqual(nextState);
  });

  it('should set isLoading', () => {
    const prevState = {
      ...initialState,
      isLoading: false,
    };
    const nextState = {
      ...prevState,
      isLoading: true,
    };
    expect(
      reducer(prevState, {
        type: 'game/fetchQuestions/pending',
      })
    ).toEqual(nextState);
  });
});
