import { createNewUserInDatabase } from "@/lib/utils";
import { Manager, Tenant, Property } from "@/types/prismaTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const { idToken } = session.tokens ?? {};
      if (idToken) {
        headers.set("authorization", `Bearer ${idToken}`);
      }
      return headers;
    }
  }),
  reducerPath: "api",
  tagTypes: ["Managers", "Tenants"],
  endpoints: (build) => ({
    getAuthUser : build.query<User, void>({
      queryFn : async(_, _queryAoi, _extraoptions, fetchWithBQ) => {
        try {
          const session = await fetchAuthSession();
          const { idToken } = session.tokens ?? {};
          const user = await getCurrentUser();
          const userRole = idToken?.payload["custom:role"] as string;

          const endpoint =
            userRole === 'manager' ? 
              `/managers/${user.userId}` : `/tenants/${user.userId}`
          
          let userDetailResponse = await fetchWithBQ(endpoint);

          // If user don't exist, create new user
          if ( userDetailResponse.error && userDetailResponse.error.status === 404) {
            userDetailResponse = await createNewUserInDatabase(user, idToken, userRole, fetchWithBQ)
          }
          return {
            data: {
              cognitoInfo : {...user},
              userInfo : userDetailResponse.data as Tenant | Manager,
              userRole
            }
          }

        } catch (error : any) {
            return { error: error.message || "Could not fetch user data"}
        }
      }
    }),
    // update tenant settings
    updateTenantSettings : build.mutation<Tenant, { cognitoId : string } & Partial<Tenant>>({
      query: ({ cognitoId, ...updatedTenant}) => ({
        url: `tenants/${cognitoId}`,
        method: "PATCH",
        body: updatedTenant
      }),
      invalidatesTags: result => [{
        type: 'Tenants',
        id: result?.id
      }]
      }),
    //update manager settings
    updateManagerSettings : build.mutation<Manager, { cognitoId : string } & Partial<Manager>>({
      query: ({ cognitoId, ...updatedManager}) => ({
        url: `managers/${cognitoId}`,
        method: "PATCH",
        body: updatedManager
      }),
      invalidatesTags: result => [{
        type: 'Managers',
        id: result?.id
      }]
      }),
    // property related endpoints
    /* getProperties: build.query<
      Property[],
      Partial<FiltersState> & { favoriteIds?: number[] }
    >({
      query: (filters) => {
        const params = cleanParams({
          location: filters.location,
          priceMin: filters.priceRange?.[0],
          priceMax: filters.priceRange?.[1],
          beds: filters.beds,
          baths: filters.baths,
          propertyType: filters.propertyType,
          squareFeetMin: filters.squareFeet?.[0],
          squareFeetMax: filters.squareFeet?.[1],
          amenities: filters.amenities?.join(","),
          availableFrom: filters.availableFrom,
          favoriteIds: filters.favoriteIds?.join(","),
          latitude: filters.coordinates?.[1],
          longitude: filters.coordinates?.[0],
        });

        return { url: "properties", params };
      }, */
  })
});

export const {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation,
  useUpdateManagerSettingsMutation
} = api;
