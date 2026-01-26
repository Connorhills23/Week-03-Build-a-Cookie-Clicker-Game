const SAVE_KEY = "rim_clicker_save";

/* ================= CORE GAME STATE ================= */
let cash = 0;
let cps = 0;
let clickPower = 1;
let autoClickers = 0;
let isMuted = false;

/* ================= BUILT-IN UPGRADES ================= */
const upgrades = [
  {
    id: 1,
    name: "Basic Alloy Rims",
    cost: 100,
    increase: 1,
    owned: 0,
    type: "cps",
  },
  {
    id: 2,
    name: "Performance Tires",
    cost: 500,
    increase: 5,
    owned: 0,
    type: "cps",
  },
  {
    id: 3,
    name: "Custom Rim Shop",
    cost: 1000,
    increase: 10,
    owned: 0,
    type: "cps",
  },
  {
    id: 4,
    name: "CNC Rim Machine",
    cost: 2000,
    increase: 20,
    owned: 0,
    type: "cps",
  },
  {
    id: 5,
    name: "Luxury Rim Factory",
    cost: 5000,
    increase: 50,
    owned: 0,
    type: "cps",
  },
  {
    id: 6,
    name: "Grip Gloves",
    cost: 30,
    increase: 1,
    owned: 0,
    type: "click",
  },
  {
    id: 7,
    name: "Power Wrist",
    cost: 1500,
    increase: 5,
    owned: 0,
    type: "click",
  },
  {
    id: 8,
    name: "Auto Rim Spinner",
    cost: 2000,
    increase: 1,
    owned: 0,
    type: "auto",
  },
  {
    id: 9,
    name: "Carbon Fiber Rim Line",
    cost: 15000,
    increase: 120,
    owned: 0,
    type: "cps",
  },
  {
    id: 10,
    name: "Robotic Assembly Arms",
    cost: 40000,
    increase: 300,
    owned: 0,
    type: "cps",
  },
  {
    id: 11,
    name: "Global Rim Distribution",
    cost: 120000,
    increase: 800,
    owned: 0,
    type: "cps",
  },
  {
    id: 12,
    name: "Automated Mega Factory",
    cost: 300000,
    increase: 2000,
    owned: 0,
    type: "cps",
  },
  {
    id: 13,
    name: "Titanium Knuckles",
    cost: 10000,
    increase: 15,
    owned: 0,
    type: "click",
  },
  {
    id: 14,
    name: "Hydraulic Arm Rig",
    cost: 50000,
    increase: 40,
    owned: 0,
    type: "click",
  },
  {
    id: 15,
    name: "Cybernetic Reflex Boost",
    cost: 200000,
    increase: 100,
    owned: 0,
    type: "click",
  },
  {
    id: 16,
    name: "Dual Spinner Rig",
    cost: 12000,
    increase: 2,
    owned: 0,
    type: "auto",
  },
  {
    id: 17,
    name: "Industrial Spin Bots",
    cost: 60000,
    increase: 5,
    owned: 0,
    type: "auto",
  },
  {
    id: 18,
    name: "AI-Controlled Spinner Network",
    cost: 250000,
    increase: 12,
    owned: 0,
    type: "auto",
  },
];

