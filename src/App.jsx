import { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';

export default function App() {
  const [role, setRole] = useState(null); 
  const [quizzes, setQuizzes] = useState([]);
  
  useEffect(() => {
    const fetchQuizzes = async () => {
      const querySnapshot = await getDocs(collection(db, "quizzes"));
      const quizData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuizzes(quizData);
    };
    if (role === 'student') fetchQuizzes();
  }, [role]);

  if (!role) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 space-y-8 p-4">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-sm">
            Elevate Exams
          </h1>
          <p className="text-slate-400 text-lg">Next-Generation Online Assessment Platform</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 mt-8">
          <button onClick={() => setRole('teacher_auth')} className="group relative px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/10 shadow-xl hover:-translate-y-1 w-64">
            <div className="text-2xl font-bold mb-1">Teacher Portal</div>
            <div className="text-sm text-slate-400 group-hover:text-slate-300">Create & Manage</div>
          </button>
          <button onClick={() => setRole('student')} className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-xl shadow-blue-900/50 hover:-translate-y-1 w-64">
            <div className="text-2xl font-bold mb-1">Student Portal</div>
            <div className="text-sm text-blue-100 group-hover:text-white">Take Assessments</div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-6xl mx-auto p-6">
        <button onClick={() => setRole(null)} className="mb-6 flex items-center text-slate-500 hover:text-slate-900 font-medium transition-colors">
          <span className="mr-2">←</span> Back to Home
        </button>
        {role === 'teacher_auth' && <TeacherAuth onLogin={() => setRole('teacher')} />}
        {role === 'teacher' && <TeacherDashboard />}
        {role === 'student' && <StudentPortal quizzes={quizzes} />}
      </div>
    </div>
  );
}

