# Machine Learning Notes

## Core ML Skills

### Algorithms & Libraries
- XGBoost (gradient boosting)
- Scikit-Learn
- Tidymodels (R ML framework)
- Ensemble Methods
- Time Series Forecasting

### Time Series Methods
- Linear Regression
- Moving Average
- Holt Exponential Smoothing
- Holt-Winters (triple exponential smoothing)

### Statistical Methods
- Binomial Logistic Regression
- Lagged variables
- Rolling statistics
- Seasonal encoding

## Flagship Project: Malaria Outbreak Predictor (2024)

### Overview
- KEMRI-inspired ML system for malaria incidence prediction
- Forecasting horizon: 1-2 years ahead
- Confidence intervals: 95%

### Performance Metrics
- R² = 0.990
- 51 engineered features
- 7-model XGBoost ensemble

### Data Sources
- 44,282 data points total
- WHO GHO (health indicators)
- World Bank (socioeconomic data)
- NASA POWER (climate data)

### Tech Stack
- Python (ETL pipeline, ML model training)
- R (Shiny dashboards, ggplot2 visualizations)
- XGBoost (ensemble model)
- Scikit-learn
- FastAPI (7 REST API endpoints for real-time predictions)
- Docker (containerization)
- GitHub Actions (CI/CD)

### ETL Pipeline
- Automated API fetching from 3 global data sources
- Processing 44k+ records
- Feature engineering: lagged variables, rolling statistics, seasonal encoding
- Total features: 51

### API Endpoints
- 7 endpoints for real-time malaria predictions
- 5-year forecast endpoint with 95% confidence intervals
- Built with FastAPI

## Kenya Malaria Dashboard (2024)

### Overview
- Power BI-style interactive dashboard
- Analyzes P. falciparum prevalence data

### Data
- 2,149 geo-referenced surveys
- Time span: 1985-2020 (35 years)
- 186,000+ individuals represented
- 20.4% prevalence baseline

### Methods
- Binomial logistic regression
- Geospatial mapping
- Time-series prevalence trend analysis

### Tech Stack
- R Shiny (dashboard framework)
- ggplot2 (visualizations)
- Power BI
- Chart.js (interactive frontend viz)

## Forecast Dashboard (2025-2026)

### Overview
- Browser-based interactive time-series forecasting

### Forecasting Methods
1. Linear Regression
2. Moving Average
3. Holt Exponential Smoothing
4. Holt-Winters

### Features
- Backtesting capabilities
- 95% confidence intervals
- Model comparison
- CSV/Excel import/export

### Tech Stack
- React (frontend framework)
- Vite (build tool)
- JavaScript
- Chart.js (visualization)

## Excel PowerBI Dashboard (2023)

### Datasets
- Microsoft Power BI Financial Sample ($118.7M sales)
- Chocolate company shipment ledger
- 2 datasets, 4 tabs

### Methods
- Python (openpyxl for Excel manipulation)
- Chart.js (interactive visualization)
- DAX (Power BI formulas)

## Deployment & Production

### Containerization
- Docker for model deployment
- FastAPI serving layer

### CI/CD
- GitHub Actions for automated deployment
- Live demos hosted on GitHub Pages

### Infrastructure
- Linux environment
- API-based architecture (FastAPI)

## Experience at KEMRI

### Role: Data Analytics Attachment
- Kenya Medical Research Institute (KEMRI) — Kisumu/Nairobi, Kenya
- 2025 — Present

### Key accomplishments
- Built malaria outbreak prediction system with R² = 0.990
- Designed FastAPI REST API with 7 endpoints
- Engineered full ETL pipeline (automated fetching from WHO, World Bank, NASA APIs)
- Created interactive dashboards using R Shiny and Streamlit
- Built geospatial mapping for malaria prevalence
- Published all projects with live demos on GitHub Pages
