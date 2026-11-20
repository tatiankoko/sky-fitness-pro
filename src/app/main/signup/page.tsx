import SignUpForm from '../../../components/signUpForm/SignUpForm';
import { getValidReturnTo } from '@/utils/helper';

interface SignUpPageProps {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { returnTo } = await searchParams;
  const validReturnTo = getValidReturnTo(returnTo);

  return <SignUpForm returnTo={validReturnTo} />;
}
