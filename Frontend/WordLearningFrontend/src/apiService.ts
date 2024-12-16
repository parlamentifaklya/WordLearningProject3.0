import { Word } from './wordInterface';

const API_URL = 'http://localhost:5035/GetAll';

export const fetchWords = async (): Promise<Word[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.value;
};