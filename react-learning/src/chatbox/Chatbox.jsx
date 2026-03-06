import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "./chatbox.css";
import assets from "../assets/assets";
import { UserContext } from "../UserProvider";

const createMessage = ({ text, direction = "in", sender, type = "message" }) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  text,
  direction,
  sender,
  type,
  createdAt: new Date().toISOString(),
});

const parseIncomingMessage = (rawData) => {
  const fallback = String(rawData ?? "").trim();
  if (!fallback) {
    return null;
  }

  try {
    const parsed = JSON.parse(fallback);
    if (typeof parsed === "string") {
      const text = parsed.trim();
      if (!text) {
        return null;
      }

      return {
        text,
        sender: "Teammate",
        type: "message",
      };
    }

    const eventType = String(parsed?.type ?? "").toUpperCase();
    const sender = String(parsed?.sender ?? parsed?.from ?? "Teammate");

    const text = String(parsed?.text ?? parsed?.message ?? parsed?.content ?? "").trim();
    if (!text && eventType === "JOIN") {
      return {
        text: `${sender} joined`,
        sender,
        type: "system",
      };
    }

    if (!text && eventType === "LEAVE") {
      return {
        text: `${sender} left`,
        sender,
        type: "system",
      };
    }

    if (!text) {
      return null;
    }

    return {
      text,
      sender,
      type: eventType === "JOIN" || eventType === "LEAVE" ? "system" : "message",
    };
  } catch {
    return {
      text: fallback,
      sender: "Teammate",
      type: "message",
    };
  }
};

const Chatbox = ({ room, peerName }) => {
  const { username } = useContext(UserContext);
  const stompClientRef = useRef(null);
  const endRef = useRef(null);
  const hasShownOfflineNoticeRef = useRef(false);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [connectionState, setConnectionState] = useState("connecting");

  const displayName = useMemo(() => (username?.trim() ? username.trim() : "Guest"), [username]);
  const roomName = useMemo(() => (room?.trim() ? room.trim() : "general"), [room]);
  const activePeerName = useMemo(() => (peerName?.trim() ? peerName.trim() : ""), [peerName]);
  const configuredSocketUrl = import.meta.env.VITE_CHAT_WS_URL?.trim() || "/ws";
  const sendDestinationTemplate =
    import.meta.env.VITE_STOMP_SEND_DESTINATION?.trim() || "/app/chat/{room}/sendMessage";
  const joinDestinationTemplate =
    import.meta.env.VITE_STOMP_JOIN_DESTINATION?.trim() || "/app/chat/{room}/addUser";
  const subscribeDestinationTemplate =
    import.meta.env.VITE_STOMP_SUBSCRIBE_DESTINATION?.trim() || "/topic/{room}";
  const sendDestination = useMemo(
    () =>
      sendDestinationTemplate
        .replace("{room}", roomName)
        .replace("{username}", displayName),
    [displayName, roomName, sendDestinationTemplate]
  );
  const joinDestination = useMemo(
    () =>
      joinDestinationTemplate
        .replace("{room}", roomName)
        .replace("{username}", displayName),
    [displayName, joinDestinationTemplate, roomName]
  );
  const subscribeDestination = useMemo(
    () =>
      subscribeDestinationTemplate
        .replace("{room}", roomName)
        .replace("{username}", displayName),
    [displayName, roomName, subscribeDestinationTemplate]
  );
  const socketUrl = useMemo(
    () =>
      configuredSocketUrl
        .replace("{room}", encodeURIComponent(roomName))
        .replace("{username}", encodeURIComponent(displayName)),
    [configuredSocketUrl, displayName, roomName]
  );
  const isSockJsUrl = useMemo(
    () =>
      socketUrl.startsWith("http://") ||
      socketUrl.startsWith("https://") ||
      socketUrl.startsWith("/"),
    [socketUrl]
  );

  useEffect(() => {
    setMessages([]);
  }, [roomName]);

  useEffect(() => {
    setConnectionState("connecting");

    const client = new Client({
      reconnectDelay: 4000,
      debug: () => {},
      onConnect: () => {
        hasShownOfflineNoticeRef.current = false;
        setConnectionState("connected");

        client.subscribe(subscribeDestination, (frame) => {
          const payload = parseIncomingMessage(frame.body);
          if (!payload) {
            return;
          }

          setMessages((prev) => [
            ...prev,
            createMessage({
              text: payload.text,
              sender: payload.sender,
              direction: payload.sender === displayName ? "out" : "in",
              type: payload.type,
            }),
          ]);
        });

        client.publish({
          destination: joinDestination,
          body: JSON.stringify({
            sender: displayName,
            type: "JOIN",
          }),
        });
      },
      onStompError: () => {
        setConnectionState("disconnected");
      },
      onWebSocketError: () => {
        setConnectionState("disconnected");
      },
      onWebSocketClose: () => {
        setConnectionState("disconnected");
      },
    });

    if (isSockJsUrl) {
      client.webSocketFactory = () => new SockJS(socketUrl);
    } else {
      client.brokerURL = socketUrl;
    }

    stompClientRef.current = client;
    client.activate();

    return () => {
      if (client.connected) {
        client.publish({
          destination: joinDestination,
          body: JSON.stringify({
            sender: displayName,
            type: "LEAVE",
          }),
        });
      }
      client.deactivate();
      stompClientRef.current = null;
    };
  }, [displayName, isSockJsUrl, joinDestination, socketUrl, subscribeDestination]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const messageText = text.trim();
    if (!messageText) {
      return;
    }

    const client = stompClientRef.current;
    if (!client || !client.connected) {
      if (!hasShownOfflineNoticeRef.current) {
        setMessages((prev) => [
          ...prev,
          createMessage({
            text: "Server disconnected. Message is only visible locally.",
            type: "system",
            direction: "in",
            sender: "System",
          }),
        ]);
        hasShownOfflineNoticeRef.current = true;
      }
      return;
    }

    try {
      client.publish({
        destination: sendDestination,
        body: JSON.stringify({
          sender: displayName,
          content: messageText,
          type: "CHAT",
        }),
      });
      setText("");
    } catch {
      setMessages((prev) => [
        ...prev,
        createMessage({
          text: "Unable to deliver message. Try reconnecting.",
          type: "system",
          direction: "in",
          sender: "System",
        }),
      ]);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <div className="chatbox">
      <div className="chat-user">
        <img src={assets.profile_img} alt="Profile" />
        <div className="chat-user-meta">
          <p>{activePeerName || `Room: ${roomName}`}</p>
          <span className={`chat-status ${connectionState}`}>
            {connectionState} | you: {displayName}
          </span>
        </div>
        <button className="help-btn" type="button" title="Help">
          <img src={assets.help_icon} alt="Help" />
        </button>
      </div>

      <div className="message-list">
        {messages.length === 0 && (
          <div className="empty-state">
            <h4>No messages yet</h4>
            <p>Type and send a message to start chatting.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-row ${msg.direction} ${msg.type === "system" ? "system" : ""}`}
          >
            <div className="message-bubble">
              <p>{msg.text}</p>
              <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form className="message-input-wrap" onSubmit={onSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message..."
          aria-label="Message"
        />
        <button type="submit" disabled={!text.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbox;
