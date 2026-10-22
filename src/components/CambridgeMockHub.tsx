import React, { useState } from 'react';
import {
  CAMBRIDGE_BOOKS,
  CAMBRIDGE_SAMPLE_TESTS,
  CambridgeBookSummary,
  CambridgeTest,
  QuestionItem,
} from '../data/cambridgeTests';
import { calculateListeningBandScore, calculateReadingBandScore, getCEFRLevel } from '../utils/scoring';
import {
  BookOpen,
  Headphones,
  FileText,
  PenTool,
  Mic,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Sparkles,
  Volume2,
  ChevronRight,
  Award,
  ArrowLeft
} from 'lucide-react';

interface CambridgeMockHubProps {
  onSaveAttempt: (attempt: any) => void;
  onNavigateToWriting?: (promptData: any) => void;
  onNavigateToSpeaking?: (topicData: any) => void;
}

export default function CambridgeMockHub({
  onSaveAttempt,
  onNavigateToWriting,
  onNavigateToSpeaking,
}: CambridgeMockHubProps) {
  const [selectedBook, setSelectedBook] = useState<number>(19);
  const [selectedTestNum, setSelectedTestNum] = useState<number>(1);
  const [activeModule, setActiveModule] = useState<'overview' | 'listening' | 'reading' | 'writing' | 'speaking'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Test State
  const activeTest: CambridgeTest = CAMBRIDGE_SAMPLE_TESTS[selectedBook] || CAMBRIDGE_SAMPLE_TESTS[19];

  // Listening / Reading Interactive Answer State
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);
  const [isGeneratingTts, setIsGeneratingTts] = useState<boolean>(false);

  // Filter books by search query
  const filteredBooks = CAMBRIDGE_BOOKS.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookNumber.toString().includes(searchQuery) ||
      b.highlight.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAnswerChange = (questionId: number, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handlePlayTts = async (text: string) => {
    setIsGeneratingTts(true);
    try {
      const res = await fetch('/api/gemini/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: 'Puck',
          style: 'Clear, authentic British IELTS Listening Examiner and dialogue speaker',
        }),
      });
      const data = await res.json();
      if (data.audioBase64) {
        setTtsAudioUrl(`data:audio/wav;base64,${data.audioBase64}`);
      }
    } catch (err) {
      console.error('Failed to generate audio:', err);
    } finally {
      setIsGeneratingTts(false);
    }
  };

  const calculateResults = (questions: QuestionItem[], moduleType: 'listening' | 'reading') => {
    let correctCount = 0;
    questions.forEach((q) => {
      const userAns = (userAnswers[q.id] || '').trim().toLowerCase();
      const correctAns = q.correctAnswer.trim().toLowerCase();
      if (userAns === correctAns) {
        correctCount++;
      }
    });

    const scaledScore = Math.round((correctCount / questions.length) * 40);
    const bandScore =
      moduleType === 'listening'
        ? calculateListeningBandScore(scaledScore)
        : calculateReadingBandScore(scaledScore);

    return { correctCount, total: questions.length, scaledScore, bandScore };
  };

  const handleSubmitSection = (questions: QuestionItem[], moduleType: 'listening' | 'reading') => {
    setIsSubmitted(true);
    const { correctCount, total, scaledScore, bandScore } = calculateResults(questions, moduleType);

    onSaveAttempt({
      bookNumber: selectedBook,
      testNumber: selectedTestNum,
      module: moduleType,
      score: scaledScore,
      bandScore,
      durationSeconds: 1800,
      details: `${correctCount}/${total} correct (${bandScore} Band Score)`,
      createdAt: new Date().toISOString(),
    });
  };

  const resetSection = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setTtsAudioUrl(null);
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner with Cambridge Accreditation Aesthetics */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 border border-slate-700 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-bold mb-3">
              <Award className="w-3.5 h-3.5 text-red-400" />
              <span>Official Academic Examination Papers 1 to 19</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Cambridge IELTS Academic Mock Library
            </h1>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Access authentic test papers from Cambridge IELTS 1 through Cambridge IELTS 19.
              Practice real test questions under timed exam conditions with instant AI band score calculations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[110px]">
              <span className="block text-2xl font-black text-white">19</span>
              <span className="text-xs text-slate-400 font-semibold">Official Books</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[110px]">
              <span className="block text-2xl font-black text-red-400">76</span>
              <span className="text-xs text-slate-400 font-semibold">Full Mock Tests</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[110px]">
              <span className="block text-2xl font-black text-emerald-400">0 - 9.0</span>
              <span className="text-xs text-slate-400 font-semibold">Instant Bands</span>
            </div>
          </div>
        </div>
      </div>

      {/* Module Selector & Back Button */}
      {activeModule !== 'overview' && (
        <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <button
            onClick={() => {
              setActiveModule('overview');
              resetSection();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-sky-400" />
            <span>Back to Cambridge Test Selection</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Current Test:</span>
            <span className="text-xs font-bold text-white px-2.5 py-1 rounded-lg bg-red-600/20 border border-red-500/30 text-red-300">
              Cambridge {selectedBook} - Test {selectedTestNum}
            </span>
          </div>
        </div>
      )}

      {/* Overview: Cambridge Books Catalog & Test Selection */}
      {activeModule === 'overview' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search Cambridge Books 1-19..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
              />
              <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
              <span className="text-xs text-slate-400 whitespace-nowrap">Jump to:</span>
              {[19, 18, 17, 16, 15, 14, 10, 1].map((bNum) => (
                <button
                  key={bNum}
                  onClick={() => setSelectedBook(bNum)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedBook === bNum
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Book {bNum}
                </button>
              ))}
            </div>
          </div>

          {/* Active Book Detail Header */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Cambridge University Press & Assessment
                </span>
                <span className="text-xs text-slate-400">Year {CAMBRIDGE_BOOKS.find(b => b.bookNumber === selectedBook)?.year || 2024}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Cambridge IELTS {selectedBook} Academic
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {CAMBRIDGE_BOOKS.find(b => b.bookNumber === selectedBook)?.highlight}
              </p>
            </div>

            {/* Test 1-4 Switcher */}
            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
              {[1, 2, 3, 4].map((tNum) => (
                <button
                  key={tNum}
                  onClick={() => setSelectedTestNum(tNum)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedTestNum === tNum
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Practice Test {tNum}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Authentic Modules of the Active Cambridge Test */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Listening Module */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-105 transition-transform">
                  <Headphones className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-white">Listening Test</h3>
                  <span className="text-[11px] font-semibold text-slate-400">30 Mins</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  4 audio sections: Form completion, multiple choice, and academic dialogues.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-sky-400 font-semibold">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>TTS Audio & Full Transcript</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveModule('listening');
                  resetSection();
                }}
                className="mt-6 w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-sky-600/20"
              >
                <span>Start Listening</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>

            {/* Reading Module */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-white">Reading Test</h3>
                  <span className="text-[11px] font-semibold text-slate-400">60 Mins</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  3 authentic academic texts with True/False/Not Given & multiple choice questions.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Instant Band 0-9 Conversion</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveModule('reading');
                  resetSection();
                }}
                className="mt-6 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-emerald-600/20"
              >
                <span>Start Reading</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>

            {/* Writing Module */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
                  <PenTool className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-white">Writing Test</h3>
                  <span className="text-[11px] font-semibold text-slate-400">60 Mins</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  Task 1 Academic Report (150 words) & Task 2 Argumentative Essay (250 words).
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-amber-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Thinking Evaluation</span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (onNavigateToWriting) {
                    onNavigateToWriting(activeTest.writingPrompts);
                  } else {
                    setActiveModule('writing');
                  }
                }}
                className="mt-6 w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-amber-600/20"
              >
                <span>Open Writing Lab</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>

            {/* Speaking Module */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-105 transition-transform">
                  <Mic className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-white">Speaking Test</h3>
                  <span className="text-[11px] font-semibold text-slate-400">11-14 Mins</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  Part 1 Warm-up, Part 2 Cue Card (1 min prep), and Part 3 Deep Analytical Discussion.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-rose-400 font-semibold">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Live Examiner Voice Simulator</span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (onNavigateToSpeaking) {
                    onNavigateToSpeaking(activeTest.speakingParts);
                  } else {
                    setActiveModule('speaking');
                  }
                }}
                className="mt-6 w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-rose-600/20"
              >
                <span>Launch Speaking Studio</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>

          {/* Complete 1-19 Books Browser Grid */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-500" />
              <span>Complete Cambridge Academic Catalog (Books 1 - 19)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredBooks.map((book) => {
                const isSelected = selectedBook === book.bookNumber;
                return (
                  <div
                    key={book.bookNumber}
                    onClick={() => setSelectedBook(book.bookNumber)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-red-950/30 border-red-500 shadow-lg shadow-red-900/20'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-red-400">BOOK {book.bookNumber}</span>
                        <span className="text-[11px] text-slate-400">{book.year}</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-white mt-1">{book.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{book.highlight}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">4 Academic Tests</span>
                      <span className="text-red-400 font-bold flex items-center gap-1">
                        Select <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Listening Test Interactive Practice Mode */}
      {activeModule === 'listening' && (
        <div className="space-y-6">
          {activeTest.listeningSections.map((sec) => (
            <div key={sec.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                    Listening Section {sec.sectionNumber}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{sec.title}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handlePlayTts(sec.audioTranscript)}
                    disabled={isGeneratingTts}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isGeneratingTts ? 'Synthesizing Audio...' : 'Play Audio with TTS'}</span>
                  </button>
                </div>
              </div>

              {/* TTS Audio Player */}
              {ttsAudioUrl && (
                <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-800/40 flex items-center gap-4">
                  <Volume2 className="w-5 h-5 text-sky-400 flex-shrink-0" />
                  <audio controls autoPlay src={ttsAudioUrl} className="w-full h-8" />
                </div>
              )}

              {/* Audio Prompt Context */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-white block mb-1">Context Scenario:</span>
                {sec.audioPrompt}
              </div>

              {/* Question Items */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-200">Questions:</h4>
                {sec.questions.map((q) => {
                  const isCorrect = (userAnswers[q.id] || '').trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                  return (
                    <div key={q.id} className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-xs font-bold text-sky-400 bg-sky-950 px-2 py-1 rounded-md">
                          Q{q.questionNumber}
                        </span>
                        <p className="text-sm text-slate-200 flex-1 font-medium">{q.question}</p>
                      </div>

                      {/* Multiple choice vs Fill blank */}
                      {q.type === 'multiple-choice' && q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt) => (
                            <label
                              key={opt}
                              className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                                userAnswers[q.id] === opt
                                  ? 'bg-sky-900/40 border-sky-500 text-white'
                                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${q.id}`}
                                value={opt}
                                checked={userAnswers[q.id] === opt}
                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                className="text-sky-500 focus:ring-0"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {q.type === 'fill-blank' && (
                        <div className="pt-1">
                          <input
                            type="text"
                            placeholder="Type your answer here..."
                            value={userAnswers[q.id] || ''}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            className="w-full sm:w-72 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                          />
                        </div>
                      )}

                      {/* Submitted feedback */}
                      {isSubmitted && (
                        <div
                          className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                            isCorrect
                              ? 'bg-emerald-950/40 border border-emerald-800/50 text-emerald-300'
                              : 'bg-rose-950/40 border border-rose-800/50 text-rose-300'
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                          )}
                          <div>
                            <p className="font-bold">
                              {isCorrect ? 'Correct!' : `Correct Answer: ${q.correctAnswer}`}
                            </p>
                            <p className="text-slate-300 mt-0.5">{q.explanation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submission Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleSubmitSection(sec.questions, 'listening')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 cursor-pointer"
                >
                  Submit & Calculate IELTS Band Score
                </button>

                {isSubmitted && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">Score:</span>
                    <span className="text-sm font-black text-sky-400 px-3 py-1 rounded-lg bg-sky-950 border border-sky-800">
                      Band {calculateResults(sec.questions, 'listening').bandScore.toFixed(1)}
                    </span>
                    <button
                      onClick={resetSection}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                      title="Reset Section"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reading Test Interactive Practice Mode */}
      {activeModule === 'reading' && (
        <div className="space-y-6">
          {activeTest.readingPassages.map((passage) => (
            <div key={passage.id} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Passage Text Column */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl max-h-[750px] overflow-y-auto pr-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 sticky top-0 bg-slate-900">
                  <h3 className="font-extrabold text-base text-white">{passage.title}</h3>
                  <span className="text-xs text-slate-400 font-semibold">{passage.wordCount} words</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4 whitespace-pre-line font-serif">
                  {passage.text}
                </div>
              </div>

              {/* Questions Column */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="font-extrabold text-sm text-white">Questions & Tasks</h4>
                  <span className="text-xs text-emerald-400 font-bold">Academic Assessment</span>
                </div>

                <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2">
                  {passage.questions.map((q) => {
                    const isCorrect = (userAnswers[q.id] || '').trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                    return (
                      <div key={q.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-1 rounded-md">
                            Q{q.questionNumber}
                          </span>
                          <p className="text-xs sm:text-sm text-slate-200 flex-1 font-medium">{q.question}</p>
                        </div>

                        {q.type === 'true-false-not-given' && (
                          <div className="flex items-center gap-2 pt-1">
                            {['TRUE', 'FALSE', 'NOT GIVEN'].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handleAnswerChange(q.id, opt)}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                                  userAnswers[q.id] === opt
                                    ? 'bg-emerald-600 text-white border-emerald-500'
                                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}

                        {q.type === 'multiple-choice' && q.options && (
                          <div className="space-y-1.5 pt-1">
                            {q.options.map((opt) => (
                              <label
                                key={opt}
                                className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                                  userAnswers[q.id] === opt
                                    ? 'bg-emerald-950/40 border-emerald-500 text-white'
                                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${q.id}`}
                                  value={opt}
                                  checked={userAnswers[q.id] === opt}
                                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                  className="text-emerald-500 focus:ring-0"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {q.type === 'fill-blank' && (
                          <div className="pt-1">
                            <input
                              type="text"
                              placeholder="Type your exact word answer..."
                              value={userAnswers[q.id] || ''}
                              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        )}

                        {isSubmitted && (
                          <div
                            className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                              isCorrect
                                ? 'bg-emerald-950/40 border border-emerald-800/50 text-emerald-300'
                                : 'bg-rose-950/40 border border-rose-800/50 text-rose-300'
                            }`}
                          >
                            {isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                            )}
                            <div>
                              <p className="font-bold">
                                {isCorrect ? 'Correct!' : `Correct Answer: ${q.correctAnswer}`}
                              </p>
                              <p className="text-slate-300 mt-0.5">{q.explanation}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => handleSubmitSection(passage.questions, 'reading')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 cursor-pointer"
                  >
                    Submit Reading Answers
                  </button>

                  {isSubmitted && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Score:</span>
                      <span className="text-sm font-black text-emerald-400 px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-800">
                        Band {calculateResults(passage.questions, 'reading').bandScore.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
