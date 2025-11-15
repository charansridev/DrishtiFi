import type { ReportData } from '../types';

const getStorageKey = (uid: string): string => `drishtifi_reports_${uid}`;

/**
 * Retrieves all reports for a given user from localStorage.
 * @param uid The unique ID of the logged-in Firebase user.
 * @returns An array of ReportData objects, or an empty array if none are found.
 */
export const getReportsForUser = (uid: string): ReportData[] => {
    if (!uid) return [];
    try {
        const reportsJson = localStorage.getItem(getStorageKey(uid));
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
 * @param uid The unique ID of the logged-in Firebase user.
 * @param reports The full array of reports to save.
 */
export const saveReportsForUser = (uid: string, reports: ReportData[]): void => {
    if (!uid) return;
    try {
        const reportsJson = JSON.stringify(reports);
        localStorage.setItem(getStorageKey(uid), reportsJson);
    } catch (error) {
        console.error("Failed to save reports to localStorage", error);
    }
};
