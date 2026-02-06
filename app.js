const loader = document.getElementById("loader");
const terminalInput = document.getElementById("terminal-input");
const terminalMessages = document.getElementById("terminal-messages");
const terminalOutput = document.getElementById("terminal-output");

const embeddedPayloads = {
  "ressources/payloads/test.html": "<div>Test Payload</div>",
  "ressources/payloads/banana-mode.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Banana Mode</title>
    <style>
      body {
        margin: 0;
        background: #111;
        color: #ffe135;
        font-family: "Comic Sans MS", "Comic Sans", system-ui, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        text-align: center;
      }
      .card {
        border: 3px dashed #ffe135;
        padding: 32px 40px;
        border-radius: 16px;
        box-shadow: 0 0 25px rgba(255, 225, 53, 0.5);
        animation: wiggle 1.5s infinite;
      }
      h1 {
        margin: 0 0 12px;
        font-size: 2.5rem;
        letter-spacing: 0.2rem;
      }
      p {
        margin: 0;
        font-size: 1.1rem;
      }
      @keyframes wiggle {
        0%, 100% {
          transform: rotate(0deg);
        }
        25% {
          transform: rotate(1deg);
        }
        50% {
          transform: rotate(-1deg);
        }
        75% {
          transform: rotate(1.5deg);
        }
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>🍌 BANANA MODE 🍌</h1>
      <p>Your system is now 82% more potassium.</p>
    </div>
  </body>
</html>`,
  "ressources/payloads/fake-kernel-panic.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Kernel Panic</title>
    <style>
      body {
        margin: 0;
        background: #0a0a0a;
        color: #00ff7f;
        font-family: "Courier New", monospace;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
      }
      .terminal {
        border: 2px solid #00ff7f;
        padding: 24px 32px;
        box-shadow: 0 0 20px rgba(0, 255, 127, 0.4);
      }
      .blink {
        animation: blink 1s steps(2, start) infinite;
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
    </style>
  </head>
  <body>
    <div class="terminal">
      <div>*** KERNEL PANIC - NOT A REAL ERROR ***</div>
      <div>Process: banana-daemon (pid 42)</div>
      <div>Reason: too much potassium in stack frame</div>
      <div class="blink">Rebooting into safe peel mode...</div>
    </div>
  </body>
</html>`,
  "ressources/payloads/rainbow-matrix.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Rainbow Matrix</title>
    <style>
      body {
        margin: 0;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        font-family: "Courier New", monospace;
      }
      .matrix {
        font-size: 2rem;
        letter-spacing: 0.4rem;
        animation: glow 2s infinite;
      }
      .matrix span:nth-child(1) { color: #ff004c; }
      .matrix span:nth-child(2) { color: #ff7a00; }
      .matrix span:nth-child(3) { color: #ffe500; }
      .matrix span:nth-child(4) { color: #3cff00; }
      .matrix span:nth-child(5) { color: #00e5ff; }
      .matrix span:nth-child(6) { color: #7b00ff; }
      @keyframes glow {
        0%, 100% { text-shadow: 0 0 10px currentColor; }
        50% { text-shadow: 0 0 25px currentColor; }
      }
    </style>
  </head>
  <body>
    <div class="matrix">
      <span>H</span><span>A</span><span>C</span><span>K</span><span>E</span><span>D</span>
    </div>
  </body>
</html>`,
  "ressources/payloads/fake-update.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Updating...</title>
    <style>
      body {
        margin: 0;
        background: #101820;
        color: #f2f2f2;
        font-family: system-ui, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
      }
      .card {
        padding: 28px 36px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.06);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
        width: min(420px, 90vw);
      }
      .bar {
        height: 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.15);
        overflow: hidden;
        margin-top: 16px;
      }
      .fill {
        height: 100%;
        width: 65%;
        background: linear-gradient(90deg, #00ffa3, #00c2ff);
        animation: pulse 1.2s infinite;
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>Installing 47 critical updates</h2>
      <p>Do not power off your banana.</p>
      <div class="bar"><div class="fill"></div></div>
      <p>Stuck at 65%? That's part of the prank.</p>
    </div>
  </body>
</html>`,
};

class CommandSystem {
  constructor() {
    this.commands = new Map();
  }

  register(name, handler, description) {
    this.commands.set(name, { handler, description });
  }

  async execute(input, print) {
    const parts = input.trim().split(/\s+/);
    const commandName = parts[0];
    const args = parts.slice(1);

    const command = this.commands.get(commandName);
    if (!command) {
      return `Unknown command: ${commandName}`;
    }

    try {
      return await command.handler(args, print);
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
    }
  }

  list() {
    const commandList = Array.from(this.commands.entries())
      .map(([name, cmd]) => `  ${name}${cmd.description ? ` - ${cmd.description}` : ""}`)
      .join("\n");
    return `Available commands:\n${commandList}`;
  }
}

const commands = new CommandSystem();

const encodeBase64 = (input) => {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

async function testToken(token) {
  try {
    const response = await fetch(
      "https://api.ecoledirecte.com/v3/groupesFlexibles.awp?verbe=get&idEleve=0&v=4.89.2",
      {
        headers: {
          "2fa-token": "",
          accept: "application/json, text/plain, */*",
          "accept-language": "fr-FR,fr;q=0.9",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded",
          pragma: "no-cache",
          priority: "u=1, i",
          "sec-ch-ua": '"Chromium";v="142", "Brave";v="142", "Not_A Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Linux"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "sec-gpc": "1",
          "x-token": token,
        },
        referrer: "",
        body: "data={}",
        method: "POST",
        mode: "cors",
        credentials: "omit",
      }
    );
    const data = await response.json();
    if (data.code !== 200) {
      return [false, `Error ${data.code}: ${data.message}`, token];
    }
    return [true, "Authentified with success", ""];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return [false, errorMessage, ""];
  }
}

async function log(token, print) {
  if (token === "save") {
    sessionStorage.setItem("token", localStorage.getItem("token") || "");
    sessionStorage.setItem("id", localStorage.getItem("id") || "");
    sessionStorage.setItem("type", localStorage.getItem("type") || "");
    await log(sessionStorage.getItem("token") || "", print);
    return "Opened session from saved data.";
  }

  const tokenValid = await testToken(token);
  if (tokenValid[0]) {
    print(tokenValid[1]);
    sessionStorage.setItem("token", token);
    return "Please give the ID and type of the account doing\nid [id] [type]";
  }
  return tokenValid[1];
}

async function searchID(print) {
  try {
    const res = await fetch(
      "https://api.ecoledirecte.com/v3/elevesDocuments.awp?archive=&verbe=get&v=4.89.2",
      {
        credentials: "omit",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64; rv:145.0) Gecko/20100101 Firefox/145.0",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Token": sessionStorage.getItem("token") || "",
          "2FA-Token": "400ecac8-44e1-4bf6-a4e2-e77d64d9acc5",
          "Sec-GPC": "1",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-site",
        },
        referrer: "https://www.ecoledirecte.com/",
        body: "data={}",
        method: "POST",
        mode: "cors",
      }
    );
    const data = await res.json();
    let profile = {};
    if (
      data &&
      data.data &&
      data.data.listesPiecesAVerser &&
      data.data.listesPiecesAVerser.personnes
    ) {
      data.data.listesPiecesAVerser.personnes.forEach((person) => {
        profile = person;
      });
    }
    if (profile.id) {
      print(`Found an id: ${profile.id}`);
      sessionStorage.setItem("id", profile.id.toString());
    }
    if (profile.type) {
      print(`Found a type: ${profile.type}`);
      sessionStorage.setItem("type", profile.type);
    }
    await log(sessionStorage.getItem("token") || "", print);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    print(`Error during searchID: ${msg}`);
  }
}

commands.register(
  "help",
  () => commands.list(),
  "Show available commands"
);

commands.register(
  "auth",
  async (args, print) => {
    if (args.length === 0) {
      return "Usage: auth token [token] or auth storage";
    }
    if (args[0] === "login") {
      return "Auth by login is not implemented yet.";
    }
    if (args[0] === "token") {
      if (!args[1]) {
        return "Please provide a token.";
      }
      return await log(args[1], print);
    }
    if (args[0] === "storage") {
      return await log("save", print);
    }
    return 'Auth failed. Incorrect authentification method. Try "auth token [token]" or "auth storage".';
  },
  'Login with token or "save"'
);

commands.register(
  "id",
  async (args) => {
    if (args.length < 2) {
      return "Usage: id [id] [type]";
    }
    sessionStorage.setItem("id", args[0]);
    sessionStorage.setItem("type", args[1]);
    return `ID set to ${args[0]} with type ${args[1]}`;
  },
  "Set account ID and type"
);

commands.register(
  "clear",
  () => {
    sessionStorage.clear();
    localStorage.clear();
    return "Session cleared";
  },
  "Clear session data"
);

commands.register(
  "searchid",
  async (_, print) => {
    await log(sessionStorage.getItem("token") || "", print);
    return await searchID(print);
  },
  "Search for account ID"
);

commands.register(
  "create",
  (args) => {
    if (args.length < 2) {
      return "Usage: create [msg | exploit] [id]";
    }
    localStorage.setItem(
      args[1],
      JSON.stringify({
        type: args[0],
        id: args[1],
        createdAt: new Intl.DateTimeFormat("fr-FR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date(Date.now())),
        targetID: null,
        subject: null,
        text: null,
        integration: null,
      })
    );
    return `Configuration for ${args[0]} with ID ${args[1]} created and saved.`;
  },
  "Create a saved configuration"
);

commands.register(
  "delete",
  (args) => {
    if (args.length < 1) {
      return "Usage: delete [id]";
    }
    try {
      localStorage.removeItem(args[0]);
    } catch {
      return `Error deleting configuration with ID ${args[0]}. It may not exist.`;
    }
    return `Configuration with ID ${args[0]} deleted.`;
  },
  "Delete a saved configuration"
);

commands.register(
  "list",
  () => {
    const keys = Object.keys(localStorage);
    if (keys.length === 0) {
      return "No saved configurations found.";
    }
    return keys.join("\n");
  },
  "List saved configurations"
);

commands.register("show", (args) => {
  if (args.length < 1) {
    return "Usage: show [id]";
  }
  try {
    const config = JSON.parse(localStorage.getItem(args[0]) || "{}");
    let response = "";
    Object.keys(config).forEach((key) => {
      response += `${key}: ${config[key]}\n`;
    });
    return response;
  } catch {
    return `Error parsing configuration with ID ${args[0]}. It may not exist or be corrupted.`;
  }
}, "Show a saved configuration");

commands.register("set", (args) => {
  if (args.length < 3) {
    return "Usage: set [id] [key] [value]";
  }
  const config = JSON.parse(localStorage.getItem(args[0]) || "{}");
  config[args[1]] = args[2];
  localStorage.setItem(args[0], JSON.stringify(config));
  return `Configuration for ID ${args[0]} updated: set ${args[1]} to ${args[2]}`;
}, "Set a key-value pair in a saved configuration");

commands.register(
  ".use",
  async (args, print) => {
    if (args.length < 3) {
      return "Usage: .use [exploit | payload] [script path (ex: ressources/payloads/payload.html)] [id]";
    }

    const type = args[0];
    const scriptPath = args[1];
    const id = args[2];

    if (type !== "exploit" && type !== "payload") {
      return `Invalid type "${type}". Must be "exploit" or "payload".`;
    }

    let content = embeddedPayloads[scriptPath];

    if (!content) {
      try {
        const response = await fetch(scriptPath);
        if (!response.ok) {
          return `File not found at path: ${scriptPath}`;
        }
        content = await response.text();
      } catch {
        return `Error reading file at path: ${scriptPath}. Make sure the file exists or use an embedded payload path.`;
      }
    }

    const base64Content = encodeBase64(content);

    const config = localStorage.getItem(id);
    if (!config) {
      return `No configuration found for ID ${id}`;
    }

    const parsedConfig = JSON.parse(config);
    parsedConfig.integration = base64Content;
    print(`Payload encoded (${base64Content.length} chars base64)`);
    localStorage.setItem(id, JSON.stringify(parsedConfig));
    return `Configuration for ID ${id} updated with ${type}: ${scriptPath}`;
  },
  "Load and encode a payload or exploit into a saved configuration"
);

async function handleInput(input, print) {
  const result = await commands.execute(input, print);
  if (result) {
    print(result);
  }
}

const appendMessage = (text) => {
  const messageEl = document.createElement("div");
  messageEl.className = "message";
  messageEl.textContent = text;
  terminalMessages.appendChild(messageEl);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
};

const enterCmd = async (text) => {
  if (!text.trim()) {
    return;
  }
  appendMessage(`@EDInspector ~ root> ${text}`);
  await handleInput(text, appendMessage);
};

terminalInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    await enterCmd(terminalInput.value);
    terminalInput.value = "";
  }
});

window.addEventListener("DOMContentLoaded", () => {
  appendMessage("Welcome to the ED inspector tool");
  setTimeout(() => {
    loader.classList.add("is-hidden");
  }, 5000);
  terminalInput.focus();
});
