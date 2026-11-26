import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('рендерит children с type="button"', () => {
    render(<Button>Войти</Button>);
    expect(screen.getByRole('button', { name: 'Войти' })).toHaveAttribute(
      'type',
      'button',
    );
  });

  it('вызывает onClick по клику', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Войти</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disabled блокирует клик', () => {
    const onClick = jest.fn();
    render(
      <Button disabled onClick={onClick}>
        Войти
      </Button>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('compact добавляет мобильный класс', () => {
    render(<Button compact>Войти</Button>);
    expect(screen.getByRole('button')).toHaveClass('button__compact');
  });

  it('без compact мобильного класса нет', () => {
    render(<Button>Войти</Button>);
    expect(screen.getByRole('button')).not.toHaveClass('button__compact');
  });

  it('primary={false} переключает на secondary', () => {
    render(<Button primary={false}>Выйти</Button>);
    expect(screen.getByRole('button')).toHaveClass('button__secondary');
  });
});
