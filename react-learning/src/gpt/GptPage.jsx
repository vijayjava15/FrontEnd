import { useEffect, useMemo, useRef, useState } from "react";
import "./gpt.css";

const getDefaultEndpoint = () =>
  import.meta.env.VITE_GPT_API_URL || "http://192.168.29.247:11434/api/chat";

const getDefaultModel = () => import.meta.env.VITE_GPT_MODEL || "";

const createChat = (id) => ({
  id,
  title: "New Chat",
  messages: [
    {
      role: "assistant",
      content: "Hello. Ask me anything.",
      id: `${id}-welcome`,
    },
  ],
});

const truncateTitle = (text) => {
  const trimmed = text.trim();
  if (!trimmed) {
    return "New Chat";
  }

  return trimmed.length > 36 ? `${trimmed.slice(0, 36)}...` : trimmed;
};

const buildAssistantText = (payload) => {
  const fromChoices = payload?.choices?.[0]?.message?.content;
  if (fromChoices) {
    return fromChoices;
  }

  if (typeof payload?.response === "string") {
    return payload.response;
  }

  if (typeof payload?.output_text === "string") {
    return payload.output_text;
  }

  if (typeof payload?.message?.content === "string") {
    return payload.message.content;
  }

  throw new Error("Unsupported API response format.");
};

const normalizeEndpoint = (endpoint) => {
  const raw = (endpoint || "").trim();
  if (!raw) {
    return { method: "POST", url: "" };
  }

  const match = raw.match(/^(GET|POST|PUT|PATCH|DELETE)\s+(.+)$/i);
  if (match) {
    return { method: match[1].toUpperCase(), url: match[2].trim() };
  }

  return { method: "POST", url: raw };
};

const buildRequestBody = (url, model, messages) => {
  if (url.includes("/api/generate")) {
    const lastUserMessage = [...messages].reverse().find((item) => item.role === "user");
    return {
      model,
      prompt: lastUserMessage?.content || "",
      stream: false,
    };
  }

  return {
    model,
    messages: messages.map(({ role, content }) => ({ role, content })),
    stream: false,
  };
};

const getModelEndpoints = (endpointUrl) => {
  const parsed = new URL(endpointUrl);
  const origin = parsed.origin;
  return [`${origin}/v1/models`, `${origin}/api/tags`];
};

const loadModels = async (endpoint) => {
  const { url } = normalizeEndpoint(endpoint);
  if (!url) {
    return [];
  }

  const endpoints = getModelEndpoints(url);
  for (const modelUrl of endpoints) {
    try {
      const response = await fetch(modelUrl);
      if (!response.ok) {
        continue;
      }
      const payload = await response.json();
      const v1Models = payload?.data?.map((item) => item.id).filter(Boolean);
      if (Array.isArray(v1Models) && v1Models.length) {
        return v1Models;
      }
      const ollamaModels = payload?.models?.map((item) => item.name).filter(Boolean);
      if (Array.isArray(ollamaModels) && ollamaModels.length) {
        return ollamaModels;
      }
    } catch {
      // Continue trying alternate model endpoints.
    }
  }

  return [];
};

const requestCompletion = async ({ endpoint, apiKey, model, messages }) => {
  const { method, url } = normalizeEndpoint(endpoint);
  if (!url) {
    throw new Error("Endpoint is required.");
  }

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify(buildRequestBody(url, model, messages)),
  });
  const rawText = await response.text();
  let body = {};
  try {
    body = rawText ? JSON.parse(rawText) : {};
  } catch {
    body = { output_text: rawText };
  }

  if (!response.ok) {
    const serverError = body?.error?.message || body?.message;
    throw new Error(serverError || `Request failed (${response.status}).`);
  }

  return buildAssistantText(body);
};

