import AuthModal from '../AuthModal';
import SignUpForm from '../../signup/SignUpForm';

interface SignUpModalProps {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}

export default async function SignUpModal({ searchParams }: SignUpModalProps) {
  const { returnTo } = await searchParams;
  const validReturnTo =
    typeof returnTo === 'string' &&
    (returnTo === '/main' || /^\/main\/course\/[^/]+$/.test(returnTo))
      ? returnTo
      : undefined;

  return (
    <AuthModal title="Регистрация" returnTo={validReturnTo}>
      <SignUpForm />
    </AuthModal>
  );
}
