import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import { NextPage } from 'next';
import {
  Button,
  Stack,
  TextInput,
  Group,
  Title,
  Text,
  Box,
} from '@mantine/core';

import config from 'config';
import { RoutePath } from 'routes';
import { handleError } from 'utils';
import { Link } from 'components';

import { accountApi, accountConstants } from 'resources/account';
import { IconCircleCheck } from '@tabler/icons-react';

const schema = z.object({
  firstName: z.string().min(1, 'Please enter First name').max(100),
  lastName: z.string().min(1, 'Please enter Last name').max(100),
  email: z.string().regex(accountConstants.emailRegex, 'Email format is incorrect.'),
  password: z.string().regex(accountConstants.passwordRegex, 'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).'),
});

type SignUpParams = z.infer<typeof schema>;

const passwordRules = [
  {
    title: 'Be 6-50 characters',
    done: false,
  },
  {
    title: 'Have at least one letter',
    done: false,
  },
  {
    title: 'Have at least one number',
    done: false,
  },
];

const SignUp: NextPage = () => {
  const [email, setEmail] = useState('');
  const [registered, setRegistered] = useState(false);
  const [signupToken, setSignupToken] = useState();

  const [passwordRulesData, setPasswordRulesData] = useState(passwordRules);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<SignUpParams>({
    resolver: zodResolver(schema),
  });

  const passwordValue = watch('password', '');

  useEffect(() => {
    const updatedPasswordRulesData = [...passwordRules];

    updatedPasswordRulesData[0].done = passwordValue.length >= 6 && passwordValue.length <= 50;
    updatedPasswordRulesData[1].done = /[a-zA-Z]/.test(passwordValue);
    updatedPasswordRulesData[2].done = /\d/.test(passwordValue);

    setPasswordRulesData(updatedPasswordRulesData);
  }, [passwordValue]);

  const { mutate: signUp, isLoading: isSignUpLoading } = accountApi.useSignUp<SignUpParams>();

  const onSubmit = (data: SignUpParams) => signUp(data, {
    onSuccess: (response: any) => {
      if (response.signupToken) setSignupToken(response.signupToken);

      setRegistered(true);
      setEmail(data.email);
    },
    onError: (e) => handleError(e, setError),
  });

  // const label = (
  //   <SimpleGrid
  //     cols={1}
  //     spacing="xs"
  //     p={4}
  //   >
  //     <Text>Password must:</Text>
  //     {passwordRulesData.map((ruleData) => (
  //       <Checkbox
  //         styles={{ label: { color: 'white' } }}
  //         key={ruleData.title}
  //         checked={ruleData.done}
  //         label={ruleData.title}
  //       />
  //     ))}
  //   </SimpleGrid>
  // );

  if (registered) {
    return (
      <>
        <Head>
          <title>Sign up</title>
        </Head>
        <Stack sx={{ width: '450px' }}>
          <Title order={2}>Thanks!</Title>
          <Text size="md" sx={({ colors }) => ({ color: colors.gray[5] })}>
            Please follow the instructions from the email to complete a sign up process.
            We sent an email with a confirmation link to
            {' '}
            <b>{email}</b>
          </Text>
          {signupToken && (
            <div>
              You look like a cool developer.
              {' '}
              <Link size="sm" href={`${config.API_URL}/account/verify-email?token=${signupToken}`}>
                Verify email
              </Link>
            </div>
          )}
        </Stack>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <Stack sx={{ width: '408px' }} spacing={20}>
        <Stack spacing={34}>
          <Title order={1}>Sign Up</Title>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={20}>
              <TextInput
                {...register('firstName')}
                label="Email adress"
                maxLength={100}
                placeholder="First Name"
                error={errors.firstName?.message}
              />
              <TextInput
                {...register('lastName')}
                label="Password"
                maxLength={100}
                placeholder="Last Name"
                error={errors.lastName?.message}
              />
              <Box display="flex" style={{ alignItems: 'center', gap: '12px' }}>
                <IconCircleCheck />
                <Text>Must be at least 8 characters</Text>
              </Box>
              <Box display="flex" style={{ alignItems: 'center', gap: '12px' }}>
                <IconCircleCheck />
                <Text>Must contain at least 1 number</Text>
              </Box>
              <Box display="flex" style={{ alignItems: 'center', gap: '12px' }}>
                <IconCircleCheck />
                <Text>Must contain lower case and capital letters</Text>
              </Box>
            </Stack>
            <Button
              type="submit"
              loading={isSignUpLoading}
              fullWidth
              mt={34}
            >
              Create Account
            </Button>
          </form>
        </Stack>
        <Stack spacing={34}>
          <Group sx={{ fontSize: '16px', justifyContent: 'center' }} spacing={12}>
            Have an account?
            <Link
              type="router"
              href={RoutePath.SignIn}
              inherit
              underline={false}
            >
              Sign In
            </Link>
          </Group>
        </Stack>
      </Stack>
    </>
  );
};

export default SignUp;
