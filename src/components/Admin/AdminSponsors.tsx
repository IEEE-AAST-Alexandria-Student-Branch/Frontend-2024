import { useEffect, useState } from 'react';
import getCollection from '../../firebase/getCollection';
import { EventData } from '../../interfaces/EventData';
import { IoIosAdd } from 'react-icons/io';
import { IconButton } from '@chakra-ui/react';

interface Sponsor {
  id: string;
  name: string;
}

interface AdminSponsorsProps {
  event: EventData;
  setEvent: (event: EventData) => void;
}

export const AdminSponsors = ({ event: { sponsors = [], ...restEvent }, setEvent }: AdminSponsorsProps) => {
  const event = { sponsors, ...restEvent };
  const [availableSponsors, setAvailableSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    const fetchSponsors = async () => {
      const sponsorsCollection = await getCollection('sponsors');
      const sponsorsWithIds = sponsorsCollection.result?.map((sponsor, index) => ({
        name: sponsor.name,
        id: sponsorsCollection.ids ? sponsorsCollection.ids[index] : ''
      }));
      setAvailableSponsors(sponsorsWithIds || []);
      // console.log(sponsorsWithIds);
    };
    fetchSponsors();
  }, []);

  return (
    <>
      {event.sponsors.map((sponsor, index) => (
        <div key={index} className='flex items-center gap-2 mt-1'>
          <select
            value={sponsor}
            onChange={(e) => {
              const newSponsors = [...event.sponsors];
              newSponsors[index] = e.target.value;
              setEvent({ ...event, sponsors: newSponsors });
            }}
            className={`block w-full rounded-md bg-gray-700 border-gray-600 text-white px-2 h-10`}
          >
            {availableSponsors.filter(s => !event.sponsors.includes(s.id) || s.id === sponsor).map(filteredSponsor => (
              <option key={filteredSponsor.id} value={filteredSponsor.id}>{filteredSponsor.name}</option>
            ))}
          </select>

          <button
            type='button'
            onClick={() => {
              const newSponsors = event.sponsors.filter((_, i) => i !== index);
              setEvent({ ...event, sponsors: newSponsors });
            }}
            className={`bg-red-600 text-white py-1 px-2 rounded-md`}
          >
            -
          </button>
        </div>
      ))}
      {event.sponsors.length < availableSponsors.length &&
        <IconButton 
          aria-label='Add Sponsor'
          onClick={() => {
            const newSponsors = [...event.sponsors, availableSponsors.find(s => !event.sponsors.includes(s.id))?.id || ''];
            setEvent({ ...event, sponsors: newSponsors });
          }}
          size='sm'
          icon={<IoIosAdd />}
          fontSize='20px'
          isRound={true}
        />
      }
    </>
  );
};
