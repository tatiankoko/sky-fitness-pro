import AuthModal from '../AuthModal';
import SignInForm from '../../signin/SignInForm';

interface SignInModalProps {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}

export default async function SignInModal({ searchParams }: SignInModalProps) {
  const { returnTo } = await searchParams;
  const validReturnTo =
    typeof returnTo === 'string' &&
    (returnTo === '/main' || /^\/main\/course\/[^/]+$/.test(returnTo))
      ? returnTo
      : undefined;

  return (
    <AuthModal title="Вход" returnTo={validReturnTo}>
      <SignInForm returnTo={validReturnTo} />
    </AuthModal>
  );
}
