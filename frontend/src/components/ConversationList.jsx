function ConversationList({
    conversations,
    currentUser,
    selectedConversation,
    setSelectedConversation,
    loadMessages,
}) {
    return (
        <div>
            <h2>Conversations</h2>

            {conversations.map((conversation) => {
                const otherUser =
                    conversation.participants.find(
                        (participant) =>
                            participant._id !== currentUser.id
                    );

                return (
                    <div
                        key={conversation._id}
                        className={`conversation-item ${selectedConversation?._id ===
                            conversation._id
                            ? "active-conversation"
                            : ""
                            }`}
                        onClick={() => {
                            setSelectedConversation(
                                conversation
                            );

                            loadMessages(
                                conversation._id
                            );
                        }}
                    >
                        <div className="conversation-card">
                            <span>👤</span>
                            <span>{otherUser?.username}</span>
                        </div>

                        <hr />
                    </div>
                );
            })}
        </div>
    );
}

export default ConversationList;