import { Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator, Center, Spinner } from '@chakra-ui/react';
import { VolunteersCarousel } from './VolunteersCarousel';
import HeadVolunteer from '../../interfaces/HeadVolunteer.tsx';
import { useState, useEffect } from 'react';
import getCollection from '../../firebase/getCollection.js';

interface GroupedHeads {
  [year: number]: {
    boards: HeadVolunteer[],
    heads: HeadVolunteer[]
  }
}
const years = [2024];
const showHeads = false;

export const Volunteers = () => {
  const [headsByYear, setHeadsByYear] = useState<GroupedHeads>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const boardRoleOrder = ['Chairman', 'Vice Chairman', 'Secretary', 'Treasurer'];
    const headRoleOrder = [
      'Head of IT Committee',
      'Head of Web Team (IT Committee)',
      'Head of Mobile Team (IT Committee)',
      'Head of Technical Committee',
      'Head of Operations Committee',
      'Head of Registration Committee',
      'Head of Media Committee',
      'Head of Marketing Committee',
      'Head of Documentation Committee'
    ];

    const fetchData = async () => {
      try {
        const response = await getCollection('heads');

        if (response.result) {
          const result: HeadVolunteer[] = response.result;
          const groupedHeads = result.reduce((acc: GroupedHeads, head) => {
            const year = head.year;
            if (!acc[year]) {
              acc[year] = { boards: [], heads: [] };
            }
            if (head.board) {
              acc[year].boards.push(head);
            } else {
              acc[year].heads.push(head);
            }
            return acc;
          }, {});

          for (const year in groupedHeads) {
            groupedHeads[year].boards.sort((a, b) => boardRoleOrder.indexOf(a.role) - boardRoleOrder.indexOf(b.role));
            groupedHeads[year].heads.sort((a, b) => headRoleOrder.indexOf(a.role) - headRoleOrder.indexOf(b.role));
          }

          setHeadsByYear(groupedHeads);
          setIsLoading(false);
          console.log(groupedHeads);
        } else {
          console.error('Failed to retrieve heads:', response.error);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching heads:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full container mx-auto overflow-hidden mt-[40px]">
      <p className="font-bold text-[30px] sm:text-[35px] md:text-[45px] mb-5 w-full mt-10 text-center">Meet Talent in Our Team</p>

      {isLoading ? (
        <Center mt={8}>
          <Spinner size="xl" />
        </Center>
      ) : (
        <div>
          <Tabs className='relative' variant='unstyled' defaultIndex={0}>
            <TabList className='bg-[#151F33] rounded-full px-[20px] md:px-[30px] mt-4 gap-1 md:gap-2 justify-around w-fit mx-auto'>
              {years.map((year) => (
                <Tab key={year} w={'fit-content'} className="px-2 text-base md:text-lg lg:text-xl xl:text-2xl">
                  <p className='text-[9vw] sm:text-[40pt]'>{year}</p>
                </Tab>
              ))  
              }
            </TabList>
            <TabIndicator mt='-1.5px' height='2px' bg='white' borderRadius='1px' />
            <TabPanels>
              {years.map((year) => (
                <TabPanel key={year}>
                  <Tabs className="relative" variant='unstyled' defaultIndex={0}>
                    <Center>
                      <TabList className="bg-[#151F33] rounded-full px-4 py-1 gap-2">
                        <Tab w={"80px"} h={"40px"} className="px-1 sm:px-2 md:px-3 text-xs sm:text-sm md:text-base lg:text-lg">
                          Board
                        </Tab>{ showHeads ? (
                        <Tab w={"80px"} h={"40px"} className="px-1 sm:px-2 md:px-3 text-xs sm:text-sm md:text-base lg:text-lg">
                          Heads
                        </Tab>) : null
                        }
                      </TabList>
                    </Center>
                    <TabIndicator mt='-1.5px' height='2px' bg='white' borderRadius='1px' />
                    <TabPanels>
                      <TabPanel>
                        {headsByYear[year] && headsByYear[year].boards.length > 0 ? (
                          <VolunteersCarousel volunteers={headsByYear[year].boards} />
                        ) : (
                          <p>No boards available for {year}</p>
                        )}
                      </TabPanel>
                      
                      {
                        showHeads ? (headsByYear[year] && headsByYear[year].heads.length > 0 ? (  
                          <TabPanel>
                            <VolunteersCarousel volunteers={headsByYear[year].heads} />
                          </TabPanel>
                        ) : (
                          <p>No heads available for {year}</p>
                        )) : null
                      }
                    </TabPanels>
                  </Tabs>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </div>
      )}
    </div>
  );
};
