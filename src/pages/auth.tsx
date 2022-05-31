// auth.tsx
import 'firebase/compat/auth';

import { getAuth } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import { BsGoogle } from 'react-icons/bs';

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'redirect',
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

function SignInScreen() {
  const [user] = useAuthState(getAuth(app));
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  const [signInWithGoogle, user2, loading, error] = useSignInWithGoogle(
    getAuth(app)
  );

  const checkIfUserExists = async (uid: string) => {
    const userInfo = await getDoc(doc(getFirestore(app), 'users', uid));
    if (userInfo.exists()) {
      router.push('/');
    } else {
      router.push('/registration');
    }
  };

  if (user) {
    console.log(user);
    checkIfUserExists(user.uid);
  }

  return (
    <div className="flex h-screen justify-center bg-slate-50 p-4">
      <div className="my-10 h-fit w-full min-w-fit max-w-md rounded-md border-2 border-solid border-slate-100 bg-white p-10 shadow">
        {/* <h1 className="ml-5 text-lg italic text-slate-700">star tub</h1> */}
        <div className="flex items-center">
          {/* <Image src="/logo.png" width="64" height="64" /> */}
          <h1 className=" text-xl font-semibold text-slate-700">Sign In</h1>
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          {/* register your input into the hook by invoking the "register" function */}
          <input
            placeholder="E-mail*"
            type="email"
            {...register('email')}
            className="mt-4 flex items-center justify-center rounded border-1 border-slate-300 py-1 px-2 text-slate-400"
          />
          <input
            placeholder="Password*"
            type="password"
            {...register('password', { required: true })}
            className="mt-4 flex items-center justify-center rounded border-1 border-slate-300 py-1 px-2 text-slate-400"
          />

          {/* errors will return when field validation fails  */}
          {errors.exampleRequired && <span>This field is required</span>}

          <input
            className="my-4 cursor-pointer rounded bg-slate-500 p-1 font-bold text-slate-50"
            type="submit"
          />
        </form>
        <div className="flex items-center justify-center text-slate-600">
          <div className="ml-4 mr-2 w-full border-b-1 border-slate-400" />
          <div className="text-sm text-slate-400">or</div>
          <div className="mr-4 ml-2 w-full border-b-1 border-slate-400" />
        </div>

        {/* <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={getAuth(app)} /> */}
        <div className="my-4 flex cursor-pointer items-center justify-center rounded border-1 border-slate-600 py-1 text-center">
          <div className="flex items-center text-slate-600">
            <BsGoogle className="mr-2" />
            <button
              className="font-semibold"
              onClick={() => signInWithGoogle()}
            >
              Sign In With Google
            </button>
          </div>
        </div>
        <div className="flex">
          <div className="text-slate-700">Don't have an account? </div>
          <Link href="/registration">
            <a className="ml-1">Sign up!</a>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignInScreen;
