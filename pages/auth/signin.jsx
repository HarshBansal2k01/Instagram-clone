import React from 'react'
import { getProviders, signIn as SignIntoProvider } from 'next-auth/react'
import Header from '../../components/Header'
//Browser
function signIn({ providers }) {
  return (
    <>
      <Header />

      <div className="-mt-40 flex min-h-screen flex-col items-center justify-center py-2 px-14 text-center">
        <img className="w-80" src="https://links.papareact.com/ocw" alt="" />
        <p className="font-xs italic">
          This is Instgram Clone not an real ONE!!!!
        </p>

        <div className="mt-40">
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className="rounded-lg bg-blue-500 p-3 text-white"
                onClick={() =>
                  SignIntoProvider(provider.id, { callbackUrl: '/' })
                }
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

//server side rendering user---server side(api)---client
export async function getServerSideProps() {
  const providers = await getProviders()

  return {
    props: {
      providers,
    },
  }
}

export default signIn
