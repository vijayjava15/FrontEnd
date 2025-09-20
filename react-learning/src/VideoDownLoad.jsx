import React, { useState } from "react";

const VideoDownLoad = () => {
  const [url, setUrl] = useState("");

  const downloadVideo = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      // Create temporary download link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);

      // Optional: set filename
      link.download = `video-${Date.now()}.mp4`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading video:", error);
    }
  };

  const handleChange = (url) => {
    console.log(url + "before")
    setUrl((prev) => url);
     console.log(url + "after")
  };

  return (
    <div className="videoDownload">
      <input
        type="text"
        placeholder="Paste Video Url"
        id="downloadInput"
        value={url}
        onChange={(e) => handleChange(e.target.value)}
      />
      <button id="buttonDownload" onClick={() => downloadVideo()}>
        {" "}
        Download{" "}
      </button>
    </div>
  );
};

export default VideoDownLoad;
