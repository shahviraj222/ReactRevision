const API_URL = 'http://localhost:5000/api';

export const testConnection = async () => {
    try {
        const response = await fetch(`${API_URL}/test`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}; 