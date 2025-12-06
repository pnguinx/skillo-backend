const { User } = require("./user");
const { Service } = require("./service");
const { Category } = require("./category");
const { SubCategory } = require("./sub-category");
const { Addon } = require("./addon");
const { Booking } = require("./booking");
const { TimeSlot } = require("./timeslot");
const { Chat } = require("./chat");
const { Payment } = require("./payment");
const { Blog } = require("./blog");
const { s3Service } = require("./s3Service");
const { Notification } = require("./notification");
const { Rating } = require("./rating");
const Subscription = require("./subscription");

const schema = {
  typeDefs: `#graphql
     
    ${User.typedefs} 

    ${Service.typedefs}

    ${Addon.typedefs}

    ${Category.typedefs}

    ${SubCategory.typedefs}

    ${Booking.typedefs}

    ${TimeSlot.typedefs}

    ${Chat.typedefs}
    
    ${Payment.typedefs}

    ${Blog.typedefs}

    ${Notification.typedefs}

    ${Rating.typedefs}

    ${Subscription.typedefs}
 


    type Response {
      success: Boolean
      message: String 
    }

    type Query {
      ${User.queries} 
      ${Service.queries}
      ${Addon.queries}
      ${Category.queries}
      ${SubCategory.queries}
      ${Booking.queries}
      ${TimeSlot.queries}
      ${Chat.queries}
      ${Payment.queries}
      ${Blog.queries} 
      ${Notification.queries}
      ${Rating.queries}
      ${Subscription.queries}
    }

    type Mutation {
      ${User.mutations}
      ${Service.mutations}
      ${Addon.mutations}
      ${Category.mutations}
      ${SubCategory.mutations}
      ${Booking.mutations}
      ${TimeSlot.mutations}
      ${Chat.mutations}
      ${Payment.mutations}
      ${Blog.mutations}
      ${s3Service.mutations}
      ${Notification.mutations}
      ${Rating.mutations}
      ${Subscription.mutations}
    }
    `,

  resolvers: {
    Query: {
      ...User.resolvers.queries,
      ...Service.resolvers.queries,
      ...Addon.resolvers.queries,
      ...Category.resolvers.queries,
      ...SubCategory.resolvers.queries,
      ...Booking.resolvers.queries,
      ...TimeSlot.resolvers.queries,
      ...Chat.resolvers.queries,
      ...Payment.resolvers.queries,
      ...Blog.resolvers.queries,
      ...Notification.resolvers.queries,
      ...Rating.resolvers.queries,
      ...Subscription.resolvers.Query,
    },
    Mutation: {
      ...User.resolvers.mutations,
      ...Service.resolvers.mutations,
      ...Addon.resolvers.mutations,
      ...Category.resolvers.mutations,
      ...SubCategory.resolvers.mutations,
      ...Booking.resolvers.mutations,
      ...TimeSlot.resolvers.mutations,
      ...Chat.resolvers.mutations,
      ...Payment.resolvers.mutations,
      ...Blog.resolvers.mutations,
      ...s3Service.resolvers.mutations,
      ...Notification.resolvers.mutations,
      ...Rating.resolvers.mutations,
      ...Subscription.resolvers.Mutation,
    },
  },
  introspection: true,
  formatError: (err) => ({
    message: err.message,
    success: false,
  }),
};

module.exports = schema;
