import React, { useEffect, useState, useRef } from 'react';
import { fetchWords } from '../apiService'; 
import { Word } from '../wordInterface';
import { gsap } from 'gsap';
import '../WordList.css';

const WordList: React.FC = () => {
    const [words, setWords] = useState<Word[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedQuestion, setSelectedQuestion] = useState<Word | null>(null);
    const [answers, setAnswers] = useState<Word[]>([]);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [difficulty, setDifficulty] = useState<string>('easy');
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
    const questionRef = useRef<HTMLDivElement | null>(null);
    const answerRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const getWords = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchWords();
                if (Array.isArray(data)) { 
                    const initializedWords = data.map(word => ({
                        ...word,
                        successCounter: word.successCounter || 0 
                    }));
                    setWords(initializedWords);
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

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
            return () => clearInterval(timerId);
        } else if (timeLeft === 0 && difficulty !== 'easy') {
            setIsTimeUp(true);
            setFeedback("Time's up! Please select a new question.");
        }
    }, [timeLeft, difficulty]);

    const selectRandomElements = () => {
        const availableWords = words.filter(word => word.successCounter < 3);
        if (availableWords.length === 0) return;

        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const questionWord = availableWords[randomIndex];
        const correctAnswer = questionWord;
        const remainingElements = availableWords.filter((item) => item !== questionWord);

        const randomIndices = new Set<number>();
        while (randomIndices.size < 2 && remainingElements.length > 0) {
            const index = Math.floor(Math.random() * remainingElements.length);
            randomIndices.add(index);
        }

        const selectedDistinctAnswers = Array.from(randomIndices).map(index => remainingElements[index]);
        const finalAnswers = [correctAnswer, ...selectedDistinctAnswers].sort(() => Math.random() - 0.5);

        setSelectedQuestion(questionWord);
        setAnswers(finalAnswers);
        setSelectedAnswerIndex(null);
        setFeedback(null);
        setIsTimeUp(false);

        switch (difficulty) {
            case 'medium':
                setTimeLeft(30);
                break;
            case 'hard':
                setTimeLeft(10);
                break;
            default:
                setTimeLeft(0);
        }

        if (questionRef.current) {
            gsap.fromTo(questionRef.current, { rotationY: 180 }, { rotationY: 0, duration: 0.5 });
        }

        setTimeout(() => {
            answerRefs.current.forEach((card, index) => {
                if (card) {
                    gsap.fromTo(card, { rotationY: 180 }, { rotationY: 0, duration: 0.5, delay: index * 0.1 });
                }
            });
        }, 100);
    };

    const handleAnswerSelection = (isCorrect: boolean, index: number) => {
        if (isTimeUp) {
            alert("Time's up! You cannot answer.");
            return;
        }

        if (selectedAnswerIndex !== null) return;

        setSelectedAnswerIndex(index);
        if (isCorrect && selectedQuestion) {
            const updatedWords = words.map(word => {
                if (word.eng === selectedQuestion.eng) {
                    return { ...word, successCounter: word.successCounter + 1 };
                }
                return word;
            });
            setWords(updatedWords);
            setFeedback("Correct!");
        } else {
            setFeedback("Wrong answer. Try again!");
        }

        setTimeout(() => {
            if (answerRefs.current[index]) {
                gsap.to(answerRefs.current[index], { rotationY: 180, duration: 0.5 });
            }
        }, 100);

        setTimeout(() => {
            selectRandomElements();
        }, 1000);
    };

    const handleDifficultyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDifficulty(event.target.value);
        setIsTimeUp(false);
        selectRandomElements();
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1 className='title'>Word Quiz</h1>
            <select onChange={handleDifficultyChange} value={difficulty}>
                <option value="easy">Easy (Unlimited Time)</option>
                <option value="medium">Medium (30 seconds)</option>
                <option value="hard">Hard (10 seconds)</option>
            </select>
            <div className='container'>
                {selectedQuestion && (
                    <div className='content'>
                        <div className='question' ref={questionRef}>
                            {selectedQuestion.eng}
                        </div>
                        <div className='arrow'>→</div>
                        <div className='answer-container'>
                            {answers.map((answer, index) => (
                                <div 
                                    key={index} 
                                    ref={(ref) => { answerRefs.current[index] = ref; }}
                                    className={`answer ${selectedAnswerIndex === index ? (answer.eng === selectedQuestion.eng ? 'correct-answer' : 'wrong-answer') : ''}`} 
                                    onClick={() => handleAnswerSelection(answer.eng === selectedQuestion.eng, index)}
                                >
                                    {answer.hun}
                                </div>
                            ))}
                        </div>
                        {feedback && <div className='feedback'>{feedback}</div>}
                        {difficulty !== 'easy' && <p>Time Left: {timeLeft} seconds</p>}
                    </div>
                )}
                <button type="button" onClick={selectRandomElements}>New Question</button>
            </div>
        </div>
    );
};

export default WordList;