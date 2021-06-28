import React from 'react';
import { useGame } from '../useGame';
import { renderHook, act } from '@testing-library/react-hooks';
import * as reactRedux from 'react-redux';
import { store } from '../../redux';
import * as thunks from '../../redux/thunks/gameThunks';
import * as reactAppRedux from '../../redux';
// import {fetchQuestions} from '../../redux/thunks/gameThunks'

// jest.spyOn(thunks, 'fetchQuestions');
// jest.spyOn(reactRedux, 'useDispatch');
// jest.spyOn(reactRedux, '');

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <reactRedux.Provider store={store}>{children}</reactRedux.Provider>;
};

const dispatch = jest.fn();
let useD: any;
let useS: any;
let fetchQuestions: any;
// let dispatch: any;
beforeEach(() => {
  fetchQuestions = jest.spyOn(thunks, 'fetchQuestions');
  useD = jest.spyOn(reactRedux, 'useDispatch');
  useS = jest.spyOn(reactAppRedux, 'useAppSelector');
});

describe('useGame hook', () => {
  it('check default isGameRun to be false', () => {
    const { result, rerender } = renderHook(() => useGame(), {
      wrapper: Wrapper,
    });
    result.current.handleStartGame = jest.fn(() => dispatch(fetchQuestions()));
    expect(result.current.isGameRun).toBeFalsy();
    act(() => {
      result.current.handleStartGame();
    });
    expect(result.current.handleStartGame).toHaveBeenCalledTimes(1);
    rerender();
    expect(useD).toHaveBeenCalledTimes(2);
    expect(useS).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(fetchQuestions).toHaveBeenCalledTimes(1);
  });
});
