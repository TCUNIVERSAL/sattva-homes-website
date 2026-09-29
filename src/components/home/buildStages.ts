/** The five construction stages, shared by the 3D build and its static fallback. */
export const BUILD_STAGES = [
  { short: "Slab", title: "Slab", text: "We set out your home on the block and pour the concrete slab." },
  { short: "Frame", title: "Frame", text: "The timber frame goes up wall by wall, then the upper floor." },
  { short: "Roof", title: "Roof", text: "The roof goes on and the house takes its real shape." },
  { short: "Lock-up", title: "Lock-up", text: "Walls, windows and doors. Now the house can be locked." },
  { short: "Home", title: "Welcome home", text: "Fit-out, garden and a final walkthrough. Then the lights are yours." },
] as const;
