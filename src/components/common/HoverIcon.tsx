import React from 'react'
import { Tooltip } from '@chakra-ui/react';

interface HoverIconProps {
    src: string;
    alt: string;
    className?: string;
    hoverText?: string;
}

export const HoverIcon: React.FC<HoverIconProps> = ({ src, alt, className, hoverText }) => {
    const content=
    <div className={className}>
        <img src={src} alt={alt} className='hover:scale-125 transition-transform duration-200 w-10 h-10 min-w-10' />
    </div>
    return (
        (hoverText&&hoverText.length>0)?
        <Tooltip label={hoverText}>
            {content}
        </Tooltip>
        :
        content
    )
}
