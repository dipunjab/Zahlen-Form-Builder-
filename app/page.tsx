import dbConnect from '@/lib/dbConnect'
import React from 'react'

const Home = async() => {
 await dbConnect();
  return (
    <div>
    </div>
  )
}

export default Home
