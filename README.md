# 🌌 Kira CLI - Your Professional AI Terminal Companion

Kira CLI ek powerful aur stylish Command Line Interface (CLI) tool hai jo aapko direct terminal se duniya ke best AI models ke saath chat karne ki power deta hai. OpenRouter API ka use karke, ye tool multiple AI models ko support karta hai ek attractive aur user-friendly terminal environment mein.

---

## ✨ Features

- 🎨 **Beautiful UI:** ASCII art logo aur vibrant colors (using Chalk) ke saath ek premium feel.
- 🤖 **Multiple AI Models:** DeepSeek, Llama, Gemma, aur Qwen jaise top models ek hi jagah.
- ⌨️ **Typewriter Effect:** Real-time human-like typing experience.
- 📜 **Chat History:** Aapki purani baatein save rehti hain `history.json` mein.
- 📊 **Status Bar:** Current model aur history size hamesha aapki aankhon ke samne.
- 💡 **Smart Suggestions:** Commands type karte waqt suggestions milte hain.
- 🚀 **Fast & Lightweight:** Bina kisi heavy UI ke, seedha terminal se fast responses.

---

## 🛠 Installation

Sabse pehle ensure karein ki aapke system mein **Node.js** installed hai.

1. **Repo Clone karein:**
   ```bash
   git clone https://github.com/ytmomentosstudio-sketch/kira-cli.git
   cd kira-cli
   ```

2. **Dependencies Install karein:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Ek `.env` file banayein project root mein aur apni API key daalein:
   ```env
   OPENROUTER_API_KEY=your_api_key_here
   ```
   *(Aap apni key [OpenRouter](https://openrouter.ai/) se le sakte hain)*

---

## 🚀 Usage Guide

Kira CLI start karne ke liye ye command chalayein:

```bash
node index.js
```

Start hote hi aapko model list dikhegi, apna pasandida model select karein aur chat shuru karein!

---

## 🤖 Available Models

Kira CLI niche diye gaye models ko support karta hai (via OpenRouter):

- **DeepSeek R1** (Free)
- **DeepSeek Chat**
- **Llama 3.3 70B** (Free)
- **Gemma 4 31B** (Free)
- **Qwen3 235B** (Free)

*(Models ko `config.js` file se customize kiya ja sakta hai)*

---

## ⌨️ Commands List

Terminal mein niche diye gaye commands ka use karein:

| Command | Kaam |
| :--- | :--- |
| `/help` | Saare available commands ki list dekho |
| `/clear` | Screen ko saaf (clean) karo |
| `/model` | Live chat ke beech mein model switch karo |
| `/history` | Apni pichli chats ki history dekho |
| `exit` | Kira CLI ko band karne ke liye |

---

## 🤝 Contributing

Agar aap is project ko behtar banana chahte hain:
1. Project ko **Fork** karein.
2. Apni feature branch banayein (`git checkout -b feature/AmazingFeature`).
3. Changes **Commit** karein (`git commit -m 'Add some AmazingFeature'`).
4. Branch **Push** karein (`git push origin feature/AmazingFeature`).
5. Ek **Pull Request** open karein.

---

## 📄 License

Ye project **ISC License** ke andar aata hai. Details ke liye `package.json` dekhein.

---

**Developed with ❤️ by [ytmomentosstudio-sketch](https://github.com/ytmomentosstudio-sketch)**
