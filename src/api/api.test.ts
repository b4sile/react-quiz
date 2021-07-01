import { api } from '.';
import { IResponse } from '../types';
import * as utils from '../utils';
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();

const response: IResponse = {
  response_code: 0,
  results: [
    {
      category: 'test',
      correct_answer: ['a'],
      difficulty: 'easy',
      question: 'Test question',
      incorrect_answers: ['b', 'c'],
      type: 'boolean',
    },
  ],
};
describe('testing api', () => {
  beforeEach(async function () {
    fetchMock.resetMocks();
  });

  it('should return questions', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(response));
    jest.spyOn(utils, 'shuffle').mockReturnValue(['a', 'b', 'c']);
    const data = await api.getQuestions();
    expect(fetchMock.mock.calls.length).toBe(1);
    expect(data).toEqual([
      { ...response.results[0], variants: ['a', 'b', 'c'] },
    ]);
  });

  it('should return null', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ ...response, response_code: 1 })
    );
    const data = await api.getQuestions();
    expect(fetchMock.mock.calls.length).toBe(1);
    expect(data).toBeNull();
  });

  it('correct_answer should be array', async () => {
    response.results[0].correct_answer = response.results[0].correct_answer[0];
    fetchMock.mockResponseOnce(JSON.stringify(response));
    const data = await api.getQuestions();
    expect(fetchMock.mock.calls.length).toBe(1);
    expect(data?.[0].correct_answer).toEqual(['a']);
  });
});
