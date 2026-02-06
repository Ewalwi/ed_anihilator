# ED Anihilator (Vanilla)

This repository now runs as a **static HTML/CSS/JS** experience that works **without a server**. Just open `index.html` in your browser.

## Usage

1. Open `index.html` directly in your browser (double-click or drag into a tab).
2. The loader appears for a few seconds, then the terminal interface is ready.
3. Type `help` to see available commands.

## Notes

- The `.use` command can read embedded payloads such as `ressources/payloads/test.html` without a server.
- For custom payload paths, browsers may block direct file access when opening `index.html` via `file://`.

## Files

- `index.html` — main page
- `styles.css` — styling for loader + terminal
- `app.js` — command system and behavior
- `public/YPlogo.png`, `public/YP letters.png` — assets used by the loader