const GptPage = () => {
  const [endpoint, setEndpoint] = useState(
    localStorage.getItem("gpt_endpoint") || getDefaultEndpoint()
  );
  const [apiKey, setApiKey] = useState(localStorage.getItem("gpt_api_key") || "");
  const [model, setModel] = useState(localStorage.getItem("gpt_model") || getDefaultModel());
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableModels, setAvailableModels] = useState([]);
  const [chatSeed, setChatSeed] = useState(2);
  const [chats, setChats] = useState([createChat(1)]);
  const [activeChatId, setActiveChatId] = useState(1);
  const endRef = useRef(null);

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) || chats[0],
    [activeChatId, chats]
  );

  useEffect(() => {
    localStorage.setItem("gpt_endpoint", endpoint);
  }, [endpoint]);

  useEffect(() => {
    localStorage.setItem("gpt_api_key", apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem("gpt_model", model);
  }, [model]);

  useEffect(() => {
    let isCancelled = false;

    const syncModels = async () => {
      const models = await loadModels(endpoint);
      if (isCancelled) {
        return;
      }
      setAvailableModels(models);
      if (models.length) {
        setModel((current) => current || models[0]);
      }
    };

    syncModels();

    return () => {
      isCancelled = true;
    };
  }, [endpoint]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages?.length, isLoading]);

  const createNewChat = () => {
    const nextChat = createChat(chatSeed);
    setChats((current) => [nextChat, ...current]);
    setActiveChatId(nextChat.id);
    setChatSeed((value) => value + 1);
    setPrompt("");
    setError("");
  };

  const updateActiveChat = (nextMessages, nextTitle) => {
    setChats((current) =>
      current.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: nextMessages,
              title: nextTitle || chat.title,
            }
          : chat
      )
    );
  };

  const sendMessage = async () => {
    const messageText = prompt.trim();
    if (!messageText || isLoading || !activeChat) {
      return;
    }
    if (!model.trim()) {
      setError("Model is required.");
      return;
    }

    setError("");
    setPrompt("");

    const userMessage = {
      role: "user",
      content: messageText,
      id: `${Date.now()}-user`,
    };

    const baseMessages = [...activeChat.messages, userMessage];
    const nextTitle =
      activeChat.title === "New Chat" ? truncateTitle(messageText) : activeChat.title;

    updateActiveChat(baseMessages, nextTitle);
    setIsLoading(true);

    try {
      const assistantText = await requestCompletion({
        endpoint,
        apiKey,
        model,
        messages: baseMessages,
      });

      updateActiveChat(
        [
          ...baseMessages,
          {
            role: "assistant",
            content: assistantText,
            id: `${Date.now()}-assistant`,
          },
        ],
        nextTitle
      );
    } catch (requestError) {
      setError(requestError.message || "Unable to fetch response.");
      updateActiveChat(
        [
          ...baseMessages,
          {
            role: "assistant",
            content: "I could not reach the model. Check endpoint/model/API key.",
            id: `${Date.now()}-assistant-error`,
          },
        ],
        nextTitle
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onComposerKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="gpt-page">
      <aside className="gpt-sidebar">
        <button className="gpt-new-chat" onClick={createNewChat}>
          + New Chat
        </button>

        <div className="gpt-history">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`gpt-history-item ${chat.id === activeChatId ? "active" : ""}`}
            >
              {chat.title}
            </button>
          ))}
        </div>

        <div className="gpt-config">
          <label htmlFor="gpt-endpoint">Endpoint</label>
          <input
            id="gpt-endpoint"
            value={endpoint}
            onChange={(event) => setEndpoint(event.target.value)}
            placeholder="http://localhost:11434/v1/chat/completions"
          />
          <p className="gpt-config-note">
            Supports `/api/chat`, `/api/generate`, or `/v1/chat/completions`.
          </p>

          <label htmlFor="gpt-model">Model</label>
          <input
            id="gpt-model"
            list="gpt-model-list"
            value={model}
            onChange={(event) => setModel(event.target.value)}
            placeholder="deepseek-r1:1.5b"
          />
          <datalist id="gpt-model-list">
            {availableModels.map((modelName) => (
              <option key={modelName} value={modelName} />
            ))}
          </datalist>

          <label htmlFor="gpt-key">API Key (optional)</label>
          <input
            id="gpt-key"
            type="password"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="sk-..."
          />
        </div>
      </aside>

      <main className="gpt-main">
        <div className="gpt-messages">
          {activeChat?.messages?.map((message) => (
            <div key={message.id} className={`gpt-message-row ${message.role}`}>
              <div className="gpt-message-bubble">{message.content}</div>
            </div>
          ))}

          {isLoading ? (
            <div className="gpt-message-row assistant">
              <div className="gpt-message-bubble loading">Thinking...</div>
            </div>
          ) : null}

          <div ref={endRef} />
        </div>

        {error ? <p className="gpt-error">{error}</p> : null}

        <div className="gpt-composer">
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={onComposerKeyDown}
            placeholder="Message your model"
            rows={3}
          />
          <button onClick={sendMessage} disabled={!prompt.trim() || isLoading}>
            Send
          </button>
        </div>
      </main>
    </div>
  );
};

export default GptPage;
