import React from 'react';
import { render, screen } from '@testing-library/react';
import { Quiz } from './Quiz';
import userEvent from '@testing-library/user-event';
import * as hooks from '../hooks/useGame';
import { IQuestion, IResults } from '../types';

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
  all: { count: 10, correct: 5 },
  easy: { correct: 3, count: 6 },
  medium: { count: 0, correct: 0 },
  hard: { count: 4, correct: 2 },
};

const useGameState: ReturnType<typeof hooks.useGame> = {
  isLoading: false,
  isGameRun: false,
  results: null,
  error: undefined,
  question: {} as IQuestion,
  answer: [],
  handleNextStep: jest.fn(),
  onChange: jest.fn(),
  handleStartGame: jest.fn(),
  isLastQuestion: false,
};

describe('Quiz component', () => {
  it('should render button start game', () => {
    const useGame = jest
      .spyOn(hooks, 'useGame')
      .mockImplementationOnce(() => useGameState);
    render(<Quiz />);
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
    expect(useGame).toHaveBeenCalledTimes(1);
  });

  it('should render loading screen', () => {
    const useGame = jest
      .spyOn(hooks, 'useGame')
      .mockImplementationOnce(() => ({ ...useGameState, isLoading: true }));
    render(<Quiz />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
    expect(useGame).toHaveBeenCalledTimes(1);
  });

  it('should render error message', () => {
    const useGame = jest.spyOn(hooks, 'useGame').mockImplementationOnce(() => ({
      ...useGameState,
      error: 'Error message',
    }));
    render(<Quiz />);
    expect(screen.getByText(/error/i)).toBeInTheDocument();
    expect(useGame).toHaveBeenCalledTimes(1);
  });

  it('should render results', () => {
    const useGame = jest.spyOn(hooks, 'useGame').mockImplementationOnce(() => ({
      ...useGameState,
      results,
    }));
    render(<Quiz />);
    expect(screen.getByText(/all.*10/i)).toBeInTheDocument();
    expect(screen.getByText(/easy.*6/i)).toBeInTheDocument();
    expect(screen.getByText(/medium.*0/i)).toBeInTheDocument();
    expect(screen.getByText(/hard.*4/i)).toBeInTheDocument();
    expect(useGame).toHaveBeenCalledTimes(1);
  });

  it('button should start game', () => {
    const useGame = jest
      .spyOn(hooks, 'useGame')
      .mockImplementationOnce(() => useGameState)
      .mockImplementationOnce(() => ({ ...useGameState, isLoading: true }))
      .mockImplementationOnce(() => ({
        ...useGameState,
        isGameRun: true,
        question,
      }));
    const { rerender } = render(<Quiz />);
    userEvent.click(screen.getByRole('button', { name: /start/i }));
    rerender(<Quiz />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
    rerender(<Quiz />);
    expect(screen.getAllByRole('radio').length).toBeGreaterThan(0);
    expect(useGame).toHaveBeenCalledTimes(3);
  });

  it('should render checkboxes', () => {
    const useGame = jest.spyOn(hooks, 'useGame').mockImplementationOnce(() => ({
      ...useGameState,
      question: { ...question, type: 'multiply' },
      isGameRun: true,
    }));
    render(<Quiz />);
    expect(screen.getAllByRole('checkbox').length).toBeGreaterThan(0);
    expect(useGame).toHaveBeenCalledTimes(1);
  });

  it('should render button finish game', () => {
    const useGame = jest.spyOn(hooks, 'useGame').mockImplementationOnce(() => ({
      ...useGameState,
      question,
      isGameRun: true,
      isLastQuestion: true,
    }));
    render(<Quiz />);
    expect(screen.getByRole('button', { name: /finish/i })).toBeInTheDocument();
    expect(useGame).toHaveBeenCalledTimes(1);
  });
});
