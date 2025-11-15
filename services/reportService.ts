import type { ReportData } from '../types';

const getStorageKey = (username: string): string => `drishtifi_reports_${username}`;

/**
 * Retrieves all reports for a given user from localStorage.
 * @param username The username of the logged-in user.
 * @returns An array of ReportData objects, or an empty array if none are found.
 */
export const getReportsForUser = (username: string): ReportData[] => {
    try {
        const reportsJson = localStorage.getItem(getStorageKey(username));
        if (reportsJson) {
            return JSON.parse(reportsJson) as ReportData[];
        }
        return [];
    } catch (error) {
        console.error("Failed to parse reports from localStorage", error);
        return [];
    }
};

/**
 * Saves an array of reports for a given user to localStorage.
 * This overwrites any existing reports for that user.
 * @param username The username of the logged-in user.
 * @param reports The full array of reports to save.
 */
export const saveReportsForUser = (username: string, reports: ReportData[]): void => {
    try {
        const reportsJson = JSON.stringify(reports);
        localStorage.setItem(getStorageKey(username), reportsJson);
    } catch (error) {
        console.error("Failed to save reports to localStorage", error);
    }
};