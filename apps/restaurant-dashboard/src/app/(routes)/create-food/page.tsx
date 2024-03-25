import React from 'react'
import CreateFood from '../../../shared/components/layout/dashboard/create.food'

const Page = () => {
  return (
    <div className='w-full'>
      <h1 className='text-4xl text-center pt-5'>Create food</h1>
      <CreateFood />
    </div>
  )
}

export default Page