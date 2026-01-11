/**
 * Base class for all investment types
 */
class GenericInvestment {
    /**
     * @param {Object} generalInformation - General user information
     * @param {number} amount - Initial investment amount
     * @param {number} annualRate - Annual return rate (as decimal)
     * @param {number} monthlyContribution - Monthly contribution amount
     */
    constructor(generalInformation, amount, annualRate, monthlyContribution) {
        this.generalInformation = generalInformation;

        this.amount = amount;
        this.annualRate = annualRate;
        this.monthlyContribution = monthlyContribution;

        this.investmentData = [];
    }

    calculateData(housingCosts, livingExpenses) {
        throw new Error("Method 'calculateData()' must be implemented.");
    }
}

/**
 * Represents investment data for a single year
 */
class InvestmentYear {
    /**
     * @param {number} age - User's age for this year
     * @param {Array<number>} value - Investment values for each housing scenario
     */
    constructor(age, value) {
        this.age = age;
        this.value = value;
    }
}

/**
 * Taxable investment account or Traditional IRA
 * Withdrawals are taxed, so more needs to be withdrawn to cover expenses
 */
class TaxableInvestment extends GenericInvestment {
    /**
     * @param {Object} generalInformation - General user information
     * @param {number} amount - Initial investment amount
     * @param {number} annualRate - Annual return rate (as decimal)
     * @param {number} monthlyContribution - Monthly contribution amount
     * @param {number} taxRate - Tax rate on withdrawals (as decimal)
     */
    constructor(generalInformation, amount, annualRate, monthlyContribution, taxRate) {
        super(generalInformation, amount, annualRate, monthlyContribution);
        this.taxRate = taxRate;
    }

    /**
     * Calculates investment growth and withdrawals for each housing scenario
     * @param {Array} housingCosts - Array of housing objects
     * @param {LivingExpenses} livingExpenses - Living expenses object
     */
    calculateData(housingCosts, livingExpenses) {
        const years = this.generalInformation.lifeExpectancy - this.generalInformation.startAge;

        for (let i = 0; i < years; i++) {
            const values = [];

            for (let j = 0; j < housingCosts.length; j++){
                let currentValue;

                if (i < (this.generalInformation.retirementAge - this.generalInformation.startAge)) {
                    // Pre-retirement: add contributions and grow
                    currentValue = ((i == 0 ? this.amount : this.investmentData[i - 1].value[j]) + this.monthlyContribution * 12) * (1 + this.annualRate);
                } else {
                    // Post-retirement: withdraw to cover expenses not covered by income
                    const uncoveredLivingCosts = housingCosts[j].housingData[i].yearlyCosts +
                                                livingExpenses.expensesData[i].yearlySpending -
                                                this.generalInformation.socialSecurity * 12 -
                                                this.generalInformation.otherRetirementIncome * 12;
                    // Withdrawals must include tax
                    const withdrawals = (uncoveredLivingCosts > 0 ? -uncoveredLivingCosts * (1 + this.taxRate) : 0);
                    currentValue = ((i == 0 ? this.amount : this.investmentData[i - 1].value[j]) + withdrawals) * (1 + this.annualRate);
                }

                values.push(currentValue);
            }
            this.investmentData.push(new InvestmentYear(this.generalInformation.startAge + i, values));
        }
    }
}

/**
 * Non-taxable investment such as Roth IRA
 * Withdrawals are tax-free
 */
class NonTaxableInvestment extends GenericInvestment {
    /**
     * @param {Object} generalInformation - General user information
     * @param {number} amount - Initial investment amount
     * @param {number} annualRate - Annual return rate (as decimal)
     * @param {number} monthlyContribution - Monthly contribution amount
     */
    constructor(generalInformation, amount, annualRate, monthlyContribution) {
        super(generalInformation, amount, annualRate, monthlyContribution);
    }

    /**
     * Calculates investment growth and withdrawals for each housing scenario
     * FIXED: Each scenario now maintains its own separate value instead of sharing currentValue
     * @param {Array} housingCosts - Array of housing objects
     * @param {LivingExpenses} livingExpenses - Living expenses object
     * @param {HealthcareCosts} healthcare - Healthcare costs object (optional)
     */
    calculateData(housingCosts, livingExpenses, healthcare = null) {
        const years = this.generalInformation.lifeExpectancy - this.generalInformation.startAge;

        for (let i = 0; i < years; i++) {
            const values = [];
            const healthcareCost = healthcare ? healthcare.healthcareData[i].annualCost : 0;

            for (let j = 0; j < housingCosts.length; j++){
                let currentValue;

                if (i < (this.generalInformation.retirementAge - this.generalInformation.startAge)) {
                    // Pre-retirement: add contributions and grow
                    currentValue = ((i == 0 ? this.amount : this.investmentData[i - 1].value[j]) + this.monthlyContribution * 12) * (1 + this.annualRate);
                } else {
                    // Post-retirement: withdraw to cover expenses not covered by income
                    const uncoveredLivingCosts = housingCosts[j].housingData[i].yearlyCosts +
                                                livingExpenses.expensesData[i].yearlySpending +
                                                healthcareCost -
                                                this.generalInformation.socialSecurity * 12 -
                                                this.generalInformation.otherRetirementIncome * 12;
                    const withdrawals = (uncoveredLivingCosts > 0 ? -uncoveredLivingCosts : 0);

                    currentValue = ((i == 0 ? this.amount : this.investmentData[i - 1].value[j]) + withdrawals) * (1 + this.annualRate);
                }

                values.push(currentValue);
            }
            this.investmentData.push(new InvestmentYear(this.generalInformation.startAge + i, values));
        }
    }
}

export { GenericInvestment, InvestmentYear, TaxableInvestment, NonTaxableInvestment };
