
# Contributing to IEC 63345 SECD Implementation

## Project Architecture

This project strictly implements the **IEC 63345:2023** standard for a Simple External Consumer Display. 
All data structures, types, and logic are derived directly from the normative tables in the standard.

### Core Structure

*   **`src/iec-types/`**: Contains strict TypeScript definitions of the Data Point Types (Clause 8).
    *   `dpt-primitives.ts`: Boolean, Counters (Clause 8.2-8.7)
    *   `dpt-float.ts`: 2-octet Float F16 (Clause 8.4)
    *   `dpt-datetime.ts`: 8-octet Date/Time (Clause 8.13)
    *   `dpt-metering-value.ts`: Complex Value + Unit + Status (Clause 8.8)
    *   `enums.ts`: All standard enumerations (Table 25, 29, etc.)
*   **`src/functional-blocks/`**: Interfaces for the Metering Functional Blocks (Clause 7).
    *   Each file corresponds to a specific table in the standard (e.g., `m-elecm.ts` = Table 7).
*   **`src/components/dpt-renderers/`**: React components responsible for visualizing specific DPTs.
    *   These components handle the formatting logic (e.g., hiding invalid dates, showing status flags).
*   **`src/utils/generators/`**: Mock data generators for simulation.
    *   Used to create realistic test data adhering to the strict types.

## How to Add a New Functional Block

1.  **Define Interface**: Create `src/functional-blocks/m-newtype.ts`. Extend `IEC_FunctionalBlock_Common` and add specific fields defined in the relevant IEC table.
2.  **Add to Union**: Update `IEC_Meter` union type in `src/context/MDCContext.tsx`.
3.  **Create Generator**: Create `src/utils/generators/genNewType.ts`. Implement a function that returns a valid object of your new interface.
4.  **Register Ticker**: Create `src/utils/simulation/tickers/tickNewType.ts` to define how the data changes over time. Register it in `tickMeters.ts`.
5.  **Create UI Component**: Create `src/components/functional-blocks/FB_NEWTYPE.tsx`. This should use the `DPTRenderer_*` components to display the data.
6.  **Register UI**: Add the new component to the switch case in `src/components/MeterDetailContainer.tsx`.

## Coding Standards

*   **Strict Typing**: Never use `any`. Use the specific DPT types (e.g., `DPT_Float_F16` instead of `number` where applicable).
*   **Tiny Files**: Keep files focused. Separate logic from view.
*   **Modularity**: Use the `DPTRenderer` components for all value display to ensure consistent formatting rules (invalid values, status flags).

## Data Simulation

The application runs a simulation loop (`tickMeters`) every X seconds (configurable). 
This loop acts as the "H1 Interface Driver", updating the state of all connected meters.
When developing new features, ensure your logic handles the `ReliabilityOfMeteringData` flag correctly (UI should indicate faults).
