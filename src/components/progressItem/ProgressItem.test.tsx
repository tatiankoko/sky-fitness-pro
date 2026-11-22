import { render, screen } from '@testing-library/react';
import ProgressItem from './ProgressItem';

describe('ProgressItem', () => {
  it('показывает округлённый процент', () => {
    render(<ProgressItem title="Прогресс" progress={1} max={3} />);
    expect(screen.getByText('Прогресс 33%')).toBeInTheDocument();
  });

  it('показывает 100% при полном прогрессе', () => {
    render(<ProgressItem title="Прогресс" progress={5} max={5} />);
    expect(screen.getByText('Прогресс 100%')).toBeInTheDocument();
  });

  it('max=0 даёт 0% без деления на ноль', () => {
    render(<ProgressItem title="Прогресс" progress={5} max={0} />);
    expect(screen.getByText('Прогресс 0%')).toBeInTheDocument();
  });

  it('передаёт value и max в элемент progress', () => {
    const { container } = render(
      <ProgressItem title="Прогресс" progress={2} max={5} />,
    );
    const bar = container.querySelector('progress');
    expect(bar).toHaveAttribute('value', '2');
    expect(bar).toHaveAttribute('max', '5');
  });
});
