/**
 * General information about the user's financial situation
 */
class GeneralInformation {
    /**
     * @param {number} startAge - Current age of the user
     * @param {number} retirementAge - Expected retirement age
     * @param {number} lifeExpectancy - Expected age at death
     * @param {number} inflation - Annual inflation rate (as decimal, e.g., 0.03 for 3%)
     * @param {number} socialSecurity - Monthly social security income
     * @param {number} otherRetirementIncome - Other monthly retirement income
     * @param {number} monthlySpending - Current monthly spending (excluding housing)
     * @param {number} retirementMonthlySpending - Expected monthly spending in retirement
     */
    constructor(startAge = 0, retirementAge = 0, lifeExpectancy = 0, inflation = 0,
                socialSecurity = 0, otherRetirementIncome = 0, monthlySpending = 0,
                retirementMonthlySpending = 0) {
        this.startAge = startAge;
        this.retirementAge = retirementAge;
        this.lifeExpectancy = lifeExpectancy;

        this.inflation = inflation;
        this.socialSecurity = socialSecurity;
        this.otherRetirementIncome = otherRetirementIncome;
        this.monthlySpending = monthlySpending;
        this.retirementMonthlySpending = retirementMonthlySpending;
    }
}

/**
 * Information specific to renting
 */
class RentingInformation {
    /**
     * @param {number} monthlyRent - Monthly rent payment
     * @param {number} rentIncrease - Annual rent increase rate (as decimal)
     * @param {number} monthlyRentInsurance - Monthly rental insurance cost
     */
    constructor(monthlyRent = 0, rentIncrease = 0, monthlyRentInsurance = 0) {
        this.monthlyRent = monthlyRent;
        this.rentIncrease = rentIncrease;
        this.monthlyRentInsurance = monthlyRentInsurance;
    }
}

/**
 * Information specific to buying a home
 */
class BuyingInformation {
    /**
     * @param {number} mortgage - Mortgage amount (excluding down payment)
     * @param {number} mortgageDownPayment - Down payment amount
     * @param {number} homeValue - Total home value
     * @param {number} mortgageRate - Mortgage interest rate (as decimal)
     * @param {number} oneTimeRepairs - Initial repair costs
     * @param {number} annualTaxAssessment - Annual property tax
     * @param {number} monthlyHomeInsurance - Monthly home insurance cost
     * @param {number} annualHomeMaintenance - Annual maintenance cost
     * @param {number} annualHomeValueAppreciation - Annual home appreciation rate (as decimal)
     */
    constructor(mortgage = 0, mortgageDownPayment = 0, homeValue = 0, mortgageRate = 0,
                oneTimeRepairs = 0, annualTaxAssessment = 0, monthlyHomeInsurance = 0,
                annualHomeMaintenance = 0, annualHomeValueAppreciation = 0) {
        this.mortgage = mortgage;
        this.mortgageDownPayment = mortgageDownPayment;
        this.homeValue = homeValue;
        this.mortgageRate = mortgageRate;

        this.oneTimeRepairs = oneTimeRepairs;
        this.annualTaxAssessment = annualTaxAssessment;
        this.monthlyHomeInsurance = monthlyHomeInsurance;
        this.annualHomeMaintenance = annualHomeMaintenance;
        this.annualHomeValueAppreciation = annualHomeValueAppreciation;
    }
}

/**
 * Information about investments
 */
class InvestingInformation {
    /**
     * @param {number} totalCurrentInvestments - Current investment balance
     * @param {boolean} includeDownPayment - Whether to include theoretical down payment in investments
     * @param {number} monthlyInvestmentContribution - Monthly investment contribution
     * @param {number} annualInvestmentAppreciation - Annual investment return rate (as decimal)
     */
    constructor(totalCurrentInvestments = 0, includeDownPayment = false,
                monthlyInvestmentContribution = 0, annualInvestmentAppreciation = 0) {
        this.totalCurrentInvestments = totalCurrentInvestments;
        this.includeDownPayment = includeDownPayment;
        this.monthlyInvestmentContribution = monthlyInvestmentContribution;
        this.annualInvestmentAppreciation = annualInvestmentAppreciation;
    }
}

/**
 * Container for all form information
 */
class FormInformation {
    /**
     * @param {GeneralInformation} generalInformation
     * @param {RentingInformation} rentingInformation
     * @param {BuyingInformation} buyingInformation
     * @param {InvestingInformation} investingInformation
     */
    constructor(generalInformation, rentingInformation, buyingInformation, investingInformation) {
        this.generalInformation = generalInformation;
        this.rentingInformation = rentingInformation;
        this.buyingInformation = buyingInformation;
        this.investingInformation = investingInformation;
    }
}

/**
 * Reads and validates form data from the HTML form
 * @returns {FormInformation} Parsed form data
 */
