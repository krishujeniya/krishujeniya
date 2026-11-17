# Software Coding and Testing

**Course Guide & Structured Reference**
*Accessible companion text for `Software_Coding_and_Testing.pdf` (Unit 6: Software Engineering & DevOps)*

---

## Unit Outcomes (UOs)

1. **Follow coding standards and industry guidelines** across diverse programming stacks.
2. **Design comprehensive test cases** and execute structured verification across unit, integration, and system levels.

---

## 1. Concepts of Software Coding

- **Definition of Coding**: Transforming software design documents (architectural models, interface specifications, and component algorithms) into high-level language code and unit tests.
- **Objectives of the Coding Phase**:
  - Implement design specifications accurately and efficiently.
  - Produce maintainable, readable, and self-documenting code.
  - Reduce cognitive load for ongoing maintenance and peer code review.
- **Purpose of Coding Standards**:
  - Provides a uniform appearance and layout across code written by disparate engineers.
  - Enhances readability and prevents common anti-patterns.
  - Encourages robust error handling and defensive programming practices.

---

## 2. Coding Standards and Guidelines

### 2.1 Coding Standards
- Rules that must be strictly followed within an engineering organization:
  - **Header Structure**: Every module/source file must contain standard header documentation (module name, author, revision history, purpose, and dependencies).
  - **Naming Conventions**: Distinct patterns for variables, constants, functions, classes, and packages (e.g., camelCase for functions, PascalCase for classes, UPPER_SNAKE_CASE for constants).
  - **Global Variable Restrictions**: Limiting or forbidding global mutable state to prevent side-effects, race conditions, and hidden couplings.
  - **Resource Management**: Explicit acquisition and release patterns (RAII, `try-with-resources`, `using` statements, Python context managers).

### 2.2 Coding Guidelines
- Recommended best practices and stylistic heuristics:
  - Single Responsibility Principle (SRP): Each function or method should do one thing well.
  - DRY (Don't Repeat Yourself): Abstract repeated logic into reusable utility functions or shared libraries.
  - Function Length & Nesting Depth: Limit nesting to at most 3 levels; refactor deeply nested logic with guard clauses and early returns.
  - Comment Quality: Explain *why* code exists, not merely *what* obvious syntax is doing.

---

## 3. Code Verification Techniques

- **Code Review**: Structured peer inspection of code changes before merging to main branch to identify defects, design divergence, and security oversights.
- **Static Analysis**: Automated linting and static application security testing (SAST) tools verifying syntax, unused variables, cyclomatic complexity, and known vulnerability patterns without executing the program.
- **Code Walkthrough**: Informal peer review sessions where the author guides colleagues through the operational flow of complex logic.

---

## 4. Software Testing Fundamentals

- **Testing Definition**: The process of executing a program with the deliberate intent of finding errors and verifying that functional and non-functional requirements are satisfied.
- **Verification vs. Validation**:
  - **Verification**: "Are we building the product right?" (Evaluating artifacts against design specifications).
  - **Validation**: "Are we building the right product?" (Evaluating software to ensure it satisfies user needs and expected behavior).
- **Levels of Testing**:
  1. **Unit Testing**: Testing individual components, functions, or classes in isolation with mocked dependencies.
  2. **Integration Testing**: Testing communication interfaces and data exchanges between aggregated modules or services.
  3. **System Testing**: Testing the completely integrated software system against high-level specifications and business journeys.
  4. **Acceptance Testing**: Final validation by stakeholders or users prior to release (Alpha/Beta testing).

---

## 5. Black-Box and White-Box Testing Methodologies

### 5.1 Black-Box Testing (Functional Testing)
- Testing software behavior without internal source code or architecture knowledge:
  - **Equivalence Partitioning**: Dividing the input domain into valid and invalid equivalence classes; testing one representative from each partition.
  - **Boundary Value Analysis (BVA)**: Concentrating tests on minimum, just above minimum, nominal, just below maximum, and maximum boundary conditions.
  - **Cause-Effect Graphing & Decision Tables**: Modeling complex combinations of conditional inputs and resulting system actions.

### 5.2 White-Box Testing (Structural Testing)
- Testing based on the explicit internal logic, control flow, and data flow of the program:
  - **Statement Coverage**: Ensuring every executable line of code is evaluated at least once ($100\%$ statement coverage does not guarantee branch coverage).
  - **Branch / Decision Coverage**: Ensuring every branch (true and false paths of `if` statements and loops) is traversed.
  - **Condition Coverage**: Ensuring every individual boolean sub-condition evaluates to both true and false.
  - **Path Coverage (Cyclomatic Complexity)**: Testing all linearly independent control paths through the program graph ($V(G) = E - N + 2P$).

---

## 6. Test Case Design and Automation

- **Structure of a Formal Test Case**:
  - Test Case Identifier (`TC_001`).
  - Requirement Reference / User Story mapping.
  - Preconditions and initial test environment setup.
  - Exact input steps and test data.
  - Expected output / behavior.
  - Actual output, pass/fail status, and timestamp.
- **Automated Testing & Continuous Integration**: Running test harnesses automatically upon every push or PR in GitHub Actions to detect regressions early.
