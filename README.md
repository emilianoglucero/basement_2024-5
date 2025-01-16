# Basement Creative Dev Challenge — Extra Feature

> **Trophy model reacts to physics** using `@react-three/rapier` — an extra feature built on top of the main challenge submission.

| | |
|---|---|
| 🔗 **Repo** | [emilianoglucero/basement_2024-5](https://github.com/emilianoglucero/basement_2024-5) |
| 🚀 **Live Demo** | [basement-2024-5.vercel.app](https://basement-2024-5.vercel.app/) |
| 📖 **Documentation** | [docs/README.md](./docs/README.md) |

---

## Related

> 🏆 **Main Challenge** — Trophy rotates on scroll (primary submission):
> - Repo: [emilianoglucero/bsmnt-scroll](https://github.com/emilianoglucero/bsmnt-scroll)
> - Live: [bsmnt-scroll.vercel.app](https://bsmnt-scroll.vercel.app/)
> - Docs: [docs/README.md](https://github.com/emilianoglucero/bsmnt-scroll/blob/main/docs/README.md)

---

## What's Different Here

This branch extends the main challenge with a physics simulation for the trophy model:

- Trophy is a `RigidBody` driven by `@react-three/rapier`
- Forces applied each frame to track the DOM element position via `useTracker` from `r3f-scroll-rig`
- Two-state system: `intro` (high-force approach) → `active` (continuous dynamic interaction)
- Mouse/touch pointer creates a collider that pushes the trophy
- Viewport-responsive force scaling for mobile/desktop

📖 [Full physics implementation details →](./docs/extras/physics-implementation.md)

---

## Challenge Requirements (main features also implemented here)

- Track DOM elements and draw Three.js objects in their place using correct scale and position
- Implement Lenis for smooth and accessible scrolling
- Add a custom shader for hover image interaction
- Awwwards model scroll behavior — **here extended with physics**
- Pin the Caps section, animate caps on scroll
- Responsive up to iPad

## Stack

- [TypeScript](https://www.typescriptlang.org/)
- [Next.js](https://nextjs.org/)
- [@react-three/fiber](https://github.com/pmndrs/react-three-fiber)
- [@react-three/drei](https://github.com/pmndrs/drei)
- [@react-three/rapier](https://github.com/pmndrs/react-three-rapier) ← physics
- [@14islands/r3f-scroll-rig](https://github.com/14islands/r3f-scroll-rig)
- [gsap](https://gsap.com/)
- [@studio-freight/lenis](https://github.com/studio-freight/lenis)
- [zustand](https://zustand.docs.pmnd.rs/)

## Development

1. Install pnpm:

   ```bash
   npm install -g pnpm
   ```

2. Install dependencies:

   ```bash
   pnpm i --frozen-lockfile
   ```

3. Start dev server:

   ```bash
   pnpm dev
   ```
