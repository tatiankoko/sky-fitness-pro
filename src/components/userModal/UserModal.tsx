import styles from './user-modal.module.css';
import Modal from '@/components/modal/Modal';
import { userType } from '@/sharedTypes/sharedTypes';
import { splitUsername } from '@/utils/helper';
import Button from '@/components/button/Button';
import Link from 'next/link';
import { useAppDispatch } from '@/store/store';
import { setLogout } from '@/store/features/authSlice';

interface userModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: userType | null;
}

export default function UserModal({ isOpen, onClose, user }: userModalProps) {
  const dispatch = useAppDispatch();

  if (!isOpen) return null;

  const logout = () => {
    dispatch(setLogout());
    onClose();
  };

  return (
    <Modal
      overlayClassName={styles.overlay}
      dialogClassName={styles.dialog}
      onClose={onClose}
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
    </Modal>
  );
}
