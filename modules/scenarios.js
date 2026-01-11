/**
 * Scenario Management Module
 * Handles saving, loading, and deleting calculation scenarios to/from localStorage
 */

const SCENARIOS_STORAGE_KEY = "retirementCalculatorScenarios";

/**
 * Represents a saved scenario
 */
class Scenario {
    /**
     * @param {string} name - Scenario name
     * @param {string} notes - Optional notes about the scenario
     * @param {Object} formData - All form input values
     * @param {Date} createdAt - When the scenario was created
     * @param {Date} updatedAt - When the scenario was last updated
     */
    constructor(name, notes, formData, createdAt = new Date(), updatedAt = new Date()) {
        this.id = this.generateId();
        this.name = name;
        this.notes = notes;
        this.formData = formData;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Generates a unique ID for the scenario
     * @returns {string} Unique ID
     */
    generateId() {
        return `scenario_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

/**
 * ScenarioManager handles all scenario operations
 */
class ScenarioManager {
    /**
     * Get all saved scenarios from localStorage
     * @returns {Array<Scenario>} Array of saved scenarios
     */
    static getAllScenarios() {
        const scenariosJson = localStorage.getItem(SCENARIOS_STORAGE_KEY);
        if (!scenariosJson) {
            return [];
        }

        try {
            const scenarios = JSON.parse(scenariosJson);
            // Convert date strings back to Date objects
            return scenarios.map(s => ({
                ...s,
                createdAt: new Date(s.createdAt),
                updatedAt: new Date(s.updatedAt)
            }));
        } catch (error) {
            console.error("Error parsing scenarios from localStorage:", error);
            return [];
        }
    }

    /**
     * Save a new scenario or update an existing one
     * @param {string} name - Scenario name
     * @param {string} notes - Optional notes
     * @param {Object} formData - Form input values
     * @param {string} existingId - Optional ID if updating existing scenario
     * @returns {Scenario} The saved scenario
     */
    static saveScenario(name, notes, formData, existingId = null) {
        if (!name || !name.trim()) {
            throw new Error("Scenario name is required");
        }

        const scenarios = this.getAllScenarios();

        // Check if updating existing scenario
        if (existingId) {
            const index = scenarios.findIndex(s => s.id === existingId);
            if (index !== -1) {
                scenarios[index].name = name;
                scenarios[index].notes = notes;
                scenarios[index].formData = formData;
                scenarios[index].updatedAt = new Date();

                localStorage.setItem(SCENARIOS_STORAGE_KEY, JSON.stringify(scenarios));
                return scenarios[index];
            }
        }

        // Create new scenario
        const scenario = new Scenario(name, notes, formData);
        scenarios.push(scenario);

        localStorage.setItem(SCENARIOS_STORAGE_KEY, JSON.stringify(scenarios));
        return scenario;
    }

    /**
     * Get a scenario by ID
     * @param {string} id - Scenario ID
     * @returns {Scenario|null} The scenario or null if not found
     */
    static getScenarioById(id) {
        const scenarios = this.getAllScenarios();
        return scenarios.find(s => s.id === id) || null;
    }

    /**
     * Delete a scenario
     * @param {string} id - Scenario ID to delete
     * @returns {boolean} True if deleted, false if not found
     */
    static deleteScenario(id) {
        const scenarios = this.getAllScenarios();
        const filteredScenarios = scenarios.filter(s => s.id !== id);

        if (filteredScenarios.length === scenarios.length) {
            return false; // Scenario not found
        }

        localStorage.setItem(SCENARIOS_STORAGE_KEY, JSON.stringify(filteredScenarios));
        return true;
    }

    /**
     * Delete all scenarios
     */
    static deleteAllScenarios() {
        localStorage.removeItem(SCENARIOS_STORAGE_KEY);
    }

    /**
     * Export scenarios to JSON file
     * @returns {string} JSON string of all scenarios
     */
    static exportScenarios() {
        const scenarios = this.getAllScenarios();
        return JSON.stringify(scenarios, null, 2);
    }

    /**
     * Import scenarios from JSON
     * @param {string} jsonString - JSON string containing scenarios
     * @param {boolean} merge - If true, merge with existing scenarios; if false, replace
     * @returns {number} Number of scenarios imported
     */
    static importScenarios(jsonString, merge = true) {
        try {
            const importedScenarios = JSON.parse(jsonString);

            if (!Array.isArray(importedScenarios)) {
                throw new Error("Invalid scenarios format");
            }

            let scenarios = merge ? this.getAllScenarios() : [];

            // Add imported scenarios, avoiding duplicates by ID
            importedScenarios.forEach(imported => {
                const exists = scenarios.some(s => s.id === imported.id);
                if (!exists) {
                    scenarios.push(imported);
                }
            });

            localStorage.setItem(SCENARIOS_STORAGE_KEY, JSON.stringify(scenarios));
            return importedScenarios.length;
        } catch (error) {
            console.error("Error importing scenarios:", error);
            throw new Error("Failed to import scenarios: " + error.message);
        }
    }
}

export { Scenario, ScenarioManager };
