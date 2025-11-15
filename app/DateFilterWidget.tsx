"use client";
export default function DateFilterWidget() {
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={e => {
        e.preventDefault();
        const checkin = e.currentTarget.checkin.value;
        const checkout = e.currentTarget.checkout.value;
        window.location.href = `/prenota-pacchetto?checkin=${checkin}&checkout=${checkout}`;
      }}
    >
      <label className="text-gray-600">Data entrata (check-in)
        <input type="date" name="checkin" required className="border rounded px-2 py-1 w-full" />
      </label>
      <label className="text-gray-600">Data uscita (check-out)
        <input type="date" name="checkout" required className="border rounded px-2 py-1 w-full" />
      </label>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full mt-2">Vedi disponibilità?</button>
    </form>
  );
}