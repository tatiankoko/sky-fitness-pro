import { redirect } from 'next/navigation';
import SignUpForm from './SignUpForm';

interface SignUpPageProps {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { returnTo } = await searchParams;
  const validReturnTo =
    typeof returnTo === 'string' &&
    (returnTo === '/main' || /^\/main\/course\/[^/]+$/.test(returnTo))
      ? returnTo
      : undefined;

  if (validReturnTo) {
    redirect(validReturnTo);
  }

  return <SignUpForm />;
}