/* ================= ACHIEVEMENTS ================= */
const achievements = [
  {
    name: "🛞 First Rim",
    reward: 1,
    unlocked: false,
    check: () => cash >= 100,
  },
  {
    name: "💸 Rolling In Cash",
    reward: 5,
    unlocked: false,
    check: () => cash >= 1000,
  },
  {
    name: "🏭 Rim Dealer",
    reward: 10,
    unlocked: false,
    check: () => upgrades.reduce((s, u) => s + u.owned, 0) >= 5,
  },
  {
    name: "🌍 Rim Empire",
    reward: 25,
    unlocked: false,
    check: () => upgrades.reduce((s, u) => s + u.owned, 0) >= 15,
  },
  {
    name: "🚀 Rim Tycoon",
    reward: 50,
    unlocked: false,
    check: () => cash >= 20000,
  },
  {
    name: "💎 Premium Collector",
    reward: 75,
    unlocked: false,
    check: () => upgrades.reduce((s, u) => s + u.owned, 0) >= 25,
  },
  {
    name: "⚡ Click Master",
    reward: 20,
    unlocked: false,
    check: () => clickPower >= 50,
  },
  {
    name: "🤖 Auto Overlord",
    reward: 30,
    unlocked: false,
    check: () => autoClickers >= 10,
  },
  {
    name: "🏰 Rim Mogul",
    reward: 100,
    unlocked: false,
    check: () => cash >= 200000,
  },
  {
    name: "💰 Billionaire Spinner",
    reward: 200,
    unlocked: false,
    check: () => cash >= 1000000,
  },
  {
    name: "🔧 Ultimate Clicker",
    reward: 50,
    unlocked: false,
    check: () => clickPower >= 200,
  },
  {
    name: "🤖 AI Rim Network",
    reward: 75,
    unlocked: false,
    check: () => autoClickers >= 25,
  },
  {
    name: "🎯 Perfectionist",
    reward: 50,
    unlocked: false,
    check: () => upgrades.reduce((s, u) => s + u.owned, 0) >= 40,
  },
  {
    name: "🔥 Rim Legend",
    reward: 500,
    unlocked: false,
    check: () => cash >= 5000000,
  },
];

/* ================= CLICK RIM ================= */
function clickRim() {
  cash += clickPower;
  showFloatingText(clickPower);

  const rim = document.querySelector(".rim-button img");
  if (rim) {
    rim.classList.add("clicked");
    setTimeout(() => rim.classList.remove("clicked"), 150);
  }

  updateUI();
}

/* ================= BUY UPGRADE ================= */
function buyUpgrade(id) {
  const u = upgrades.find((x) => x.id === id);
  if (!u || cash < u.cost) return;

  cash -= u.cost;
  u.owned++;
  u.cost = Math.floor(u.cost * 1.5);

  if (u.type === "cps") cps += u.increase;
  if (u.type === "click") clickPower += u.increase;
  if (u.type === "auto") autoClickers += u.increase;

  if (!isMuted) {
    const sound = document.getElementById("upgrade-sound");
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  }

  updateUI();
  renderUpgrades();
  checkAchievements();
}

/* ================= FLOATING TEXT ================= */
function showFloatingText(amount) {
  const rimBtn = document.querySelector(".rim-button");
  if (!rimBtn) return;

  const el = document.createElement("div");
  el.className = "floating-text";
  el.textContent = `+£${amount}`;
  el.style.left = "50%";
  el.style.top = "30%";
  el.style.transform = "translate(-50%, -50%)";

  rimBtn.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

/* ================= UI ================= */
function updateUI() {
  document.getElementById("cash").textContent = `Cash: £${Math.floor(cash)}`;
  document.getElementById("cps").textContent =
    `CPS: £${cps} | Click: £${clickPower}`;

  upgrades.forEach((u) => {
    const btn = document.getElementById(`buy-${u.id}`);
    if (btn) btn.disabled = cash < u.cost;
  });
}

function renderUpgrades() {
  const el = document.getElementById("upgrades");
  if (!el) return;
  el.innerHTML = "";

  upgrades.forEach((u) => {
    el.innerHTML += `
      <div class="upgrade">
        <h4>${u.name}</h4>
        <p>Owned: ${u.owned}</p>
        <p>+${u.increase} ${u.type.toUpperCase()}</p>
        <p>Cost: £${u.cost}</p>
        <button id="buy-${u.id}" onclick="buyUpgrade(${u.id})">Buy</button>
      </div>
    `;
  });
}

function renderAchievements() {
  const el = document.getElementById("achievements");
  if (!el) return;
  el.innerHTML = "";

  achievements.forEach((a) => {
    el.innerHTML += `<div class="achievement ${a.unlocked ? "unlocked" : ""}">${a.name} (+${a.reward} CPS)</div>`;
  });
}

/* ================= ACHIEVEMENTS ================= */
function checkAchievements() {
  achievements.forEach((a) => {
    if (!a.unlocked && a.check()) {
      a.unlocked = true;
      cps += a.reward;
      showAchievementPopup(a.name, a.reward);
      renderAchievements();
    }
  });
}

function showAchievementPopup(name, reward) {
  if (!isMuted) {
    const sound = document.getElementById("achievement-sound");
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  }

  const p = document.createElement("div");
  p.textContent = `🏆 ${name} (+${reward} CPS)`;
  Object.assign(p.style, {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#222",
    color: "#0f0",
    padding: "10px 20px",
    borderRadius: "6px",
    zIndex: 9999,
  });
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 10000);
}

