const typedefs = `
  type Offer {
    amount: Float
    status: String
    counterOffer: Float
    terms: String
  }

  type MessageImage {
    url: String!
    key: String!
    width: Int
    height: Int
  }

  type Message {
    _id: ID
    sender: User
    recipient: User
    booking: Booking
    content: String
    images: [MessageImage]
    offer: Offer
    type: String
    status: String
    conversationId: String
    replyTo: Message
    createdAt: String
    direction: String
    isCurrentUser: Boolean
  }

  type Conversation {
    conversationId: String
    booking: Booking
    participant: User
    lastMessage: Message
    unreadCount: Int
  }

  type GetUserConversationsResponse {
    success: Boolean
    message: String
    data: [Conversation]
  }

  type GetBookingMessagesResponse {
    success: Boolean
    message: String
    data: [Message]
  }

  input MessageFilterInput {
    booking: ID
    user: ID
    conversationId: String
  }

 
`;

module.exports.typedefs = typedefs;