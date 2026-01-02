// PWA Notification Client Logic
const BACKEND_URL = "https://notify-api.work-amazing.us"; // Change to your backend URL
let terminalUUID = null;
const VAPID_PUBLIC_KEY =
  "BGsayBDvk6Tdi7Q3Lzy4G4kyDNyRbV0r4WK6EXV_nTJByRz3ulYSfggHCzMVU6Bc68DVKUPIyh2fKI_tZK3Qtls"; // From backend/vapid_keys.py

const DB_NAME = "PWA_Notif_DB";
const DB_VERSION = 1;
const STORE_NAME = "terminal";

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
    };
  });
}

async function getOrCreateUUID() {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get("terminal");
    request.onsuccess = async () => {
      let terminal = request.result;
      if (!terminal) {
        terminal = { id: "terminal", uuid: crypto.randomUUID() };
        await new Promise((r) => {
          const writeTx = db.transaction(STORE_NAME, "readwrite");
          writeTx.objectStore(STORE_NAME).put(terminal).onsuccess = r;
        });
      }
      resolve(terminal.uuid);
    };
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

async function getPushSubscription() {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.register("/sw.js");
    await registration.update();
    await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) return subscription;

    const vapidKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
    return registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidKey,
    });
  }
  throw new Error("Service Worker not supported");
}

async function registerTerminal() {
  try {
    terminalUUID = await getOrCreateUUID();
    const subscription = await getPushSubscription();

    const response = await fetch(`${BACKEND_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uuid: terminalUUID, subscription }),
    });

    if (response.ok) {
      document.getElementById("status").textContent =
        `Registered! UUID: ${terminalUUID}`;
      document.getElementById("uuid").textContent = terminalUUID;
      console.log("Terminal registered:", terminalUUID);
    } else {
      throw new Error("Registration failed");
    }
  } catch (error) {
    console.error("Registration error:", error);
    document.getElementById("status").textContent = `Error: ${error.message}`;
  }
}

async function sendTestNotification() {
  const uuid = document.getElementById("uuid").textContent;
  if (!uuid) {
    alert("Register first!");
    return;
  }

  const title = document.getElementById("title").value || "Test";
  const body = document.getElementById("body").value || "Test notification";

  const response = await fetch(`${BACKEND_URL}/notify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target_uuid: uuid, title, body }),
  });

  if (response.ok) {
    alert("Notification sent!");
  } else {
    const err = await response.json();
    alert(`Error: ${err.detail}`);
  }
}

// Request notification permission on load
if ("Notification" in window) {
  Notification.requestPermission();
}
