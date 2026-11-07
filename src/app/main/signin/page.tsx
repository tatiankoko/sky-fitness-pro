import { redirect } from 'next/navigation';
import SignInForm from './SignInForm';

interface SignInPageProps {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { returnTo } = await searchParams;

  const validReturnTo =
    typeof returnTo === 'string' &&
    (returnTo === '/main' || /^\/main\/course\/[^/]+$/.test(returnTo))
      ? returnTo
      : undefined;

  if (validReturnTo) {
    redirect(validReturnTo);
  }

  return <SignInForm returnTo={validReturnTo} />;
}
