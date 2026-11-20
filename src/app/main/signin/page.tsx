import SignInForm from '../../../components/signInForm/SignInForm';

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

  return <SignInForm returnTo={validReturnTo} />;
}
