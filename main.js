import { readForm, calculateTotalCosts, calculateCumulativeAssets, calculateNetPositions, updateTables } from './modules/utilities.js';
import { House, Apartment } from './modules/housing.js';
import { LivingExpenses } from './modules/living.js';
import { NonTaxableInvestment } from './modules/investments.js';

// Global variables
let comparativeTotalCostsTable = null;
let perMonthCostsTable = null;
let perMonthInvestmentUseTable = null;
let investmentValueTable = null;
let comparativeAssetValuesTable = null;
let netPositionsTable = null;
let form = null;

// Make available globally for utilities.js
window.generalInformation = null;

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  trailingZeroDisplay: 'stripIfInteger'
});

/**
 * Initialize the application when DOM is loaded
 */
window.onload = function() {
    form = document.querySelector("#detailsForm");
    form.addEventListener("submit", handleFormSubmit);

    comparativeTotalCostsTable = document.querySelector("#comparativeTotalCostsTable").getElementsByTagName("tbody")[0];
    perMonthCostsTable = document.querySelector("#perMonthCostsTable").getElementsByTagName("tbody")[0];
    perMonthInvestmentUseTable = document.querySelector("#perMonthInvestmentUseTable").getElementsByTagName("tbody")[0];
    investmentValueTable = document.querySelector("#investmentValueTable").getElementsByTagName("tbody")[0];
    comparativeAssetValuesTable = document.querySelector("#comparativeAssetValuesTable").getElementsByTagName("tbody")[0];
    netPositionsTable = document.querySelector("#netPositionsTable").getElementsByTagName("tbody")[0];

    // Set up export and clear buttons
    document.getElementById("exportCsvBtn").addEventListener("click", exportToCSV);
    document.getElementById("clearDataBtn").addEventListener("click", clearSavedData);

    // Add custom form validation
    form.addEventListener("submit", validateForm);

    // Load saved data from localStorage
    loadFromLocalStorage();
}

/**
 * Validates form inputs before submission
 * @param {Event} e - Form submit event
 */
function validateForm(e) {
    const currentAge = Number(document.getElementById("currentAge").value);
    const retirementAge = Number(document.getElementById("retirementAge").value);
    const deathAge = Number(document.getElementById("deathAge").value);

    let isValid = true;
    let errorMessage = "";

    if (retirementAge <= currentAge) {
        errorMessage += "Retirement age must be greater than current age.\n";
        isValid = false;
    }

    if (deathAge <= retirementAge) {
        errorMessage += "Death age must be greater than retirement age.\n";
        isValid = false;
    }

    if (!isValid) {
        e.preventDefault();
        alert(errorMessage);
        return false;
    }

    return true;
}

/**
 * Handles form submission and triggers calculations
 * @param {Event} e - Form submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();

    calc();

    // Save form data to localStorage
    saveToLocalStorage();
}

/**
 * Main calculation function
 */
