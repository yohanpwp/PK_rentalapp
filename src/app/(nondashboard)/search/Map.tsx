'use client'
import { useGetPropertiesQuery } from '@/state/api';
import { useAppSelector } from '@/state/redux';
import React, { useEffect, useRef } from 'react'

const Map = () => {
    const mapContainerRef = useRef(null);
    const filters = useAppSelector( (state) => state.global.filters);
    const isFiltersFullOpen = useAppSelector(
        (state) => state.global.isFiltersFullOpen
    )

    const {
        data: properties,
        isLoading,
        isError
    } = useGetPropertiesQuery(filters);

    useEffect( () => {
        if (isLoading || isError || !properties) return;

        const map = new mapboxgl.map()

        //Highlight current properties
        properties.forEach( (property) => {
            const marker = property
        })

        const resizeMap = () => setTimeout( () => map.resize(), 700);
        resizeMap()

        return () => map.remove()
    }, [isLoading, isError, properties, filters.coordinates])

    if (isLoading) return <>Loading...</>
    if (isError || !properties) return <>No Map is Loaded</>

  return (
    <div className='basis-5/12 grow relative rounded-xl'>
        <div 
            className='map-container rounded-xl'
            ref={mapContainerRef}
            style={{
                height: '100%',
                width: '100%'
            }}/>
    </div>
  )
}

export default Map