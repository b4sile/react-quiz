import React from 'react';
import { useAppDispatch, useAppSelector } from '../redux';
import {
  selectGameState,
  setGameOver,
  setAnswer,
  setNextQuestion,
} from '../redux/slices/gameSlice';
import { fetchQuestions } from '../redux/thunks/gameThunks';

export const useGame = () => {
  const {
    error,
    questions,
    isLoading,
    isGameRun,
    currentQuestionInd,
    answers,
    results,
  } = useAppSelector(selectGameState);
  const dispatch = useAppDispatch();
  const answer = answers[currentQuestionInd];

  const handleStartGame = () => {
    dispatch(fetchQuestions());
  };

  const handleNextStep = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentQuestionInd < questions.length - 1) {
      dispatch(setNextQuestion());
    } else {
      dispatch(setGameOver());
    }
  };

  const question = questions[currentQuestionInd];
  const isLastQuestion = questions.length - 1 === currentQuestionInd;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setAnswer(e.target.value));
  };

  return {
    question,
    error,
    isLoading,
    handleStartGame,
    isGameRun,
    handleNextStep,
    isLastQuestion,
    onChange,
    answer,
    results,
  };
};
