# Retirement Calculator

A comprehensive financial planning tool to compare renting vs. buying scenarios as you approach retirement. This calculator helps you visualize the long-term financial implications of different housing decisions, investment strategies, and retirement income sources.

## Features

### Financial Calculations
- **Three Housing Scenarios**: Compare renting, 15-year mortgage, and 30-year mortgage side-by-side
- **Investment Tracking**: Track how investments grow and are drawn down during retirement
- **Accurate Mortgage Math**: Uses proper amortization schedules with month-by-month interest calculations
- **Inflation Adjustment**: All costs are adjusted for inflation over time
- **Retirement Income**: Factors in Social Security and other retirement income sources

### Data Visualization
- **Interactive Tables**: Six detailed tables showing costs, investments, and net positions over time
- **D3.js Graphs**: Visual representations of total costs, asset values, and net positions
- **Color-Coded Warnings**: Red highlighting for negative values, yellow for low investment balances
- **Zero Line Indicators**: Graphs show when values cross into negative territory

### User Experience
- **Data Persistence**: Form inputs automatically save to browser localStorage
- **CSV Export**: Download all calculation results for further analysis
- **Input Validation**: Comprehensive validation prevents calculation errors
- **Mobile Responsive**: Works seamlessly on phones, tablets, and desktops
- **Privacy Focused**: All data stays in your browser - nothing is transmitted to servers

## Getting Started

### Online Access
Visit [https://pulsence.github.io/retirment-calculator/](https://pulsence.github.io/retirment-calculator/) to use the calculator immediately.

### Local Installation
1. Download the project:
   - Clone the repository: `git clone [repository-url]`
   - Or download and extract the ZIP file

2. Open `index.html` in your web browser

**Note**: No internet connection is required when running locally. All assets are included in the project.

## How to Use

1. **Fill in General Information**: Enter your current age, retirement age, life expectancy, and inflation expectations
2. **Add Income Details**: Input Social Security and other expected retirement income
3. **Enter Living Expenses**: Specify your current and expected retirement spending (excluding housing)
4. **Input Renting Details**: If considering renting, enter monthly rent and insurance costs
5. **Input Buying Details**: If considering purchasing, enter mortgage details, taxes, insurance, and maintenance
6. **Configure Investments**: Enter current investment balance, contribution amounts, and expected returns
7. **Calculate**: Click "Calculate" to see results in tables and graphs
8. **Export**: Use "Export to CSV" to download results for further analysis

## Calculation Assumptions

The calculator makes the following assumptions (detailed in the UI):

1. **Inflation**: All costs are adjusted for inflation based on your input rate
2. **Fixed Income**: Social Security and other retirement income are NOT inflation-adjusted
3. **Simplified Taxes**: Tax rates and contributions (except property tax) are not factored in
4. **Year-End Values**: All values represent end-of-year calculations
5. **Nominal Values**: Results are shown in nominal (not inflation-corrected) dollars

### Interpreting Results

- **Investment Value > 0**: You have money in the bank
- **Investment Value < 0, Asset Value > 0**: You have home equity but no cash
- **Both < 0**: You're in debt
- **Net Positions**: Indicates efficiency at building intergenerational wealth (inheritance potential)

## Technical Details

### Technology Stack
- **Pure JavaScript (ES6 Modules)**: No build process required
- **Bootstrap 5**: Responsive design framework
- **D3.js v7**: Data visualization library
- **HTML5 localStorage**: Client-side data persistence

### Project Structure
```
/
├── index.html              # Main application page
├── main.js                 # Application entry point and UI logic
├── modules/
│   ├── utilities.js        # Form handling and calculation utilities
│   ├── housing.js          # Housing cost calculations
│   ├── living.js           # Living expense calculations
│   └── investments.js      # Investment growth/withdrawal calculations
├── assets/
│   ├── bootstrap/          # Bootstrap CSS and JS
│   └── d3/                 # D3.js visualization library
└── readme.md              # This file
```

### Code Quality
- **ES6 Modules**: Modern JavaScript with proper imports/exports
- **JSDoc Comments**: Comprehensive documentation throughout
- **Input Validation**: Client-side validation prevents invalid inputs
- **Responsive Design**: Mobile-first approach with Bootstrap grid

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript modules
- HTML5 localStorage
- CSS Grid and Flexbox

Tested in: Chrome, Firefox, Safari, Edge

## Privacy & Data

**Your data never leaves your device.** All calculations happen in your browser. Form inputs are saved to localStorage for convenience but can be cleared at any time with the "Clear Saved Data" button.

## Limitations & Disclaimers

**This calculator is for educational purposes only and should not be considered financial advice.**

- Calculations are simplified models and may not reflect all real-world factors
- Tax implications are not fully considered
- Market returns are estimates and actual returns will vary
- Consult with a qualified financial advisor for personalized guidance

## Contributing

This is a personal project. Feel free to fork and customize for your own needs.

## License

This project is available for personal use. No warranty or financial guarantee is provided.