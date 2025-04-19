import { useContext } from 'react';
import { Menu, MenuButton, MenuList, MenuItem, Avatar } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import SignOut from '../../firebase/signout';

const ProfileMenu = () => {
  const { userData, userId } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <Menu>
      <MenuButton>
        <Avatar
          size='md'
          src={userData?.imgurl}
          name={`${userData?.firstname} ${userData?.lastname}`}
        />
      </MenuButton>
      <MenuList bg={'#00091A'} color={'white'} className='text-xl'>
        <div className='px-3 text-3xl'>{`${userData?.firstname} ${userData?.lastname}`}</div>
        <Link to={`/profile/${userId}`}>
          <MenuItem
            bg={'#151F33'}
            border={'1px solid #00091A'}
            _focus={{ bg: '#1e2c48' }}
          >
            Profile
          </MenuItem>
        </Link>
        <MenuItem
          bg={'#151F33'}
          border={'1px solid #00091A'}
          _focus={{ bg: '#1e2c48' }}
          onClick={userData ? () => { 
            SignOut(); 
            navigate('/'); 
            navigate(0);
            const { setUserData, setUserId } = useContext(UserContext);
            setUserData(null);
            setUserId(null);
          } : () => { }}
        >
          Sign Out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