function readForm() {
    const generalInformation = new GeneralInformation();
    generalInformation.startAge = Number(document.getElementById("currentAge").value);
    generalInformation.retirementAge = Number(document.getElementById("retirementAge").value);
    generalInformation.lifeExpectancy = Number(document.getElementById("deathAge").value);
    generalInformation.inflation = Number(document.getElementById("averageInflation").value) / 100;
    generalInformation.socialSecurity = Number(document.getElementById("monthlySocialSecurity").value);
    generalInformation.otherRetirementIncome = Number(document.getElementById("otherMonthlyRetirementSources").value);
    generalInformation.monthlySpending = Number(document.getElementById("currentMonthlySpending").value);
    generalInformation.retirementMonthlySpending = Number(document.getElementById("expectedMonthlySpendingInRetirement").value);

    const rentingInformation = new RentingInformation();
    rentingInformation.monthlyRent = Number(document.getElementById("monthlyRent").value);
    rentingInformation.rentIncrease = Number(document.getElementById("rentIncrease").value) / 100;
    rentingInformation.monthlyRentInsurance = Number(document.getElementById("monthlyRentInsurance").value);

    const buyingInformation = new BuyingInformation();
    buyingInformation.mortgage = Number(document.getElementById("mortgage").value);
    buyingInformation.mortgageDownPayment = Number(document.getElementById("mortgageDownPayment").value);
    buyingInformation.homeValue = buyingInformation.mortgage + buyingInformation.mortgageDownPayment;
    buyingInformation.mortgageRate = Number(document.getElementById("mortgageRate").value) / 100;
    buyingInformation.oneTimeRepairs = Number(document.getElementById("oneTimeRepairs").value);
    buyingInformation.annualTaxAssessment = Number(document.getElementById("annualTaxAssessment").value);
    buyingInformation.monthlyHomeInsurance = Number(document.getElementById("monthlyHomeInsurance").value);
    buyingInformation.annualHomeMaintenance = Number(document.getElementById("annualHomeMaintenance").value);
    buyingInformation.annualHomeValueAppreciation = Number(document.getElementById("annualHomeValueAppreciation").value) / 100;

    const investingInformation = new InvestingInformation();
    investingInformation.totalCurrentInvestments = Number(document.getElementById("totalCurrentInvestments").value);
    // Fixed: Use .checked instead of .value for checkbox
    investingInformation.includeDownPayment = document.getElementById("includeDownPayment").checked;
    investingInformation.monthlyInvestmentContribution = Number(document.getElementById("monthlyInvestmentContribution").value);
    investingInformation.annualInvestmentAppreciation = Number(document.getElementById("annualInvestmentAppreciation").value) / 100;

    return new FormInformation(generalInformation, rentingInformation, buyingInformation, investingInformation);
}

/**
 * Calculates total costs (housing + living expenses) for each year across all scenarios
 * @param {Array} housing - Array of housing objects (rental and house scenarios)
 * @param {LivingExpenses} livingExpenses - Living expenses object
 * @returns {Array} Array of [age, [costs for each scenario]]
 */
function calculateTotalCosts(housing, livingExpenses) {
    const years = housing[0].housingData.length;
    const totalCosts = [];

    for (let i = 0; i < years; i++) {
        const values = [];
        for (let j = 0; j < housing.length; j++) {
            values.push(housing[j].housingData[i].totalCosts + livingExpenses.expensesData[i].totalCosts);
        }
        totalCosts.push([housing[0].housingData[i].age, values]);
    }
    return totalCosts;
}

/**
 * Calculates cumulative asset values (investments + home equity) for each scenario
 * @param {Array} investments - Array of investment objects
 * @param {Array} housing - Array of housing objects
 * @returns {Array} Array of [age, [asset values for each scenario]]
 */
function calculateCumulativeAssets(investments, housing) {
    const years = investments[0].investmentData.length;
    const cumulativeAssets = [];

    for (let i = 0; i < years; i++) {
        const values = [];
        for (let j = 0; j < investments[0].investmentData[i].value.length; j++) {
            let sum = 0;
            for (let x = 0; x < investments.length; x++) {
                sum += investments[x].investmentData[i].value[j];
            }
            values.push(sum + housing[j].housingData[i].value);
        }
        cumulativeAssets.push([investments[0].investmentData[i].age, values]);
    }
    return cumulativeAssets;
}

/**
 * Calculates net position (assets - total costs spent) for each scenario
 * This represents the intergenerational wealth or inheritance potential
 * @param {Array} cumulativeAssets - Cumulative asset values
 * @param {Array} housing - Housing costs
 * @param {LivingExpenses} livingExpenses - Living expenses
 * @returns {Array} Array of [age, [net positions for each scenario]]
 */
function calculateNetPositions(cumulativeAssets, housing, livingExpenses) {
    const years = cumulativeAssets.length;
    const netPositions = [];

    for (let i = 0; i < years; i++) {
        const values = [];
        for (let j = 0; j < cumulativeAssets[i][1].length; j++) {
            values.push(cumulativeAssets[i][1][j] -
                            housing[j].housingData[i].totalCosts -
                            livingExpenses.expensesData[i].totalCosts);
        }
        netPositions.push([cumulativeAssets[i][0], values]);
    }
    return netPositions;
}

