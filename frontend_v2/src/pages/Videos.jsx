import React from "react";
import VideoGallery from "../components/VideoGallery.jsx";

export default function Videos() {
  return (
    <section className="grid gap-4">
      <h1 className="text-xl font-semibold">Videos</h1>
      <VideoGallery />
    </section>
  );
}
