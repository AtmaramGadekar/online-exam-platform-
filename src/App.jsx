import { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export default function App() {
  const [role, setRole] = useState(null); 
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  
  const fetchAnnouncements = async () => {
    const snap = await getDocs(collection(db, "announcements"));
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort newest first
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setAnnouncements(data);
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      const querySnapshot = await getDocs(collection(db, "quizzes"));
      const quizData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuizzes(quizData);
    };
    
    fetchAnnouncements();
    if (role === 'student') fetchQuizzes();
  }, [role]);

  // --- REIMAGINED CLASSY LANDING PAGE ---
  if (!role) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans relative overflow-hidden selection:bg-blue-200">
        
        {/* Subtle Background Accents */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-300/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-300/20 rounded-full blur-[120px] pointer-events-none"></div>

        <main className="flex-grow flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-5xl mx-auto py-20">
          
          {/* Header Section */}
          <div className="text-center space-y-6 mb-16 animation-fade-in w-full">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-blue-100 bg-white/60 backdrop-blur-md text-blue-700 text-sm font-bold tracking-wide shadow-sm">
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              Empowering Academic Excellence
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm">
              Elevate Exams
            </h1>
            
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              Experience the next generation of academic assessment. Secure, real-time.
            </p>
          </div>
          
          {/* Role Selection Cards (Beautiful & Classy) */}
          <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mb-16 z-20">
            <button onClick={() => setRole('teacher_auth')} className="group relative overflow-hidden p-10 bg-white text-left rounded-[2.5rem] transition-all duration-500 border border-slate-100 hover:border-blue-200 hover:-translate-y-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)]">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              </div>
              <h2 className="text-3xl font-extrabold mb-3 text-slate-800 group-hover:text-blue-600 transition-colors">Educator Portal</h2>
              <p className="text-slate-500 font-medium leading-relaxed">Create assessments, manage cohorts, and review deep analytics securely.</p>
            </button>

            <button onClick={() => setRole('student')} className="group relative overflow-hidden p-10 bg-white text-left rounded-[2.5rem] transition-all duration-500 border border-slate-100 hover:border-emerald-200 hover:-translate-y-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)]">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-inner">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6"></path></svg>
              </div>
              <h2 className="text-3xl font-extrabold mb-3 text-slate-800 group-hover:text-emerald-600 transition-colors">Student Portal</h2>
              <p className="text-slate-500 font-medium leading-relaxed">Access your active examinations and submit responses in real-time.</p>
            </button>
          </div>

          {/* Announcements Section (Moved Below Cards) */}
          {announcements.length > 0 && (
            <div className="w-full max-w-4xl bg-white border border-slate-100 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden z-20">
              <div className="absolute top-0 left-0 w-2 h-full bg-amber-400"></div>
              <h3 className="text-slate-800 font-extrabold flex items-center mb-6 text-xl pl-4">
                <svg className="w-6 h-6 mr-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                Campus Announcements
              </h3>
              <div className="grid gap-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar pl-4">
                {announcements.map((ann) => (
                  <div key={ann.id} className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <p className="text-slate-700 text-base leading-relaxed font-medium whitespace-pre-wrap">{ann.text}</p>
                    <p className="text-xs text-slate-400 mt-3 font-mono font-bold tracking-wide">{new Date(ann.date).toLocaleDateString()} • {ann.author}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </main>
        <Footer />
      </div>
    );
  }

  // --- INTERNAL PAGES ---
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-blue-200">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-400"></div>
            <span className="font-extrabold text-xl tracking-tight text-slate-800">Elevate<span className="text-blue-600">Exams</span></span>
          </div>
          <button onClick={() => setRole(null)} className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-grow p-6 py-12 max-w-7xl mx-auto w-full relative z-10">
        {role === 'teacher_auth' && <TeacherAuth onLogin={(info) => { setTeacherInfo(info); setRole('teacher'); }} />}
        {role === 'teacher' && <TeacherDashboard teacherInfo={teacherInfo} />}
        {role === 'student' && <StudentPortal quizzes={quizzes} />}
      </main>
      
      <Footer />
    </div>
  );
}

// --- SHARED FOOTER ---
function Footer() {
  return (
    <footer className="py-8 text-center border-t border-slate-200/50 bg-white/50 backdrop-blur-sm z-20 relative">
      <p className="text-sm font-semibold text-slate-600 mb-1">
        All rights reserved by <span className="font-bold text-blue-600">Amit Gadekar</span>
      </p>
      <p className="text-xs text-slate-500 font-mono font-medium">
        Email: amitgadekar45@gmail.com
      </p>
    </footer>
  );
}

// --- TEACHER COMPONENTS ---
function TeacherAuth({ onLogin }) {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (id === 'TEACHER123' && email.includes('@')) {
      onLogin({ id, email });
    } else {
      alert('Invalid Unique ID or missing email.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-10 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Educator Login</h2>
        <p className="text-slate-500 mt-2 font-medium">Verify your credentials to continue</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Official Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-700 shadow-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Unique Access ID</label>
          <input type="password" required value={id} onChange={(e) => setId(e.target.value)}
            className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-700 shadow-sm" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 hover:shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] font-bold text-lg transition-all active:scale-[0.98] mt-4">
          Secure Login
        </button>
      </form>
    </div>
  );
}

function TeacherDashboard({ teacherInfo }) {
  const [view, setView] = useState('create'); 

  const navs = [
    { id: 'create', label: 'Create Assessment', icon: 'M12 4v16m8-8H4' },
    { id: 'manage', label: 'Manage Active', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'results', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'announce', label: 'Announcements', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' }
  ];

  return (
    <div className="w-full animation-fade-in">
      <div className="flex flex-wrap gap-3 mb-10 bg-white p-3 rounded-3xl shadow-sm border border-slate-200/60 mx-auto w-fit">
        {navs.map(n => (
          <button key={n.id} onClick={() => setView(n.id)} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${view === n.id ? 'bg-blue-600 text-white shadow-md scale-105' : 'text-slate-500 hover:bg-slate-100'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={n.icon}></path></svg>
            {n.label}
          </button>
        ))}
      </div>
      
      <div className="transition-all duration-500">
        {view === 'create' && <CreateQuiz teacherInfo={teacherInfo} />}
        {view === 'manage' && <ManageQuizzes />}
        {view === 'results' && <ViewResults />}
        {view === 'announce' && <ManageAnnouncements teacherInfo={teacherInfo} />}
      </div>
    </div>
  );
}

function ManageAnnouncements({ teacherInfo }) {
  const [text, setText] = useState('');
  const [announcements, setAnnouncements] = useState([]);

  const loadAnnouncements = async () => {
    const snap = await getDocs(collection(db, "announcements"));
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setAnnouncements(data);
  };

  useEffect(() => { loadAnnouncements(); }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await addDoc(collection(db, "announcements"), {
        text,
        author: teacherInfo.email,
        date: new Date().toISOString()
      });
      setText('');
      loadAnnouncements();
    } catch (err) { alert("Error: " + err.message); }
  };

  const deleteAnnouncement = async (id) => {
    if(window.confirm("Delete this announcement globally?")) {
      await deleteDoc(doc(db, "announcements", id));
      loadAnnouncements();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-3">
          <span className="bg-amber-100 text-amber-600 p-2 rounded-xl"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg></span>
          Post Global Announcement
        </h2>
        <form onSubmit={handlePost} className="space-y-4">
          <textarea required value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message to display on the public landing page..." className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white resize-none h-32 transition-all font-medium"></textarea>
          <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]">Broadcast Message</button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold mb-6">Active Broadcasts</h3>
        {announcements.length === 0 ? <p className="text-slate-400 italic font-medium">No active announcements.</p> : (
          <div className="space-y-4">
            {announcements.map(ann => (
              <div key={ann.id} className="p-5 border border-slate-200 rounded-2xl bg-slate-50 flex justify-between items-start gap-4 hover:shadow-md transition-shadow">
                <div>
                  <p className="text-slate-800 font-semibold whitespace-pre-wrap">{ann.text}</p>
                  <p className="text-xs text-slate-500 mt-3 font-mono font-bold">{new Date(ann.date).toLocaleString()} • {ann.author}</p>
                </div>
                <button onClick={() => deleteAnnouncement(ann.id)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CreateQuiz({ teacherInfo }) {
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
    setQuestions([...questions, { q: currentQ, options: [options.opt1, options.opt2, options.opt3, options.opt4], answer: correctOpt }]);
    setCurrentQ(''); setOptions({ opt1: '', opt2: '', opt3: '', opt4: '' }); setCorrectOpt('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          setQuestions([...questions, ...parsed]);
          alert(`${parsed.length} questions imported successfully!`);
        } else alert("Invalid file structure.");
      } catch (err) { alert("Failed to parse JSON file."); }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const publishQuiz = async (e) => {
    e.preventDefault();
    if (questions.length === 0) return alert("Add at least one question first!");
    try {
      await addDoc(collection(db, "quizzes"), { title, questions, timeLimit: timeLimit * 60, isActive: true, teacherEmail: teacherInfo.email });
      alert("Assessment Published Successfully!");
      setTitle(''); setTimeLimit(10); setQuestions([]);
    } catch (err) { alert("Error: " + err.message); }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 grid xl:grid-cols-2 gap-12">
        
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-extrabold mb-6 flex items-center text-slate-800 tracking-tight">
              <span className="bg-blue-100 text-blue-600 w-10 h-10 rounded-2xl flex items-center justify-center mr-4 shadow-inner">1</span> 
              Core Details
            </h2>
            <div className="space-y-5">
              <input type="text" placeholder="Assessment Title" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-semibold text-lg transition-all text-slate-800" />
              <div className="p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl">
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Time Limit (Minutes)</label>
                <input type="number" required value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} className="w-full bg-transparent outline-none font-bold text-2xl text-slate-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 rounded-3xl border border-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-blue-800"><svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path></svg></div>
            <h3 className="font-extrabold text-blue-900 text-xl mb-1 relative z-10">Ready to Deploy?</h3>
            <p className="text-sm font-medium text-blue-600/80 mb-6 relative z-10">Total Questions: <span className="font-black text-2xl text-blue-600 ml-1">{questions.length}</span></p>
            <button onClick={publishQuiz} className="w-full bg-blue-600 text-white p-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.98] relative z-10">
              Publish Assessment Now
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold flex items-center text-slate-800 tracking-tight">
              <span className="bg-emerald-100 text-emerald-600 w-10 h-10 rounded-2xl flex items-center justify-center mr-4 shadow-inner">2</span> 
              Builder
            </h2>
            <label className="cursor-pointer bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              Upload JSON
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          <div className="bg-slate-50 p-6 md:p-8 border border-slate-200 rounded-[2rem] space-y-5">
            <textarea placeholder="Type your question here..." value={currentQ} onChange={(e) => setCurrentQ(e.target.value)} className="w-full p-5 bg-white border border-slate-200 rounded-2xl outline-none resize-none h-32 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700 font-semibold" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['opt1', 'opt2', 'opt3', 'opt4'].map((opt, idx) => (
                <input key={opt} type="text" placeholder={`Option ${idx + 1}`} value={options[opt]} onChange={(e) => setOptions({...options, [opt]: e.target.value})} className="p-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all text-sm font-semibold text-slate-700" />
              ))}
            </div>
            <select value={correctOpt} onChange={(e) => setCorrectOpt(e.target.value)} className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none font-bold text-blue-700 focus:border-blue-500 transition-all cursor-pointer">
              <option value="">-- Assign Correct Answer --</option>
              {Object.values(options).map((opt, i) => opt && <option key={i} value={opt}>{opt}</option>)}
            </select>
            <button onClick={addQuestion} className="w-full bg-slate-800 text-white p-4 rounded-xl font-bold hover:bg-slate-900 transition-colors shadow-md">
              + Append to Exam
            </button>
          </div>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h2 className="text-2xl font-extrabold mb-8 text-slate-800">Verification Feed</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {questions.map((q, i) => (
              <div key={i} className="flex flex-col sm:flex-row justify-between items-start bg-slate-50 p-6 rounded-2xl border border-slate-200 gap-4 group hover:border-blue-300 transition-colors">
                <div className="w-full">
                  <p className="font-bold text-slate-800 mb-4 text-lg"><span className="text-blue-500 mr-2">{i + 1}.</span>{q.q}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className={`text-sm px-3 py-2 rounded-lg border font-semibold truncate ${opt === q.answer ? 'bg-emerald-100 border-emerald-300 text-emerald-800 shadow-sm' : 'bg-white border-slate-200 text-slate-500'}`}>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => removeQuestion(i)} className="text-slate-400 hover:text-red-600 bg-white hover:bg-red-50 p-3 rounded-xl border border-slate-200 hover:border-red-200 transition-all w-full sm:w-auto shrink-0 flex justify-center shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const fetchQuizzes = async () => {
    const snap = await getDocs(collection(db, "quizzes"));
    setQuizzes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };
  useEffect(() => { fetchQuizzes(); }, []);

  const toggleStatus = async (quizId, currentStatus) => {
    await updateDoc(doc(db, "quizzes", quizId), { isActive: !currentStatus });
    fetchQuizzes(); 
  };
  const deleteQuiz = async (quizId) => {
    if (window.confirm("Permanently delete this assessment?")) {
      await deleteDoc(doc(db, "quizzes", quizId));
      fetchQuizzes();
    }
  };

  return (
    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 max-w-5xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-8 text-slate-800">Exam Lifecycle</h2>
      <div className="space-y-5">
        {quizzes.map(quiz => (
          <div key={quiz.id} className="flex flex-col md:flex-row justify-between items-center p-6 border-2 border-slate-100 rounded-3xl bg-slate-50/50 hover:bg-white hover:border-slate-200 transition-all gap-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="w-full">
              <h4 className="text-2xl font-bold text-slate-800 mb-2">{quiz.title}</h4>
              <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
                <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>{quiz.questions?.length} Items</span>
                <span className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${quiz.isActive !== false ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  <span className={`w-2 h-2 rounded-full ${quiz.isActive !== false ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                  {quiz.isActive !== false ? 'Live' : 'Closed'}
                </span>
              </div>
            </div>
            <div className="flex space-x-3 w-full md:w-auto">
              <button onClick={() => toggleStatus(quiz.id, quiz.isActive !== false)} className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold transition-all text-white shadow-sm ${quiz.isActive !== false ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                {quiz.isActive !== false ? 'Halt Exam' : 'Go Live'}
              </button>
              <button onClick={() => deleteQuiz(quiz.id)} className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold transition-all bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ViewResults() {
  const [groupedResults, setGroupedResults] = useState({});
  const [selectedQuiz, setSelectedQuiz] = useState('ALL');

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

  const quizTitles = Object.keys(groupedResults);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">Performance Intelligence</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Select an assessment module to view localized telemetry.</p>
        </div>
        <select value={selectedQuiz} onChange={(e) => setSelectedQuiz(e.target.value)} className="w-full sm:w-80 p-4 border-2 border-slate-100 rounded-2xl outline-none font-bold text-slate-700 bg-slate-50 focus:border-blue-500 cursor-pointer transition-all shadow-sm">
          <option value="ALL">Global View (All Exams)</option>
          {quizTitles.map((title, i) => <option key={i} value={title}>{title}</option>)}
        </select>
      </div>

      {quizTitles.filter(t => selectedQuiz === 'ALL' || t === selectedQuiz).map((title, idx) => (
        <div key={idx} className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 text-white p-8 flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight">{title}</h3>
              <p className="text-blue-300 font-bold mt-1 font-mono text-sm">Total Submissions: {groupedResults[title].length}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-widest font-extrabold text-slate-500">
                  <th className="p-5 pl-8">Identity</th>
                  <th className="p-5">Scorecard</th>
                  <th className="p-5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {groupedResults[title].map((res, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-5 pl-8">
                      <p className="font-extrabold text-slate-800 text-lg">{res.name}</p>
                      <p className="text-sm text-slate-500 font-mono mt-0.5 font-medium">{res.rollNo} • {res.studentEmail}</p>
                    </td>
                    <td className="p-5">
                      <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-xl font-black text-lg shadow-sm">
                        {res.score} <span className="text-blue-400 text-sm font-bold">/ {res.total}</span>
                      </div>
                    </td>
                    <td className="p-5 text-sm font-bold text-slate-400">
                      {new Date(res.timestamp).toLocaleString([], {month:'short', day:'numeric', hour: '2-digit', minute:'2-digit'})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- STUDENT COMPONENTS ---
function StudentPortal({ quizzes }) {
  const [student, setStudent] = useState({ name: '', rollNo: '', email: '' });
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [score, setScore] = useState(null);

  const startQuiz = async (quiz) => {
    const q = query(collection(db, "results"), where("quizId", "==", quiz.id));
    const snapshot = await getDocs(q);
    const alreadyTaken = snapshot.docs.some(doc => {
      const data = doc.data();
      return data.studentEmail === student.email || data.rollNo === student.rollNo;
    });
    if (alreadyTaken) return alert('Security Block: You have already attempted this examination.');
    setActiveQuiz(quiz);
  };

  if (score !== null) {
    return (
      <div className="max-w-2xl mx-auto text-center mt-10 bg-white p-16 rounded-[3rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-4 bg-emerald-500"></div>
        <div className="w-28 h-28 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-emerald-100">
          <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">Submission Confirmed</h2>
        <p className="text-slate-500 mb-10 text-lg font-medium">Your responses have been securely encrypted and stored.</p>
        <div className="inline-block p-1.5 bg-slate-100 rounded-[2rem] mb-10 border border-slate-200">
          <div className="bg-white rounded-[1.5rem] px-12 py-6 shadow-sm">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Final Score</p>
            <div className="text-6xl font-black text-blue-600">{score}</div>
          </div>
        </div>
        <br/>
        <button onClick={() => {setScore(null); setActiveQuiz(null);}} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 hover:-translate-y-1 transition-all shadow-lg text-lg">Exit to Dashboard</button>
      </div>
    );
  }

  if (activeQuiz) return <ActiveQuiz quiz={activeQuiz} student={student} onSubmit={setScore} />;

  const activeQuizzes = quizzes.filter(q => q.isActive !== false);

  return (
    <div className="max-w-5xl mx-auto animation-fade-in">
      {!isRegistered ? (
        <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 max-w-xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 mb-6 border border-emerald-100 shadow-inner">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Student Authentication</h2>
            <p className="text-slate-500 mt-2 font-medium">Enter official details to establish your secure session.</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (student.name && student.rollNo && student.email) setIsRegistered(true); }} className="space-y-5">
            <input type="text" placeholder="Full Legal Name" required value={student.name} onChange={(e) => setStudent({...student, name: e.target.value})} className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800 shadow-sm" />
            <input type="text" placeholder="University Roll Number" required value={student.rollNo} onChange={(e) => setStudent({...student, rollNo: e.target.value})} className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800 shadow-sm" />
            <input type="email" placeholder="Student Email Address" required value={student.email} onChange={(e) => setStudent({...student, email: e.target.value})} className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800 shadow-sm" />
            <button type="submit" className="w-full bg-slate-900 text-white p-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 mt-6 active:scale-[0.98]">Enter Dashboard</button>
          </form>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="z-10">
              <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-1">Active Session</p>
              <h2 className="text-3xl font-extrabold">{student.name}</h2>
              <p className="text-slate-300 font-mono mt-2 bg-white/10 border border-white/10 inline-block px-3 py-1 rounded-lg font-medium">ID: {student.rollNo}</p>
            </div>
            <div className="bg-white/10 p-5 rounded-[2rem] border border-white/20 backdrop-blur-sm text-center min-w-[160px] z-10 shadow-inner">
              <p className="text-4xl font-black text-white">{activeQuizzes.length}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300 mt-1">Available Exams</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeQuizzes.map(quiz => (
              <div key={quiz.id} className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)] hover:border-emerald-200 transition-all duration-300 hover:-translate-y-2 flex flex-col group">
                <div className="flex-grow">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 group-hover:bg-emerald-50 transition-colors shadow-inner">
                    <svg className="w-7 h-7 text-slate-400 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                  </div>
                  <h4 className="text-xl font-extrabold text-slate-800 mb-4 leading-tight">{quiz.title}</h4>
                  <div className="space-y-3 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-semibold">Questions</span>
                      <span className="font-extrabold text-slate-700">{quiz.questions?.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-semibold">Duration</span>
                      <span className="font-extrabold text-slate-700">{quiz.timeLimit / 60} Min</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => startQuiz(quiz)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold group-hover:bg-emerald-600 transition-all shadow-md active:scale-[0.98]">
                  Initialize Exam
                </button>
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

  useEffect(() => { answersRef.current = answers; }, [answers]);

  const handleFinish = async () => {
    let score = 0;
    const currentAnswers = answersRef.current;
    quiz.questions.forEach((q, index) => { if (currentAnswers[index] === q.answer) score++; });
    try {
      await addDoc(collection(db, "results"), { quizId: quiz.id, quizTitle: quiz.title, name: student.name, rollNo: student.rollNo, studentEmail: student.email, score: score, total: quiz.questions.length, timestamp: new Date().toISOString() });
      onSubmit(`${score} / ${quiz.questions.length}`);
    } catch (err) { alert("Error saving results."); }
  };

  useEffect(() => {
    if (timeLeft <= 0) return handleFinish();
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        alert("SECURITY WARNING: You switched tabs or minimized the window. Your exam has been instantly auto-submitted.");
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

  const progressPercentage = ((quiz.timeLimit - timeLeft) / quiz.timeLimit) * 100;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden pb-10">
      
      {/* Dynamic Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
        <div className={`h-full transition-all duration-1000 ${timeLeft < 60 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${progressPercentage}%` }}></div>
      </div>

      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-slate-100 p-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">{quiz.title}</h2>
          <p className="text-slate-400 text-sm mt-1 font-bold">{student.name} ({student.rollNo})</p>
        </div>
        <div className={`flex items-center space-x-3 px-6 py-3 rounded-2xl border-2 shadow-sm transition-colors ${timeLeft < 60 ? 'bg-red-50 border-red-100 text-red-600 animate-pulse' : 'bg-slate-900 border-slate-800 text-white'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span className="font-mono font-bold text-2xl tracking-wider">{formatTime(timeLeft)}</span>
        </div>
      </div>
      
      <div className="px-6 md:px-10 mt-8 space-y-10">
        <div className="bg-amber-50 text-amber-800 p-5 rounded-2xl border border-amber-200 text-sm font-bold flex items-start gap-4 shadow-sm">
          <svg className="w-6 h-6 shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          Proctoring Active: Do not minimize this window or open other tabs. Doing so will result in immediate termination of your exam.
        </div>

        {quiz.questions.map((q, index) => (
          <div key={index} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="font-extrabold text-xl text-slate-800 mb-8 leading-relaxed flex items-start">
              <span className="bg-white border border-slate-200 text-slate-600 w-10 h-10 flex items-center justify-center rounded-[1rem] mr-4 shrink-0 shadow-sm">{index + 1}</span> 
              {q.q}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map(option => {
                const isSelected = answers[index] === option;
                return (
                  <label key={option} className={`p-5 border-2 rounded-2xl cursor-pointer transition-all flex items-center group ${isSelected ? 'border-blue-500 bg-blue-50/50 shadow-[0_4px_15px_-3px_rgba(59,130,246,0.2)]' : 'border-slate-200 bg-white hover:border-blue-300'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 shrink-0 transition-colors ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <input type="radio" name={`q-${index}`} value={option} onChange={() => setAnswers({...answers, [index]: option})} className="hidden" />
                    <span className={`font-bold text-lg ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>{option}</span>
                  </label>
                )
              })}
            </div>
          </div>
        ))}
        
        <div className="pt-6">
          <button onClick={handleFinish} className="w-full bg-blue-600 text-white p-6 rounded-[2rem] font-extrabold text-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.98]">
            Finalize & Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
}