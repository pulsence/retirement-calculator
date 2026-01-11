/**
 * Healthcare Cost Module
 * Handles healthcare cost calculations for retirement planning
 */

/**
 * Healthcare Configuration
 */
class HealthcareConfig {
    /**
     * @param {number} preMedicareMonthlyPremium - Monthly health insurance premium before Medicare (age < 65)
     * @param {number} preMedicareAnnualDeductible - Annual deductible before Medicare
     * @param {number} preMedicareAnnualOutOfPocket - Estimated annual out-of-pocket costs before Medicare
     * @param {number} medicarePartBPremium - Monthly Medicare Part B premium (age >= 65)
     * @param {number} medicarePartDPremium - Monthly Medicare Part D (prescription) premium
     * @param {number} medigapPremium - Monthly Medigap/supplemental insurance premium
     * @param {number} medicareAnnualOutOfPocket - Estimated annual out-of-pocket costs with Medicare
     * @param {boolean} includeLongTermCare - Whether to include long-term care insurance
     * @param {number} longTermCarePremium - Monthly long-term care insurance premium
     * @param {number} longTermCareStartAge - Age to start long-term care insurance
     */
    constructor(
        preMedicareMonthlyPremium = 800,
        preMedicareAnnualDeductible = 5000,
        preMedicareAnnualOutOfPocket = 3000,
        medicarePartBPremium = 174.70,  // 2024 standard premium
        medicarePartDPremium = 55,
        medigapPremium = 200,
        medicareAnnualOutOfPocket = 2000,
        includeLongTermCare = false,
        longTermCarePremium = 250,
        longTermCareStartAge = 60
    ) {
        this.preMedicareMonthlyPremium = preMedicareMonthlyPremium;
        this.preMedicareAnnualDeductible = preMedicareAnnualDeductible;
        this.preMedicareAnnualOutOfPocket = preMedicareAnnualOutOfPocket;
        this.medicarePartBPremium = medicarePartBPremium;
        this.medicarePartDPremium = medicarePartDPremium;
        this.medigapPremium = medigapPremium;
        this.medicareAnnualOutOfPocket = medicareAnnualOutOfPocket;
        this.includeLongTermCare = includeLongTermCare;
        this.longTermCarePremium = longTermCarePremium;
        this.longTermCareStartAge = longTermCareStartAge;
    }
}

/**
 * Represents healthcare costs for a single year
 */
class HealthcareYear {
    /**
     * @param {number} age - User's age for this year
     * @param {number} annualCost - Total healthcare costs for the year
     * @param {number} monthlyPremiums - Monthly premium costs
     * @param {number} outOfPocket - Out-of-pocket costs
     */
    constructor(age, annualCost, monthlyPremiums, outOfPocket) {
        this.age = age;
        this.annualCost = annualCost;
        this.monthlyPremiums = monthlyPremiums;
        this.outOfPocket = outOfPocket;
    }
}

/**
 * Healthcare Cost Calculator
 */
class HealthcareCosts {
    /**
     * @param {Object} generalInformation - General user information
     * @param {HealthcareConfig} config - Healthcare configuration
     */
    constructor(generalInformation, config) {
        this.generalInformation = generalInformation;
        this.config = config;
        this.healthcareData = [];
        this.medicareEligibleAge = 65; // Medicare eligibility age
    }

    /**
     * Calculates healthcare costs for all years
     */
    calculateData() {
        const years = this.generalInformation.lifeExpectancy - this.generalInformation.startAge;
        const inflationRate = this.generalInformation.inflation / 100;

        for (let i = 0; i < years; i++) {
            const age = this.generalInformation.startAge + i;
            const yearsSinceStart = i;
            const inflationMultiplier = Math.pow(1 + inflationRate, yearsSinceStart);

            let monthlyPremiums = 0;
            let outOfPocket = 0;

            // Before Medicare (under 65)
            if (age < this.medicareEligibleAge) {
                monthlyPremiums = this.config.preMedicareMonthlyPremium * inflationMultiplier;
                // Deductible is typically once per year, out-of-pocket is additional
                outOfPocket = (this.config.preMedicareAnnualDeductible +
                              this.config.preMedicareAnnualOutOfPocket) * inflationMultiplier;
            }
            // Medicare eligible (65+)
            else {
                // Medicare Part B + Part D + Medigap
                monthlyPremiums = (this.config.medicarePartBPremium +
                                  this.config.medicarePartDPremium +
                                  this.config.medigapPremium) * inflationMultiplier;
                outOfPocket = this.config.medicareAnnualOutOfPocket * inflationMultiplier;
            }

            // Long-term care insurance (if enabled and age appropriate)
            if (this.config.includeLongTermCare && age >= this.config.longTermCareStartAge) {
                monthlyPremiums += this.config.longTermCarePremium * inflationMultiplier;
            }

            const annualCost = (monthlyPremiums * 12) + outOfPocket;

            this.healthcareData.push(new HealthcareYear(age, annualCost, monthlyPremiums, outOfPocket));
        }
    }

    /**
     * Gets healthcare cost for a specific age
     * @param {number} age - Age to get cost for
     * @returns {number} Annual healthcare cost
     */
    getCostAtAge(age) {
        const yearData = this.healthcareData.find(y => y.age === age);
        return yearData ? yearData.annualCost : 0;
    }

    /**
     * Gets total healthcare costs over all years
     * @returns {number} Total healthcare costs
     */
    getTotalCosts() {
        return this.healthcareData.reduce((sum, year) => sum + year.annualCost, 0);
    }
}

export { HealthcareConfig, HealthcareYear, HealthcareCosts };
