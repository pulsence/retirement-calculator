/**
 * Tax Calculation Module
 * Handles federal and state income tax calculations for retirement planning
 */

/**
 * 2024 Federal Tax Brackets for Single Filers (simplified, not inflation-adjusted)
 * These should be updated periodically or made configurable
 */
const FEDERAL_TAX_BRACKETS_SINGLE = [
    { max: 11600, rate: 0.10 },
    { max: 47150, rate: 0.12 },
    { max: 100525, rate: 0.22 },
    { max: 191950, rate: 0.24 },
    { max: 243725, rate: 0.32 },
    { max: 609350, rate: 0.35 },
    { max: Infinity, rate: 0.37 }
];

/**
 * 2024 Federal Tax Brackets for Married Filing Jointly (simplified)
 */
const FEDERAL_TAX_BRACKETS_JOINT = [
    { max: 23200, rate: 0.10 },
    { max: 94300, rate: 0.12 },
    { max: 201050, rate: 0.22 },
    { max: 383900, rate: 0.24 },
    { max: 487450, rate: 0.32 },
    { max: 731200, rate: 0.35 },
    { max: Infinity, rate: 0.37 }
];

/**
 * Standard deductions for 2024
 */
const STANDARD_DEDUCTION = {
    single: 14600,
    joint: 29200
};

/**
 * Tax Configuration
 */
class TaxConfig {
    /**
     * @param {string} filingStatus - 'single' or 'joint'
     * @param {number} stateIncomeTaxRate - State income tax rate as decimal (e.g., 0.05 for 5%)
     * @param {boolean} itemizeDeductions - Whether to itemize deductions
     * @param {number} mortgageInterestDeduction - Annual mortgage interest paid (if itemizing)
     * @param {number} propertyTaxDeduction - Annual property tax (if itemizing)
     * @param {number} otherDeductions - Other itemized deductions
     */
    constructor(filingStatus = 'single', stateIncomeTaxRate = 0, itemizeDeductions = false,
                mortgageInterestDeduction = 0, propertyTaxDeduction = 0, otherDeductions = 0) {
        this.filingStatus = filingStatus;
        this.stateIncomeTaxRate = stateIncomeTaxRate;
        this.itemizeDeductions = itemizeDeductions;
        this.mortgageInterestDeduction = mortgageInterestDeduction;
        this.propertyTaxDeduction = propertyTaxDeduction;
        this.otherDeductions = otherDeductions;
    }
}

/**
 * Tax Calculator
 */
class TaxCalculator {
    /**
     * @param {TaxConfig} config - Tax configuration
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * Calculates federal income tax using progressive brackets
     * @param {number} taxableIncome - Income after deductions
     * @returns {number} Federal tax owed
     */
    calculateFederalTax(taxableIncome) {
        if (taxableIncome <= 0) return 0;

        const brackets = this.config.filingStatus === 'joint'
            ? FEDERAL_TAX_BRACKETS_JOINT
            : FEDERAL_TAX_BRACKETS_SINGLE;

        let tax = 0;
        let previousMax = 0;

        for (const bracket of brackets) {
            if (taxableIncome <= previousMax) break;

            const incomeInBracket = Math.min(taxableIncome, bracket.max) - previousMax;
            tax += incomeInBracket * bracket.rate;

            previousMax = bracket.max;
            if (taxableIncome <= bracket.max) break;
        }

        return tax;
    }

    /**
     * Calculates state income tax (simplified as flat rate)
     * @param {number} taxableIncome - Income after deductions
     * @returns {number} State tax owed
     */
    calculateStateTax(taxableIncome) {
        if (taxableIncome <= 0) return 0;
        return taxableIncome * this.config.stateIncomeTaxRate;
    }

    /**
     * Calculates total deductions
     * @param {number} mortgageInterest - Mortgage interest paid this year
     * @param {number} propertyTax - Property tax paid this year
     * @returns {number} Total deductions
     */
    calculateDeductions(mortgageInterest = 0, propertyTax = 0) {
        const standardDeduction = this.config.filingStatus === 'joint'
            ? STANDARD_DEDUCTION.joint
            : STANDARD_DEDUCTION.single;

        if (!this.config.itemizeDeductions) {
            return standardDeduction;
        }

        // Calculate itemized deductions
        const itemizedTotal =
            mortgageInterest +
            Math.min(propertyTax, 10000) + // SALT cap at $10k
            this.config.otherDeductions;

        // Take the greater of standard or itemized
        return Math.max(standardDeduction, itemizedTotal);
    }

    /**
     * Calculates Social Security taxable amount
     * Social Security benefits may be partially taxable depending on total income
     * @param {number} socialSecurityIncome - Annual Social Security income
     * @param {number} otherIncome - Other income sources
     * @returns {number} Taxable portion of Social Security
     */
    calculateTaxableSocialSecurity(socialSecurityIncome, otherIncome) {
        // Simplified calculation based on combined income
        const combinedIncome = otherIncome + (socialSecurityIncome * 0.5);

        const thresholds = this.config.filingStatus === 'joint'
            ? { lower: 32000, upper: 44000 }
            : { lower: 25000, upper: 34000 };

        if (combinedIncome < thresholds.lower) {
            return 0; // No SS is taxable
        } else if (combinedIncome < thresholds.upper) {
            return Math.min(socialSecurityIncome * 0.5,
                           (combinedIncome - thresholds.lower) * 0.5);
        } else {
            return Math.min(socialSecurityIncome * 0.85,
                           (thresholds.upper - thresholds.lower) * 0.5 +
                           (combinedIncome - thresholds.upper) * 0.85);
        }
    }

    /**
     * Calculates total tax liability for a year
     * @param {number} socialSecurityIncome - Annual Social Security income
     * @param {number} otherRetirementIncome - Other retirement income (pensions, etc.)
     * @param {number} investmentWithdrawals - Withdrawals from investments (treated as ordinary income for simplicity)
     * @param {number} mortgageInterest - Mortgage interest paid
     * @param {number} propertyTax - Property tax paid
     * @returns {Object} Tax breakdown
     */
    calculateAnnualTax(socialSecurityIncome, otherRetirementIncome, investmentWithdrawals,
                      mortgageInterest = 0, propertyTax = 0) {
        // Calculate taxable Social Security
        const taxableSS = this.calculateTaxableSocialSecurity(
            socialSecurityIncome,
            otherRetirementIncome + investmentWithdrawals
        );

        // Total gross income
        const grossIncome = taxableSS + otherRetirementIncome + investmentWithdrawals;

        // Calculate deductions
        const deductions = this.calculateDeductions(mortgageInterest, propertyTax);

        // Taxable income
        const taxableIncome = Math.max(0, grossIncome - deductions);

        // Calculate taxes
        const federalTax = this.calculateFederalTax(taxableIncome);
        const stateTax = this.calculateStateTax(taxableIncome);
        const totalTax = federalTax + stateTax;

        return {
            grossIncome,
            taxableSocialSecurity: taxableSS,
            deductions,
            taxableIncome,
            federalTax,
            stateTax,
            totalTax
        };
    }
}

export { TaxConfig, TaxCalculator, FEDERAL_TAX_BRACKETS_SINGLE, FEDERAL_TAX_BRACKETS_JOINT, STANDARD_DEDUCTION };
