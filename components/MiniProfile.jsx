import React from 'react'
import {signOut, useSession} from "next-auth/react";

function MiniProfile() {
  const {data :session} = useSession();

  console.log(session);
  return (
    <div className="mt-14 ml-10 flex items-center justify-between">
      <img
        className="h-16 w-16 rounded-full border p-[2px]"
        src={session?.user?.image}
        alt=""
      />

      <div className='flex-1 mx-4'>
        <h2 className='font-bold'>{session?.user?.username}</h2>
        <h3 className='text-sm text-gray-400'>Welcome to instagram</h3>
      </div>

      <button onClick={signOut} className='text-blue-400 text-sm font-semibold'>Sign Out</button>
    </div>
  )
}

export default MiniProfile
