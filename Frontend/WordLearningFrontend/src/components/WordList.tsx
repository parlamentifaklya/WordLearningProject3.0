import React, { useEffect, useState } from 'react';
import { fetchWords } from '../apiService'; 
import { Word } from '../wordInterface'; 

const WordList: React.FC = () => {
    const [words, setWords] = useState<Word[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedQuestion, setSelectedQuestion] = useState<Word | null>(null);
    const [answers, setAnswers] = useState<Word[]>([]);

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

    const selectRandomElements = () => {
        if (words.length === 0) return;

        const randomIndex = Math.floor(Math.random() * words.length);
        const questionWord = words[randomIndex];

        const correctAnswer = questionWord;

        const remainingElements = words.filter((item) => item !== questionWord);

        const randomIndices = new Set<number>();
        while (randomIndices.size < 2) {
            const index = Math.floor(Math.random() * remainingElements.length);
            randomIndices.add(index);
        }

        const selectedDistinctAnswers = Array.from(randomIndices).map(index => remainingElements[index]);

        const finalAnswers = [correctAnswer, ...selectedDistinctAnswers];

        const shuffledAnswers = finalAnswers.sort(() => Math.random() - 0.5);

        setSelectedQuestion(questionWord);
        setAnswers(shuffledAnswers);
    };

    useEffect(() => {
        if (words.length > 0) {
            selectRandomElements();
        }
    }, [words]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='container'>
            {selectedQuestion && (
                <div className='question'>
                    {selectedQuestion.eng}
                    <div className='answer-container'>
                        {answers.map((answer, index) => (
                            <div key={index} className='answer'>
                                {answer.hun}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WordList;