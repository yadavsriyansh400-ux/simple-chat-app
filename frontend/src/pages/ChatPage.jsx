import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import socket from "../socket";
import ConversationList from "../components/ConversationList";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import "./ChatPage.css";

function ChatPage() {
    const navigate = useNavigate();

    const currentUser = JSON.parse(
        localStorage.getItem("user")
    );

    const [email, setEmail] = useState("");
    const [users, setUsers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation,] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [showRequests, setShowRequests] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);

    useEffect(() => {
        const token =
            localStorage.getItem("token");

        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        getConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            socket.emit(
                "joinConversation",
                selectedConversation._id
            );
        }
    }, [selectedConversation]);

    useEffect(() => {
        socket.on(
            "receiveMessage",
            (message) => {
                setMessages((prev) => [
                    ...prev,
                    message,
                ]);
            }
        );

        return () => {
            socket.off("receiveMessage");
        };
    }, []);

    const handleSearch = async () => {
        try {
            const res = await api.get(
                `/users/search?email=${email}`
            );

            setUsers(res.data);
            setShowSearchResults(true);
        } catch (error) {
            console.log(error);
        }
    };

    const sendRequest = async (
        receiverId
    ) => {
        try {
            const res = await api.post(
                "/chat/request",
                {
                    receiverId,
                }
            );

            alert(res.data.message);
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to send request"
            );
        }
    };

    const getRequests = async () => {
        try {
            const res = await api.get(
                "/chat/requests"
            );

            setRequests(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const acceptRequest = async (
        requestId
    ) => {
        try {
            const res = await api.put(
                `/chat/accept/${requestId}`
            );

            alert(res.data.message);

            getRequests();
            getConversations();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to accept request"
            );
        }
    };

    const getConversations =
        async () => {
            try {
                const res = await api.get(
                    "/chat/conversations"
                );

                setConversations(res.data);
            } catch (error) {
                console.log(error);
            }
        };

    const loadMessages = async (
        conversationId
    ) => {
        try {
            const res = await api.get(
                `/chat/messages/${conversationId}`
            );

            setMessages(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const sendMessage = async (text) => {
        if (!selectedConversation) {
            return;
        }

        try {
            await api.post("/chat/send", {
                conversationId:
                    selectedConversation._id,
                text,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="chat-page">
            <div className="firefly firefly-1"></div>
            <div className="firefly firefly-2"></div>
            <div className="firefly firefly-3"></div>
            <div className="firefly firefly-4"></div>
            <div className="firefly firefly-5"></div>
            {showRequests && (
                <div className="requests-modal">
                    <div className="requests-content">
                        <h2>Pending Requests</h2>

                        <button
                            onClick={() =>
                                setShowRequests(false)
                            }
                        >
                            Close
                        </button>

                        {requests.length === 0 ? (
                            <p>No pending requests</p>
                        ) : (
                            requests.map((request) => (
                                <div key={request._id}>
                                    <p>
                                        {request.sender.username}
                                    </p>

                                    <p>
                                        {request.sender.email}
                                    </p>

                                    <button
                                        onClick={() =>
                                            acceptRequest(
                                                request._id
                                            )
                                        }
                                    >
                                        Accept
                                    </button>

                                    <hr />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {showSearchResults && (
                <div className="requests-modal">
                    <div className="requests-content">
                        <h2>Search Results</h2>

                        <button
                            onClick={() =>
                                setShowSearchResults(false)
                            }
                        >
                            Close
                        </button>

                        {users.length === 0 ? (
                            <p>No users found</p>
                        ) : (
                            users.map((user) => (
                                <div key={user._id}>
                                    <p>{user.username}</p>

                                    <p>{user.email}</p>

                                    <button
                                        onClick={() =>
                                            sendRequest(user._id)
                                        }
                                    >
                                        Send Request
                                    </button>

                                    <hr />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {showSearchModal && (
                <div className="requests-modal">
                    <div className="requests-content">
                        <h2>Search User</h2>

                        <button
                            onClick={() =>
                                setShowSearchModal(false)
                            }
                        >
                            Close
                        </button>

                        <input
                            type="text"
                            placeholder="Search by email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                        <button onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                </div>
            )}
            <div className="top-bar">

                <div className="logo-section">

                    <img
                        src="/vine-left.png"
                        className="vine-left"
                        alt=""
                    />

                    <span>
                        🌿 JungleChat
                    </span>

                    <img
                        src="/vine-right.png"
                        className="vine-right"
                        alt=""
                    />

                </div>

                <div className="profile-section">

                    <div className="profile-card">
                        <span className="profile-icon">
                            💎
                        </span>

                        <span>
                            {currentUser?.username}
                        </span>
                    </div>

                </div>

            </div>
            <hr />

            <div className="actions">


                <button
                    onClick={() =>
                        setShowSearchModal(true)
                    }
                >
                    Search
                </button>

                <button
                    onClick={() => {
                        getRequests();
                        setShowRequests(true);
                    }}
                >
                    Requests
                </button>

                <hr />

            </div>

            <div className="main-layout">

                <div className="sidebar">
                    <ConversationList
                        conversations={conversations}
                        currentUser={currentUser}
                        selectedConversation={
                            selectedConversation
                        }
                        setSelectedConversation={
                            setSelectedConversation
                        }
                        loadMessages={loadMessages}
                    />
                </div>

                <div className="chat-section">

                    <div className="messages-area">
                        <ChatWindow
                            selectedConversation={
                                selectedConversation
                            }
                            messages={messages}
                            currentUser={currentUser}
                            conversations={conversations}
                        />
                    </div>

                    <MessageInput
                        selectedConversation={
                            selectedConversation
                        }
                        sendMessage={sendMessage}
                    />

                </div>

            </div>
        </div>
    );
}

export default ChatPage;