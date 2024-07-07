
type CardProps = {
    image: string;
    quote: string;
    logo: string;
    name: string;
    position: string;
    company: string;
    percentage: string;
    description: string;
}

export const CardAboutUs = (data: CardProps) => {
  return (
    <div className='bg-orange-50 rounded-3xl  xl:min-h-[350px] lg:min-h-[433px] p-2'>
        <div className='flex xl:flex-row flex-col space-y-5 h-full'>
            <img  className="rounded-3xl xl:w-[30%] xl:h-[450px] lg:w-full h-96 w-full md:h-[550px] object-cover" src={data.image} />
            <div className='flex flex-col justify-between space-y-6 xl:w-1/3 xl:min-h-[433px] p-2 '>
                <p className='text-black text-2xl italic'>{data.quote}</p>
                <div className='flex items-center mt-auto'>
                    <img src={data.logo} height="100" width="100"/>
                    <div className='flex flex-col text-black'>
                        <p className="font-bold text-[18px]">{data.name}</p>
                        <p className="font-semibold text-[18px] text-slate-500">{data.position}</p>
                    </div>
                </div>

            </div>
            <div className=' xl:w-[2px] sm:w-[2px] bg-gray-200 rounded-3xl'></div>
            <div className='mt-auto text-black p-2 lg:flex lg:flex-col lg:justify-end '>
                <div className='flex flex-col '>
                <p className=' text-7xl font-bold sm:font-normal'>{data.percentage}</p>
                <p className='ml-2 font-semibold text-[18px] text-slate-500'>{data.description}</p>
                </div>
            </div>
        </div>
    </div>
  )
}