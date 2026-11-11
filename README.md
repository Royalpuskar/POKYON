# POKYON — Orbit Rush

**A fully playable, small browser arcade prototype.** Built for the Royalpuskar game-development portfolio.

## Play

Open the root `index.html` through a local web server or use GitHub Pages when enabled.

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Visit `http://127.0.0.1:8000`.

Use **A / D** or **Left / Right** arrow keys to steer. On mobile, use the left/right buttons or touch the left/right half of the arena. Press **P** to pause and use **Restart** for a new game. Dodge falling hazards; earn points over time and for cleared hazards; three hits end the run.

## Architecture

- `index.html`: landing page, game area, status dashboard.
- `style.css`: responsive game styling.
- `client.mjs`: Canvas renderer, keyboard and pointer controls, pause, restart, overlays.
- `game.mjs`: deterministic state transitions, movement, collision, scoring, increasing difficulty.
- `game.test.mjs`: unit tests for reproducible state, boundaries, invalid steps, and collisions.

No account, analytics, external assets, payment gateway or API key required. All gameplay happens locally.

## Tests

Node.js 22+:

```sh
node --test
node --check client.mjs
```

GitHub Actions runs these tests on commits and pull requests.

## Relation to the Android project

This repository is the **POKYON browser game lab**. The separate [POKYON-](https://github.com/Royalpuskar/POKYON-) repository houses an experimental Android/Compose implementation. They are two independent codebases; neither is a completed commercial 3D multiplayer game.

## Limitations

The current implementation is a browser Canvas prototype. It does not include network multiplayer, native Android packaging, 3D graphics, anti-cheat, leaderboards, monetization, cloud saves or commercial-scale performance testing. Those remain potential engineering projects, not shipped features.

**Author:** [Royalpuskar](https://github.com/Royalpuskar).
