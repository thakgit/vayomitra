import React from "react";
import SpiritualQuote from "../components/SpiritualQuote.jsx";
import TipsMock from "../components/TipsMock.js";

export default function Tips() {
  return (
    <section className="grid gap-4">
      <h1 className="text-xl font-semibold">Tips</h1>
      <SpiritualQuote />
      <TipsMock />
    </section>
  );
}
