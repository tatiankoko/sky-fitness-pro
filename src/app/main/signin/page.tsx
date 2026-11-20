import SignInForm from '../../../components/signInForm/SignInForm';
import { getValidReturnTo } from '@/utils/helper';

interface SignInPageProps {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { returnTo } = await searchParams;

  const validReturnTo = getValidReturnTo(returnTo);

  return <SignInForm returnTo={validReturnTo} />;
}