function calc(){
    const formInformation = readForm();
    const generalInformation = formInformation.generalInformation;
    const rentingInformation = formInformation.rentingInformation;
    const buyingInformation = formInformation.buyingInformation;
    const investingInformation = formInformation.investingInformation;

    // Make available globally for utilities.js
    window.generalInformation = generalInformation;

    // Calculate rental scenario
    const rental = new Apartment(generalInformation, rentingInformation.monthlyRentInsurance, 0,
                            rentingInformation.monthlyRent, rentingInformation.rentIncrease);
    rental.calculateData();

    // Calculate initial investment amount (with down payment if selected)
    let initialInvestment = investingInformation.totalCurrentInvestments;
    if (investingInformation.includeDownPayment) {
        initialInvestment += buyingInformation.mortgageDownPayment;
    }

    // Calculate 15-year mortgage scenario
    const house15 = new House(generalInformation, buyingInformation.monthlyHomeInsurance, 0,
                        buyingInformation.mortgage, buyingInformation.mortgageDownPayment,
                        buyingInformation.mortgageRate, 15, buyingInformation.annualTaxAssessment,
                        buyingInformation.annualHomeValueAppreciation, buyingInformation.oneTimeRepairs,
                        buyingInformation.annualHomeMaintenance);
    house15.calculateData();

    // Calculate 30-year mortgage scenario
    const house30 = new House(generalInformation, buyingInformation.monthlyHomeInsurance, 0,
                        buyingInformation.mortgage, buyingInformation.mortgageDownPayment,
                        buyingInformation.mortgageRate, 30, buyingInformation.annualTaxAssessment,
                        buyingInformation.annualHomeValueAppreciation, buyingInformation.oneTimeRepairs,
                        buyingInformation.annualHomeMaintenance);
    house30.calculateData();

    // Calculate living expenses
    const livingExpenses = new LivingExpenses(generalInformation);
    livingExpenses.calculateData();

    // Calculate investments
    const investments = new NonTaxableInvestment(generalInformation, initialInvestment,
                                            investingInformation.annualInvestmentAppreciation,
                                            investingInformation.monthlyInvestmentContribution);
    investments.calculateData([rental, house15, house30], livingExpenses);

    const totalCosts = calculateTotalCosts([rental, house15, house30], livingExpenses);
    const assetValues = calculateCumulativeAssets([investments], [rental, house15, house30]);
    const netValues = calculateNetPositions(assetValues, [rental, house15, house30], livingExpenses);

    updateTables([investments], [rental, house15, house30], livingExpenses, assetValues, netValues,
                    comparativeTotalCostsTable, perMonthCostsTable,
                    perMonthInvestmentUseTable, investmentValueTable, comparativeAssetValuesTable, netPositionsTable);

    drawGraph(totalCosts, "totalCostsGraph", "Total Costs");
    drawGraph(assetValues, "totalAssetsGraph", "Cumulative Asset Values");
    drawGraph(netValues, "netPositionsGraph", "Net Positions");

    // Store data for CSV export
    window.calculationResults = {
        totalCosts,
        assetValues,
        netValues,
        investments,
        rental,
        house15,
        house30,
        livingExpenses
    };
}

/**
 * Generic graph drawing function - eliminates code duplication
 * @param {Array} data - Data to plot [age, [scenario values]]
 * @param {string} containerId - ID of container element
 * @param {string} title - Graph title (unused but could be added)
 */
function drawGraph(data, containerId, title) {
    // Chart dimensions and margins
    const width = 640;
    const height = 400;
    const marginTop = 20;
    const marginRight = 60;
    const marginBottom = 30;
    const marginLeft = 75;

    const years = data.length;
    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;

    // Find min and max values across all scenarios
    for (let i = 0; i < data.length; i++) {
        min = Math.min(...data[i][1], min);
        max = Math.max(...data[i][1], max);
    }

    max = Math.ceil(max * 1.10);
    min = Math.floor(min);

    // X scale (age)
    const x = d3.scaleLinear()
        .domain([data[0][0], data[years - 1][0]])
        .range([marginLeft, width - marginRight]);

    // Y scale (dollar values)
    const y = d3.scaleLinear()
        .domain([min, max])
        .range([height - marginBottom, marginTop]);

    // Line generators for each scenario
    const rentLine = d3.line()
        .x(d => x(d[0]))
        .y(d => y(d[1][0]));

    const fifteenYearLine = d3.line()
        .x(d => x(d[0]))
        .y(d => y(d[1][1]));

    const thirtyYearLine = d3.line()
        .x(d => x(d[0]))
        .y(d => y(d[1][2]));

    // Create SVG container
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    // Add X axis
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x));

    // Add Y axis with grid lines
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y)
            .ticks(height / 80)
            .tickFormat(d3.format("$,.0f")))
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1));

    // Add zero line if graph includes negative values
    if (min < 0 && max > 0) {
        svg.append("line")
            .attr("x1", marginLeft)
            .attr("x2", width - marginRight)
            .attr("y1", y(0))
            .attr("y2", y(0))
            .attr("stroke", "red")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "5,5")
            .attr("opacity", 0.5);
    }

    // Add lines for each scenario
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", rentLine(data));

    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "maroon")
        .attr("stroke-width", 1.5)
        .attr("d", fifteenYearLine(data));

    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", thirtyYearLine(data));

    // Add labels
    svg.append("text")
        .attr("transform", "translate(" + (width - marginRight + 3) + "," + y(data[years - 1][1][0]) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "steelblue")
        .text("Rent");

    svg.append("text")
        .attr("transform", "translate(" + (width - marginRight + 3) + "," + y(data[years - 1][1][1]) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "maroon")
        .text("15 Yr");

    svg.append("text")
        .attr("transform", "translate(" + (width - marginRight + 3) + "," + y(data[years - 1][1][2]) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "green")
        .text("30 Yr");

    // Append to container
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    container.append(svg.node());
}

