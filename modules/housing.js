/**
 * Base class for all housing types
 */
class GenericHousing {
    /**
     * @param {Object} generalInformation - General user information
     * @param {number} monthlyInsurance - Monthly insurance cost
     * @param {number} monthlyHOA - Monthly HOA fees
     */
    constructor(generalInformation, monthlyInsurance, monthlyHOA){
        this.generalInformation = generalInformation;
        this.monthlyInsurance = monthlyInsurance;
        this.monthlyHOA = monthlyHOA;

        this.housingData = [];
    }

    calculateData() {
        throw new Error("Method 'calculateData()' must be implemented.");
    }
}

/**
 * Represents housing data for a single year
 */
class HousingYear {
    /**
     * @param {number} age - User's age for this year
     * @param {number} value - Equity/value of housing (0 for rental)
     * @param {number} yearlyCosts - Costs for this specific year
     * @param {number} totalCosts - Cumulative costs up to this year
     */
    constructor(age, value, yearlyCosts, totalCosts) {
        this.age = age;
        this.value = value;
        this.yearlyCosts = yearlyCosts;
        this.totalCosts = totalCosts;
    }
}

/**
 * Represents homeownership with a mortgage
 *
 * Mortgage calculation uses standard amortization formula:
 * Monthly Payment = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
 * Where P = principal, r = monthly rate, n = number of payments
 */
class House extends GenericHousing {
    /**
     * @param {Object} generalInformation - General user information
     * @param {number} monthlyInsurance - Monthly home insurance
     * @param {number} monthlyHOA - Monthly HOA fees
     * @param {number} mortgage - Mortgage principal amount
     * @param {number} downPayment - Down payment amount
     * @param {number} mortgageRate - Annual mortgage interest rate (as decimal)
     * @param {number} mortgageTermYears - Mortgage term in years (15 or 30)
     * @param {number} propertyTaxAssessment - Annual property tax
     * @param {number} homeAppreciationRate - Annual home appreciation rate (as decimal)
     * @param {number} oneTimeImprovements - Initial repair/improvement costs
     * @param {number} annualMaintenanceCost - Annual maintenance cost
     */
    constructor(generalInformation, monthlyInsurance, monthlyHOA,
                mortgage, downPayment, mortgageRate, mortgageTermYears,
                propertyTaxAssessment, homeAppreciationRate, oneTimeImprovements, annualMaintenanceCost) {
        super(generalInformation, monthlyInsurance, monthlyHOA);

        this.mortgage = mortgage;
        this.downPayment = downPayment;
        this.mortgageRate = mortgageRate;
        this.mortgageTermYears = mortgageTermYears;

        this.propertyTaxAssessment = propertyTaxAssessment;
        this.homeAppreciationRate = homeAppreciationRate;
        this.oneTimeImprovements = oneTimeImprovements;
        this.annualMaintenanceCost = annualMaintenanceCost;
    }

    /**
     * Calculates year-by-year costs and equity for homeownership
     * Uses proper amortization schedule for accurate interest/principal breakdown
     */
    calculateData() {
        const years = this.generalInformation.lifeExpectancy - this.generalInformation.startAge;
        let currentValue = this.downPayment + this.mortgage; // Start with full home value

        // Calculate monthly payment using standard mortgage formula
        const monthlyRate = this.mortgageRate / 12;
        const totalPayments = this.mortgageTermYears * 12;
        const monthlyMortgagePayment = this.mortgage > 0
            ? this.mortgage * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
              (Math.pow(1 + monthlyRate, totalPayments) - 1)
            : 0;

        let remainingPrincipal = this.mortgage;

        for (let i = 0; i < years; i++) {
            let yearlyCosts = this.monthlyInsurance * 12 + this.monthlyHOA * 12 + this.propertyTaxAssessment;
            let yearlyPrincipalPaid = 0;

            // Calculate mortgage payments for this year (if still in mortgage term)
            if (i < this.mortgageTermYears && remainingPrincipal > 0) {
                let yearlyInterestPaid = 0;

                // Calculate each month's interest and principal for accurate amortization
                for (let month = 0; month < 12; month++) {
                    const monthlyInterest = remainingPrincipal * monthlyRate;
                    const monthlyPrincipal = monthlyMortgagePayment - monthlyInterest;

                    yearlyInterestPaid += monthlyInterest;
                    yearlyPrincipalPaid += monthlyPrincipal;
                    remainingPrincipal -= monthlyPrincipal;

                    // Prevent negative principal due to rounding
                    if (remainingPrincipal < 0) remainingPrincipal = 0;
                }

                yearlyCosts += monthlyMortgagePayment * 12;
            }

            // Add one-time improvements in first year, annual maintenance thereafter
            if (i == 0) {
                yearlyCosts += this.oneTimeImprovements;
            } else {
                yearlyCosts += this.annualMaintenanceCost;
            }

            // Home value appreciates annually
            currentValue = currentValue * (1 + this.homeAppreciationRate);

            this.housingData.push(new HousingYear(
                this.generalInformation.startAge + i,
                currentValue,
                yearlyCosts,
                (i == 0 ? yearlyCosts : this.housingData[i - 1].totalCosts + yearlyCosts)
            ));

            // Adjust costs for inflation
            this.annualMaintenanceCost *= (1 + this.generalInformation.inflation);
            this.propertyTaxAssessment *= (1 + this.generalInformation.inflation);
            this.monthlyInsurance *= (1 + this.generalInformation.inflation);
            this.monthlyHOA *= (1 + this.generalInformation.inflation);
        }
    }
}

/**
 * Represents apartment/rental housing
 */
class Apartment extends GenericHousing {
    /**
     * @param {Object} generalInformation - General user information
     * @param {number} monthlyInsurance - Monthly renter's insurance
     * @param {number} monthlyHOA - Monthly HOA fees (rare for rentals)
     * @param {number} monthlyRent - Monthly rent payment
     * @param {number} annualRentIncrease - Annual rent increase rate (as decimal)
     */
    constructor(generalInformation, monthlyInsurance, monthlyHOA,
                monthlyRent, annualRentIncrease) {
        super(generalInformation, monthlyInsurance, monthlyHOA);

        this.monthlyRent = monthlyRent;
        this.annualRentIncrease = annualRentIncrease;
    }

    /**
     * Calculates year-by-year costs for renting
     * Rental has no equity value, only costs
     */
    calculateData() {
        const years = this.generalInformation.lifeExpectancy - this.generalInformation.startAge;
        let currentRent = this.monthlyRent;

        for (let i = 0; i < years; i++) {
            const yearlyCosts = currentRent * 12 + this.monthlyInsurance * 12 + this.monthlyHOA * 12;

            this.housingData.push(new HousingYear(
                this.generalInformation.startAge + i,
                0, // Rentals have no equity
                yearlyCosts,
                (i == 0 ? yearlyCosts : this.housingData[i - 1].totalCosts + yearlyCosts)
            ));

            // Increase rent and insurance for next year
            currentRent = currentRent * (1 + this.annualRentIncrease);
            this.monthlyInsurance *= (1 + this.generalInformation.inflation);
            this.monthlyHOA *= (1 + this.generalInformation.inflation);
        }
    }
}

export { GenericHousing, HousingYear, House, Apartment };
