import Img9 from '../assests/img9.svg'
import MaxWidthWrapper from './MaxWidthWrapper';

import React from 'react'

const NoDataFound = ({title,subtitle}) => {
  return (
    <MaxWidthWrapper>

  
    <div className='h-full w-full flex justify-center items-center flex-col'>

        <div className='w-80 mt-8'>
            <img src={Img9} alt="No Found Image" />
        </div>
        <div className='text-3xl text-gray-900 font-bold'>
            {title}
        </div>
        { subtitle && <div className='text-sm text-muted-foreground font-semibold'>
            {subtitle}
        </div>}

    </div>
    </MaxWidthWrapper>
  )
}

export default NoDataFound;