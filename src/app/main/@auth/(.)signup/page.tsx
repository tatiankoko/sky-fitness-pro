import AuthModal from '../../../../components/authModal/AuthModal';
import SignUpForm from '../../../../components/signUpForm/SignUpForm';
import { getValidReturnTo } from '@/utils/helper';

interface SignUpModalProps {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}

export default async function SignUpModal({ searchParams }: SignUpModalProps) {
  const { returnTo } = await searchParams;
  const validReturnTo = getValidReturnTo(returnTo);

  return (
    <AuthModal title="Регистрация" returnTo={validReturnTo}>
      <SignUpForm returnTo={validReturnTo} />
    </AuthModal>
  );
}
