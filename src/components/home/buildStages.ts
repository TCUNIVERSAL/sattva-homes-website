/**
 * The five steps from choosing a design to moving in, shared by the 3D build and its static fallback.
 * The 3D house grows alongside them: footprint on the block, frame, roof, lock-up, lights on.
 */
export const BUILD_STAGES = [
  { short: "Design", title: "Pick your design", text: "Browse single and double storey house designs across three series, and choose the floor plan that suits your block and the way you live." },
  { short: "Finishes", title: "Make it yours", text: "Choose your façade, colours, floors, benchtops and fixtures, with our team beside you." },
  { short: "Plans", title: "Plans & approvals", text: "We finalise your plans and building contract together, then lodge the approvals." },
  { short: "Build", title: "We build it", text: "Slab, frame, roof and lock-up, stage by stage, and you're kept in the loop throughout." },
  { short: "Move in", title: "Welcome home", text: "A final walkthrough together, then the keys to your new home are yours." },
] as const;
