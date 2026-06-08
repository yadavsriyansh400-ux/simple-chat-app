import { useState } from "react";

function MessageInput({
  selectedConversation,
  sendMessage,
}) {
  const [messageText, setMessageText] =
    useState("");

  const handleSend = () => {
    if (!messageText.trim()) return;

    sendMessage(messageText);

    setMessageText("");
  };

  if (!selectedConversation) {
    return null;
  }

  return (
    <div className="message-input-container">
      <input
        className="message-input"
        type="text"
        placeholder="Type message..."
        value={messageText}
        onChange={(e) =>
          setMessageText(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
      />

      <button
        className="send-button"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;