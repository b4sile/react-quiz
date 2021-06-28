import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '.';
import userEvent from '@testing-library/user-event';

describe('Button', () => {
  it('render button component', () => {
    render(<Button>Button</Button>);
    expect(screen.getByRole('button', { name: /button/i })).toBeInTheDocument();
  });

  it('button should click one times', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Button</Button>);
    userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
