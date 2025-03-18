import axios from 'axios';

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const API_URL = 'https://api.unsplash.com';

export const getTravelPhotos = async (count = 10) => {
    try {
        const response = await axios.get(`${API_URL}/photos/random`, {
        params: {
            client_id: ACCESS_KEY,
            query: 'travel,adventure,nature',
            orientation: 'landscape',
            count: count
        }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching photos:', error);
        return [];
    }
};