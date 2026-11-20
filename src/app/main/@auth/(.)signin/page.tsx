import AuthModal from '../../../../components/authModal/AuthModal';
import SignInForm from '../../../../components/signInForm/SignInForm';
import { getValidReturnTo } from '@/utils/helper';

interface SignInModalProps {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}

export default async function SignInModal({ searchParams }: SignInModalProps) {
  const { returnTo } = await searchParams;
  const validReturnTo = getValidReturnTo(returnTo);

  return (
    <AuthModal title="Вход" returnTo={validReturnTo}>
      <SignInForm returnTo={validReturnTo} />
    </AuthModal>
  );
}
