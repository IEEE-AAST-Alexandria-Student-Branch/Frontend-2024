import React, { useEffect } from 'react';
import getCollection from '../../firebase/getCollection';
interface EventHighlight{
  index: number;
  url: string;
}

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

const EventHighlights = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState('');
  const [images, setImages] = React.useState<string[]>([]);
  useEffect(() => {
  getCollection('highlights').then((data) => {
    const sortedHighlights = (data.result || []).sort((a: EventHighlight, b: EventHighlight) => a.index - b.index);
    console.log(sortedHighlights);
    setImages(sortedHighlights.map((highlight: EventHighlight) => highlight.url));
  });
},[])
  const onClose = () => setIsOpen(false);
  const onOpen = (img:string) =>{
    setIsOpen(true);
    setSelectedImage(img);
  }

  return (
    <>
      <div className="flex flex-col items-start w-full container mx-auto">
        <p className="font-bold text-[30px] sm:text-[35px] md:text-[45px] mb-5 w-full mt-20 text-center">Event Highlights</p>
        <div className="flex justify-center w-full">
          <div className="grid sm:hidden grid-cols-3 sm:grid-cols-3 gap-4 p-4">
            <div onClick={()=>{onOpen(images[0])}} className="cursor-pointer col-span-1 sm:col-span-1" style={{ height: '200px' }}>
              <img src={images[0]} alt="Image 1" className="object-cover w-50 h-full border rounded-xl" />
            </div>
            <div onClick={()=>{onOpen(images[1])}} className="cursor-pointer col-span-1 sm:col-span-1" style={{ height: '200px' }}>
              <img src={images[1]} alt="Image 2" className="object-cover w-50 h-full border rounded-xl" />
            </div>
            <div onClick={()=>{onOpen(images[2])}} className="cursor-pointer col-span-1 sm:col-span-1" style={{ height: '200px' }}>
              <img src={images[2]} alt="Image 3" className="object-cover w-50 h-full border rounded-xl" />
            </div>
            <div onClick={()=>{onOpen(images[3])}} className="cursor-pointer col-span-1 sm:col-span-1" style={{ height: '200px' }}>
              <img src={images[3]} alt="Image 4" className="object-cover w-50 h-full border rounded-xl" />
            </div>
            <div onClick={()=>{onOpen(images[4])}} className="cursor-pointer col-span-1 sm:col-span-1" style={{ height: '200px' }}>
              <img src={images[4]} alt="Image 5" className="object-cover w-50 h-full border rounded-xl" />
            </div>
            <div onClick={()=>{onOpen(images[5])}} className="cursor-pointer col-span-1 sm:col-span-1" style={{ height: '200px' }}>
              <img src={images[5]} alt="Image 6" className="object-cover w-50 h-full border rounded-xl" />
            </div>
          </div>
          <div className="hidden sm:grid sm:grid-cols-2 sm:gap-4 sm:p-4 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-4">
            <div onClick={()=>{onOpen(images[0])}} className="cursor-pointer col-span-1" style={{ height: '300px' }}>
              <img src={images[0]} alt="Image 1" className="object-cover w-full h-full border rounded-xl" />
            </div>
            <div onClick={()=>{onOpen(images[1])}} className="cursor-pointer col-span-1 md:col-span-2 lg:col-span-1 row-span-2" style={{ height: '615px' }}>
              <img src={images[1]} alt="Image 2" className="object-cover w-full h-full border rounded-xl" />
            </div>
            <div onClick={()=>{onOpen(images[2])}} className="cursor-pointer col-span-1" style={{ height: '300px' }}>
              <img src={images[2]} alt="Image 3" className="object-cover w-full h-full border rounded-xl" />
            </div>
            <div onClick={()=>{onOpen(images[3])}} className="cursor-pointer col-span-1 md:col-span-2 lg:col-span-1" style={{ height: '300px' }}>
              <img src={images[3]} alt="Image 4" className="object-cover w-full h-full border rounded-xl" />
            </div>
            <div onClick={()=>{onOpen(images[4])}} className="cursor-pointer col-span-1" style={{ height: '300px' }}>
              <img src={images[4]} alt="Image 5" className="object-cover w-full h-full border rounded-xl" />
            </div>
            <div onClick={()=>{onOpen(images[5])}} className="cursor-pointer col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2" style={{ height: '300px' }}>
              <img src={images[5]} alt="Image 6" className="object-cover w-full h-full border rounded-xl" />
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <img src={selectedImage} alt="Selected Image" className="object-cover w-full h-full border rounded-xl" />
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EventHighlights;
