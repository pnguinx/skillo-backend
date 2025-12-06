const MessageModel = require("./model");
const User = require("../user/model");
const Booking = require("../booking/model");
const { default: mongoose } = require("mongoose");

const getUserConversations = async (args) => {
  try {
    const user = new mongoose.Types.ObjectId(args.user);

    // First, find all messages of this user
    const messages = await MessageModel.find({
      $or: [{ sender: user }, { recipient: user }],
    });

    // Update conversationId if missing
    await Promise.all(
      messages.map(async (msg) => {
        if (!msg.conversationId) {
          const userA = msg.sender.toString();
          const userB = msg.recipient.toString();
          const booking = msg.booking?.toString();
          console.log("Booking ID:", booking);

          const sortedUsers = [userA, userB].sort();
          const conversationId = `${booking}-${sortedUsers[0]}-${sortedUsers[1]}`;

          msg.conversationId = conversationId;
          await msg.save();
        }
      })
    );

    // Now aggregate based on conversationId
    const conversationsThreads = await MessageModel.aggregate([
      {
        $match: {
          $or: [{ sender: user }, { recipient: user }],
        },
      },
      {
        $group: {
          _id: "$conversationId",
          booking: { $first: "$booking" },
          otherUser: {
            $first: {
              $cond: [{ $eq: ["$sender", user] }, "$recipient", "$sender"],
            },
          },
          lastMessage: { $last: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$recipient", user] },
                    { $ne: ["$status", "seen"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { "lastMessage.createdAt": -1 } },
    ]);

    const conversations = await Promise.all(
      conversationsThreads.map(async (thread) => {
        const [booking, user] = await Promise.all([
          Booking.findById(thread.booking).select(
            "name price status booking_id"
          ),
          User.findById(thread.otherUser).select(
            "first_name last_name email profile_picture online lastSeen"
          ),
        ]);

        return {
          conversationId: thread._id,
          booking: JSON.parse(JSON.stringify(booking)),
          participant: JSON.parse(JSON.stringify(user)),
          lastMessage: JSON.parse(JSON.stringify(thread.lastMessage)),
          unreadCount: thread.unreadCount,
        };
      })
    );

    console.log(conversations);

    return {
      success: true,
      message: "Conversations retrieved successfully",
      statusCode: 200,
      data: conversations,
    };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch conversations",
      data: null,
    };
  }
};

const getBookingMessages = async (args) => {
  const { filters = {} } = args;
  const { booking, user, conversationId } = filters;

  try {
    const query = {};
    if (booking) query.booking = booking;
    if (user) query.$or = [{ sender: user }, { recipient: user }];
    if (conversationId) query.conversationId = conversationId;

    const messages = await MessageModel.find(query)
      .sort({ createdAt: 1 })
      .populate("sender recipient", "first_name last_name email");

    // Mark as seen only if both booking and userId are provided
    if (booking && user) {
      await MessageModel.updateMany(
        {
          booking,
          recipient: user,
          status: { $ne: "seen" },
        },
        { status: "seen" }
      );
    }

    const enhancedMessage = messages.map((message) => {
      const isSender = user && message.sender._id.toString() === user;
      return {
        ...message.toObject(),
        direction: isSender ? "outgoing" : "incoming",
        isCurrentUser: isSender,
      };
    });

    return {
      success: true,
      message: messages.length
        ? "Messages retrieved successfully"
        : "No messages found",
      data: enhancedMessage,
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch messages",
      messages: null,
    };
  }
};

module.exports.ChatService = {
  getUserConversations,
  getBookingMessages,
};
