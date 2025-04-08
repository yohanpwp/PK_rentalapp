"use client";
import { useGetPropertiesQuery } from "@/state/api";
import { useAppSelector } from "@/state/redux";
import React, { useEffect, useRef } from "react";
import {
  APIProvider,
  Map as GoogleMap,
  MapCameraChangedEvent,
  Pin,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";

type Poi ={ key: string, location: google.maps.LatLngLiteral }

const Map = () => {
  const mapContainerRef = useRef(null);
  const filters = useAppSelector((state) => state.global.filters);
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );

  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  const marker : Poi[] = [];

  useEffect(() => {
    if (isLoading || isError || !properties) return;

    //Highlight current properties
    properties.forEach((property) => {
      marker.push({
        key: property.name,
        location: {
          lat: property.location.coordinates.latitude,
          lng: property.location.coordinates.longitude,
        },
      });
    });
    // const resizeMap = () => setTimeout( () => map.resize(), 700);
    // resizeMap()
  }, [isLoading, isError, properties, filters.coordinates, marker]);

  const PoiMarkers = (props : {pois: Poi[]}) => {
    return (
      <>
        {props.pois.map( (poi) => (
          <AdvancedMarker
            key={poi.key}
            position={poi.location}
            clickable={true}
            onClick={(e) => console.log(e.latLng.toString())}>
          <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
          </AdvancedMarker>
        ))}
      </>
    );
  };

  if (isLoading) return <>Loading...</>;
  if (isError || !properties) return <>No Map is Loaded</>;

  return (
    <div className="basis-5/12 grow relative rounded-xl">
      <div
        className="map-container rounded-xl"
        ref={mapContainerRef}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <APIProvider
          apiKey={String(process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY)}
          onLoad={() => console.log("Maps API has loaded.")}
        >
          <GoogleMap
            defaultZoom={13}
            defaultCenter={{
              lat: properties[0].location.coordinates.latitude,
              lng: properties[0].location.coordinates.longitude,
            }}
            mapId= '4504f8b37365c3d0'
          >
            <PoiMarkers pois={marker} />
          </GoogleMap>
        </APIProvider>
      </div>
    </div>
  );
};

export default Map;
