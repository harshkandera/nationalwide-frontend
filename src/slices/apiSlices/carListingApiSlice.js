import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Helper function to get the token from cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// Base query with token in headers
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8000/' ,
  credentials: "include",

  prepareHeaders: (headers) => {
    const token = getCookie("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  }, 
});


// Create API slice
export const listingApiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ['DraftListing', 'User' ,'Bid'],

  endpoints: (builder) => ({
    // Queries (GET requests)
    DraftListings: builder.query({
      query: (category) => `api/v2/get_draft_listing?category=${category}`,
      providesTags: ['DraftListing'], 
    }),

    ListingById: builder.query({
      query: (id) => `api/v2/get_listing_by_id/${id}`,
    }),

    UserBids: builder.query({
      query: ({ carId, userId }) => `api/user_bids/${userId}/${carId}`,
    }),

    UserDashBoardData: builder.query({
      query: ({ userId }) => `api/get_user_dashboard/${userId}`,
    }),

    GetUsersBids: builder.query({
      query: ({ userId }) => `api/get_users_detail/${userId}`,
    }),

    GetUserNotifications: builder.query({
      query: (userId) => `api/get_user_notifications/${userId}`,
    }),

    GetUsers: builder.query({ 
      query:() => 'api/v2/get_all_users',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'User', id: _id })), 
              { type: 'User', id: 'LIST' }, 
            ]
          : [{ type: 'User', id: 'LIST' }], 
    }),

    GetAuctions: builder.query({
      query:({ status, page ,limit , category }) => `api/v2/get_acutions/${status}/${category}?page=${page}&limit=${limit}`
    }),
  
    GetAuctionsById: builder.query({
      query:(id) => `api/v2/get_auctionsbyid/${id}`,
      providesTags: ['Bid'],
    })
    ,
    GetAdminDashboardData: builder.query({
      query:(filterData) =>{
        const queryParams = new URLSearchParams(filterData).toString();
        return `api/v2/admin_dashboard?${queryParams}`;
      },
    })
    ,

    // Mutations (POST, PUT, DELETE requests)
    createListing: builder.mutation({
      query: ({ formData, step }) => ({
        url: `api/v2/create_listing/${step}`,
        method: "POST",
        body: formData,
      }),
    }),

    updateStatus: builder.mutation({
      query: (formData) => ({
        url: `api/v2/change_status`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ['DraftListing'],
    }),

    saveForLater: builder.mutation({
      query: ({ userId, carId }) => ({
        url: `api/save_for_later/${userId}/${carId}`,
        method: "POST",
      }),
    }),

    createBidding: builder.mutation({
      query: ({ bidAmount, userId, carId }) => ({
        url: `api/create_bidding/${userId}/${carId}`,
        method: "POST",
        body: { bidAmount },
      }),
    }),

    withDrawalBidding: builder.mutation({
      query: ({ userId, carId }) => ({
        url: `api/withdrawal_bidding/${userId}/${carId}`,
        method: "POST",
      }),
    }),

    filterListings: builder.mutation({
      query: (filters) => ({
        url: `api/filter`,
        method: "POST",
        body: filters,
      }),
    }),

    markNotificationsAsRead: builder.mutation({
      query: ({ userId, notificationIds }) => ({
        url: `api/mark_notifications_read/${userId}`,
        method: "POST",
        body: { notificationIds },
      }),
    }),

    deleteNotifications: builder.mutation({
      query: ({ userId, notificationIds }) => ({
        url: `api/delete_notifications/${userId}`,
        method: "POST",
        body: { notificationIds },
      }),
    }),

    passwordChange: builder.mutation({
      query: ({ userId, oldPassword, newPassword }) => ({
        url: `api/change_password/${userId}`,
        method: "POST",
        body: { oldPassword, newPassword },
      }),
    }),
 
    changeRole:builder.mutation({
      query: ({ userId ,newRole }) => ({
        url: `api/v2/change_role`,
        method: "POST",
        body: {userId ,newRole },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }], 
    }),
 
    deleteUsers:builder.mutation({
      query: ({ userIds }) => ({
        url: `api/v2/delete_users`,
        method: "POST",
        body:{ userIds },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }], 
    }),


    deleteCars:builder.mutation({
      query: ({ carIds }) => ({
        url: `api/v2/delete_listing`,
        method: "POST",
        body:{ carIds },
      }),
      invalidatesTags: ['DraftListing'],

    }),

    deleteBids:builder.mutation({
      query: ({ bidId,bidAmount }) => ({
        url: `api/v2/delete_bid/${bidId}`,
        method: "POST",
        body:{ bidAmount},
      }),
      invalidatesTags: ['Bid'],
    }),

    editBiddingDate:builder.mutation({
      query: ({ carIds , data }) => ({
        url: `api/v2/edit_listing_date`,
        method: "POST",
        body:{ carIds , data},
      }),
      invalidatesTags: ['DraftListing'],
    }),

    buyNow:builder.mutation({
      query: ({ carId , userId }) => ({
        url: `api/buy_now/${userId}/${carId}`,
        method: "POST",
      })
    }),

  }),
});

// Export the hooks for components to use
export const {
  // Queries
  useDraftListingsQuery,
  useListingByIdQuery,
  useUserBidsQuery,
  useLazyUserBidsQuery,
  useUserDashBoardDataQuery,
  useGetUsersBidsQuery,
  useGetUserNotificationsQuery,
  useGetUsersQuery,
  useGetAuctionsByIdQuery,
  useGetAuctionsQuery,
  useGetAdminDashboardDataQuery,

  // Mutations
  useCreateListingMutation,
  useUpdateStatusMutation,
  useSaveForLaterMutation,
  useCreateBiddingMutation,
  useWithDrawalBiddingMutation,
  useFilterListingsMutation,
  useMarkNotificationsAsReadMutation,
  useDeleteNotificationsMutation,
  usePasswordChangeMutation,
  useChangeRoleMutation, 
  useDeleteUsersMutation,
  useDeleteCarsMutation,
  useDeleteBidsMutation,
  useEditBiddingDateMutation,
  useBuyNowMutation
} = listingApiSlice;


// /delete_bid/:bidId
// /admin_dashboard