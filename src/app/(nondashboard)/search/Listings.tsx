'use client'
import Card from '@/components/Card';
import CardCompact from '@/components/CardCompact';
import { useAddFavoritePropertyMutation, useGetAuthUserQuery, useGetPropertiesQuery, useGetTenantQuery, useRemoveFavoritePropertyMutation } from '@/state/api'
import { useAppSelector } from '@/state/redux';
import { Property } from '@/types/prismaTypes';
import React from 'react'

const Listings = () => {
    const { data: authUser } = useGetAuthUserQuery();
    const { data: tenant } = useGetTenantQuery(
        authUser?.cognitoInfo.userId || '',
        { skip: !authUser?.cognitoInfo?.userId}
    )
    const [addFavourite] = useAddFavoritePropertyMutation();
    const [removeFavourite] = useRemoveFavoritePropertyMutation();
    const viewMode = useAppSelector( (state) => state.global.viewMode);
    const filters = useAppSelector( (state) => state.global.filters);

    const {
        data: properties,
        isLoading,
        isError
    } = useGetPropertiesQuery(filters);

    const handleFavouriteToggle = async ( propertyId: number) => {
        if (!authUser) return;

        const isFavourite = tenant?.favourites.some(
            (fav: Property) => fav.id === propertyId
        )

        if (isFavourite) {
            await removeFavourite({
                cognitoId: authUser.cognitoInfo.userId,
                propertyId
            })
        } else {
            await addFavourite({
                cognitoId: authUser.cognitoInfo.userId,
                propertyId
            })
        }
    };

    if (isLoading) return <>Loading...</>
    if (isError || !properties) return <div>Failed to fetch properties.</div>;

  return (
    <div className='w-full'>
        <h3 className='text-sm px-4 font-bold'>{properties.length}{" "}
            <span className='text-gray-700 font-normal'>
                Places in {filters.location}
            </span>
        </h3>
        <div className='flex'>
            <div className='p-4 w-full'>
                { properties?.map( (property) => 
                    viewMode == 'grid' ? (
                        <Card
                        key={property.id}
                        property={property}
                        isFavorite={
                            tenant?.favourites?.some(
                                (fav: Property) => fav.id === property.id
                            ) || false
                        }
                        onFavoriteToggle={() => handleFavouriteToggle(property.id)}
                        showFavoriteButton= {!!authUser}
                        propertyLink={`/search/${property.id}`}
                         />
                    ) : (
                        <CardCompact
                        key={property.id}
                        property={property}
                        isFavorite={
                            tenant?.favourites?.some(
                                (fav: Property) => fav.id === property.id
                            ) || false
                        }
                        onFavoriteToggle={() => handleFavouriteToggle(property.id)}
                        showFavoriteButton= {!!authUser}
                        propertyLink={`/search/${property.id}`}
                         />
                    ))}
            </div>
        </div>
    </div>
  )
}

export default Listings