# Retirement Calculator

A comprehensive financial planning tool to compare renting vs. buying scenarios as you approach retirement. This calculator helps you visualize the long-term financial implications of different housing decisions, investment strategies, and retirement income sources.

## Features

### Financial Calculations
- **Three Housing Scenarios**: Compare renting, 15-year mortgage, and 30-year mortgage side-by-side
- **Investment Tracking**: Track how investments grow and are drawn down during retirement
- **Accurate Mortgage Math**: Uses proper amortization schedules with month-by-month interest calculations
- **Tax Calculations**: Progressive federal and state income tax calculations with deductions
- **Healthcare Costs**: Pre-Medicare and Medicare cost modeling with inflation adjustment
- **Inflation Adjustment**: All costs are adjusted for inflation over time
- **Retirement Income**: Factors in Social Security and other retirement income sources

### Data Visualization
- **Interactive Tables**: Six detailed tables showing costs, investments, and net positions over time
- **D3.js Graphs**: Visual representations of total costs, asset values, and net positions
- **Color-Coded Warnings**: Red highlighting for negative values, yellow for low investment balances
- **Zero Line Indicators**: Graphs show when values cross into negative territory

### User Experience
- **Data Persistence**: Form inputs automatically save to browser localStorage
- **Scenario Management**: Save, load, and compare multiple what-if scenarios
- **Scenario Comparison**: Side-by-side comparison of input parameters across 2-3 scenarios
- **CSV Export**: Download all calculation results for further analysis
- **Input Validation**: Comprehensive validation prevents calculation errors
- **Mobile Responsive**: Works seamlessly on phones, tablets, and desktops
- **Privacy Focused**: All data stays in your browser - nothing is transmitted to servers

## Getting Started

### Online Access
Visit [https://pulsence.github.io/retirement-calculator/](https://pulsence.github.io/retirement-calculator/) to use the calculator immediately.

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
7. **Configure Tax Settings**: Set filing status, state tax rate, and deduction preferences
8. **Configure Healthcare Costs**: Enter pre-Medicare and Medicare cost estimates
9. **Calculate**: Click "Calculate" to see results in tables and graphs
10. **Export**: Use "Export to CSV" to download results for further analysis

## Scenario Management

The calculator includes powerful scenario management features to help you explore different financial strategies:

### Saving Scenarios
1. Fill in your inputs and give your scenario a name (e.g., "Conservative", "Optimistic", "Aggressive Growth")
2. Optionally add notes to describe assumptions or important details
3. Click "Save Current Scenario" to store it in your browser
4. Your scenarios are saved separately from the auto-saved form data

### Loading Scenarios
1. Select a saved scenario from the dropdown
2. Click "Load Selected Scenario" to populate the form with those values
3. The scenario name and notes will also be loaded for reference

### Comparing Scenarios
1. Click "Compare Scenarios" button (enabled when you have 2+ saved scenarios)
2. Select 2 or 3 scenarios you want to compare
3. Click "Compare Selected Scenarios" to see a detailed side-by-side comparison
4. The comparison table shows all input parameters across your selected scenarios
5. Review differences to understand how varying assumptions affect your planning

### Managing Scenarios
- **Delete**: Select a scenario and click "Delete Selected Scenario" to remove it
- **Update**: Save a scenario with the same name to update it with new values
- **Privacy**: All scenarios are stored locally in your browser's localStorage

## Tax Configuration

The calculator includes comprehensive tax modeling to provide more accurate retirement planning:

### Tax Features
- **Progressive Federal Tax Brackets**: Uses 2024 tax brackets for single and married filing jointly
- **State Income Tax**: Configure your state's income tax rate (or 0 for states without income tax)
- **Standard vs Itemized Deductions**: Choose between standard deduction or itemize
- **Mortgage Interest Deduction**: Automatically factors in mortgage interest if itemizing
- **Property Tax Deduction**: Includes property tax with SALT cap ($10,000)
- **Social Security Taxation**: Calculates taxable portion of Social Security based on combined income

### Tax Assumptions
- Tax brackets are based on 2024 values and are not adjusted for future inflation
- Social Security and other retirement income are treated as ordinary income
- Investment withdrawals are treated as ordinary income (simplified model)
- Tax calculations help determine accurate investment withdrawal needs

## Healthcare Cost Planning

Healthcare is one of the largest expenses in retirement. The calculator models these costs:

### Pre-Medicare (Before Age 65)
- **Monthly Premiums**: Health insurance premiums before Medicare eligibility
- **Out-of-Pocket Costs**: Annual deductibles, copays, and prescription costs
- All costs are adjusted for inflation over time

### Medicare (Age 65+)
- **Part B Premium**: Standard is $174.70/month (2024), adjust for IRMAA if applicable
- **Part D Premium**: Prescription drug coverage (default $55/month)
- **Medigap/Supplemental**: Supplemental insurance to cover gaps in Medicare
- **Out-of-Pocket**: Reduced but still significant copays and prescription costs

### Long-Term Care Insurance (Optional)
- **Optional Coverage**: Toggle to include long-term care insurance premiums
- **Age-Based**: Typically starts at age 60
- **Monthly Premium**: Adjust based on coverage level and age

### Healthcare Cost Impact
Healthcare costs are included in:
- Total annual expenses
- Investment withdrawal calculations
- Net position and inheritance projections

## Calculation Assumptions

The calculator makes the following assumptions (detailed in the UI):

1. **Inflation**: All costs are adjusted for inflation based on your input rate
2. **Fixed Income**: Social Security and other retirement income are NOT inflation-adjusted
3. **Year-End Values**: All values represent end-of-year calculations
4. **Nominal Values**: Results are shown in nominal (not inflation-corrected) dollars
5. **Healthcare Inflation**: Healthcare costs inflate at the same rate as general inflation
6. **Tax Brackets**: Federal tax brackets are based on 2024 values (not inflation-adjusted)

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
│   ├── investments.js      # Investment growth/withdrawal calculations
│   ├── scenarios.js        # Scenario management and comparison
│   ├── taxes.js            # Tax calculation engine
│   └── healthcare.js       # Healthcare cost modeling
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