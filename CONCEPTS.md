
# IEC 63345:2023 Implementation Concepts

This project is a strict implementation of the **IEC 63345:2023 - Energy efficiency systems - Simple external consumer display** standard.

## 1. Data Model Mapping (Clause 7 & 8)

The standard defines a set of "Functional Blocks" (FB) and "Data Point Types" (DPT). This application mirrors these definitions one-to-one in TypeScript interfaces.

### Functional Blocks (Clause 7)
| IEC 63345 Table | Functional Block | TypeScript Interface | UI Component |
| :--- | :--- | :--- | :--- |
| **Table 2** | `M_HEATM` | `src/functional-blocks/m-heatm.ts` | `FB_HEATM.tsx` |
| **Table 3** | `M_HCA` | `src/functional-blocks/m-hca.ts` | `FB_HCA.tsx` |
| **Table 4** | `M_WATERM` | `src/functional-blocks/m-waterm.ts` | `FB_WATERM.tsx` |
| **Table 5** | `M_GENERICM` | `src/functional-blocks/m-genericm.ts` | `FB_GENERICM.tsx` |
| **Table 6** | `M_GASM` | `src/functional-blocks/m-gasm.ts` | `FB_GASM.tsx` |
| **Table 7** | `M_ELECM` | `src/functional-blocks/m-elecm.ts` | `FB_ELECM.tsx` |
| **Table 8** | `M_BREAKERM` | `src/functional-blocks/m-breakerm.ts` | `FB_BREAKERM.tsx` |
| **Table 9** | `M_VALVEM` | `src/functional-blocks/m-valve.ts` | `FB_VALVEM.tsx` |

### Data Point Types (Clause 8)
*   **DPT_DateTime (Table 24)**: Strictly typed 8-octet structure.
*   **DPT_MeteringValue (Table 16)**: Complex structure with VIF and Z8 Status byte.
*   **DPT_Float_F16 (Table 12)**: 2-octet floating point.

## 2. Architecture & Data Flow

### Simulation Layer (Generators & Tickers)
The simulation logic is modularized to strictly adhere to the behavior of each functional block.

**Initialization (Generators):**
- `src/utils/generators/genElec.ts` -> `M_ELECM`
- `src/utils/generators/genGas.ts` -> `M_GASM`
- `src/utils/generators/genHeat.ts` -> `M_HEATM`
- `src/utils/generators/genWater.ts` -> `M_WATERM`
- `src/utils/generators/genHCA.ts` -> `M_HCA`
- `src/utils/generators/genGeneric.ts` -> `M_GENERICM`
- `src/utils/generators/genActuators.ts` -> `M_BREAKERM`, `M_VALVEM`

**Runtime Loop (Tickers):**
The `MDCContext` runs a simulation loop (`tickMeters`) which delegates to specific tickers (e.g., `tickElec`, `tickHeat`) to simulate physical phenomenon like energy accumulation, temperature fluctuation, and status changes.

### Data Flow Diagram

```
[ Simulation Loop (tickMeters.ts) ]
        |
        +---> [ tickElec.ts ] (Accumulates kWh, Jitters Power)
        +---> [ tickHeat.ts ] (Calculates Power = Flow * DeltaT)
        +---> [ ...others ]
        |
        v
[ MDCProvider (Context) ]
        |
        |  (1. Applies Network Latency Simulation)
        |  (2. Validates Array Integrity)
        |  (3. Updates Global State)
        v
[ React UI Tree ]
        |
        +-> [ DashboardOverview ] (Memoized Cards)
        |
        +-> [ MeterDetailContainer ]
                |
                +-> [ MeterDetailHeader ] (StatusBadge, Battery)
                |
                +-> [ FB_* Renderers ]
                        |
                        +-> [ DPTRenderer_MeteringValue ] (Strict Formatting)
                        +-> [ HistoryBarChart ] (Visualization)
```

## 3. UI System
*   **Dark Mode**: Native support via Tailwind `dark:` classes.
*   **StatusBadge**: Standardized pill component for all IEC status flags.
*   **HistoryBarChart**: Reusable Recharts wrapper handling DPT data arrays.
*   **EventLog**: Captures simulated alarms and user actions.
