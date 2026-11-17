# Preparing to Model in Machine Learning

**Course Guide & Structured Reference**
*Accessible companion text for `Preparing_Model.pdf` (Chapter 2: Machine Learning Pipelines & Data Preparation)*

---

## Chapter Overview

1. [Machine Learning Activities and End-to-End Lifecycle](#1-machine-learning-activities)
2. [Types and Structures of Data](#2-types-and-structures-of-data)
3. [Statistical Summarization and Exploratory Data Analysis (EDA)](#3-statistical-summarization-and-eda)
4. [Data Quality Assessment and Remediation](#4-data-quality-assessment-and-remediation)
5. [Feature Engineering and Preprocessing](#5-feature-engineering-and-preprocessing)
6. [Dimensionality Reduction and Feature Selection](#6-dimensionality-reduction-and-feature-selection)

---

## 1. Machine Learning Activities

- **The Four-Step Machine Learning Process**:
  1. **Step 1: Model Preparation**: Understanding data types, source quality, inter-feature correlations, data cleaning, and preprocessing.
  2. **Step 2: Learning (Training)**: Partitioning dataset (train/validation/test holdouts), selecting candidate estimators, hyperparameter tuning, and cross-validation fitting.
  3. **Step 3: Performance Evaluation**: Testing trained models on unseen validation sets using task-specific metrics ($R^2$, RMSE, MAE for regression; Precision, Recall, F1-score, ROC-AUC for classification).
  4. **Step 4: Performance Improvement**: Error analysis, feature engineering, regularization tuning, and ensemble aggregation.

---

## 2. Types and Structures of Data

- **Qualitative (Categorical) Data**:
  - **Nominal Data**: Discrete categories with no inherent ordering or ranking (e.g., country of origin, marital status, blood group).
  - **Ordinal Data**: Categorical data with a clear intrinsic hierarchy or rank, but non-uniform intervals between ranks (e.g., education level, customer feedback ratings: poor/fair/good/excellent).
- **Quantitative (Numerical) Data**:
  - **Discrete Data**: Countable integer values (e.g., number of transactions, hospital admissions).
  - **Continuous Data**: Measurable real-valued data within a range (e.g., salary, temperature, reaction time).

---

## 3. Statistical Summarization and EDA

- **Measures of Central Tendency**:
  - **Mean ($\mu$)**: Arithmetic average; sensitive to extreme outlier values.
  - **Median**: Positional midpoint of sorted values; robust to skewed distributions.
  - **Mode**: Most frequently occurring value in the distribution.
- **Measures of Dispersion (Spread)**:
  - Range, Variance ($\sigma^2$), and Standard Deviation ($\sigma$).
  - Interquartile Range ($IQR = Q_3 - Q_1$): Identifies the spread of the middle $50\%$ of observations.
- **Outlier Detection**:
  - Tukey's method: Any value lower than $Q_1 - 1.5 \times IQR$ or greater than $Q_3 + 1.5 \times IQR$.
  - Z-Score analysis: Observations with $|Z| > 3$ where $Z = \frac{x - \mu}{\sigma}$.

---

## 4. Data Quality Assessment and Remediation

- **Data Quality Issues**:
  - Missing Values (MCAR: Missing Completely at Random, MAR: Missing at Random, MNAR: Missing Not at Random).
  - Inconsistent representations, duplicate records, and anomalous sensor noise.
- **Remediation Techniques**:
  - Imputation: Mean/median imputation for continuous variables; mode imputation for categorical attributes; KNN or iterative regression imputation for complex multi-variable interactions.
  - Record or column deletion: Applicable when missingness exceeds $50–60\%$ and feature carries negligible predictive signal.
  - Strictly avoid data leakage: Preprocessing parameters (e.g., scaler means, standard deviations, imputation values) must be fit solely on the training partition and transformed onto the test partition.

---

## 5. Feature Engineering and Preprocessing

- **Feature Scaling**:
  - **Standardization (Z-score normalization)**: Centers data at mean 0 with variance 1 ($z = \frac{x - \mu}{\sigma}$). Essential for distance-based estimators (KNN, SVM) and gradient-descent algorithms.
  - **Min-Max Normalization**: Rescales feature values to a fixed interval, typically $[0, 1]$ ($x_{\text{norm}} = \frac{x - x_{\min}}{x_{\max} - x_{\min}}$).
- **Encoding Categorical Features**:
  - **One-Hot Encoding**: Converts nominal categories into binary indicator vectors ($k$ categories into $k$ or $k-1$ features).
  - **Ordinal Encoding**: Maps ordered ranks to integers preserving relational order.

---

## 6. Dimensionality Reduction and Feature Selection

- **The Curse of Dimensionality**: High feature spaces increase sample sparsity, computational complexity, and the risk of overfitting.
- **Feature Selection Techniques**:
  - Filter Methods: Pearson correlation coefficient, mutual information gain, Chi-Square ($\chi^2$) tests.
  - Wrapper Methods: Recursive Feature Elimination (RFE), forward selection, and backward elimination.
  - Embedded Methods: L1 Regularization (Lasso) shrinking coefficients of irrelevant features to exactly zero.
- **Unsupervised Dimensionality Reduction**:
  - **Principal Component Analysis (PCA)**: Linear transformation projecting data onto orthogonal axes of maximum variance via eigendecomposition of the covariance matrix.
