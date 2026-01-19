import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserProvider";

const QuizApp = () => {
  const { username } = useContext(UserContext);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [change, setChange] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const map = {
    true: "True",
    false: "False",
  };

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=1&difficulty=easy&type=boolean")
      .then((res) => {
        if (!res.ok) {
          console.log("error " + res);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        console.log(data.results);
        const result = data.results[0];
        console.log(question);
        setQuestion(result.question);
        setCorrectAnswer(result.correct_answer);
        console.log(result.correct_answer);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [change]);

  const submitAnswer = () => {
    if (map[answer] == correctAnswer) {
      alert("Correct Answer  " + username);
      setChange((prev) => prev + 1);
      setScore((prevScore) => prevScore + 1);
      setAnswer(null);
    } else {
      alert("wrong answer  " + username);
      setChange((prev) => prev + 1);
      setAnswer(null);
    }
  };

  return (
    <div className="quizApp">
      <h1>Welome {username}</h1>
      <h3>Score {score}</h3>
      <div className="container">
        <p>{question}</p>{" "}
      </div>

      <div className="answerBox">
        <label>
          <input
            type="checkbox"
            checked={answer === true}
            onChange={() => setAnswer(true)}
          />
          True
        </label>
        <label>
          <input
            type="checkbox"
            checked={answer === false}
            onChange={() => setAnswer(false)}
          />
          False
        </label>
      </div>
      <button onClick={submitAnswer}> Submit </button>
    </div>
  );
};

export default QuizApp;
