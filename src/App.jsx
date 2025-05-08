import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('Session');
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return (
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds : seconds)
    );
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setMode('Session');
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const handleStartStop = () => {
    setIsRunning((prev) => !prev);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (timeLeft === 0) {
      audioRef.current.play();
      setTimeout(() => {
        if (mode === 'Session') {
          setMode('Break');
          setTimeLeft(breakLength * 60);
        } else {
          setMode('Session');
          setTimeLeft(sessionLength * 60);
        }
      }, 1000);
    }
  }, [timeLeft, mode, breakLength, sessionLength]);

  const adjustLength = (type, amount) => {
    if (isRunning) return;
    if (type === 'break') {
      if (breakLength + amount > 0 && breakLength + amount <= 60) {
        setBreakLength(breakLength + amount);
      }
    } else {
      if (sessionLength + amount > 0 && sessionLength + amount <= 60) {
        setSessionLength(sessionLength + amount);
        setTimeLeft((sessionLength + amount) * 60);
      }
    }
  };

  return (
    <div className="App">
      <h1>25 + 5 Clock</h1>
      <div className="length-controls">
        <div>
          <h2 id="break-label">Break Length</h2>
          <button id="break-decrement" onClick={() => adjustLength('break', -1)}>-</button>
          <span id="break-length">{breakLength}</span>
          <button id="break-increment" onClick={() => adjustLength('break', 1)}>+</button>
        </div>
        <div>
          <h2 id="session-label">Session Length</h2>
          <button id="session-decrement" onClick={() => adjustLength('session', -1)}>-</button>
          <span id="session-length">{sessionLength}</span>
          <button id="session-increment" onClick={() => adjustLength('session', 1)}>+</button>
        </div>
      </div>

      <div className="timer">
        <h2 id="timer-label">{mode}</h2>
        <div id="time-left">{formatTime(timeLeft)}</div>
        <button id="start_stop" onClick={handleStartStop}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button id="reset" onClick={handleReset}>Reset</button>
      </div>

      <audio
        id="beep"
        ref={audioRef}
        src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"
        preload="auto"
      ></audio>
    </div>
  );
};

export default App;
