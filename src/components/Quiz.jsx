import React, { useEffect, useState } from "react";
import './Quiz.css'
const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "https://api.allorigins.win/get?url=" +
            encodeURIComponent("https://api.jsonserve.com/Uw5CrX")
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonResponse = await response.json();
        const data = JSON.parse(jsonResponse.contents);
        setQuestions(data.questions);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!questions.length) return <div>Error: No questions available.</div>;

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 4);
    } else {
      setScore(score - 1);
    }

    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    return (
      <div className="quiz-summary">
        <h2>Quiz Completed!</h2>
        <p>Your Score: {score}</p>
        <button onClick={restartQuiz}>Restart Quiz</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
     <div className="index"> <h2>{currentQuestion?.title || "Qusetions"}</h2>
     <h4>Question {currentQuestionIndex + 1} of {questions.length}</h4></div>
     
      <hr />
      <p className="question">{currentQuestion?.description || "No description available."}</p>
      <div className="options">
        {currentQuestion?.options?.map((option) => (
          <button key={option.id} onClick={() => handleAnswer(option.is_correct)}>
            {option.description}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