/**
 * Saves form data to localStorage
 */
function saveToLocalStorage() {
    const formData = {};
    const inputs = form.querySelectorAll("input");

    inputs.forEach(input => {
        if (input.type === "checkbox") {
            formData[input.id] = input.checked;
        } else {
            formData[input.id] = input.value;
        }
    });

    localStorage.setItem("retirementCalculatorData", JSON.stringify(formData));
}

/**
 * Loads form data from localStorage
 */
function loadFromLocalStorage() {
    const savedData = localStorage.getItem("retirementCalculatorData");

    if (savedData) {
        const formData = JSON.parse(savedData);

        Object.keys(formData).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                if (input.type === "checkbox") {
                    input.checked = formData[key];
                } else {
                    input.value = formData[key];
                }
            }
        });
    }
}

/**
 * Clears saved data from localStorage
 */
function clearSavedData() {
    if (confirm("Are you sure you want to clear all saved data? This will reset the form to default values.")) {
        localStorage.removeItem("retirementCalculatorData");
        form.reset();
        alert("Saved data cleared successfully!");
    }
}

/**
 * Exports calculation results to CSV file
 */
function exportToCSV() {
    if (!window.calculationResults) {
        alert("Please run calculations first before exporting.");
        return;
    }

    const { totalCosts, assetValues, netValues, investments, rental, house15, house30, livingExpenses } = window.calculationResults;

    let csv = "Retirement Calculator Results\n\n";

    // Total Costs
    csv += "Total Costs (Housing + Living)\n";
    csv += "Age,Rent,15 Year Mortgage,30 Year Mortgage\n";
    for (let i = 0; i < totalCosts.length; i++) {
        csv += `${totalCosts[i][0]},${totalCosts[i][1][0].toFixed(2)},${totalCosts[i][1][1].toFixed(2)},${totalCosts[i][1][2].toFixed(2)}\n`;
    }

    csv += "\n";

    // Investment Values
    csv += "Investment Values\n";
    csv += "Age,Rent,15 Year Mortgage,30 Year Mortgage\n";
    for (let i = 0; i < investments.investmentData.length; i++) {
        csv += `${investments.investmentData[i].age},${investments.investmentData[i].value[0].toFixed(2)},${investments.investmentData[i].value[1].toFixed(2)},${investments.investmentData[i].value[2].toFixed(2)}\n`;
    }

    csv += "\n";

    // Cumulative Asset Values
    csv += "Cumulative Asset Values (Investments + Home Equity)\n";
    csv += "Age,Rent,15 Year Mortgage,30 Year Mortgage\n";
    for (let i = 0; i < assetValues.length; i++) {
        csv += `${assetValues[i][0]},${assetValues[i][1][0].toFixed(2)},${assetValues[i][1][1].toFixed(2)},${assetValues[i][1][2].toFixed(2)}\n`;
    }

    csv += "\n";

    // Net Positions
    csv += "Net Positions (Assets - Total Costs)\n";
    csv += "Age,Rent,15 Year Mortgage,30 Year Mortgage\n";
    for (let i = 0; i < netValues.length; i++) {
        csv += `${netValues[i][0]},${netValues[i][1][0].toFixed(2)},${netValues[i][1][1].toFixed(2)},${netValues[i][1][2].toFixed(2)}\n`;
    }

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'retirement_calculator_results.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
