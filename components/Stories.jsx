import Story from '../components/Story'
import faker from 'faker'
import { useSession } from 'next-auth/react'

import { useState, useEffect } from 'react'

function Stories() {

  const {data : session} = useSession();
  //storing faker data so reload does not remove it
  const [suggestions, setSuggestions] = useState([])
  useEffect(() => {
    const suggestions = [...Array(20)].map((_, i) => ({
      // contextualCards generates all the random data
      ...faker.helpers.contextualCard(),
      id: i, // i gives loop
    }))

    console.log(suggestions)
    setSuggestions(suggestions)
  }, [])
  return (
    <div className="my-8 flex space-x-2 rounded-sm border border-gray-200 bg-white p-6 overflow-x-scroll scrollbar-thin scrollbar-thumb-black">
      {session && (
        <Story img ={session.user.image}
        username = {session.user.username}/>
      )}
      {suggestions.map((profile) => (
        <Story
          key={profile.id}
          img={profile.avatar}
          username={profile.username}
        />
      ))}

    </div>
  )
}

export default Stories
