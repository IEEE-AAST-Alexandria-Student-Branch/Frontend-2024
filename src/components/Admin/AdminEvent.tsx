import { useState, useEffect } from 'react';
import firebase from "firebase/compat/app";
import { EventData } from '../../interfaces/EventData';
import addStorage from '../../firebase/addStorage';
import { Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, LightMode } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from '@chakra-ui/react';
import AdminSchedule from './AdminSchedule';
import { AdminSponsors } from './AdminSponsors';
import { AdminResources } from './AdminResources';
import { AdminGallery } from './AdminGallery';
import updateData from '../../firebase/updateData';
import addDocument from '../../firebase/addData';
import { Link, useNavigate } from 'react-router-dom';
import { eventTypesWithColors, autoColorByTopic, convertBRTagsToNewLines, convertNewLinesToBRTags} from '../../utils';
import { EventCard } from '../common/EventCard';
import { MdSave } from 'react-icons/md';

interface AdminEventProps {
  event: EventData;
  events: EventData[];
  setEvents: (events: EventData[]) => void;
  setSelectedEvent: (event: EventData) => void;
}

const convertDate = (date: firebase.firestore.Timestamp | null) => {
  if (!date) return null;
  const localDate = new Date(date.toDate().getTime() - date.toDate().getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

const AdminEvent: React.FC<AdminEventProps> = ({ event, events, setEvents, setSelectedEvent }) => {
  const navigate = useNavigate();
  const originalEventTitle = event.title;
  const [eventData, setEventData] = useState<EventData>({
    ...event,
    title: event.title || '',
    formLink: event.formLink || '',
    description: event.description || '',
    type: event.type || eventTypesWithColors[0].type,
    starttime: event.starttime || null,
    endtime: event.endtime || null,
    coverPhoto: event.coverPhoto || '',
    registrationOpen: event.registrationOpen || false,
    schedule: event.schedule || [],
    gallery: event.gallery || [],
  });
  const [modalVer, setModalVer] = useState<string|null>(null);
  const onClose = () => setModalVer(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [enableColor, setEnableColor] = useState(false);
  const [colorPicker, setColorPicker] = useState<string | undefined>(undefined); //This only exists to save the selected color the put it back if you disable then re-enable the color picker
  useEffect(() => {
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      (fileInput as HTMLInputElement).value = '';
    }
  }, [event]);

  useEffect(() => {
    setEnableColor(event.cardColor !== undefined);
    setEventData(event);
  }, [event]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Handle datetime-local input for starttime and endtime
    if (name === 'starttime' || name === 'endtime') {
      if (value === '') return undefined;
      const dateValue = value ? firebase.firestore.Timestamp.fromDate(new Date(value)) : null;
      setEventData({ ...eventData, [name]: dateValue });
    } else {
      setEventData({ ...eventData, [name]: value });
    }

    if (name === 'type') {
      const { type, cardColor, ...rest } = eventData;
      setEventData({ ...rest, type: value === ''? type : value, cardColor: enableColor? cardColor: autoColorByTopic(value) });
    }

    console.log(event);
  };

  // Submit event data form
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const { id, ...eventDataWithoutId } = {
      ...eventData,
      description: convertNewLinesToBRTags(eventData.description),
    };
    setSaving(true);

    if (id) {
      const { error } = await updateData('events', id, eventDataWithoutId, enableColor ? [] : ["cardColor"]);
      if (error) {
        console.error(error);
        alert('Error saving: ' + error);
      } else {
        if (confirm('Event updated successfully, would you like to navigate to the event page?')) {
          navigate(`/event/${eventData.title}`);
        }
      }
    } else {
      const { result, error } = await addDocument('events', eventDataWithoutId);
      if (error) {
        console.error(error);
        alert('Error creating: ' + error);
      } else { // Get the new ID and use it to select the created event
        
        const newEventData = {
          ...eventData,
          id: result?.id || null
        }

        setEvents([
          ...events,
          newEventData
        ]);

        setEventData(newEventData);

        setSelectedEvent(newEventData);


        if (confirm('Event created successfully, would you like to navigate to the event page?')) {
          navigate(`/event/${eventData.title}`);
        }
      }
    }

    setSaving(false);
  };

  // Upload event cover image
  const uploadCover = async (file: File) => {
    setUploading(true);
    await addStorage(file, `events/${eventData.title}`).then((res) => {
      setUploading(false);
      setEventData({ ...eventData, coverPhoto: res.link });
    });
  };

  return (
    <div className='flex justify-between'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 p-4  rounded shadow-md w-full'>
        <label className='flex flex-col'>
          <span className='mb-2 font-semibold'>Title</span>
          <input
            type="text"
            name="title"
            onChange={handleChange}
            value={eventData.title || ''}
            className='p-2 rounded bg-gray-800'
            required
          />
        </label>
        <div className='flex gap-4'>
          <label className='flex flex-col'>
            <span className='mb-2 font-semibold'>Form Link</span>
            <input type="text"
              name="formLink"
              onChange={handleChange}
              value={eventData.formLink || ''}
              className='p-2 rounded bg-gray-800'
              required={eventData.registrationOpen}
            />
          </label>
          <label className='flex h-fit gap-2 mb-auto mt-10'>
            <span className='font-semibold'>Registration Open?</span>
            <input type="checkbox"
              name="registrationOpen"
              checked={eventData.registrationOpen}
              onChange={(e) => setEventData({ ...eventData, registrationOpen: e.target.checked })}
              className='p-2 rounded bg-gray-800 w-6'
            />
          </label>

            </div>
            <label className='flex flex-col'>
                <span className='mb-2 font-semibold'>Location</span>
                <input type="text"
                    name="location"
                    onChange={handleChange}
                    value={eventData.location}
                    className='p-2 rounded bg-gray-800'
                />
            </label>
            <label className='flex flex-col'>
                <span className='mb-2 font-semibold'>Description</span>
                <textarea 
                    name="description" 
                    value={convertBRTagsToNewLines(eventData.description)} 
                    onChange={handleChange} 
                    className='p-2 rounded bg-gray-800 h-40 resize-none customScrollbar'
                    required
                    placeholder='You can use markdown/rich text here by inserting tags! please don&apos;t XSS the site :( '
                />
            </label>
            <div>
                <label className='font semibold'>Cover Photo</label>
                <input
                    type='file'
                    accept='image/*'
                    onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                            await uploadCover(e.target.files[0]);
                        }
                    }}
                    className='mt-1 block w-full text-white'
                    required={eventData.coverPhoto === ''||eventData.coverPhoto === undefined||eventData.coverPhoto === null}
                />
                {eventData.coverPhoto && (
                    <img src={eventData.coverPhoto} alt='Profile' className='mt-2 w-20 h-20 rounded-md' />
                )}
            </div>
            <label className='flex flex-col'>
                <span className='mb-2 font-semibold'>Type</span>
                <select 
                    name="type" 
                    value={eventData.type || ''} 
                    onChange={handleChange} 
                    className='p-2 rounded bg-gray-800'
                    required
                >
                    <option value="" disabled>Select a type</option>
                    {eventTypesWithColors.map((type) => (
                        <option key={type.type} value={type.type}>
                            {type.type}
                        </option>
                    ))}
                </select>
            </label>
            <label className='flex flex-col'>
                <span className='mb-2 font-semibold'>Start Time</span>
                <input 
                    type="datetime-local" 
                    name="starttime" 
                    value={convertDate(eventData.starttime ?? null) || ''}
                    onChange={handleChange} 
                    className='p-2 rounded bg-gray-800'
                />
            </label>
            <label className='flex flex-col'>
                <span className='mb-2 font-semibold'>End Time</span>
                <input 
                    type="datetime-local" 
                    name="endtime" 
                    value={convertDate(eventData.endtime ?? null) || ''}
                    onChange={handleChange} 
                    className='p-2 rounded bg-gray-800'
                />
            </label>
            <label className='flex items-center gap-4'>
                <span className='font-semibold'>Enable Custom Card Color</span>
                <input 
                    type="checkbox" 
                    name="enableCustomColor" 
                    className='p-2 rounded bg-gray-800'
                    checked={enableColor}
                    onChange={(e) => {
                        if(!e.target.checked){
                            setColorPicker(eventData.cardColor);
                            setEventData({...eventData,cardColor:undefined});
                        }
                        else{
                            setEventData({...eventData,cardColor:colorPicker});
                        }
                        setEnableColor(e.target.checked);
                    }}
                />
            </label>
            <label className='flex items-center gap-4'>
                <span className='font-semibold'>Card Color</span>
                <input 
                    type="color" 
                    name="cardColor" 
                    value={enableColor?eventData.cardColor:autoColorByTopic(eventData.type)} 
                    onChange={handleChange}
                    className={`p-2 rounded bg-gray-800 h-12 ${!enableColor && 'opacity-25 cursor-not-allowed'}`}
                    disabled={!enableColor}
                />
            </label>

        <Accordion allowMultiple>
          <AccordionItem>
            <AccordionButton>
              Schedule
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <AdminSchedule event={eventData} setEvent={setEventData} />
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              Sponsors
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <AdminSponsors event={eventData} setEvent={setEventData} />
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              Resources
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <AdminResources event={eventData} setEvent={setEventData} setUploading={setUploading} />
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              Gallery
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <AdminGallery event={eventData} setEvent={setEventData} setUploading={setUploading} />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <div className='flex gap-4 w-full items-center sticky bottom-0 bg-[#0B162A] p-4'>
          <LightMode>
            <Button 
              type="submit" 
              loadingText={uploading? 'Uploading': 'Saving'}
              colorScheme='blue'
              className='p-2 mt-4'
              fontSize='16px'
              leftIcon={<MdSave />}
              isLoading={uploading || saving}
              isDisabled={uploading || saving || eventData === event}
              >
              Save
            </Button>
            <Button 
              colorScheme='red'
              className='p-2 mt-4'
              fontSize='16px'
              onClick={() => setModalVer("revert")}
              isDisabled={eventData === event}
            >
              Revert Changes
            </Button>
          </LightMode>
        </div>
      </form>
      <div className='sticky top-4 self-start cursor-pointer' onClick={() => {
        eventData === event ? navigate(`/event/${eventData.title}`) :
        setModalVer("save")
        }}>
        <EventCard className='max-w-fit' event={eventData} disabled />
      </div>
      <Modal isOpen={modalVer!=null} onClose={onClose} isCentered size={'xl'}>
        <ModalOverlay />
        {
          modalVer === "save" &&
        <ModalContent bg={"#151F33"}>
          <ModalHeader>Save Changes?</ModalHeader>
          <ModalCloseButton />
          <ModalBody >
            <p>You are about to leave to go to the event page of <strong>{originalEventTitle}</strong>. Do you want to save your changes?</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleSubmit}>
              Save Changes
            </Button>
            <Link to={`/event/${originalEventTitle}`} className='text-white'>
              <Button colorScheme="red" mr={3}>
                Go Without Saving
              </Button>
            </Link>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
        }
                {
          modalVer === "revert" &&
        <ModalContent bg={"#151F33"}>
          <ModalHeader>Revert Changes?</ModalHeader>
          <ModalCloseButton />
          <ModalBody >
            <p>Are you sure you want to revert your changes to <strong>{originalEventTitle}</strong>?</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={()=>{setEventData(event);onClose()}}>
              Revert
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
        }
        
      </Modal>
    </div>
  );
};

export default AdminEvent;
