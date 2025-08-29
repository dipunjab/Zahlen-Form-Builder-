"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { signInSchema } from '@/schemas/User/signin';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const SignIn = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  });

  const submitCredentials = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    });
    if (result?.error) {
      toast(result.error);
    }
    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  return (
    <div className='bg-hero authContainer'>
      <div className='authCard rounded-4xl'>
        <div className="flex flex-col items-center mb-6">
          <Image src="/images/logo.png" alt="Logo" width={80} height={40} />
          <h1 className="text-xl font-semibold mt-2">Welcome Back</h1>
        </div>


        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(submitCredentials)}>
            <FormField
              control={form.control}
              name='identifier'
              render={({ field }) => (
                <FormItem >
                  <FormLabel>Email / Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email@work.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-[#FFBF00] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="cursor-pointer w-full bg-[#FFBF00] text-white py-2 rounded hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              {form.formState.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Signing In...</span>
                </div>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </Form>

        <div className="separator">or continue with</div>

        <fieldset>
          <button
            className="cursor-pointer w-full border border-gray-300 rounded py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition"
            onClick={() => signIn('google')}
          >
            <Image src="/icons/google.png" alt="Google" width={20} height={20} />
            <span>Continue with Google</span>
          </button>
        </fieldset>

        <div className="text-center mt-6 text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-[--app-color] hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
