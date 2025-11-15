/**
 * A simple service to manage user accounts in localStorage.
 * In a real-world application, this would be a secure backend service.
 */

const USER_STORAGE_KEY = 'drishtifi_users';

type UserStore = { [key: string]: string };

/**
 * Retrieves the user database from localStorage.
 * If no database exists, it initializes with a default user.
 * @returns The user store object (username: password).
 */
export const getUsers = (): UserStore => {
    try {
        const usersJson = localStorage.getItem(USER_STORAGE_KEY);
        if (usersJson) {
            return JSON.parse(usersJson) as UserStore;
        } else {
            // Initialize with a default user if none exists
            const defaultUsers: UserStore = { 'loan_officer': 'password123' };
            saveUsers(defaultUsers);
            return defaultUsers;
        }
    } catch (error) {
        console.error("Failed to parse users from localStorage", error);
        const defaultUsers: UserStore = { 'loan_officer': 'password123' };
        saveUsers(defaultUsers);
        return defaultUsers;
    }
};

/**
 * Saves the entire user database to localStorage.
 * @param users The user store object to save.
 */
export const saveUsers = (users: UserStore): void => {
    try {
        const usersJson = JSON.stringify(users);
        localStorage.setItem(USER_STORAGE_KEY, usersJson);
    } catch (error) {
        console.error("Failed to save users to localStorage", error);
    }
};