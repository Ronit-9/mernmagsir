import { Input } from '@/components/ui/input'
import React from 'react'
import Alcoholic from '../cocktail/Alcoholic'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const nav= useNavigate();
  return (
    <div>
<div className="grid grid-cols-4 gap-4 mt-7 items-center w-4/5 mx-auto">
        <img  src='https://www.thecocktaildb.com/images/cocktail_left.png' />
           <div className='col-span-2 space-y-3 text-center '>
              <h2 className='text-4xl'>
            Welcome to TheCocktailDB
           </h2>
           <p className='text-1xl mr-8 ml-8'>
            An open, crowd-sourced database of drinks and cocktails from around the world.
            We also offer a free cocktail API for anyone wanting to use it.
           </p>
          
        <form   className="max-w-2xl self-center" 
        action={(formData)=>{
          nav(`/search?s=${formData.get('search')}`)
        }}
        >
          <Input
           name="search"
            className="w-auto inline-block bg-white text-black self-center"
            type="text" placeholder="Search"  />

        </form>
  
           </div>
          <img src='https://www.thecocktaildb.com/images/cocktail_left.png'/>
      </div>
  <hr className="border-t-2 w-4/5 mx-auto mb-7 mt-6" />
        <Alcoholic/>
   
    </div>
  )
}