/* ================= SAVE / LOAD ================= */
function saveGame() {
  localStorage.setItem(
    SAVE_KEY,
    JSON.stringify({
      cash,
      cps,
      clickPower,
      autoClickers,
      upgrades: upgrades.map((u) => ({
        id: u.id,
        owned: u.owned,
        cost: u.cost,
      })),
      achievements: achievements.map((a) => a.unlocked),
    }),
  );
}

function loadGame() {
  const data = localStorage.getItem(SAVE_KEY);
  if (!data) return;

  const save = JSON.parse(data);
  cash = save.cash ?? 0;
  cps = save.cps ?? 0;
  clickPower = save.clickPower ?? 1;
  autoClickers = save.autoClickers ?? 0;

  save.upgrades?.forEach((savedUpgrade) => {
    const u = upgrades.find((x) => x.id === savedUpgrade.id);
    if (u) {
      u.owned = savedUpgrade.owned;
      u.cost = savedUpgrade.cost;
    }
  });

  save.achievements?.forEach((u, i) => {
    if (achievements[i]) achievements[i].unlocked = u;
  });
}

/* ================= RESET ================= */
function resetGame() {
  if (!confirm("Reset your rim empire?")) return;
  localStorage.removeItem(SAVE_KEY);
  location.reload();
}

/* ================= MUTE ================= */
function toggleMute() {
  isMuted = !isMuted;
  const btn = document.getElementById("mute-button");
  if (btn) btn.textContent = isMuted ? "🔇 Muted" : "🔊 Unmuted";
}

/* ================= LOOPS ================= */
setInterval(() => {
  cash += cps / 10;
  if (autoClickers > 0) {
    upgrades
      .filter((u) => u.type === "auto")
      .forEach((u) => {
        cash += (u.owned * u.increase) / 10;
      });
  }
  updateUI();
}, 100);

setInterval(checkAchievements, 500);
setInterval(saveGame, 3000);

// toggle dropdown menu
const optionsButton = document.getElementById("options-button");
const optionsMenu = document.getElementById("options-menu");

optionsButton.addEventListener("click", () => {
  optionsMenu.classList.toggle("hidden");
});

// reset button
const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", () => {
  if (confirm("Reset your rim empire?")) {
    localStorage.removeItem("rim_clicker_save");
    location.reload();
  }
});

/* ================= WHEEL IMAGES ================= */
const wheelImages = ["image/rim1.png", "image/rim2.png", "image/rim3.png"];
let currentWheelIndex = 0;
const wheelButtonImg = document.querySelector(".rim-button img");
const changeWheelButton = document.getElementById("change-wheel-button");

if (changeWheelButton) {
  changeWheelButton.addEventListener("click", () => {
    currentWheelIndex = (currentWheelIndex + 1) % wheelImages.length;
    if (wheelButtonImg) wheelButtonImg.src = wheelImages[currentWheelIndex];
  });
}

/* ================= FETCH LOCAL UPGRADES ================= */
async function fetchUpgrades() {
  try {
    const response = await fetch("upgrades.json"); // Local JSON file
    if (!response.ok) throw new Error("Failed to fetch upgrades");

    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error("Upgrades JSON is not an array");
      return;
    }

    const apiUpgrades = data.map((item) => ({
      id: item.id,
      name: item.name,
      cost: item.cost,
      increase: item.increase,
      owned: 0,
      type: item.type,
    }));

    upgrades.push(...apiUpgrades);
    renderUpgrades();
    updateUI();
    loadGame(); // apply saved states if any
  } catch (err) {
    console.error("Error fetching upgrades:", err);
  }
}

/* ================= INIT ================= */
document.getElementById("mute-button")?.addEventListener("click", toggleMute);
document.getElementById("reset-button")?.addEventListener("click", resetGame);

fetchUpgrades();
loadGame();
renderUpgrades();
renderAchievements();
updateUI();
