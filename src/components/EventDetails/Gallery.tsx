import React, { useState, useRef,useEffect } from 'react';
import { Stack, Image, Box, Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure } from '@chakra-ui/react';

interface GalleryProps {
  images: string[] | null;
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleImageClick = (img: string) => {
    setSelectedImage(img);
    onOpen();
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (imgRef.current && !imgRef.current.contains(event.target as Node)) {
      onClose()
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <Stack direction='row' alignItems='flex-start' backgroundColor='#00091A' padding='20px 0px 20px 0px' borderRadius='20px'>
        <div style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '20px', gap: '5px' }}>
          {images?.map((img, index) => (
            <Box key={index} w='150px' h='150px' bg='gray.100' overflow='hidden' margin='1px' className='rounded-2xl'>
              <Image
                boxSize='100%'
                objectFit='cover'
                src={img}
                alt={`Image ${index}`}
                borderRadius='none'
                onClick={() => handleImageClick(img)}
                cursor='pointer'
              />
            </Box>
          ))}
        </div>
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose} allowPinchZoom size="full">
        <ModalOverlay />
        <ModalContent background="transparent" w='fit-content' h='fit-content' boxShadow='none' margin='auto'>
          <ModalBody display='flex' alignItems='center' justifyContent='center'>
            {selectedImage && (
              <Image
                ref={imgRef}
                src={selectedImage}
                alt="Photo"
                objectFit='contain'
                maxW='90vw'
                maxH='90vh'
                margin='auto'
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Gallery;
