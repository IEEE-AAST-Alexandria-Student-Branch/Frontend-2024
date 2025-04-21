import {
  Tr,
  Td,
  Avatar,
  Stack,
  Flex,
} from '@chakra-ui/react'
import { Social } from './Social';

export const Speaker = ({ name, src, bio, links }: {name: string, src:string, bio:string, links:any}) => {
  return (
    <>
      <Tr>
        <Td>
          <Stack direction={'row'} alignItems="center">
            <Avatar name={name} src={src} key={name}/>
            {/* < CustomAvatar name={name} bio={bio} src={src} Slinks={{ twitter: 'twitter.com', instagram: '', linkedin: '' }} /> */}
          </Stack>
        </Td>
        <Td>
          <>{name}</>
        </Td>
        <Td>
          <>{bio}</>
        </Td>
        <Td>
          <Flex className='!space-x-3'>
            <Social links={links} />
          </Flex>
        </Td>
      </Tr>
    </>
  );
}
