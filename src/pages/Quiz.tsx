import React from 'react';
import { Button } from '../components/button';
import { useGame } from '../hooks/useGame';
import cn from 'classnames';
import s from './style.module.css';

export const Quiz = () => {
  const {
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
  } = useGame();

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  if (results) {
    return (
      <div className={s.container}>
        <div className={s.results}>
          {Object.entries(results).map(([key, res]) => {
            const percent = `${
              res.count ? ((res.correct * 100) / res.count).toFixed(0) : 0
            }%`;

            return (
              <div key={key} className={s.res_item}>
                <p className={s.res_text}>
                  {key.toUpperCase()} questions: {res.count} Correct answers:{' '}
                  {res.correct} ({percent})
                </p>
                <div className={s.bg_line}>
                  <div className={s.line} style={{ width: percent }}></div>
                </div>
              </div>
            );
          })}
        </div>
        <Button className={s.btn} onClick={handleStartGame}>
          Start over
        </Button>
      </div>
    );
  }

  if (!isGameRun) return <Button onClick={handleStartGame}>start</Button>;

  const { category, difficulty, variants, type, question: text } = question;
  const inputType = type === 'boolean' ? 'radio' : 'checkbox';

  return (
    <div className={s.container}>
      <h2 className={s.question}>{text}</h2>
      <div className={s.tags}>
        <span className={s.category}>Category - {category}</span>
        <span
          className={cn(s.difficulty, {
            [s.easy]: difficulty === 'easy',
            [s.medium]: difficulty === 'medium',
            [s.hard]: difficulty === 'hard',
          })}
        >
          {difficulty}
        </span>
      </div>
      <form onSubmit={handleNextStep} className={s.form}>
        {variants.map((variant, ind) => (
          <React.Fragment key={variant}>
            <input
              id={`checkbox-${ind}`}
              defaultChecked={answer.includes(variant)}
              className={s.input}
              type={inputType}
              name="answer"
              onChange={onChange}
              value={variant}
            />
            <label className={s.label} htmlFor={`checkbox-${ind}`}>
              {variant}
            </label>
          </React.Fragment>
        ))}
        <Button className={s.btn} type="submit" disabled={!answer.length}>
          {!isLastQuestion ? 'Next question' : 'Finish game'}
        </Button>
      </form>
    </div>
  );
};
