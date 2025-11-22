import { CommandSystem } from "../class/command";
import { encodeBase64 } from "../utils/base64";
import { log, searchID } from "./requestHandler";

const commands = new CommandSystem();

commands.register(
  "help",
  () => {
    return commands.list();
  },
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
    } else if (args[0] === "token") {
      if (!args[1]) return "Please provide a token.";
      return await log(args[1], print);
    } else if (args[0] === "storage") {
      return await log("save", print);
    } else {
      return 'Auth failed. Incorrect authentification method. Try "auth token [token]" or "auth storage".';
    }
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
        createdAt: new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(Date.now())),
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
    for (const key in config) {
      response += `${key}: ${config[key]}\n`;
    }
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
}, 'Set a key-value pair in a saved configuration');

commands.register(".use", async (args, print) => {
  if (args.length < 3) {
    return "Usage: .use [exploit | payload] [script path (ex: ressources/payloads/payload.html)] [id]";
  }

  const type = args[0];
  const scriptPath = args[1];
  const id = args[2];

  // Validate script type
  if (type !== "exploit" && type !== "payload") {
    return `Invalid type "${type}". Must be "exploit" or "payload".`;
  }

  // Try to fetch and encode the file content
  try {
    const response = await fetch(`/api/payload?path=${encodeURIComponent(scriptPath)}`);
    if (!response.ok) {
      return `File not found at path: ${scriptPath}`;
    }
    const data = await response.json();
    const content = data.content;
    const base64Content = encodeBase64(content);

    const config = localStorage.getItem(id);
    if (!config) {
      return `No configuration found for ID ${id}`;
    }

    const parsedConfig = JSON.parse(config);
    parsedConfig["integration"] = base64Content;
    print(`Payload encoded (${base64Content.length} chars base64)`);
    localStorage.setItem(id, JSON.stringify(parsedConfig));
    return `Configuration for ID ${id} updated with ${type}: ${scriptPath}`;
  } catch {
    return `Error reading file at path: ${scriptPath}. Make sure the file exists.`;
  }
}, "Load and encode a payload or exploit into a saved configuration");

async function handleInput(input: string, print: (text: string) => void) {
  const result = await commands.execute(input, print);
  if (result) {
    print(result);
  }
}

export { commands, handleInput };
