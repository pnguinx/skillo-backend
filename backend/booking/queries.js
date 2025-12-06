const queries = `#graphql 

    getBookingById(id: String!): GetBookingResponse

    getAllBookings(
    page: Int,
    limit: Int,
    sortField: String,
    sortOrder: String,
    filters: BookingFilterInput
  ): GetAllBookingsResponse
    
`;
module.exports.queries = queries;
