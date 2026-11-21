// =====================
// DATA UNDANGAN
// Ubah bagian ini sesuai data acara Anda.
// =====================
const invitationData = {
  bride: "Ayu",
  groom: "Bima",
  brideFull: "Ayu Lestari",
  groomFull: "Bima Pratama",
  dateText: "Minggu, 20 Desember 2026",
  // Format wajib: YYYY-MM-DDTHH:MM:SS
  dateISO: "2026-12-20T08:00:00",
  akadTime: "08.00 WIB – selesai",
  resepsiTime: "11.00 – 14.00 WIB",
  place: "Gedung / lokasi acara, alamat lengkap",
  mapUrl: "https://maps.google.com/?q=lokasi+acara",
  whatsapp: "6281234567890", // Nomor WhatsApp penerima RSVP, awali kode negara
  bank: "BCA",
  account: "1234567890",
  accountOwner: "a.n. Nama Penerima",
  giftAddress: "Isi alamat penerima kado di sini"
};

const $ = (id) => document.getElementById(id);
function setText(id, value) { const el = $(id); if (el) el.textContent = value; }

function applyInvitationData() {
  ["coverBride","heroBride"].forEach(id => setText(id, invitationData.bride));
  ["coverGroom","heroGroom"].forEach(id => setText(id, invitationData.groom));
  setText("brideName", invitationData.brideFull);
  setText("groomName", invitationData.groomFull);
  setText("coverDate", invitationData.dateText.toUpperCase());
  setText("heroDate", invitationData.dateText);
  setText("akadDate", invitationData.dateText);
  setText("resepsiDate", invitationData.dateText);
  setText("akadTime", invitationData.akadTime);
  setText("resepsiTime", invitationData.resepsiTime);
  setText("akadPlace", invitationData.place);
  setText("resepsiPlace", invitationData.place);
  setText("closingNames", `${invitationData.bride} & ${invitationData.groom}`);
  setText("bankName", invitationData.bank);
  setText("accountNumber", invitationData.account);
  setText("accountOwner", invitationData.accountOwner);
  setText("giftAddress", invitationData.giftAddress);
  $("akadMap").href = invitationData.mapUrl;
  $("resepsiMap").href = invitationData.mapUrl;
  document.title = `Undangan Pernikahan | ${invitationData.bride} & ${invitationData.groom}`;
}
applyInvitationData();

// Nama tamu dapat diisi melalui URL: index.html?to=Nama%20Tamu
const params = new URLSearchParams(location.search);
if (params.get("to")) setText("guestName", params.get("to"));

$("openInvitation").addEventListener("click", () => {
  $("cover").classList.add("opened");
  $("cover").style.display = "none";
  $("invitation").classList.remove("hidden");
  $("musicControl").style.display = "grid";
  window.scrollTo({top:0, behavior:"smooth"});
  // Browser biasanya mensyaratkan interaksi pengguna sebelum audio diputar.
  $("bgMusic").play().then(() => setText("musicIcon","♫")).catch(() => {});
});

$("musicControl").addEventListener("click", () => {
  const audio = $("bgMusic");
  if (audio.paused) { audio.play().catch(()=>{}); setText("musicIcon","♫"); }
  else { audio.pause(); setText("musicIcon","Ⅱ"); }
});

function updateCountdown() {
  const target = new Date(invitationData.dateISO).getTime();
  let distance = target - Date.now();
  if (distance < 0) distance = 0;
  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance % 86400000) / 3600000);
  const minutes = Math.floor((distance % 3600000) / 60000);
  const seconds = Math.floor((distance % 60000) / 1000);
  setText("days", String(days).padStart(2,"0"));
  setText("hours", String(hours).padStart(2,"0"));
  setText("minutes", String(minutes).padStart(2,"0"));
  setText("seconds", String(seconds).padStart(2,"0"));
}
updateCountdown();
setInterval(updateCountdown, 1000);

$("rsvpForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("rsvpName").value.trim();
  const count = $("rsvpCount").value;
  const status = $("rsvpStatus").value;
  const message = $("rsvpMessage").value.trim();
  if (!name) return;
  const text = `Assalamualaikum, saya ${name}.%0AKonfirmasi: ${status}%0AJumlah: ${count}%0AUcapan: ${message || "-"}`;
  const url = `https://wa.me/${invitationData.whatsapp}?text=${encodeURIComponent(decodeURIComponent(text))}`;
  window.open(url, "_blank", "noopener");
});

$("copyAccount").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(invitationData.account);
    $("copyAccount").textContent = "Nomor rekening tersalin ✓";
  } catch {
    $("copyAccount").textContent = "Salin manual: " + invitationData.account;
  }
});
