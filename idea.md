# Game Design Document: The L-System Arboretum

**Platform:** Web (React / React Three Fiber)  
**Genre:** Incremental / Idle / Simulation  
**Core Tech:** Three.js, InstancedMesh, L-System Mathematics  
**Version:** 1.0  

---

## 1. Executive Summary
**The L-System Arboretum** is a web-based idle game where players cultivate a single, procedurally generated tree. Unlike standard idle games where upgrades are abstract (e.g., "Level 2 Mine"), upgrades here physically alter the genetic code (L-System rules) of the tree.

Players must balance **structural integrity** (roots/wood) with **energy production** (leaves/light) to evolve their tree from a simple twig into a massive, screen-filling fractal structure.

---

## 2. Core Gameplay Loop

### A. The Cycle
1.  **Grow:** The tree generates resources automatically.
2.  **Mutate:** Spend resources to edit the L-System "DNA" (Axiom and Rules).
3.  **Visualize:** The 3D tree updates in real-time to reflect the new geometry.
4.  **Prestige:** Trigger "Winter" to harvest the tree for Seeds.

### B. Resources & Economy

| Resource | Source | Generation Logic | Usage |
| :--- | :--- | :--- | :--- |
| **Photosynthesis** | Leaves (Terminators) | `Total Leaf Area` × `Light Exposure`. Raycasting determines if a leaf is occluded by branches above it. | Buying new **Rules**, increasing **Iterations**, optimizing Angles. |
| **Sap** | Wood (Branches) | `Total Cylinder Volume` × `Root Depth`. | Increasing **Width** (girth), **Tick Rate**, and growing **Fruit**. |
| **Seeds** | Fruit (Prestige) | Earned upon resetting via "Winter." | Global multipliers, unlocking 3D geometries, unlocking non-cylinder meshes. |

---

## 3. The Mathematics: L-Systems (Genetics)

The tree is defined by the tuple `(V, ω, P)`. The player does not buy "production buildings"; they buy complex math rules.

### Variables (The DNA)
* **Axiom (ω):** The starting seed string (e.g., `X`).
* **Rules (P):** The production logic.
    * *Level 1:* `X` → `F[+X][-X]` (Simple split).
    * *Level 10:* `X` → `F-[[X]+X]+F[+FX]-X` (Complex Fern).
* **Constants:**
    * **δ (Angle):** The rotation angle (gameplay slider).
    * **d (Step):** Length of branch segments.

### The "Turtle" Interpreter
The string is parsed to generate 3D transforms:
* `F`: Move forward (Draw Branch).
* `[`: Save current position/rotation (Push Stack).
* `]`: Restore previous position/rotation (Pop Stack).
* `+` / `-`: Rotate around Z-axis.
* `&` / `^`: Rotate around X-axis (Pitch - Unlockable).
* `/` / `\`: Rotate around Y-axis (Roll - Unlockable).

---

## 4. Technical Architecture (React Three Fiber)

### The Rendering Bottleneck
Rendering a recursive component tree (e.g., `<Branch><Branch /></Branch>`) is fatal for performance beyond 5 iterations. We must use **Instanced Rendering**.

### Implementation Strategy

**1. The Generator Hook (`useLSystem`)**
Calculates the matrices off the main render loop.

    const { positions, rotations, scales } = useMemo(() => {
      let sentence = axiom;
      // 1. String Generation
      for(let i=0; i<iterations; i++) {
         sentence = applyRules(sentence);
      }
      
      // 2. Turtle Interpretation
      const tempObject = new THREE.Object3D();
      const data = []; 
      
      // ... Iterate through string chars
      // ... Calculate matrices based on Turtle rules
      
      return data;
    }, [axiom, rules, iterations, angle]);

**2. The Renderer (`<TreeRenderer />`)**
Uses `drei` or native InstancedMesh to draw 10,000+ branches in a single draw call.

    <Instances range={maxCapacity}>
      <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
      <meshStandardMaterial />
      
      {segments.map((data, i) => (
        <Instance 
          key={i} 
          position={data.pos} 
          rotation={data.rot} 
          scale={data.scale} 
        />
      ))}
    </Instances>

### Shaders & Juice
* **Wind Shader:** A custom vertex shader applied to the branches. It accepts a `uTime` uniform. It applies a `sin` wave displacement based on the Y-position of the instance (higher branches sway more).
* **Growth Animation:** When `Iterations` increases, use `react-spring` to animate the `scale` of new instances from `0` to `1` so the tree appears to bloom rather than snap.

---

## 5. UI/UX Design

### 1. The Genome Editor
A scientific control panel overlay.
* **String Viewer:** Shows the current logic (e.g., `F[+F]...`). Active mutations highlight in **Red**.
* **Angle Dial:** A radial knob. Dragging it changes the branch angle from 0° to 90° in real-time.

### 2. Analysis Mode (Heatmaps)
A toggle that swaps the wood texture for a gradient shader.
* **Green:** Branch is receiving 100% light.
* **Black:** Branch is fully occluded (wasted energy).
* *Player Action:* Use this mode to tweak the Angle Dial until the tree is mostly Green.

---

## 6. Progression: The Seasons

1.  **Spring (Expansion):** Low cost for Iterations. Rapid vertical growth.
2.  **Summer (Optimization):** Resource costs spike. Gameplay shifts to optimizing angles and width to maximize Photosynthesis.
3.  **Autumn (Fruiting):** Growth halts. Resources are dumped into "Fruit Spawns" (Prestige currency points).
4.  **Winter (Reset):** Visuals turn cold/grey. Clicking "Harvest" destroys the tree and awards **Seeds**.

**Seed Shop (Meta-Progression):**
* **New Geometry:** Unlock Cones, Cubes, or Tetrahedrons for branches.
* **Dimensionality:** Unlock 3D rotation rules (Pitch/Yaw) to stop the tree from being flat.
* **Automation:** Auto-tuner upgrade that slowly adjusts Angles to the perfect optimal degree.