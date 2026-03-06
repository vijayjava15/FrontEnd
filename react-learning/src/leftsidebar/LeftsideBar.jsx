import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import "./leftsidebar.css";
import assets from "../assets/assets";
import { UserContext } from "../UserProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const extractUsersFromResponse = (responseData) => {
  if (Array.isArray(responseData)) {
    return responseData;
  }

  if (Array.isArray(responseData?.data)) {
    return responseData.data;
  }

  if (Array.isArray(responseData?.users)) {
    return responseData.users;
  }

  if (Array.isArray(responseData?.data?.users)) {
    return responseData.data.users;
  }

  return [];
};

const normalizeUser = (value) => {
  if (typeof value === "string") {
    const username = value.trim();
    if (!username) {
      return null;
    }
    return { id: username, username };
  }

  if (typeof value === "object" && value !== null) {
    const candidate =
      value.username ??
      value.userName ??
      value.name ??
      value.email ??
      value.user ??
      value.value;

    const username = String(candidate ?? "").trim();
    if (!username) {
      return null;
    }

    return {
      id: String(value.id ?? username),
      username,
    };
  }

  return null;
};

const createDirectRoomId = (currentUser, peerUser) => {
  const normalizePart = (input) =>
    String(input || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

  const roomParts = [normalizePart(currentUser), normalizePart(peerUser)]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  return `dm_${roomParts.join("__")}`;
};

const LefsideBar = ({ room, selectedUser }) => {
  const { username } = useContext(UserContext);
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  const displayName = username?.trim() ? username.trim() : "Guest";
  const activePeerName = selectedUser?.trim() || "";

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [isResultOpen, setIsResultOpen] = useState(false);

  const searchApiTemplate =
    import.meta.env.VITE_CHAT_USER_SEARCH_API?.trim() || "/user/getUsers";
  const searchQueryKey = import.meta.env.VITE_CHAT_USER_QUERY_KEY?.trim() || "query";
  const trimmedSearch = searchText.trim();

  const resolvedUsers = useMemo(() => {
    const seen = new Set();
    return searchResults
      .filter((item) => item.username.toLowerCase() !== displayName.toLowerCase())
      .filter((item) => {
        const key = item.username.toLowerCase();
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
  }, [displayName, searchResults]);

  useEffect(() => {
    const onOutsideClick = (event) => {
      if (!searchContainerRef.current) {
        return;
      }

      if (!searchContainerRef.current.contains(event.target)) {
        setIsResultOpen(false);
      }
    };

    document.addEventListener("mousedown", onOutsideClick);
    return () => {
      document.removeEventListener("mousedown", onOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!trimmedSearch) {
      setSearchResults([]);
      setSearchError("");
      return;
    }

    const controller = new AbortController();
    const timerId = setTimeout(async () => {
      setIsSearching(true);
      setSearchError("");

      try {
        let endpoint = searchApiTemplate;
        const requestConfig = { signal: controller.signal };

        if (searchApiTemplate.includes("{query}")) {
          endpoint = searchApiTemplate.replace("{query}", encodeURIComponent(trimmedSearch));
        } else {
          requestConfig.params = { [searchQueryKey]: trimmedSearch };
        }

        const response = await axios.get(endpoint, requestConfig);
        const users = extractUsersFromResponse(response.data)
          .map(normalizeUser)
          .filter(Boolean)
          .filter((item) =>
            item.username.toLowerCase().includes(trimmedSearch.toLowerCase())
          )
          .sort((a, b) => a.username.localeCompare(b.username));

        setSearchResults(users);
      } catch (error) {
        if (axios.isCancel?.(error) || error?.code === "ERR_CANCELED") {
          return;
        }
        setSearchResults([]);
        setSearchError("Unable to fetch users");
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      clearTimeout(timerId);
      controller.abort();
    };
  }, [searchApiTemplate, searchQueryKey, trimmedSearch]);

  const startDirectChat = (peerName) => {
    const normalizedPeer = String(peerName || "").trim();
    if (!normalizedPeer) {
      return;
    }

    const roomId = createDirectRoomId(displayName, normalizedPeer);
    navigate(`/chat/${encodeURIComponent(roomId)}?user=${encodeURIComponent(normalizedPeer)}`);
    setSearchText("");
    setSearchResults([]);
    setSearchError("");
    setIsResultOpen(false);
  };

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="Logo" />
          <button className="menu" type="button" title="Menu">
            <img src={assets.menu_icon} alt="Menu" />
          </button>
        </div>

        <div className="search-area" ref={searchContainerRef}>
          <div className="search-icon">
          <img src={assets.search_icon} alt="Search" />
          <input
            type="text"
            placeholder="Search user"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setIsResultOpen(true);
            }}
            onFocus={() => setIsResultOpen(true)}
          />
          </div>

          {isResultOpen && (
            <div className="search-results">
              {isSearching && <p className="search-state">Searching...</p>}
              {!isSearching && searchError && <p className="search-state error">{searchError}</p>}
              {!isSearching && !searchError && trimmedSearch && resolvedUsers.length === 0 && (
                <p className="search-state">No users found</p>
              )}
              {!isSearching &&
                !searchError &&
                resolvedUsers.map((userItem) => (
                  <button
                    className="user-result"
                    key={userItem.id}
                    type="button"
                    onClick={() => startDirectChat(userItem.username)}
                  >
                    {userItem.username}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="ls-list">
        <div className="profile">
          <img src={assets.avatar_icon} alt="User avatar" />
          <div className="profile-meta">
            <div className="usrName">{displayName}</div>
            <span className="usrStatus">Active now</span>
          </div>
        </div>

        {activePeerName ? (
          <button type="button" className="profile active-chat" onClick={() => startDirectChat(activePeerName)}>
            <img src={assets.profile_img} alt="Selected user avatar" />
            <div className="profile-meta">
              <div className="usrName">{activePeerName}</div>
              <span className="usrStatus">Direct chat {room ? "(active)" : ""}</span>
            </div>
          </button>
        ) : (
          <div className="chat-hint">Search and select a user to start direct chat.</div>
        )}
      </div>
    </div>
  );
};

export default LefsideBar;