/**
 * Updates all data tables with calculated results
 * @param {Array} investments - Investment objects
 * @param {Array} housing - Housing objects
 * @param {LivingExpenses} livingExpenses - Living expenses object
 * @param {Array} assetValues - Calculated asset values
 * @param {Array} netValues - Calculated net positions
 * @param {HTMLElement} totalCostsTable - Total costs table body
 * @param {HTMLElement} perMonthCostsTable - Per month costs table body
 * @param {HTMLElement} perMonthInvestmentUseTable - Per month investment use table body
 * @param {HTMLElement} investmentValueTable - Investment value table body
 * @param {HTMLElement} cumulativeAssetsTable - Cumulative assets table body
 * @param {HTMLElement} netPositionsTable - Net positions table body
 */
function updateTables(investments, housing, livingExpenses, assetValues, netValues,
                        totalCostsTable, perMonthCostsTable,
                        perMonthInvestmentUseTable, investmentValueTable,
                        cumulativeAssetsTable, netPositionsTable) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        trailingZeroDisplay: 'stripIfInteger'
    });

    // Get general information from global scope
    const generalInformation = window.generalInformation;

    totalCostsTable.innerHTML = "";
    perMonthCostsTable.innerHTML = "";
    perMonthInvestmentUseTable.innerHTML = "";
    investmentValueTable.innerHTML = "";
    cumulativeAssetsTable.innerHTML = "";
    netPositionsTable.innerHTML = "";

    // Total Costs Table
    for (let i = 0; i < housing[0].housingData.length; i++) {
        const row = totalCostsTable.insertRow();
        row.insertCell(0).innerText = housing[0].housingData[i].age;
        for (let j = 0; j < housing.length; j++) {
            const cell = row.insertCell(j + 1);
            cell.innerText = formatter.format(housing[j].housingData[i].totalCosts +
                                                                livingExpenses.expensesData[i].totalCosts);

            if (housing[j].constructor.name === 'House' &&
                 i + 1 == housing[j].mortgageTermYears) {
                cell.classList.add("fw-bold");
            }
        }
    }

    // Per Month Costs Table
    for (let i = 0; i < housing[0].housingData.length; i++) {
        const row = perMonthCostsTable.insertRow();
        row.insertCell(0).innerText = housing[0].housingData[i].age;
        for (let j = 0; j < housing.length; j++) {
            const cell = row.insertCell(j + 1);
            cell.innerText = formatter.format(housing[j].housingData[i].yearlyCosts / 12 +
                                                livingExpenses.expensesData[i].yearlySpending / 12);
        }
    }

    // Per Month Investment Use Table
    for (let i = 0; i < housing[0].housingData.length; i++) {
        const row = perMonthInvestmentUseTable.insertRow();
        row.insertCell(0).innerText = housing[0].housingData[i].age;
        for (let j = 0; j < housing.length; j++) {

            if (generalInformation.startAge + i < generalInformation.retirementAge) {
                row.insertCell(j + 1).innerText = formatter.format(0);
                continue;
            }

            const investmentUse = (housing[j].housingData[i].yearlyCosts / 12)  +
                                    livingExpenses.expensesData[i].yearlySpending / 12 -
                                    generalInformation.socialSecurity - generalInformation.otherRetirementIncome;
            row.insertCell(j + 1).innerText = formatter.format(investmentUse > 0 ? investmentUse : 0);
        }
    }

    // Investment Values Table
    for (let i = 0; i < investments[0].investmentData.length; i++) {
        const row = investmentValueTable.insertRow();
        row.insertCell(0).innerText = investments[0].investmentData[i].age;
        for (let j = 0; j < investments[0].investmentData[i].value.length; j++) {
            const cell = row.insertCell(j + 1);
            const value = investments[0].investmentData[i].value[j];
            cell.innerText = formatter.format(value);
            if (value < 0) {
                cell.classList.add("text-danger", "fw-bold");
            } else if (value < 50000 && generalInformation.startAge + i >= generalInformation.retirementAge) {
                cell.classList.add("text-warning");
            }
        }
    }

    // Cumulative Assets Table
    for (let i = 0; i < assetValues.length; i++) {
        const row = cumulativeAssetsTable.insertRow();
        row.insertCell(0).innerText = assetValues[i][0];
        for (let j = 0; j < assetValues[i][1].length; j++) {
            const cell = row.insertCell(j + 1);
            const value = assetValues[i][1][j];
            cell.innerText = formatter.format(value);
            if (value < 0) {
                cell.classList.add("text-danger", "fw-bold");
            }
        }
    }

    // Net Positions Table
    for (let i = 0; i < investments[0].investmentData.length; i++) {
        const row = netPositionsTable.insertRow();
        row.insertCell(0).innerText = netValues[i][0];
        for (let j = 0; j < netValues[i][1].length; j++) {
            const cell = row.insertCell(j + 1);
            const value = netValues[i][1][j];
            cell.innerText = formatter.format(value);
            if (value < 0) {
                cell.classList.add("text-danger", "fw-bold");
            }
        }
    }
}

// Export all classes and functions
export {
    GeneralInformation,
    RentingInformation,
    BuyingInformation,
    InvestingInformation,
    FormInformation,
    readForm,
    calculateTotalCosts,
    calculateCumulativeAssets,
    calculateNetPositions,
    updateTables
};
