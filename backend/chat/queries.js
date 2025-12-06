const queries = `#graphql

getBookingMessages(filters: MessageFilterInput): GetBookingMessagesResponse
getUserConversations(user: String!): GetUserConversationsResponse


`;

module.exports.queries = queries;
