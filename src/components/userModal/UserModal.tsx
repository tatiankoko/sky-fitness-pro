import styles from './user-modal.module.css';
import { userType } from '@/sharedTypes/sharedTypes';
import { splitUsername } from '@/utils/helper';
import Button from '@/components/button/Button';
import Link from 'next/link';
import { useAppDispatch } from '@/store/store';
import { setLogout } from '@/store/features/authSlice';
import classNames from 'classnames';

interface userModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: userType | null;
}

export default function UserModal({ isOpen, onClose, user }: userModalProps) {
  if (!isOpen) return null;

  const dispatch = useAppDispatch();

  const logout = () => {
    dispatch(setLogout());
    onClose();
  };

  return (
    <div
      className={classNames(styles.overlay, styles.center)}
      onClick={onClose}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className={styles.title}>{splitUsername(user?.email || '')}</h3>
        <p className={styles.description}>{user?.email}</p>

        <div className={styles.buttons__block}>
          <Link href={'/profile'} className={styles.buttons__link}>
            <Button onClick={onClose}>Мой профиль</Button>
          </Link>

          <Button primary={false} onClick={logout}>
            Выйти
          </Button>
        </div>
      </div>
    </div>
  );
}
