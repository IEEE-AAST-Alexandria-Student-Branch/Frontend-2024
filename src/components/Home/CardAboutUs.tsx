import React from 'react';
import Quote from '../../interfaces/Quote';

interface CardAboutUsProps {
  quote: Quote;
}

export const CardAboutUs = ({ quote }: CardAboutUsProps) => {
  return (
    <div className='bg-orange-50 rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 xl:p-8 min-h-[350px] sm:min-h-[400px] md:min-h-[450px] lg:min-h-[433px] xl:min-h-[400px]'>
      <div className='flex flex-col xl:flex-row xl:gap-5 space-y-4 xl:space-y-0 h-full'>
        <img
          className="rounded-3xl h-48 sm:h-56 md:h-64 lg:h-72 xl:w-[30%] xl:h-[430px] object-cover"
          src={quote.img}
          alt={`${quote.by}'s photo`}
        />
        <div className='flex flex-col justify-between space-y-4 xl:w-1/3 xl:min-h-[433px]'>
          <p className='text-black text-lg sm:text-xl md:text-xl lg:text-2xl italic'>"{quote.text}"</p>
          <div className='flex items-center'>
            <img src={quote.logo} height="40" width="40" alt={`${quote.by}'s logo`} />
            <div className='flex flex-col text-black ml-3'>
              <p className="font-bold text-base sm:text-base md:text-lg lg:text-lg">{quote.by}</p>
              <p className="font-semibold text-sm sm:text-sm md:text-base lg:text-base text-slate-500">{quote.speakertitle}</p>
            </div>
          </div>
        </div>
        <div className='xl:w-[2px] sm:w-[2px] bg-gray-200'></div>
        <div className='flex flex-col justify-end text-black'>
          <p className='text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-6xl font-bold'>{quote.value}</p>
          <p className='mt-1 text-sm sm:text-sm md:text-base lg:text-lg xl:text-lg font-semibold text-slate-500'>{quote.quality}.</p>
        </div>
      </div>
    </div>
  );
};
