
import React, { useState, useEffect } from 'react';
import { CardAboutUs } from "./CardAboutUs";
import Quote from '../../interfaces/Quote';
import getCollection from "../../firebase/getCollection";

export const AboutUs = () => {
const [branchQuotes, setBranchQuotes] = useState<Quote[]>([]);

useEffect(() => {
  getCollection('quotes').then((data) => {
    setBranchQuotes(data.result || []);
  });
}, []);

return (
  <div className='flex flex-col gap-4 w-full px-6 md:px-14 lg:px-7 container mx-auto'>
    <p className="font-bold text-[2rem] md:text-[3rem] lg:text-[3rem] p-8 text-center">What People Say About Us</p>
    {
      branchQuotes.map((quote, index) => (
        <CardAboutUs key={index} quote={quote} />
      ))
    }
  </div>
);
}


