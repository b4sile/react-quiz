import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

export const fetchQuestions = createAsyncThunk(
  'game/fetchQuestions',
  async () => {
    const questions = await api.getQuestions();
    if (questions) {
      return questions;
    } else {
      throw new Error('Invalid response');
    }
  }
);
