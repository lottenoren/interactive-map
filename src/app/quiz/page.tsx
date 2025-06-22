'use client';

import { useEffect, useState } from 'react';

type Country = {
  name: { common: string };
  flags: { svg: string };
};

export default function FlagQuizPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [chooseLevel, setChooseLevel] = useState(false);
  const [question, setQuestion] = useState<{
    flag: string;
    correct: string;
    options: string[];
  } | null>(null);

  const totalQuestions = 10;

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,flags')
      .then((res) => res.json())
      .then((data) => setCountries(data));
  }, []);

  useEffect(() => {
    if (level && countries.length > 0 && !quizStarted) {
      setQuizStarted(true);
      generateQuestion();
    }
  }, [level, countries]);

  useEffect(() => {
    if (quizStarted && countries.length > 0 && questionIndex < totalQuestions) {
      generateQuestion();
    }
  }, [questionIndex]);

  const generateQuestion = () => {
    let filtered = countries;

    if (level === 'easy') {
      const europeanCountries = [
        "Norway", "Sweden", "France", "Germany", "Italy", "Spain", "Portugal",
        "Finland", "Denmark", "Poland", "Netherlands", "Belgium", "Switzerland",
        "Austria", "Greece", "Iceland", "Ireland", "Estonia", "Latvia", "Lithuania",
      ];
      filtered = countries.filter((c) =>
        europeanCountries.includes(c.name.common)
      );
    }

    const correct = filtered[Math.floor(Math.random() * filtered.length)];
    const options = new Set<string>([correct.name.common]);

    while (options.size < 4) {
      const pool = level === 'hard' ? countries : filtered;
      const random = pool[Math.floor(Math.random() * pool.length)];
      options.add(random.name.common);
    }

    const shuffled = Array.from(options).sort(() => Math.random() - 0.5);

    setQuestion({
      flag: correct.flags.svg,
      correct: correct.name.common,
      options: shuffled,
    });

    setSelected(null);
  };

  const handleAnswer = (answer: string) => {
    setSelected(answer);
    if (answer === question?.correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setQuestionIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    setQuizStarted(false);
    setLevel(null);
    setChooseLevel(false);
    setQuestionIndex(0);
    setScore(0);
    setQuestion(null);
    setSelected(null);
  };

  if (!level && !chooseLevel) {
    return (
      <main className="min-h-screen flex items-center justify-center flex-col text-center p-8">
        <h1 className="text-4xl font-bold mb-6">Velkommen til Flaggquiz!</h1>
        <p className="mb-6 text-gray-600">Gjett hvilket land flagget tilhører</p>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button
            onClick={() => setLevel('medium')}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition"
          >
            Start tilfeldig quiz
          </button>
          <button
            onClick={() => setChooseLevel(true)}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            Velg vanskelighetsgrad
          </button>
        </div>
      </main>
    );
  }

  if (!level && chooseLevel) {
    return (
      <main className="min-h-screen flex items-center justify-center flex-col text-center p-8">
        <h1 className="text-3xl font-bold mb-6">Velg vanskelighetsgrad</h1>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button
            onClick={() => setLevel('easy')}
            className="px-6 py-3 bg-green-100 text-green-800 rounded-xl font-semibold hover:bg-green-200 transition"
          >
            Lett (kun Europa)
          </button>
          <button
            onClick={() => setLevel('medium')}
            className="px-6 py-3 bg-yellow-100 text-yellow-800 rounded-xl font-semibold hover:bg-yellow-200 transition"
          >
            Medium (alle land)
          </button>
          <button
            onClick={() => setLevel('hard')}
            className="px-6 py-3 bg-red-100 text-red-800 rounded-xl font-semibold hover:bg-red-200 transition"
          >
            Vanskelig (alle land + forvirrende valg)
          </button>
          <button
            onClick={() => setChooseLevel(false)}
            className="mt-2 text-sm text-gray-500 underline hover:text-gray-700"
          >
            ← Tilbake
          </button>
        </div>
      </main>
    );
  }

  if (questionIndex >= totalQuestions) {
    return (
      <main className="min-h-screen flex items-center justify-center flex-col text-center p-8">
        <h1 className="text-3xl font-bold mb-2">Du er ferdig!</h1>
        <p className="text-sm text-gray-500 mb-2">
          Nivå: {level === 'easy' ? 'Lett' : level === 'medium' ? 'Medium' : 'Vanskelig'}
        </p>
        <p className="text-xl mb-4">
          Du fikk <strong>{score}</strong> av {totalQuestions} riktige.
        </p>
        <button
          onClick={handleRestart}
          className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Prøv igjen
        </button>
      </main>
    );
  }

  if (!question) return <div className="p-8">Laster spørsmål...</div>;

  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center">
      <div
        className="mb-2 text-sm font-medium px-3 py-1 rounded-full"
        style={{
          backgroundColor:
            level === 'easy' ? '#a7f3d0' :
            level === 'medium' ? '#fde68a' :
            level === 'hard' ? '#fca5a5' : '#e5e7eb',
          color:
            level === 'easy' ? '#065f46' :
            level === 'medium' ? '#92400e' :
            level === 'hard' ? '#7f1d1d' : '#111827',
        }}
      >
        Nivå: {level === 'easy' ? 'Lett' : level === 'medium' ? 'Medium' : 'Vanskelig'}
      </div>

      <h2 className="text-lg text-gray-600 mb-2">
        Spørsmål {questionIndex + 1} / {totalQuestions}
      </h2>
      <h1 className="text-2xl font-bold mb-6">Hvilket land har dette flagget?</h1>
      <img src={question.flag} alt="Flagg" className="w-64 h-40 object-contain mb-6 border" />

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className={`font-semibold py-2 px-4 rounded-md transition-all duration-200 text-center border shadow-sm
              ${selected
                ? option === question.correct
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : option === selected
                  ? 'bg-red-100 text-red-800 border-red-300'
                  : 'bg-[#fdfaf5] text-gray-800 border-[#e9dfd0]'
                : 'bg-[#fdfaf5] hover:bg-[#f5ede2] text-gray-800 border-[#e9dfd0]'}`}
          >
            {option}
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-6 flex flex-col items-center">
          <p className="text-lg font-semibold mb-4">
            {selected === question.correct ? 'Riktig!' : `Feil. Riktig svar: ${question.correct}`}
          </p>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition"
          >
            Neste spørsmål
          </button>
        </div>
      )}
    </main>
  );
}
