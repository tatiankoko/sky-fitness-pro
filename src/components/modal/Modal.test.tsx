import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

const setup = (onClose = jest.fn()) => {
  const utils = render(
    <Modal
      overlayClassName="overlay"
      dialogClassName="dialog"
      onClose={onClose}
      ariaLabel="Тестовая модалка"
    >
      <p>Содержимое</p>
    </Modal>,
  );
  return { onClose, ...utils };
};

describe('Modal', () => {
  it('рендерит children и aria-атрибуты', () => {
    setup();
    const dialog = screen.getByRole('dialog', { name: 'Тестовая модалка' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Содержимое')).toBeInTheDocument();
  });

  it('клик по оверлею вызывает onClose', () => {
    const { onClose, container } = setup();
    fireEvent.click(container.querySelector('.overlay') as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('клик по диалогу не вызывает onClose (stopPropagation)', () => {
    const { onClose } = setup();
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('клик по содержимому диалога не вызывает onClose', () => {
    const { onClose } = setup();
    fireEvent.click(screen.getByText('Содержимое'));
    expect(onClose).not.toHaveBeenCalled();
  });
});