function TeacherAuth({ onLogin }) {
  const [id, setId] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (id === 'TEACHER123') {
      onLogin();
    } else {
      alert('Invalid Unique ID.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔒</div>
        <h2 className="text-2xl font-bold text-slate-800">Teacher Verification</h2>
        <p className="text-slate-500 text-sm mt-1">Please enter your secure access code</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <input 
            type="password" placeholder="Enter Unique ID" required 
            value={id} onChange={(e) => setId(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <button type="submit" className="w-full bg-slate-900 text-white p-4 rounded-xl hover:bg-slate-800 font-bold shadow-lg shadow-slate-200 transition-all active:scale-[0.98]">
          Authenticate
        </button>
      </form>
    </div>
  );
}

function TeacherDashboard() {
  const [view, setView] = useState('create'); 

  return (
    <div className="max-w-5xl mx-auto animation-fade-in">
      <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 inline-flex">
        <button onClick={() => setView('create')} className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${view === 'create' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Create Assessment</button>
        <button onClick={() => setView('manage')} className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${view === 'manage' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Manage Assessments</button>
        <button onClick={() => setView('results')} className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${view === 'results' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Performance Analytics</button>
      </div>
      {view === 'create' && <CreateQuiz />}
      {view === 'manage' && <ManageQuizzes />}
      {view === 'results' && <ViewResults />}
    </div>
  );
}

function CreateQuiz() {
  const [title, setTitle] = useState('');
  const [timeLimit, setTimeLimit] = useState(10); 
  const [questions, setQuestions] = useState([]);
  
  const [currentQ, setCurrentQ] = useState('');
  const [options, setOptions] = useState({ opt1: '', opt2: '', opt3: '', opt4: '' });
  const [correctOpt, setCorrectOpt] = useState('');

  const addQuestion = () => {
    if (!currentQ || !options.opt1 || !options.opt2 || !options.opt3 || !options.opt4 || !correctOpt) {
      return alert("Please fill all fields and select the correct answer.");
    }
    setQuestions([...questions, {
      q: currentQ,
      options: [options.opt1, options.opt2, options.opt3, options.opt4],
      answer: correctOpt
    }]);
    setCurrentQ(''); setOptions({ opt1: '', opt2: '', opt3: '', opt4: '' }); setCorrectOpt('');
  };

  const publishQuiz = async (e) => {
    e.preventDefault();
    if (questions.length === 0) return alert("Add at least one question first!");
    
    try {
      // isActive is true by default so students can see it immediately
      await addDoc(collection(db, "quizzes"), { title, questions, timeLimit: timeLimit * 60, isActive: true });
      alert("Quiz Published Successfully!");
      setTitle(''); setTimeLimit(10); setQuestions([]);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 grid md:grid-cols-2 gap-10">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center"><span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3">1</span> Assessment Details</h2>
          <div className="space-y-4">
            <input type="text" placeholder="Assessment Title" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 outline-none" />
            <div>
              <label className="block text-sm font-semibold text-slate-500 mb-2">Time Limit (Minutes)</label>
              <input type="number" required value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <h3 className="font-bold text-blue-900 mb-2">Ready to Deploy?</h3>
          <p className="text-sm text-blue-700 mb-4">Total Questions Added: <span className="font-bold text-lg">{questions.length}</span></p>
          <button onClick={publishQuiz} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            Publish Assessment
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center"><span className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3">2</span> Question Builder</h2>
        <div className="bg-slate-50 p-6 border border-slate-200 rounded-2xl space-y-4">
          <textarea placeholder="Type your question here..." value={currentQ} onChange={(e) => setCurrentQ(e.target.value)} className="w-full p-4 border border-slate-200 rounded-xl outline-none resize-none h-24 focus:ring-2" />
          
          <div className="grid grid-cols-2 gap-3">
            {['opt1', 'opt2', 'opt3', 'opt4'].map((opt, idx) => (
              <input key={opt} type="text" placeholder={`Option ${idx + 1}`} value={options[opt]} onChange={(e) => setOptions({...options, [opt]: e.target.value})} className="p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 text-sm" />
            ))}
          </div>

          <select value={correctOpt} onChange={(e) => setCorrectOpt(e.target.value)} className="w-full p-4 border border-slate-200 rounded-xl outline-none font-semibold text-slate-700 bg-white">
            <option value="">-- Select Correct Answer --</option>
            {Object.values(options).map((opt, i) => opt && <option key={i} value={opt}>{opt}</option>)}
          </select>
          
          <button onClick={addQuestion} className="w-full bg-slate-800 text-white p-4 rounded-xl font-bold hover:bg-slate-900 transition-colors">
            + Add Question
          </button>
        </div>
      </div>
    </div>
  );
}

function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);

  const fetchQuizzes = async () => {
    const querySnapshot = await getDocs(collection(db, "quizzes"));
    const quizData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setQuizzes(quizData);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const toggleStatus = async (quizId, currentStatus) => {
    try {
      const quizRef = doc(db, "quizzes", quizId);
      await updateDoc(quizRef, { isActive: !currentStatus });
      fetchQuizzes(); // Refresh the list
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
      <h2 className="text-2xl font-bold mb-6">Manage Assessments</h2>
      {quizzes.length === 0 ? <p className="text-slate-500">No assessments created yet.</p> : (
        <div className="space-y-4">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="flex justify-between items-center p-4 border border-slate-200 rounded-2xl bg-slate-50">
              <div>
                <h4 className="text-xl font-bold text-slate-800">{quiz.title}</h4>
                <div className="flex items-center space-x-3 mt-1 text-sm font-semibold">
                  <span className="text-slate-500">{quiz.questions?.length} Questions</span>
                  <span className={`px-2 py-1 rounded-md ${quiz.isActive !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    Status: {quiz.isActive !== false ? 'Live (Released)' : 'Closed'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => toggleStatus(quiz.id, quiz.isActive !== false)}
                className={`px-6 py-3 rounded-xl font-bold transition-all text-white shadow-md ${quiz.isActive !== false ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                {quiz.isActive !== false ? 'Close Assessment' : 'Release Assessment'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ViewResults() {
  const [groupedResults, setGroupedResults] = useState({});

  useEffect(() => {
    const fetchResults = async () => {
      const snap = await getDocs(collection(db, "results"));
      const data = snap.docs.map(doc => doc.data());
      
      const grouped = data.reduce((acc, curr) => {
        if (!acc[curr.quizTitle]) acc[curr.quizTitle] = [];
        acc[curr.quizTitle].push(curr);
        return acc;
      }, {});
      setGroupedResults(grouped);
    };
    fetchResults();
  }, []);

  return (
    <div className="space-y-8">
      {Object.keys(groupedResults).length === 0 ? (
        <div className="text-center bg-white p-10 rounded-3xl border border-slate-100 text-slate-500">No student results found yet.</div>
      ) : (
        Object.entries(groupedResults).map(([title, results], idx) => (
          <div key={idx} className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 text-white p-6">
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-slate-400 text-sm mt-1">Total Attempts: {results.length}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-sm font-semibold text-slate-500">
                    <th className="p-4 pl-6">Roll No</th>
                    <th className="p-4">Student Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Date Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((res, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6 font-mono text-slate-600">{res.rollNo}</td>
                      <td className="p-4 font-semibold text-slate-800">{res.name}</td>
                      <td className="p-4 text-slate-500">{res.studentEmail}</td>
                      <td className="p-4 font-bold text-blue-600 bg-blue-50/50 rounded-r-lg my-1 inline-block px-3 py-1 mt-3 ml-2">{res.score} / {res.total}</td>
                      <td className="p-4 text-sm text-slate-400">{new Date(res.timestamp).toLocaleDateString()} {new Date(res.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function StudentPortal({ quizzes }) {
  const [student, setStudent] = useState({ name: '', rollNo: '', email: '' });
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [score, setScore] = useState(null);

  const handleRegister = (e) => {
    e.preventDefault();
    if (student.name && student.rollNo && student.email.includes('@')) {
      setIsRegistered(true);
    }
  };

  const startQuiz = async (quiz) => {
    const q = query(collection(db, "results"), where("quizId", "==", quiz.id));
    const snapshot = await getDocs(q);
    
    const alreadyTaken = snapshot.docs.some(doc => {
      const data = doc.data();
      return data.studentEmail === student.email || data.rollNo === student.rollNo;
    });
    
    if (alreadyTaken) {
      return alert('Access Denied: Our records show you have already attempted this exam. Multiple attempts are not permitted.');
    }
    
    setActiveQuiz(quiz);
  };

  if (score !== null) {
    return (
      <div className="max-w-xl mx-auto text-center mt-20 bg-white p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Assessment Completed</h2>
        <p className="text-slate-500 mb-6">Your responses have been recorded successfully.</p>
        <div className="text-5xl font-extrabold text-blue-600 mb-8 bg-blue-50 inline-block px-8 py-4 rounded-2xl">{score}</div>
        <br/>
        <button onClick={() => {setScore(null); setActiveQuiz(null);}} className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">Return to Dashboard</button>
      </div>
    );
  }

  if (activeQuiz) {
    return <ActiveQuiz quiz={activeQuiz} student={student} onSubmit={setScore} />;
  }

  // Filter so students only see Active quizzes
  const activeQuizzes = quizzes.filter(q => q.isActive !== false);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {!isRegistered ? (
        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-2">Student Identity</h2>
          <p className="text-slate-500 mb-6">Please enter your details to access assessments.</p>
          <form onSubmit={handleRegister} className="space-y-4">
            <input type="text" placeholder="Full Name" required value={student.name} onChange={(e) => setStudent({...student, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2" />
            <input type="text" placeholder="Roll Number" required value={student.rollNo} onChange={(e) => setStudent({...student, rollNo: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2" />
            <input type="email" placeholder="Email Address" required value={student.email} onChange={(e) => setStudent({...student, email: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2" />
            <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mt-4">Save & Continue</button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Available Assessments</h2>
            <p className="text-slate-500 mt-1">Logged in as <span className="font-bold text-slate-700">{student.name}</span> ({student.rollNo})</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {activeQuizzes.length === 0 ? <p className="text-slate-500">No assessments scheduled at this time.</p> : null}
            {activeQuizzes.map(quiz => (
              <div key={quiz.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">{quiz.title}</h4>
                  <div className="flex space-x-4 text-sm font-semibold text-slate-500 mb-6">
                    <span className="bg-slate-100 px-3 py-1 rounded-lg">{quiz.questions?.length} Questions</span>
                    <span className="bg-slate-100 px-3 py-1 rounded-lg">{quiz.timeLimit / 60} Minutes</span>
                  </div>
                </div>
                <button onClick={() => startQuiz(quiz)} className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">Start Assessment</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ActiveQuiz({ quiz, student, onSubmit }) {
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit);
  const [answers, setAnswers] = useState({});
  const answersRef = useRef({});

  // Keeps answers ref strictly updated for the anti-cheat listener
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const handleFinish = async () => {
    let score = 0;
    const currentAnswers = answersRef.current;
    
    quiz.questions.forEach((q, index) => {
      if (currentAnswers[index] === q.answer) score++;
    });

    try {
      await addDoc(collection(db, "results"), {
        quizId: quiz.id,
        quizTitle: quiz.title,
        name: student.name,
        rollNo: student.rollNo,
        studentEmail: student.email,
        score: score,
        total: quiz.questions.length,
        timestamp: new Date().toISOString()
      });
      onSubmit(`${score} / ${quiz.questions.length}`);
    } catch (err) {
      alert("Error saving results: " + err.message);
    }
  };

  // Timer Effect
  useEffect(() => {
    if (timeLeft <= 0) return handleFinish();
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Anti-Cheat: Tab Visibility Listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        alert("SECURITY WARNING: You switched tabs or minimized the window. Your exam has been instantly submitted.");
        handleFinish();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
      <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-200 text-sm font-semibold">
        ⚠️ Warning: Do not switch tabs or minimize this window. Doing so will instantly auto-submit your exam.
      </div>
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 border-b border-slate-100 pb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{quiz.title}</h2>
          <p className="text-slate-500 text-sm mt-1">Candidate: {student.name} • Roll: {student.rollNo}</p>
        </div>
        <div className="flex items-center space-x-3 bg-red-50 text-red-600 px-5 py-3 rounded-2xl border border-red-100">
          <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span className="font-bold text-xl tracking-wider">{formatTime(timeLeft)}</span>
        </div>
      </div>
      
      <div className="space-y-8">
        {quiz.questions.map((q, index) => (
          <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-lg text-slate-800 mb-5 flex items-start">
              <span className="bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded mr-3 text-sm">{index + 1}</span> 
              {q.q}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map(option => {
                const isSelected = answers[index] === option;
                return (
                  <label key={option} className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center ${isSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:border-blue-300'}`}>
                    <input 
                      type="radio" name={`q-${index}`} value={option}
                      onChange={() => setAnswers({...answers, [index]: option})}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 mr-3"
                    />
                    <span className={`font-medium ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>{option}</span>
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 pt-6 border-t border-slate-100">
        <button onClick={handleFinish} className="w-full bg-blue-600 text-white p-5 rounded-2xl font-bold text-xl hover:bg-blue-700 transition-colors shadow-xl shadow-blue-200 active:scale-[0.98]">
          Submit Final Answers
        </button>
      </div>
    </div>
  );
}