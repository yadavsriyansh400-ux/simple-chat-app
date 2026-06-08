let io;

export const initSocket = (socketIo) => {
  io = socketIo;

  io.on("connection", (socket) => {
    console.log(
      "User Connected:",
      socket.id
    );

    socket.on(
      "joinConversation",
      (conversationId) => {
        socket.join(conversationId);

        console.log(
          `Socket ${socket.id} joined conversation ${conversationId}`
        );
      }
    );

    socket.on("disconnect", () => {
      console.log(
        "User Disconnected:",
        socket.id
      );
    });
  });
};

export const getIo = () => {
  return io;
};