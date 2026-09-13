import { useState } from "react";
import DashboardLayout from "../Components/DashboardLayout";

const cardColors = {
  Visa: "from-violet-600 to-violet-800",
  Mastercard: "from-cyan-600 to-blue-800",
  Card: "from-slate-600 to-slate-800",
};

const readCards = () => {
  try {
    const savedCards = JSON.parse(
      localStorage.getItem("eventxPaymentMethods") || "[]",
    );
    return Array.isArray(savedCards) ? savedCards : [];
  } catch {
    return [];
  }
};

const getCardBrand = (number) => {
  if (/^4/.test(number)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(number)) return "Mastercard";
  return "Card";
};

const PaymentMethods = () => {
  const [cards, setCards] = useState(readCards);
  const [form, setForm] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [message, setMessage] = useState("");

  const saveCards = (updatedCards) => {
    setCards(updatedCards);
    localStorage.setItem("eventxPaymentMethods", JSON.stringify(updatedCards));
  };

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanNumber = form.number.replace(/\D/g, "");
    const expiryMatch = form.expiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/);

    if (!form.name.trim() || cleanNumber.length < 12 || cleanNumber.length > 19) {
      setMessage("Enter a valid cardholder name and card number.");
      return;
    }
    if (!expiryMatch || !/^\d{3,4}$/.test(form.cvv)) {
      setMessage("Enter a valid expiry date and CVV.");
      return;
    }

    const newCard = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      brand: getCardBrand(cleanNumber),
      last4: cleanNumber.slice(-4),
      expiry: form.expiry,
      isDefault: cards.length === 0,
    };
    saveCards([...cards, newCard]);
    setForm({ name: "", number: "", expiry: "", cvv: "" });
    setMessage("Payment method saved successfully.");
  };

  const removeCard = (cardId) => {
    const remainingCards = cards.filter((card) => card.id !== cardId);
    if (remainingCards.length && !remainingCards.some((card) => card.isDefault)) {
      remainingCards[0] = { ...remainingCards[0], isDefault: true };
    }
    saveCards(remainingCards);
  };

  const setDefaultCard = (cardId) => {
    saveCards(
      cards.map((card) => ({ ...card, isDefault: card.id === cardId })),
    );
  };

  return (
    <DashboardLayout title="Payment Methods">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Payment Methods</h2>
          <p className="mt-1 text-sm text-gray-400">
            Manage cards and payment preferences.
          </p>
        </div>

        {cards.length ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`rounded-2xl bg-linear-to-br ${cardColors[card.brand] || cardColors.Card} p-5 text-white shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">{card.brand}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-violet-100">
                    {card.isDefault ? "Default" : "Card"}
                  </span>
                </div>
                <div className="mt-12 text-2xl tracking-[0.28em]">
                  •••• {card.last4}
                </div>
                <div className="mt-6 flex items-center justify-between text-sm text-violet-100">
                  <span>{card.name}</span>
                  <span>Valid thru {card.expiry}</span>
                </div>
                <div className="mt-5 flex gap-3 border-t border-white/20 pt-4 text-xs">
                  {!card.isDefault && (
                    <button
                      type="button"
                      onClick={() => setDefaultCard(card.id)}
                      className="text-violet-100 hover:text-white"
                    >
                      Make default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeCard(card.id)}
                    className="ml-auto text-red-200 hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#10131d] px-6 py-8 text-center text-sm text-gray-400">
            No saved payment methods yet.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-[#10131d] p-5"
        >
          <h3 className="text-lg font-semibold text-white">
            Add New Payment Method
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <input
              required
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Cardholder name"
              className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-violet-500"
            />
            <input
              required
              inputMode="numeric"
              value={form.number}
              onChange={(event) => updateField("number", event.target.value)}
              placeholder="Card number"
              className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-violet-500"
            />
            <input
              required
              value={form.expiry}
              onChange={(event) => updateField("expiry", event.target.value)}
              placeholder="MM/YY"
              maxLength={5}
              className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-violet-500"
            />
            <input
              required
              type="password"
              inputMode="numeric"
              value={form.cvv}
              onChange={(event) => updateField("cvv", event.target.value)}
              placeholder="CVV"
              maxLength={4}
              className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-violet-500"
            />
          </div>
          {message && <p className="mt-4 text-sm text-violet-300">{message}</p>}
          <button
            type="submit"
            className="mt-5 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-500"
          >
            Save Card
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PaymentMethods;
