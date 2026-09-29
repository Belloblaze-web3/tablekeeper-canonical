import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, ChevronDown, Clock3, MapPin, Search, Star, Utensils, X } from "lucide-react";

type Restaurant = { id: string; name: string; city: string; neighborhood: string; cuisine: string; price: string; rating: number; reviewCount: number; description: string; accent: string; timezone: string };
type Slot = { time: string; available: boolean; remaining: number };
type Reservation = { id: string; restaurantName: string; date: string; time: string; partySize: number; guestName: string; guestEmail: string; status: "confirmed" | "cancelled" };

const today = new Date();
const defaultDate = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
const cityOptions = ["All cities", "New York", "San Francisco", "Austin", "Chicago"];
const cuisineOptions = ["All cuisines", "New American", "Persian", "Texas Bistro", "Italian"];

function formatDate(date: string) { return new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(new Date(`${date}T12:00:00`)); }
function initials(name: string) { return name.split(" ").map((part) => part[0]).slice(0, 2).join(""); }

export default function Home() {
  const [city, setCity] = useState("All cities");
  const [cuisine, setCuisine] = useState("All cuisines");
  const [date, setDate] = useState(defaultDate);
  const [partySize, setPartySize] = useState(2);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [guest, setGuest] = useState({ name: "", email: "" });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showReservations, setShowReservations] = useState(false);
  const [loading, setLoading] = useState(false);

  const query = useMemo(() => new URLSearchParams({ city: city === "All cities" ? "" : city, cuisine: cuisine === "All cuisines" ? "" : cuisine, partySize: String(partySize) }).toString(), [city, cuisine, partySize]);
  useEffect(() => { fetch(`/api/restaurants?${query}`).then((r) => r.json()).then((data) => setRestaurants(data.restaurants ?? [])); }, [query]);
  useEffect(() => { if (!selected) return; fetch(`/api/restaurants/${selected.id}/availability?date=${date}&partySize=${partySize}`).then((r) => r.json()).then((data) => setSlots(data.slots ?? [])); }, [selected, date, partySize]);

  async function openRestaurant(restaurant: Restaurant) { setMessage(null); setSelected(restaurant); setSelectedTime(""); }
  async function book(event: React.FormEvent) {
    event.preventDefault();
    if (!selected || !selectedTime) return;
    setLoading(true); setMessage(null);
    const key = `tablekeeper-${selected.id}-${date}-${selectedTime}-${guest.email.toLowerCase()}`;
    const response = await fetch("/api/reservations", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": key }, body: JSON.stringify({ restaurantId: selected.id, date, time: selectedTime, partySize, guestName: guest.name, guestEmail: guest.email, idempotencyKey: key }) });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) { setMessage({ type: "error", text: data.message || "That table is no longer available." }); return; }
    setMessage({ type: "success", text: `Booked! Your table at ${data.reservation.restaurantName} is waiting.` });
    setReservations((current) => [data.reservation, ...current.filter((r) => r.id !== data.reservation.id)]);
  }
  async function loadReservations() { if (!guest.email) { setMessage({ type: "error", text: "Enter your email after making a booking to see your reservations." }); return; } const data = await fetch(`/api/reservations?email=${encodeURIComponent(guest.email)}`).then((r) => r.json()); setReservations(data.reservations ?? []); setShowReservations(true); }
  async function cancel(id: string) { const data = await fetch(`/api/reservations/${id}`, { method: "DELETE" }).then((r) => r.json()); setReservations((current) => current.map((r) => r.id === id ? data.reservation : r)); }

  return <div className="min-h-screen bg-[#f7f5ef] text-[#181817]">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10"><a href="/" className="flex items-center gap-3"><span className="brand-mark"><span /></span><span className="font-display text-2xl font-bold tracking-[-0.06em]">tablekeeper</span></a><button onClick={loadReservations} className="nav-link">My reservations <span className="nav-arrow">↗</span></button></header>
    <main className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
      <section className="hero-grid"><div className="hero-copy"><p className="eyebrow">Restaurant reservations, kept simple</p><h1 className="font-display text-6xl font-semibold leading-[.93] tracking-[-0.07em] sm:text-8xl">Tonight,<br /><em>made easy.</em></h1><p className="hero-subcopy">Find the right table in your neighborhood, without the back-and-forth. Book in a few taps and get on with your evening.</p></div><div className="hero-art"><div className="art-card art-card-one"><span>01</span><strong>pick<br />a place</strong></div><div className="art-card art-card-two"><span>02</span><strong>keep<br />the table</strong></div><div className="art-stamp">your table<br />is waiting</div></div></section>
      <section className="search-panel"><div className="search-panel-heading"><div><p className="eyebrow">Make a plan</p><h2 className="font-display text-3xl font-semibold tracking-[-0.04em]">Where are you eating?</h2></div><span className="search-note">Live availability · no guesswork</span></div><div className="search-fields"><label><span>City</span><select value={city} onChange={(e) => setCity(e.target.value)}>{cityOptions.map((option) => <option key={option}>{option}</option>)}</select></label><label><span>Date</span><input type="date" min={defaultDate} value={date} onChange={(e) => setDate(e.target.value)} /></label><label><span>Party</span><select value={partySize} onChange={(e) => setPartySize(Number(e.target.value))}>{[1,2,3,4,5,6,7,8].map((size) => <option key={size} value={size}>{size} {size === 1 ? "guest" : "guests"}</option>)}</select></label><label><span>Cuisine</span><select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>{cuisineOptions.map((option) => <option key={option}>{option}</option>)}</select></label><button className="primary-button search-button"><Search size={17} /> Find a table</button></div></section>
      <section className="results-section"><div className="section-heading"><div><p className="eyebrow">Curated for you</p><h2 className="font-display text-4xl font-semibold tracking-[-0.05em]">Good places, right this way.</h2></div><span className="result-count">{restaurants.length} places</span></div><div className="restaurant-grid">{restaurants.map((restaurant) => <article key={restaurant.id} className="restaurant-card"><div className="restaurant-art" style={{ background: restaurant.accent }}><span className="art-initials">{initials(restaurant.name)}</span><span className="art-city">{restaurant.city}</span></div><div className="restaurant-info"><div className="flex items-start justify-between gap-4"><div><h3 className="font-display text-2xl font-semibold tracking-[-0.04em]">{restaurant.name}</h3><p className="restaurant-meta"><MapPin size={13} /> {restaurant.neighborhood} · {restaurant.cuisine}</p></div><span className="price-tag">{restaurant.price}</span></div><p className="restaurant-description">{restaurant.description}</p><div className="restaurant-footer"><span className="rating"><Star size={14} fill="currentColor" /> {restaurant.rating} <small>({restaurant.reviewCount})</small></span><button onClick={() => openRestaurant(restaurant)} className="outline-button">See tables <span>→</span></button></div></div></article>)}</div></section>
      <section className="trust-strip"><span><Check size={16} /> No double bookings</span><span><Clock3 size={16} /> Instant confirmation</span><span><Utensils size={16} /> Local favorites</span></section>
      {showReservations && <section className="reservations-panel"><div className="section-heading"><div><p className="eyebrow">Your plans</p><h2 className="font-display text-4xl font-semibold tracking-[-0.05em]">Reservations</h2></div><button className="close-button" onClick={() => setShowReservations(false)}><X size={18} /></button></div>{reservations.length === 0 ? <p className="empty-state">No reservations found for {guest.email}.</p> : <div className="reservation-list">{reservations.map((r) => <div key={r.id} className={`reservation-row ${r.status === "cancelled" ? "is-cancelled" : ""}`}><div><strong>{r.restaurantName}</strong><span>{formatDate(r.date)} · {r.time} · {r.partySize} guests</span></div>{r.status === "confirmed" ? <button className="text-button" onClick={() => cancel(r.id)}>Cancel</button> : <span className="cancelled-label">Cancelled</span>}</div>)}</div>}</section>}
    </main>
    {selected && <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}><div className="booking-modal"><button className="close-button modal-close" onClick={() => setSelected(null)}><X size={18} /></button><div className="modal-kicker">{selected.city} · {selected.neighborhood}</div><h2 className="font-display text-4xl font-semibold tracking-[-0.05em]">A table at {selected.name}</h2><p className="modal-copy">{selected.description}</p><div className="booking-summary"><span><CalendarDays size={16} /> {formatDate(date)}</span><span><Utensils size={16} /> {partySize} guests</span></div><div className="slot-heading"><span>Choose a time</span><small>{selected.timezone.replace("America/", "").replace("_", " ")}</small></div><div className="slot-grid">{slots.map((slot) => <button key={slot.time} disabled={!slot.available} onClick={() => setSelectedTime(slot.time)} className={`slot ${selectedTime === slot.time ? "selected" : ""} ${!slot.available ? "unavailable" : ""}`}>{slot.time}<small>{slot.available ? `${slot.remaining} left` : "Full"}</small></button>)}</div><form onSubmit={book} className="guest-form"><label><span>Your name</span><input required value={guest.name} onChange={(e) => setGuest({ ...guest, name: e.target.value })} placeholder="Avery Chen" /></label><label><span>Email for confirmation</span><input required type="email" value={guest.email} onChange={(e) => setGuest({ ...guest, email: e.target.value })} placeholder="you@example.com" /></label><button className="primary-button w-full" disabled={loading || !selectedTime}>{loading ? "Keeping your table…" : "Keep this table"}</button></form>{message && <div className={`booking-message ${message.type}`}><span>{message.type === "success" ? "✓" : "!"}</span>{message.text}</div>}</div></div>}
  </div>;
}
