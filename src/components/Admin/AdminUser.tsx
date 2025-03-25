import { useState } from 'react'
import { IdUserData } from '../../pages/Admin'
import addStorage from '../../firebase/addStorage';
import updateData from '../../firebase/updateData';
import { Button, LightMode } from '@chakra-ui/react';
import GrayProfile from '../../assets/profile-person-white@2x.png';
import { MdSave } from 'react-icons/md';
import { roles as availableRoles } from '../../utils';

interface AdminUserProps {
  selectedUser: IdUserData;
  setSelectedUser: (user: IdUserData) => void;
}

export const AdminUser: React.FC<AdminUserProps> = ({ selectedUser, setSelectedUser }) => {
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const uploadPFP = async (file: File) => {
    setUploading(true);
    await addStorage(file, `profilepics/${selectedUser.id}`).then((res) => {
      setUploading(false);
      setSelectedUser({ ...selectedUser, imgurl: res.link });
    });
  }
  return (
    <>
      <form className='p-4 space-y-4 w-[600px]'>
        <div>
          <label className='block text-sm font-medium text-gray-300'>First Name</label>
          <input
            type='text'
            value={selectedUser.firstname || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, firstname: e.target.value })}
            className='mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-2 h-10'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-300'>Last Name</label>
          <input
            type='text'
            value={selectedUser.lastname || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, lastname: e.target.value })}
            className='mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-2 h-10'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-300'>Email</label>
          <input
            type='email'
            value={selectedUser.email || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
            className='mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-2 h-10'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-300'>Roles</label>
          {selectedUser.roles?.map((role, index) => (
            <div key={index} className='flex items-center gap-2 mt-1'>
              <select
                value={role}
                onChange={(e) => {
                  const newRoles = [...(selectedUser.roles || [])];
                  newRoles[index] = e.target.value;
                  setSelectedUser({ ...selectedUser, roles: newRoles });
                }}
                disabled={role === 'admin'}
                className={`block w-full rounded-md bg-gray-700 border-gray-600 text-white px-2 h-10 ${role === 'admin' ? 'cursor-not-allowed opacity-25' : ''}`}
              >
                <option value="" disabled>Select role</option>
                {availableRoles.filter(r => !selectedUser.roles?.includes(r) || r === role).map(filteredRole => (
                  <option key={filteredRole} value={filteredRole}>{filteredRole}</option>
                ))}
              </select>

              <LightMode><Button
                onClick={() => {
                  const newRoles = selectedUser.roles?.filter((_, i) => i !== index);
                  setSelectedUser({ ...selectedUser, roles: newRoles });
                }}
                isDisabled={role === 'admin'}
                colorScheme='red'
              >
                -
              </Button></LightMode>

            </div>

          ))}
          {(selectedUser.roles?.length || 0 < availableRoles.length) &&
            <LightMode><Button
              onClick={() => {
                const newRoles = [...(selectedUser.roles || []), ''];
                setSelectedUser({ ...selectedUser, roles: newRoles });
              }}
              className='mt-2'
              colorScheme='green'
            >
              +
            </Button></LightMode>

          }
          <p className='text-red-700 font-extrabold mt-4'>WARNING: Adding admin role can only be undone directly from Firebase! You can refresh the page or switch selected user without saving to undo any changes.</p>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-300'>Profile Picture</label>
          <input
            type='file'
            accept='image/*'
            onChange={async (e) => {
              if (e.target.files && e.target.files[0]) {
                await uploadPFP(e.target.files[0]);
              }
            }}
            className='mt-1 block w-full text-white'
          />

          <img src={selectedUser.imgurl ? selectedUser.imgurl : GrayProfile} alt='Profile' className='mt-2 w-20 h-20 rounded-full' />

        </div>
        <div>
          <label className='block text-sm font-medium text-gray-300'>Mobile</label>
          <input
            type='tel'
            value={selectedUser.mobile || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, mobile: e.target.value })}
            className='mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-2 h-10'
          />
        </div>
        <div className='flex items-center gap-2 w-full sticky bottom-0 p-4 bg-[#0B162A]'>
          <LightMode>
            <Button
              onClick={async () => {
                setSaving(true);
                const cleanedRoles = selectedUser.roles?.filter(role => role !== '');
                await updateData('users', selectedUser.id, { ...selectedUser, roles: cleanedRoles });
                setSaving(false);
              }}
              className='mt-4'
              colorScheme='blue'
              fontSize='16px'
              leftIcon={<MdSave />}
              isLoading={uploading || saving}
              loadingText={uploading? 'Uploading' : 'Saving'}>
              Save
            </Button>
          </LightMode>
        </div>
      </form>

    </>
  )
}
