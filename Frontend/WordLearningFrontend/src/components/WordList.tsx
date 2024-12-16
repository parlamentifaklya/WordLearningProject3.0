import React, { useEffect, useState } from 'react';
import { fetchWords } from '../apiService'; 
import { Word } from '../wordInterface'; 

const WordList: React.FC = () => {
    const [words, setWords] = useState<Word[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getWords = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchWords();
                console.log(data);
                if (Array.isArray(data)) { 
                    setWords(data);
                } else {
                    throw new Error('Fetched data is not an array');
                }
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        getWords();
    }, []); 

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <ol>
            {words.map(word => (
                <li key={word.id}>{word.eng} - {word.hun}</li>
            ))}
        </ol>
    );
};

export default WordList;