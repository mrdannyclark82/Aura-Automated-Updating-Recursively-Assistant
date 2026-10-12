# Aura - Autonomous AI Assistant

An autonomous, self-improving AI assistant with proactive task intelligence, dynamic long-term memory learning, memory bank document uploads, and dual-engine architecture (Cloud Gemini 3.8 Flash + On-Device Local Gemma WebGPU).

---

## 🚀 How to Run on Your PC

Running Aura on your PC (Windows, macOS, or Linux) takes less than 2 minutes:

### Prerequisites
- **Node.js**: Version 18 or higher ([Download Node.js](https://nodejs.org/))
- **npm** (comes with Node.js) or **bun** / **pnpm**

---

### Step 1: Install Dependencies
Open your terminal (PowerShell, Command Prompt, or Terminal) in the project directory and run:

```bash
npm install
```

---

### Step 2: Configure Your Gemini API Key
Create a `.env.local` file in the project root directory (you can copy `.env.example`):

```bash
# .env.local
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

> **Where to get a key?** Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

---

### Step 3: Start the Development Server
Run:

```bash
npm run dev
```

The terminal will display:
```
  VITE v6.x.x  ready in 250 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://0.0.0.0:3000/
```

Open your browser and navigate to:
👉 **`http://localhost:3000`**

---

## 💻 Running as a Native Desktop App on Your PC (PWA)

You don't need to keep a terminal tab or browser address bar open. Aura is a fully compliant Progressive Web App (PWA):

1. Open `http://localhost:3000` in **Google Chrome**, **Microsoft Edge**, or **Brave**.
2. Click the **"Install App"** prompt in the Aura bottom banner, or click the **Install icon (🖥️/⊕)** on the right side of your browser's address bar.
3. Aura will install as a standalone desktop window with its own icon on your Windows Taskbar, macOS Dock, or Linux desktop.

---

## ⚡ Model Engines

Aura supports two engines switchable directly from the top bar:

1. **Cloud Gemini 3.8 Flash (Default & Recommended):**
   - High-speed conversational intelligence
   - Deep autonomous toolbelt (web search, math, calendar, notes, task execution)
   - Real-time SOTA reasoning & memory grounding

2. **Local Gemma 2B (On-Device WebGPU):**
   - Runs directly in your browser hardware using WebGPU
   - 100% offline — zero data leaves your machine
   - Grounded memory query & fast local assistance

---

## 🛠️ Project Scripts

- `npm run dev`: Starts local Vite development server on port 3000.
- `npm run build`: Compiles production build into `dist/`.
- `npm run preview`: Previews the production build locally.
