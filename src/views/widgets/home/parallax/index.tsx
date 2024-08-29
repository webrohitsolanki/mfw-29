import React from 'react';
import { Parallax, Background } from 'react-parallax';
import { useMediaQuery } from '@akinon/next/hooks';

const ParallaxRender = ({ children , backgroundColor }) => {
    const isDesktop = useMediaQuery('(min-width: 1000px)');

    return isDesktop ? (
        <Parallax strength={300} className='lg:h-[100vh] h-[70vh]' style={{ backgroundColor, display: 'grid', placeItems: 'center' }}>
            <Background>
                {children}
            </Background>
        </Parallax>
    ) : (
        <div className='lg:h-[100vh]'>
            {children}
        </div>
    );
};

export default ParallaxRender;
