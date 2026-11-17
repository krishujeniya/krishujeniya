# Software Architecture and Design

**Course Guide & Structured Reference**
*Accessible companion text for `Software_Design.pdf` (Unit 5: Software Engineering & DevOps)*

---

## Unit Outcomes (UOs)

1. **Prepare modular software design specifications** from user requirements and system constraints.
2. **Design intuitive, accessible user interfaces** adhering to Human Interface Guidelines and structured information architecture.

---

## 1. The Software Design Process

- **Definition of Software Design**: The iterative engineering process of defining system architecture, components, interfaces, data models, and algorithms to satisfy requirements specified in the Software Requirements Specification (SRS).
- **Transformation**: Converting *what* the system must do (requirements) into *how* the system will be built and structured (design documents).
- **Two Core Dimensions of Software Design**:
  1. **Design Activities**: The four core architectural tasks:
     - **Architectural Design**: Identifying the global high-level system structure, major sub-systems, services, and communication paradigms.
     - **Interface Design**: Defining contracts, protocols, APIs, and formats for inter-component and external communication.
     - **Component (Detail) Design**: Elaborating internal data structures, state machines, and algorithms within individual modules.
     - **Database Design**: Modeling data persistence schemas, entity relationships, normalization, and indexing strategies.
  2. **Design Methodologies**: Function-oriented design (Structured Analysis and Structured Design - SASD) vs. Object-Oriented Design (OOD) using UML models.

---

## 2. Fundamental Software Design Concepts

### 2.1 Modularity
- Decomposing a complex monolithic system into smaller, self-contained, and manageable units (modules).
- Benefits: Isolated testing, independent development, localized maintenance, and reusability.

### 2.2 Coupling (Inter-Module Dependence)
- The degree of interdependence between two or more software modules.
- **Goal: Low Coupling** (Loose Coupling).
- **Coupling Hierarchy (from worst/tightest to best/loosest)**:
  1. **Content Coupling**: One module directly accesses or modifies internal data or statements of another module.
  2. **Common Coupling**: Multiple modules share global data stores.
  3. **Control Coupling**: One module passes execution control flags or indicators to dictate another module's internal logic.
  4. **Stamp (Data-Structured) Coupling**: Modules pass complex compound data structures where only a few fields are needed.
  5. **Data Coupling**: Modules communicate strictly through minimal primitive data arguments (ideal).

### 2.3 Cohesion (Intra-Module Strength)
- The degree to which the internal elements of a single module belong together and focus on a single well-defined task.
- **Goal: High Cohesion**.
- **Cohesion Hierarchy (from worst/weakest to best/strongest)**:
  1. **Coincidental Cohesion**: Elements are grouped together arbitrarily with no meaningful relationship.
  2. **Logical Cohesion**: Elements perform logically similar tasks selected by a flag argument.
  3. **Temporal Cohesion**: Elements are executed at the same point in time (e.g., system initialization).
  4. **Procedural Cohesion**: Elements are executed in an ordered sequence to perform a procedure.
  5. **Communicational Cohesion**: Elements operate on the same input data or contribute to the same output data.
  6. **Sequential Cohesion**: Output of one element is the direct input to the next element within the module.
  7. **Functional Cohesion**: Every element in the module is essential to performing a single, well-defined mathematical or logical function (ideal).

---

## 3. Function-Oriented Design (SASD)

- **Data Flow Diagrams (DFD)**:
  - Graphical representation of the "flow" of data through an information system.
  - Symbols: Processes (circles/bubbles), Data Flows (arrows), External Entities/Sources/Sinks (rectangles), and Data Stores (open rectangles).
  - Level-0 (Context Diagram) through Level-1 and Level-2 detailed functional decompositions.
- **Data Dictionary**: Centralized repository containing definitions and constraints for all data elements flowing through the DFDs.
- **Structure Charts**: Hierarchical tree diagram representing modular structure, module invocation relationships, and parameter data passes.

---

## 4. User Interface (UI) and Interaction Design

- **Golden Rules of Interface Design**:
  1. Place the user in control: Provide clear navigation, reversible actions (undo/redo), and non-blocking interactions.
  2. Reduce the user's memory load: Minimize cognitive friction; use recognition over recall and predictable metaphors.
  3. Maintain consistency: Uniform typography, button placement, color systems, and mental models across all views.
- **Accessibility (A11y)**:
  - Ensuring interactive elements have visible focus rings, sufficient color contrast ratios (at least 4.5:1 for normal text), and screen-reader accessible names.
  - Supporting responsive viewport reflow across mobile and desktop breakpoints without losing functionality.
