function ChatWindow({
  selectedConversation,
  messages,
  currentUser,
  conversations,
}) {
  if (!selectedConversation) {
    return (
      <div>
        <h2>Select a conversation</h2>
      </div>
    );
  }

  const otherUser =
    selectedConversation?.participants?.find(
      (participant) =>
        participant._id !== currentUser.id
    );

  return (
    <div>
      <h2>
        {" "}
        {otherUser?.username || "..."}
      </h2>
      {messages.map((message) => (
        <div
          key={message._id}
          className={
            message.sender?._id ===
              currentUser.id
              ? "my-message"
              : "other-message"
          }
        >
          <div className="message-sender">
            {message.sender?.username}
          </div>

          <div className="message-text">
            {message.text}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatWindow;