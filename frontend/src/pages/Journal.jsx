import React from "react";
import Journal from "../components/Journal.jsx";

export default function JournalPage() {
  return (
    <section className="grid gap-4">
      <h1 className="text-xl font-semibold">Journal</h1>
      <Journal />
    </section>
  );
}
