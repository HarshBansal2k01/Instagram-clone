import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import Post from '../components/Post'
import { db } from '../firebase'



function Posts() {
  const [posts, setPosts] = useState([])

  useEffect(
    () =>
      //unsubscribe make sure we donot add more than one time row listener
      // const unsubscribe = replaced it by return
      onSnapshot(
        query(collection(db, 'posts'), orderBy('timestamp', 'desc')),
        (snapshot) => {
          //updates the reacts state with latest docs as the backend changes
          setPosts(snapshot.docs)
        }
      ),
    // cleans the useEffect
    // return unsubscribe;

    [db]
  )

 

  return (
    <div>
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          username={post.data().username}
          userImg={post.data().profileImg}
          img={post.data().image}
          caption={post.data().caption}
        />
      ))}
    </div>
  )
}

export default Posts
