/**
 * Tracks living expenses (non-housing costs) over time
 * Expenses are adjusted for inflation each year
 */
class LivingExpenses {
    /**
     * @param {Object} generalInformation - General user information including spending
     */
    constructor(generalInformation) {
        this.generalInformation = generalInformation;
        this.expensesData = [];
    }

    /**
     * Calculates year-by-year living expenses
     * Uses different spending amounts before and after retirement
     */
    calculateData() {
        const years = this.generalInformation.lifeExpectancy - this.generalInformation.startAge;
        let yearlySpending = this.generalInformation.monthlySpending * 12;
        let yearlyRetirementSpending = this.generalInformation.retirementMonthlySpending * 12;

        for (let i = 0; i < years; i++) {
            // Use pre-retirement spending before retirement age, post-retirement after
            const currentYearSpending = (i < (this.generalInformation.retirementAge - this.generalInformation.startAge))
                ? yearlySpending
                : yearlyRetirementSpending;

            const totalCosts = (i == 0 ? currentYearSpending : this.expensesData[i - 1].totalCosts + currentYearSpending);

            this.expensesData.push(new ExpensesYear(
                this.generalInformation.startAge + i,
                currentYearSpending,
                totalCosts
            ));

            // Adjust both spending amounts for inflation
            yearlySpending *= (1 + this.generalInformation.inflation);
            yearlyRetirementSpending *= (1 + this.generalInformation.inflation);
        }
    }
}

/**
 * Represents living expenses for a single year
 */
class ExpensesYear {
    /**
     * @param {number} age - User's age for this year
     * @param {number} yearlySpending - Spending for this specific year
     * @param {number} totalCosts - Cumulative spending up to this year
     */
    constructor(age, yearlySpending, totalCosts) {
        this.age = age;
        this.yearlySpending = yearlySpending;
        this.totalCosts = totalCosts;
    }
}

export { LivingExpenses, ExpensesYear };
