"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signupSchema } from '@/schemas/User/signup';
import { useDebounceCallback } from 'usehooks-ts'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/helpers/sendVerificationCode';
import { Loader } from 'lucide-react';


const SignIn = () => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setisCheckingUsername] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

    useEffect(() => {
    const checkusernameUnique = async () => {
      if (username) {
        setisCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get(`/api/a/check-username-uniqueness?username=${username}`);
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
        } finally {
          setisCheckingUsername(false)
        }
      }
    }
    checkusernameUnique();
  }, [username])

  const submitCredentials = async (data: z.infer<typeof signupSchema>) => {
    setisSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>('/api/a/sign-up', data);

      toast(response.data.message);

      router.replace(`/verify/${username}`);
      setisSubmitting(false);
    } catch (error) {
      console.error("Error in signup of user", error)
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message ?? "Error in signup of user");
      setisSubmitting(false);

    }
  };

  return (
    <div className='bg-hero authContainer'>
      <div className='authCard rounded-4xl'>
        <div className="flex flex-col items-center mb-6">
          <Image src="/images/logo.png" alt="Logo" width={80} height={40} />
          <h1 className="text-xl font-semibold mt-2">Let’s Make Forms Less Boring!</h1>
        </div>


        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(submitCredentials)}>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem >
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} onChange={(e) => {
                  field.onChange(e)
                  debounced(e.target.value)
                }}/>
                  </FormControl>
                  {isCheckingUsername && <Loader className='fixed mt-7 mr-3 animate-spin'/>}
                 <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-600': 'text-red-600'}`}>{usernameMessage}</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem >
                  <FormLabel>Emai;</FormLabel>
                  <FormControl>
                    <Input placeholder="email@web.com" {...field} />
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


            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full bg-[#FFBF00] text-white py-2 rounded hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              {form.formState.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Signing Up...</span>
                </div>
              ) : (
                <span>Sign Up</span>
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
          Already have an account?{' '}
          <Link href="/sign-in" className="text-[--app-color] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
