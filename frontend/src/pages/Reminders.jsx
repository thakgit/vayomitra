import React from "react";
import MedicineReminder from "../components/MedicineReminder.jsx";

export default function Reminders() {
  return (
    <section className="grid gap-4">
      <h1 className="text-xl font-semibold">Reminders</h1>
      <MedicineReminder />
    </section>
  );
}
