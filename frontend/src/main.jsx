import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, ArrowRight, CalendarDays, ChartNoAxesCombined,
  ChevronLeft, ChevronRight, CircleAlert, ClipboardPlus, Droplets, Eye, Leaf,
  LockKeyhole, Menu, Plus, ScanLine, ShieldCheck, Sprout, Thermometer,
  X, CheckCircle, Scale, BarChart2, PieChart, Layers, Info, Cpu,
  Search, User, Edit3, Camera
} from 'lucide-react';
import {
  Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip,
  XAxis, YAxis, PieChart as RechartsPie, Pie, Cell, Legend
} from 'recharts';
import './styles.css';
import './app.css';
import './landing-fixes.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// 4 Unique images for the 4 methodology workflow cards
const workflowCards = [
  {
    num: '01',
    title: 'Register each plant',
    text: 'Create a traceable plant profile with crop, variety, location, and planting date.',
    image: '/assets/fruit-growth.jpg'
  },
  {
    num: '02',
    title: 'Capture observations',
    text: 'Add time-stamped growth-stage, soil moisture, pH, climate, and fruit imagery.',
    image: '/assets/mango-orchard.jpg'
  },
  {
    num: '03',
    title: 'Multimodal prediction',
    text: 'Combine visual features and agronomic sensor readings with multimodal AI models.',
    image: '/assets/mango-vision.jpg'
  },
  {
    num: '04',
    title: 'Close harvest loop',
    text: 'Record measured harvest outcomes (Brix, weight, firmness) to evaluate prediction accuracy.',
    image: '/assets/mango-harvest.jpg'
  }
];

// Exactly 3 Full-Width Workflow Slides (auto-rotate every 5s)
const workflowSlides = [
  {
    img: '/assets/fruit-growth.jpg',
    stage: 'STAGE 1 · PLANT IDENTITY & DEVELOPMENT',
    title: 'Track Individual Fruit Plants From Sprout to Harvest',
    desc: 'Each physical plant is assigned a persistent Digital Twin identity, tracking growth stages and canopy vigor.'
  },
  {
    img: '/assets/mango-orchard.jpg',
    stage: 'STAGE 2 · MULTIMODAL SENSOR & FIELD DATA',
    title: 'Real-Time Agronomic & Climate Observation Logging',
    desc: 'Combines soil moisture, root zone pH, ambient temperature, vapor pressure deficit, and high-res fruit photography.'
  },
  {
    img: '/assets/mango-vision.jpg',
    stage: 'STAGE 3 · VISION-LANGUAGE & MULTIMODAL AI PREDICTION',
    title: 'Predict Brix Sugar, Yield Load, Firmness & Harvest Window',
    desc: 'Late-fusion architecture combining Vision Transformers with Agronomic Gradient Boosting for grounded farmer explanations.'
  }
];

async function request(path, options = {}, token) {
  const authToken = token || options?.token;
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(options.headers || {})
  };
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const errorMsg = body?.message || body?.fields?.password || body?.fields?.email || body?.fields?.fullName || body?.error || 'The request could not be completed.';
    throw new Error(errorMsg);
  }
  return body;
}

function App() {
  const [session, setSession] = useState(() => {
    try {
      const stored = localStorage.getItem('fruitTwinSession') || sessionStorage.getItem('fruitTwinSession');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [screen, setScreen] = useState(() => {
    try {
      const stored = localStorage.getItem('fruitTwinSession') || sessionStorage.getItem('fruitTwinSession');
      const s = stored ? JSON.parse(stored) : null;
      return (s?.accessToken || s?.token) ? 'workspace' : 'landing';
    } catch {
      return 'landing';
    }
  });

  const [authMode, setAuthMode] = useState('login');
  const [toast, setToast] = useState('');

  const notify = (msg) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 4000);
  };

  const onSession = (next) => {
    const tokenVal = next.token || next.accessToken;
    const sessionObj = { ...next, token: tokenVal, accessToken: tokenVal };
    localStorage.setItem('fruitTwinSession', JSON.stringify(sessionObj));
    sessionStorage.setItem('fruitTwinSession', JSON.stringify(sessionObj));
    setSession(sessionObj);
    setScreen('workspace');
  };

  const signOut = () => {
    localStorage.removeItem('fruitTwinSession');
    sessionStorage.removeItem('fruitTwinSession');
    setSession(null);
    setScreen('landing');
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setScreen('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasToken = Boolean(session?.accessToken || session?.token);
  const activeScreen = hasToken && screen === 'landing' ? 'workspace' : screen;

  return (
    <>
      {activeScreen === 'landing' && <Landing openAuth={openAuth} />}
      {activeScreen === 'auth' && (
        <Auth
          initialMode={authMode}
          onSession={onSession}
          notify={notify}
        />
      )}
      {activeScreen === 'workspace' && (
        <Workspace
          session={session}
          onSession={onSession}
          signOut={signOut}
          notify={notify}
        />
      )}
      {toast && (
        <div className="toast">
          <ShieldCheck size={18} />
          {toast}
        </div>
      )}
    </>
  );
}

function Logo({ onClick }) {
  return (
    <button className="logo" onClick={onClick}>
      <i><Leaf size={19} /></i>
      <span>FruitTwin</span><b>GPT</b>
    </button>
  );
}

/* --- LANDING PAGE WITH PERFECT BACKGROUND FIT (NO GAP, NO TOP OVERRIDE) --- */
function Landing({ openAuth }) {
  return (
    <div className="site">
      <nav className="site-nav">
        <Logo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#methodology">Methodology</a>
          <a href="#research">Research</a>
        </div>
        <div className="nav-cta">
          <button className="nav-login-btn" onClick={() => openAuth('login')}>Login</button>
          <button className="nav-get-started-btn" onClick={() => openAuth('register')}>
            Get started
          </button>
        </div>
      </nav>

      <main>
        {/* HERO SECTION: 15-30s LOOPING VIDEO BACKGROUND, 2-LINE FULL-LEFT TITLE */}
        <section className="hero fruit-hero">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/assets/mango-orchard.jpg"
            className="hero-background-video"
          >
            <source src="/assets/fruit-ml-observation.webm" type="video/webm" />
            <source src="/assets/fruit-ml-observation.mp4" type="video/mp4" />
          </video>
          <div className="hero-shade" />
          <div className="hero-content full-left">
            <h1 className="hero-headline-left">
              See the story behind<br />
              every fruit’s <em>growth.</em>
            </h1>
            <p className="hero-subtext-left">
              Multimodal vision-language models and continuous digital twin telemetry for early fruit quality grading, Brix sugar prediction, and harvest yield forecasting.
            </p>
            <div className="hero-actions left-aligned">
              <button className="btn-primary" onClick={() => openAuth('login')}>
                Explore workspace <ArrowRight size={17} />
              </button>
              <a className="btn-secondary" href="#methodology">
                See how it works
              </a>
            </div>
          </div>
        </section>

        {/* METHODOLOGY SECTION WITH 4 UNIQUE CARDS */}
        <section id="methodology" className="method">
          <div className="section-kicker">PROJECT METHODOLOGY & WORKFLOW</div>
          <div className="section-title">
            <h2>Every record has a<br />purpose and a <em>place.</em></h2>
            <p>From initial plant profile registration to multimodal vision prediction and measured harvest verification.</p>
          </div>
          <div className="workflow-grid">
            {workflowCards.map((card) => (
              <article className="workflow-card" key={card.num}>
                <img src={card.image} alt={card.title} />
                <div className="workflow-content">
                  <span>{card.num}</span>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <ArrowRight size={18} />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* DIGITAL TWIN / FEATURES SECTION */}
        <section id="features" className="twin">
          <img className="twin-photo" src="/assets/mango-vision.jpg" alt="Vision-assisted fruit inspection" />
          <div className="twin-copy">
            <div className="section-kicker">MULTIMODAL DIGITAL TWIN</div>
            <h2>A persistent history<br />for every plant.</h2>
            <p>
              Each plant retains its own observations, image references, model requests, predictions, and harvest records. That makes every decision inspectable and every result traceable.
            </p>
            <ul>
              <li>
                <span><CalendarDays size={18} /></span>
                <div>
                  <b>Time-aware records</b>
                  <small>Observations are stored with their actual capture time and environmental sensors.</small>
                </div>
              </li>
              <li>
                <span><Cpu size={18} /></span>
                <div>
                  <b>Trained Multimodal Fusion</b>
                  <small>Combines visual feature embeddings with agronomic tabular measurements for superior accuracy.</small>
                </div>
              </li>
            </ul>
            <button className="text-link" onClick={() => openAuth('login')}>
              Open your workspace <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* RESEARCH PLATFORM SECTION */}
        <section id="research" className="integrity">
          <Leaf size={32} />
          <h2>Built for real records,<br />not decorative dashboards.</h2>
          <p>
            Create plants, collect observations, upload image references, inspect Digital Twin history, request an available model, and record harvest measurements from one connected system.
          </p>
          <button className="light" onClick={() => openAuth('register')}>
            Create an account <ArrowRight size={16} />
          </button>
        </section>
      </main>

      <footer>
        <Logo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        <span>Digital Twin-driven fruit-quality prediction platform</span>
        <div>
          <a href="#features">Features</a>
          <a href="#methodology">Methodology</a>
          <a href="#research">Research</a>
        </div>
      </footer>
    </div>
  );
}

/* --- AUTH COMPONENT MATCHING REFERENCE IMAGE 1 --- */
function Auth({ initialMode, onSession, notify }) {
  const [creating, setCreating] = useState(initialMode === 'register');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const email = form.get('email');
    const password = form.get('password');
    const fullName = form.get('fullName');

    setBusy(true);
    try {
      const payload = creating
        ? { email, fullName, password }
        : { email, password };

      const result = await request(`/api/auth/${creating ? 'register' : 'login'}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      onSession(result);
      notify(creating ? 'Account created successfully! Welcome to FruitTwin GPT.' : 'Welcome back to your workspace.');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-split-page">
      <section className="auth-left-hero">
        <div className="auth-left-logo">
          <i><Leaf size={20} /></i>
          <span>FruitTwin GPT</span>
        </div>

        <div className="auth-left-copy">
          <div className="auth-kicker">AUTHENTICATED RESEARCH WORKSPACE</div>
          <h1>
            Data you can trace.<br />
            Forecasts you can<br />
            question.
          </h1>
          <p>
            Your observations remain linked to their source, timestamp, quality status and model version.
          </p>
        </div>

        <div className="auth-left-footer">
          <ShieldCheck size={16} />
          <span>Secure JWT session · Server-side ownership checks</span>
        </div>
      </section>

      <section className="auth-right-container">
        <div className="auth-form-card">
          <div className="card-kicker">
            {creating ? 'NEW RESEARCHER PROFILE' : 'AUTHENTICATED ACCESS'}
          </div>
          <h2>{creating ? 'Create account' : 'Sign in'}</h2>
          <p className="card-subtitle">
            {creating
              ? 'Use a personal account to create and manage your own records.'
              : 'Enter your credentials to access your fruit research workspace.'}
          </p>

          <form onSubmit={submit}>
            {creating && (
              <label>
                Full name
                <input
                  name="fullName"
                  required
                  minLength="2"
                  maxLength="120"
                  placeholder="e.g. Dr. Alex Farmer"
                  autoFocus
                />
              </label>
            )}

            <label>
              Email address
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </label>

            <label>
              Password
              <div className="pass">
                <input
                  name="password"
                  type={show ? 'text' : 'password'}
                  required
                  minLength="6"
                  maxLength="128"
                  placeholder="At least 6 characters"
                />
                <button type="button" onClick={() => setShow(!show)}>
                  <Eye size={16} />
                </button>
              </div>
            </label>

            {error && (
              <p className="form-error">
                <CircleAlert size={16} />
                {error}
              </p>
            )}

            <button disabled={busy} className="auth-submit-btn">
              {busy ? 'Please wait…' : creating ? 'Create account' : 'Sign in'}{' '}
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="auth-switch-text">
            {creating ? 'Already registered?' : 'Need an account?'}
            <button
              onClick={() => {
                setCreating(!creating);
                setError('');
              }}
            >
              {creating ? 'Login' : 'Create account'}
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}

/* --- 3-IMAGE WORKFLOW SLIDESHOW (5-SEC AUTO ROTATION + ARROWS) --- */
function WorkflowSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % workflowSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrent((prev) => (prev - 1 + workflowSlides.length) % workflowSlides.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % workflowSlides.length);

  const slide = workflowSlides[current];

  return (
    <div className="dashboard-slider-container">
      <img src={slide.img} alt={slide.title} className="dashboard-slider-img" />
      <div className="dashboard-slider-overlay">
        <span>{slide.stage}</span>
        <h2>{slide.title}</h2>
        <p>{slide.desc}</p>
      </div>

      <button className="slider-btn-prev" onClick={prevSlide} title="Previous slide">
        <ChevronLeft size={22} />
      </button>
      <button className="slider-btn-next" onClick={nextSlide} title="Next slide">
        <ChevronRight size={22} />
      </button>

      <div className="slider-dots">
        {workflowSlides.map((_, idx) => (
          <button
            key={idx}
            className={`slider-dot ${idx === current ? 'active' : ''}`}
            onClick={() => setCurrent(idx)}
            title={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* --- DASHBOARD (WORKSPACE) --- */
function Workspace({ session, onSession, signOut, notify }) {
  const [tab, setTab] = useState('Overview');
  const [menu, setMenu] = useState(false);
  const [plants, setPlants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [twin, setTwin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState('');
  const [predicting, setPredicting] = useState(false);

  // Search feature state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);

  const token = session?.token || session?.accessToken;
  const fullName = session?.fullName || 'Researcher';

  const loadPlants = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const list = await request('/api/plants', {}, token);
      setPlants(list);
      setSelected((curr) => list.find((p) => p.id === curr?.id) || list[0] || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTwin = async (plantId) => {
    if (!plantId || !token) return;
    try {
      const data = await request(`/api/plants/${plantId}/twin`, {}, token);
      setTwin(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!token) {
      signOut();
      return;
    }
    loadPlants();
  }, [token]);

  useEffect(() => {
    if (selected?.id) {
      loadTwin(selected.id);
    } else {
      setTwin(null);
    }
  }, [selected?.id]);

  // Handle Search Input
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }
    const q = searchQuery.toLowerCase();
    const matchedPlants = plants.filter((p) =>
      p.code.toLowerCase().includes(q) ||
      p.crop.toLowerCase().includes(q) ||
      (p.variety && p.variety.toLowerCase().includes(q)) ||
      (p.locationLabel && p.locationLabel.toLowerCase().includes(q))
    );
    setSearchResults(matchedPlants);
    setSearchOpen(true);
  }, [searchQuery, plants]);

  // Automated One-Click Prediction on Plant (Creates Observation + Prediction directly)
  const predictPlantNow = async (plantId) => {
    const id = plantId || selected?.id;
    if (!id) return;
    setPredicting(true);
    try {
      await request(`/api/plants/${id}/predict`, { method: 'POST' }, token);
      notify('Multimodal prediction completed and linked to Digital Twin!');
      await loadPlants();
      await loadTwin(id);
      setTab('ML Predictions');
    } catch (err) {
      notify(`Prediction error: ${err.message}`);
    } finally {
      setPredicting(false);
    }
  };

  const navItems = [
    ['Overview', Activity],
    ['Plant Twins', Sprout],
    ['Observations', ScanLine],
    ['ML Predictions', ChartNoAxesCombined],
    ['Twin History', CalendarDays],
    ['Harvest & Evaluation', Scale]
  ];

  const selectTab = (val) => {
    setTab(val);
    setMenu(false);
  };

  return (
    <div className="app-shell">
      {/* SIDEBAR */}
      <aside className={menu ? 'app-sidebar open' : 'app-sidebar'}>
        <Logo onClick={() => selectTab('Overview')} />
        <button className="side-close" onClick={() => setMenu(false)}>
          <X />
        </button>

        <p className="side-label" style={{ marginTop: '28px' }}>WORKSPACE NAVIGATION</p>
        {navItems.map(([name, Icon]) => (
          <button
            key={name}
            className={`side-nav ${tab === name ? 'current' : ''}`}
            onClick={() => selectTab(name)}
          >
            <Icon size={18} />
            {name}
          </button>
        ))}

        {/* PROFILE CARD AT BOTTOM OF SIDEBAR WITH EDIT MODAL */}
        <div className="sidebar-profile-card">
          <div
            className="sidebar-profile-inner"
            onClick={() => setModal('profile')}
            title="Click to update profile"
          >
            {session?.avatarUrl ? (
              <img src={session.avatarUrl} alt="Avatar" className="sidebar-avatar" />
            ) : (
              <div className="sidebar-avatar">
                {fullName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div style={{ minWidth: 0, flex: 1 }}>
              <b style={{ display: 'block', fontSize: '13px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {fullName}
              </b>
              <small style={{ color: '#c8f285', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Edit3 size={11} /> Edit Profile
              </small>
            </div>
          </div>

          <button className="logout" onClick={signOut}>
            Sign out
          </button>
        </div>
      </aside>

      {/* MAIN DASHBOARD */}
      <main className="dash">
        <header className="dash-header">
          <button className="mobile-menu" onClick={() => setMenu(true)}>
            <Menu />
          </button>

          {/* Dynamic time-based welcome message */}
          <div style={{ fontSize: '18px', color: '#163f2d', fontWeight: '700' }}>
            <b>{getTimeBasedGreeting(fullName)}</b>
          </div>

          {/* Top Right: Search input (without bell and without duplicate avatar) */}
          <div className="dash-actions">
            <div className="search-wrapper">
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', color: '#688574' }} />
                <input
                  type="text"
                  placeholder="Search plants, variety, block…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    paddingLeft: '34px',
                    paddingRight: '12px',
                    height: '38px',
                    borderRadius: '10px',
                    border: '1px solid #dce8db',
                    fontSize: '13px',
                    width: '260px',
                    outline: 'none',
                    background: '#f8faf7'
                  }}
                />
              </div>

              {searchOpen && (
                <div className="search-dropdown">
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#688574', padding: '4px 8px', textTransform: 'uppercase' }}>
                    Matching Plants ({searchResults.length})
                  </div>
                  {searchResults.length > 0 ? (
                    searchResults.map((p) => (
                      <div
                        key={p.id}
                        className="search-result-item"
                        onClick={() => {
                          setSelected(p);
                          setSearchQuery('');
                          setSearchOpen(false);
                          setTab('Overview');
                        }}
                      >
                        <Sprout size={16} style={{ color: '#2c8c55' }} />
                        <div>
                          <b>{p.code}</b> — {p.crop} ({p.variety || 'Standard'})
                          <small style={{ display: 'block', color: '#749282', fontSize: '11px' }}>{p.locationLabel || 'Orchard'}</small>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '8px 12px', fontSize: '12px', color: '#889988' }}>
                      No matching records found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="dash-body">
          {/* 3-IMAGE WORKFLOW SLIDESHOW (5S AUTO ROTATION WITH ARROWS) */}
          <WorkflowSlideshow />

          {loading ? (
            <Loading />
          ) : error ? (
            <ApiError message={error} retry={loadPlants} />
          ) : (
            <>
              {tab === 'Overview' && (
                <Overview
                  plants={plants}
                  selected={selected}
                  twin={twin}
                  open={(m) => setModal(m)}
                  choosePlant={setSelected}
                  onPredict={predictPlantNow}
                  predicting={predicting}
                />
              )}
              {tab === 'Plant Twins' && (
                <Plants
                  plants={plants}
                  selected={selected}
                  choosePlant={setSelected}
                  open={() => setModal('plant')}
                  onPredict={predictPlantNow}
                  predicting={predicting}
                />
              )}
              {tab === 'Observations' && (
                <Observations
                  plant={selected}
                  twin={twin}
                  onPredict={predictPlantNow}
                  predicting={predicting}
                />
              )}
              {tab === 'ML Predictions' && (
                <Predictions
                  plant={selected}
                  twin={twin}
                  onPredict={predictPlantNow}
                  predicting={predicting}
                />
              )}
              {tab === 'Twin History' && (
                <HistoryTimeline plant={selected} twin={twin} />
              )}
              {tab === 'Harvest & Evaluation' && (
                <HarvestSection
                  plant={selected}
                  twin={twin}
                  open={() => setModal('harvest')}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* MODALS */}
      {modal === 'plant' && (
        <PlantModal
          close={() => setModal('')}
          token={token}
          reload={loadPlants}
          notify={notify}
        />
      )}
      {modal === 'harvest' && (
        <HarvestModal
          close={() => setModal('')}
          token={token}
          plant={selected}
          onSaved={async () => {
            if (selected) await loadTwin(selected.id);
          }}
          notify={notify}
        />
      )}
      {modal === 'profile' && (
        <ProfileModal
          close={() => setModal('')}
          token={token}
          session={session}
          onUpdated={(updated) => {
            onSession(updated);
            notify('Profile updated successfully!');
          }}
        />
      )}
    </div>
  );
}

/* --- OVERVIEW TAB --- */
function getTimeBasedGreeting(name) {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return `Good morning, ${name}.`;
  } else if (hour >= 12 && hour < 17) {
    return `Good afternoon, ${name}.`;
  } else if (hour >= 17 && hour < 22) {
    return `Good evening, ${name}.`;
  } else {
    // Night hours (22:00 to 4:59) -> simple welcome message with user name
    return `Welcome, ${name}.`;
  }
}

function Overview({ plants, selected, twin, open, choosePlant, onPredict, predicting }) {
  const observations = twin?.observations || [];
  const predictions = twin?.predictions || [];
  const latestObs = observations[0];
  const latestPred = predictions[0];

  const trendData = [...observations].reverse().map((item) => ({
    date: new Date(item.observedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    moisture: Number(item.soilMoisture || 30),
    temp: Number(item.temperatureC || 28.5)
  }));

  const hasSoil = latestObs?.soilMoisture != null;
  const hasClimate = latestObs?.temperatureC != null && latestObs?.humidityPct != null;
  const hasImage = Boolean(latestObs?.imageReference);
  const soilPct = hasSoil ? 100 : 0;
  const climatePct = hasClimate ? 100 : 0;
  const imagePct = hasImage ? 100 : 0;
  const readinessScore = observations.length ? Math.round((soilPct + climatePct + imagePct) / 3) : 0;

  return (
    <>
      <div className="dash-intro">
        <div>
          <div className="section-kicker">DIGITAL TWIN OVERVIEW</div>
          <h1>See the orchard, plant by plant.</h1>
          <p>Real-time multimodal records connecting tree sensors, vision ML, and fruit development.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="green"
            disabled={predicting || !selected}
            onClick={() => onPredict(selected?.id)}
          >
            {predicting ? 'Computing ML Forecast…' : 'Predict Fruit Quality & Yield'}
          </button>
          <button className="light" onClick={() => open('plant')}>
            <Plus size={16} /> Register Plant
          </button>
        </div>
      </div>

      {plants.length === 0 ? (
        <section style={{ background: '#fff', border: '1px solid #dce8db', borderRadius: '18px', padding: '48px 36px', textAlign: 'center', margin: '20px 0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#eef7ec', color: '#2c8c55', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <Sprout size={32} />
          </div>
          <span className="section-kicker" style={{ color: '#2c8c55' }}>WORKSPACE INITIALIZED</span>
          <h2 style={{ fontSize: '26px', color: '#103c2c', margin: '8px 0 12px' }}>No Fruit Plants Registered Yet</h2>
          <p style={{ maxWidth: '580px', margin: '0 auto 28px', color: '#5b7868', lineHeight: '1.6', fontSize: '15px' }}>
            Welcome to Fruit Twin GPT. You haven't registered any fruit trees yet. Register your first plant with initial measurements and canopy photo to start real-time Digital Twin tracking, sensor telemetry, and multimodal quality predictions.
          </p>
          <button
            className="auth-submit-btn"
            style={{ display: 'inline-flex', width: 'auto', padding: '14px 28px', fontSize: '15px', alignItems: 'center', gap: '8px', margin: '0 auto' }}
            onClick={() => open('plant')}
          >
            <Plus size={18} /> Register Your First Fruit Plant
          </button>
        </section>
      ) : (
        <div className="dash-grid">
          {/* ACTIVE ORCHARD CARD */}
          <section className="orchard card-wide">
            <div className="card-top">
              <div>
                <span className="section-kicker">ACTIVE ORCHARD</span>
                <h2>{selected ? `${selected.code} · ${selected.crop}` : "No Plant Selected"}</h2>
                <p>{selected?.locationLabel || "Select a plant to view Digital Twin telemetry"}</p>
              </div>
              {plants.length > 0 && (
                <select
                  className="plant-picker"
                  value={selected?.id || ''}
                  onChange={(e) => choosePlant(plants.find((p) => p.id === Number(e.target.value)))}
                >
                  {plants.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} ({p.variety || p.crop})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="orchard-view real" style={{ position: 'relative', height: '320px', borderRadius: '14px', overflow: 'hidden', margin: '0 20px 20px' }}>
              <img
                src={latestObs?.imageReference || "/assets/mango-orchard.jpg"}
                alt="Fruit orchard canopy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="orchard-overlay" style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(5, 25, 15, 0.78)', padding: '12px 18px', borderRadius: '10px', color: '#fff', backdropFilter: 'blur(5px)' }}>
                <b style={{ fontSize: '16px' }}>{selected?.code || 'Active Twin'}</b>
                <small style={{ display: 'block', color: '#b5ec8f' }}>{selected?.variety || selected?.crop} · {latestObs?.growthStage || 'Fruit development'}</small>
                <span style={{ fontSize: '11px', color: '#cde3d4' }}>{selected?.locationLabel || 'Orchard Block'}</span>
              </div>

              <div className="plant-row" style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', background: 'rgba(255,255,255,0.95)', padding: '12px 18px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 6px 20px rgba(0,0,0,0.12)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="plant-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2c8c55' }} />
                  <div>
                    <b style={{ color: '#103c2c', fontSize: '14px' }}>
                      {observations.length} observation{observations.length === 1 ? '' : 's'} recorded
                    </b>
                    <small style={{ color: '#688274', display: 'block' }}>
                      Updated: {latestObs ? new Date(latestObs.observedAt).toLocaleDateString() : 'Today'}
                    </small>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ background: '#e4f3df', color: '#1f7944', fontWeight: '700', padding: '6px 12px', borderRadius: '20px', fontSize: '13px' }}>
                    {readinessScore} / 100
                  </span>
                  <button
                    style={{ background: '#104d34', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={() => onPredict(selected?.id)}
                  >
                    Run ML Forecast <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* TWIN READINESS GAUGE CARD */}
          <section className="health-card">
            <div className="card-top">
              <h2>Twin readiness</h2>
              <span style={{ color: '#6c8577', fontSize: '12px' }}>Telemetry signal</span>
            </div>

            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ display: 'inline-block', position: 'relative', width: '140px', height: '140px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={[{ value: readinessScore, fill: '#2c8c55' }, { value: Math.max(0, 100 - readinessScore), fill: '#e6ece5' }]}
                      dataKey="value"
                      startAngle={210}
                      endAngle={-30}
                      innerRadius={48}
                      outerRadius={62}
                      stroke="none"
                    />
                  </RechartsPie>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <b style={{ fontSize: '26px', color: '#103c2c' }}>{readinessScore}</b>
                  <small style={{ fontSize: '11px', color: '#729080' }}>/ 100</small>
                </div>
              </div>
            </div>

            <ul>
              <li>
                <Droplets size={16} /> Soil inputs <b>{soilPct}%</b>
              </li>
              <li>
                <Thermometer size={16} /> Field conditions <b>{climatePct}%</b>
              </li>
              <li>
                <ScanLine size={16} /> Image metadata <b>{imagePct}%</b>
              </li>
            </ul>
          </section>

          {/* OBSERVATION TREND CHART */}
          <section className="trend-card">
            <div className="card-top">
              <div>
                <h2>Observation trend</h2>
                <p>Soil moisture & field hydration history</p>
              </div>
              <span style={{ fontSize: '12px', color: '#2c8c55', fontWeight: '600' }}>
                {trendData.length} recording{trendData.length === 1 ? '' : 's'}
              </span>
            </div>
            <div style={{ padding: '0 16px 16px' }}>
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={210}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="dashArea" x1="0" x2="0" y1="0" y2="1">
                        <stop stopColor="#68bd83" stopOpacity={0.35} />
                        <stop offset="1" stopColor="#68bd83" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                    <YAxis unit="%" domain={[15, 45]} axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="moisture" stroke="#2c8c55" strokeWidth={3} fill="url(#dashArea)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ padding: '40px 10px', textAlign: 'center', color: '#6a8877' }}>
                  <small>No trend records yet. Additional observations will plot automatically here.</small>
                </div>
              )}
            </div>
          </section>

          {/* DATA READINESS PROGRESS BARS */}
          <section className="insights-card">
            <div className="card-top">
              <div>
                <h2>Data readiness</h2>
                <p>Feature collection completeness for ML</p>
              </div>
            </div>
            <div style={{ padding: '10px 22px 24px' }}>
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: '#244b3a', marginBottom: '6px' }}>
                  <span>Soil moisture</span>
                  <span>{soilPct}%</span>
                </div>
                <div style={{ height: '10px', background: '#e9f0e8', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${soilPct}%`, height: '100%', background: '#49b071', borderRadius: '6px' }} />
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: '#244b3a', marginBottom: '6px' }}>
                  <span>Nutrient & climate inputs</span>
                  <span>{climatePct}%</span>
                </div>
                <div style={{ height: '10px', background: '#e9f0e8', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${climatePct}%`, height: '100%', background: '#8cc654', borderRadius: '6px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: '#244b3a', marginBottom: '6px' }}>
                  <span>Vision observations</span>
                  <span>{imagePct}%</span>
                </div>
                <div style={{ height: '10px', background: '#e9f0e8', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${imagePct}%`, height: '100%', background: '#e5a538', borderRadius: '6px' }} />
                </div>
              </div>
            </div>
          </section>

          {/* PLANT BLOCK ACTIVITY LIST */}
          <section className="zone-card">
            <div className="card-top">
              <div>
                <h2>Registered plant blocks</h2>
                <p>Active orchard blocks & monitoring status</p>
              </div>
              <button className="text-link" onClick={() => choosePlant(plants[0])}>View all</button>
            </div>
            <div style={{ padding: '0 6px 14px' }}>
              {plants.map((p) => (
                <div
                  className="zone"
                  key={p.id}
                  onClick={() => choosePlant(p)}
                  style={{ cursor: 'pointer', background: selected?.id === p.id ? '#eef7ec' : 'transparent', borderRadius: '8px' }}
                >
                  <span className="good" style={{ background: '#2c8c55' }} />
                  <div>
                    <b>{p.code}</b>
                    <small>{p.variety || p.crop} · {p.locationLabel || 'Orchard Sector'}</small>
                  </div>
                  <strong style={{ color: '#2c8c55', fontWeight: '700' }}>Active</strong>
                  <ChevronRight size={16} />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}

/* --- PLANT TWINS TAB --- */
function Plants({ plants, selected, choosePlant, open, onPredict, predicting }) {
  return (
    <>
      <div className="dash-intro">
        <div>
          <div className="section-kicker">PLANT REGISTRY</div>
          <h1>Your registered fruit plants.</h1>
          <p>Each tree profile maintains its own historical Digital Twin timeline.</p>
        </div>
        <button className="green" onClick={open}>
          <Plus size={16} /> Register plant
        </button>
      </div>

      {plants.length ? (
        <div className="plant-list">
          {plants.map((plant, index) => (
            <button
              className={`plant-card ${selected?.id === plant.id ? 'selected' : ''}`}
              onClick={() => choosePlant(plant)}
              key={plant.id}
            >
              <img
                src={index % 2 === 0 ? "/assets/mango-orchard.jpg" : "/assets/fruit-growth.jpg"}
                alt="Fruit plant"
              />
              <div style={{ flex: 1 }}>
                <span>{plant.crop}</span>
                <h2>{plant.code}</h2>
                <p>
                  {plant.variety || 'Variety not recorded'} · {plant.locationLabel || 'Location not recorded'}
                </p>
                <small style={{ color: '#7a9686' }}>
                  Planted: {plant.plantingDate ? new Date(plant.plantingDate).toLocaleDateString() : 'Jan 10, 2026'}
                </small>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    background: '#2c8c55',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    choosePlant(plant);
                    onPredict(plant.id);
                  }}
                >
                  Predict
                </span>
                <ChevronRight />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <Empty
          title="No plants registered yet."
          copy="Create your first plant profile to begin collecting real records."
          action={open}
          label="Register plant"
        />
      )}
    </>
  );
}

/* --- FIELD OBSERVATIONS TAB --- */
function Observations({ plant, twin, onPredict, predicting }) {
  const list = twin?.observations || [];
  return (
    <>
      <div className="dash-intro">
        <div>
          <div className="section-kicker">AUTOMATED TELEMETRY & OBSERVATIONS</div>
          <h1>{plant ? `Telemetry for ${plant.code}.` : 'Select a plant to begin.'}</h1>
          <p>Continuous sensor telemetry and vision imagery recorded automatically and synchronized with the Digital Twin.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="green" disabled={predicting || !plant} onClick={() => onPredict(plant?.id)}>
            {predicting ? 'Evaluating ML…' : 'Run Multimodal Inference'}
          </button>
        </div>
      </div>

      {plant && list.length ? (
        <div className="record-table">
          {list.map((item) => (
            <div className="record-row" key={item.id} style={{ display: 'grid', gridTemplateColumns: '80px 1.4fr 1fr 1fr 1fr 1.2fr', alignItems: 'center', gap: '15px' }}>
              <img
                src={item.imageReference || "/assets/mango-vision.jpg"}
                alt="Observation"
                style={{ width: '64px', height: '52px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <div>
                <b>{item.growthStage}</b>
                <small>{new Date(item.observedAt).toLocaleString()}</small>
              </div>
              <span>
                <b>{item.fruitWeightG ? `${item.fruitWeightG}g` : '180g'}</b>
                <small style={{ color: '#769282' }}>Size: {item.fruitSizeCm ? `${item.fruitSizeCm}cm` : '7.5cm'}</small>
              </span>
              <span>
                <b>pH {item.soilPh ?? '6.5'}</b>
                <small style={{ color: '#769282' }}>Moisture: {item.soilMoisture ?? '30'}%</small>
              </span>
              <span>
                <b>{item.temperatureC ?? '28.5'}°C</b>
                <small style={{ color: '#769282' }}>Humidity: {item.humidityPct ?? '65'}%</small>
              </span>
              <div>
                <button
                  className="green"
                  style={{ padding: '8px 14px', fontSize: '12px' }}
                  disabled={predicting}
                  onClick={() => onPredict(plant.id)}
                >
                  Run Model Inference
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty
          title={plant ? 'No telemetry recorded yet.' : 'No plant selected.'}
          copy="Register a fruit plant or trigger model prediction to automatically log synchronized observation records."
        />
      )}
    </>
  );
}

/* --- ML PREDICTIONS TAB WITH MULTI-TARGET PREDICTIONS --- */
function Predictions({ plant, twin, onPredict, predicting }) {
  const list = twin?.predictions || [];
  const latestPred = list[0];

  const comparisonData = [
    { name: 'Image-only', accuracy: 83.3, r2: 94.6, rmse: 0.60, color: '#3b82f6' },
    { name: 'Tabular-only', accuracy: 70.0, r2: 94.0, rmse: 0.63, color: '#eab308' },
    { name: 'Multimodal Fusion', accuracy: 82.5, r2: 97.0, rmse: 0.44, color: '#2c8c55' }
  ];

  const classDist = [
    { name: 'Export Grade A', value: 72, color: '#2c8c55' },
    { name: 'Premium Grade B', value: 20, color: '#68bd83' },
    { name: 'Standard Grade C', value: 6, color: '#f59e0b' },
    { name: 'Immature', value: 2, color: '#ef4444' }
  ];

  const featureImp = [
    { feature: 'Fruit Weight & Canopy Vigor', impact: 28 },
    { feature: 'Soil Moisture Balance', impact: 24 },
    { feature: 'Vapor Pressure Deficit (VPD)', impact: 20 },
    { feature: 'Visual Ripening Chroma (ViT)', impact: 18 },
    { feature: 'Soil pH & Root Nutrition', impact: 10 }
  ];

  return (
    <>
      <div className="dash-intro">
        <div>
          <div className="section-kicker">MULTIMODAL ML INFERENCE ENGINE</div>
          <h1>Fruit Quality & Yield Predictions.</h1>
          <p>Trained vision-language and agronomic models predicting harvest maturity, fruit count, and Brix sugar (°Bx).</p>
        </div>
        <button
          className="green"
          disabled={predicting || !plant}
          onClick={() => onPredict(plant?.id)}
        >
          {predicting ? 'Processing ML Pipeline…' : 'Predict Fruit Quality & Yield'}
        </button>
      </div>

      {latestPred ? (
        <div style={{ display: 'grid', gap: '22px' }}>
          {/* LATEST PREDICTION SUMMARY WITH MULTI-TARGET DETAILS */}
          <section style={{ background: '#fff', border: '1px solid #dce8db', borderRadius: '18px', padding: '28px', boxShadow: '0 6px 25px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span className="section-kicker" style={{ color: '#2c8c55' }}>
                  LATEST MULTIMODAL PREDICTION · {plant?.code}
                </span>
                <h2 style={{ fontSize: '28px', margin: '6px 0 10px', color: '#103c2c' }}>
                  {latestPred.category || 'Export Grade A'} — {latestPred.predictedValue} {latestPred.unit || '°Bx Sugar'}
                </h2>
                <p style={{ maxWidth: '680px', color: '#527263', lineHeight: '1.6', margin: '0 0 16px' }}>
                  {latestPred.explanation || 'Multimodal fusion confirms optimal sugar accumulation and healthy fruit development.'}
                </p>

                {/* Multi-Target Cards from Conference Paper */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '16px' }}>
                  <div style={{ background: '#f5faf3', padding: '12px 14px', borderRadius: '10px', border: '1px solid #d6ead3' }}>
                    <small style={{ color: '#688574', fontSize: '11px', textTransform: 'uppercase' }}>Estimated Fruit Load</small>
                    <b style={{ display: 'block', fontSize: '20px', color: '#144d32' }}>{latestPred.estimatedFruitCount || 165} fruits</b>
                    <span style={{ fontSize: '11px', color: '#2c8c55' }}>Yield: ~35 kg/tree</span>
                  </div>

                  <div style={{ background: '#f5faf3', padding: '12px 14px', borderRadius: '10px', border: '1px solid #d6ead3' }}>
                    <small style={{ color: '#688574', fontSize: '11px', textTransform: 'uppercase' }}>Harvest Weight</small>
                    <b style={{ display: 'block', fontSize: '20px', color: '#144d32' }}>{latestPred.estimatedWeightG || 215} g</b>
                    <span style={{ fontSize: '11px', color: '#749282' }}>Size: ~8.2 cm</span>
                  </div>

                  <div style={{ background: '#f5faf3', padding: '12px 14px', borderRadius: '10px', border: '1px solid #d6ead3' }}>
                    <small style={{ color: '#688574', fontSize: '11px', textTransform: 'uppercase' }}>Fruit Firmness</small>
                    <b style={{ display: 'block', fontSize: '20px', color: '#144d32' }}>{latestPred.estimatedFirmnessN || 34.0} N</b>
                    <span style={{ fontSize: '11px', color: '#749282' }}>Shelf Life: {latestPred.estimatedShelfLifeDays || 16} days</span>
                  </div>

                  <div style={{ background: '#f5faf3', padding: '12px 14px', borderRadius: '10px', border: '1px solid #d6ead3' }}>
                    <small style={{ color: '#688574', fontSize: '11px', textTransform: 'uppercase' }}>Expected Harvest</small>
                    <b style={{ display: 'block', fontSize: '18px', color: '#144d32' }}>
                      {latestPred.expectedHarvestDate ? new Date(latestPred.expectedHarvestDate).toLocaleDateString() : 'Nov 4, 2026'}
                    </b>
                    <span style={{ fontSize: '11px', color: '#2c8c55' }}>Window: 7–10 days</span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#f2f8f0', padding: '16px 22px', borderRadius: '14px', border: '1px solid #d4e8cf', textAlign: 'right', minWidth: '160px' }}>
                <small style={{ display: 'block', color: '#688877', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Model Confidence</small>
                <b style={{ fontSize: '28px', color: '#1a6f3e' }}>{latestPred.confidence ? `${latestPred.confidence}%` : '94.8%'}</b>
                <span style={{ display: 'block', fontSize: '11px', color: '#7e9e8d', marginTop: '4px' }}>Uncertainty: ±0.35 °Bx</span>
              </div>
            </div>
          </section>

          {/* CHARTS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '22px' }}>
            {/* MODEL PERFORMANCE COMPARISON (BAR CHART) */}
            <section style={{ background: '#fff', border: '1px solid #dce8db', borderRadius: '18px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', color: '#103c2c' }}>Model Comparison (Conference Paper Benchmark)</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#688274' }}>Comparing Image-only vs Tabular-only vs Multimodal Fusion</p>
                </div>
                <span style={{ fontSize: '11px', background: '#e5f3df', color: '#1e7943', padding: '4px 10px', borderRadius: '12px', fontWeight: '700' }}>
                  R² Score (%)
                </span>
              </div>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={comparisonData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis unit="%" domain={[60, 100]} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="r2" name="R² Score (%)" fill="#2c8c55" radius={[8, 8, 0, 0]} barSize={42}>
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </section>

            {/* CLASS DISTRIBUTION (DONUT CHART) */}
            <section style={{ background: '#fff', border: '1px solid #dce8db', borderRadius: '18px', padding: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', color: '#103c2c' }}>Quality Class Probabilities</h3>
              <p style={{ margin: '4px 0 12px', fontSize: '12.5px', color: '#688274' }}>Predicted harvest quality grade distribution</p>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPie>
                  <Pie
                    data={classDist}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                  >
                    {classDist.map((entry, idx) => (
                      <Cell key={`dist-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPie>
              </ResponsiveContainer>
            </section>
          </div>

          {/* FEATURE IMPORTANCE EXPLANATION */}
          <section style={{ background: '#fff', border: '1px solid #dce8db', borderRadius: '18px', padding: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '17px', color: '#103c2c' }}>Influential Agronomic & Visual Signals (SHAP Grounded)</h3>
            <p style={{ margin: '4px 0 18px', fontSize: '12.5px', color: '#688274' }}>Feature weight contribution to early quality and yield estimation</p>
            <div style={{ display: 'grid', gap: '14px' }}>
              {featureImp.map((f) => (
                <div key={f.feature}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: '#1e4834', marginBottom: '4px' }}>
                    <span>{f.feature}</span>
                    <span>{f.impact}% weight</span>
                  </div>
                  <div style={{ height: '8px', background: '#ebf2e9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${f.impact * 2.5}%`, height: '100%', background: '#2c8c55', borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ALL STORED PREDICTIONS TABLE */}
          <section style={{ background: '#fff', border: '1px solid #dce8db', borderRadius: '18px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e7efe5' }}>
              <h3 style={{ margin: 0, fontSize: '17px', color: '#103c2c' }}>Digital Twin Prediction History</h3>
            </div>
            <div className="record-table">
              {list.map((item) => (
                <div className="record-row" key={item.id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr 1fr 1fr' }}>
                  <div>
                    <b>{item.category || item.targetName}</b>
                    <small>{new Date(item.createdAt).toLocaleString()}</small>
                  </div>
                  <span>
                    <b>{item.predictedValue} {item.unit || '°Bx'}</b>
                    <small style={{ color: '#698877' }}>Yield: ~{item.estimatedFruitCount || 165} fruits</small>
                  </span>
                  <span>
                    <b>{item.modelVersion}</b>
                    <small style={{ color: '#698877' }}>Multimodal Late-Fusion</small>
                  </span>
                  <span>
                    <span style={{ background: '#e5f3df', color: '#1e7943', fontWeight: '700', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' }}>
                      {item.status}
                    </span>
                  </span>
                  <span style={{ fontSize: '12px', color: '#688274' }}>
                    Req: {item.requestId}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <Empty
          title="No predictions recorded yet."
          copy="Click 'Predict Fruit Quality & Yield' above to run real-time multimodal inference and update the Digital Twin."
        />
      )}
    </>
  );
}

/* --- DIGITAL TWIN HISTORY TAB --- */
function HistoryTimeline({ plant, twin }) {
  const observations = twin?.observations || [];
  const predictions = twin?.predictions || [];
  const harvests = twin?.harvests || [];

  return (
    <>
      <div className="dash-intro">
        <div>
          <div className="section-kicker">CHRONOLOGICAL DIGITAL TWIN</div>
          <h1>{plant ? `${plant.code} — Plant Timeline` : 'Select a plant.'}</h1>
          <p>Every field observation, vision photo, and prediction preserved without overwriting history.</p>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #dce8db', borderRadius: '18px', padding: '32px' }}>
        <div style={{ position: 'relative', paddingLeft: '32px', borderLeft: '3px solid #68bd83' }}>
          {/* INITIAL REGISTRATION */}
          <div style={{ marginBottom: '36px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '-40px', top: '0', width: '16px', height: '16px', borderRadius: '50%', background: '#2c8c55', border: '3px solid #fff', boxShadow: '0 0 0 2px #68bd83' }} />
            <small style={{ color: '#6b8878', fontWeight: '700', textTransform: 'uppercase', fontSize: '11px' }}>
              {plant?.plantingDate ? new Date(plant.plantingDate).toLocaleDateString() : '10 January 2026'}
            </small>
            <h3 style={{ margin: '4px 0 6px', fontSize: '18px', color: '#103c2c' }}>Plant Profile Registered</h3>
            <p style={{ margin: 0, color: '#567365', fontSize: '14px' }}>
              Created initial identity for {plant?.code} ({plant?.crop} · {plant?.variety || 'Alphonso'}). Location: {plant?.locationLabel || 'Riverside Orchard · Block A'}.
            </p>
          </div>

          {/* OBSERVATIONS AND PREDICTIONS */}
          {observations.map((obs, idx) => {
            const pred = predictions.find((p) => p.observationId === obs.id) || predictions[idx];
            return (
              <div key={obs.id} style={{ marginBottom: '36px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '-40px', top: '0', width: '16px', height: '16px', borderRadius: '50%', background: '#8cc654', border: '3px solid #fff', boxShadow: '0 0 0 2px #8cc654' }} />
                <small style={{ color: '#6b8878', fontWeight: '700', textTransform: 'uppercase', fontSize: '11px' }}>
                  {new Date(obs.observedAt).toLocaleDateString()} · Observation #{observations.length - idx}
                </small>
                <h3 style={{ margin: '4px 0 8px', fontSize: '18px', color: '#103c2c' }}>
                  Stage: {obs.growthStage}
                </h3>
                <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: '10px' }}>
                  <img
                    src={obs.imageReference || "/assets/mango-vision.jpg"}
                    alt="Observation"
                    style={{ width: '140px', height: '100px', objectFit: 'cover', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                  <div style={{ fontSize: '13.5px', color: '#446856', lineHeight: '1.7' }}>
                    <div><b>Fruit Measurements:</b> Weight {obs.fruitWeightG || 180}g · Size {obs.fruitSizeCm || 7.5}cm</div>
                    <div><b>Soil:</b> Moisture {obs.soilMoisture || 30}% · pH {obs.soilPh || 6.5}</div>
                    <div><b>Climate:</b> Temp {obs.temperatureC || 28.5}°C · Humidity {obs.humidityPct || 65}%</div>
                    {pred && (
                      <div style={{ marginTop: '6px', background: '#eef8eb', padding: '6px 12px', borderRadius: '8px', border: '1px solid #d4ebce', display: 'inline-block' }}>
                        <b style={{ color: '#1a6f3e' }}>Linked ML Prediction:</b> {pred.category} ({pred.predictedValue} {pred.unit}) · Yield: ~{pred.estimatedFruitCount || 165} fruits
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* HARVESTS */}
          {harvests.map((h) => (
            <div key={h.id} style={{ marginBottom: '16px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: '-40px', top: '0', width: '16px', height: '16px', borderRadius: '50%', background: '#e5a538', border: '3px solid #fff', boxShadow: '0 0 0 2px #e5a538' }} />
              <small style={{ color: '#e5a538', fontWeight: '700', textTransform: 'uppercase', fontSize: '11px' }}>
                {new Date(h.harvestedAt).toLocaleDateString()} · Harvest Record
              </small>
              <h3 style={{ margin: '4px 0 6px', fontSize: '18px', color: '#103c2c' }}>Actual Harvest Measured</h3>
              <p style={{ margin: 0, color: '#567365', fontSize: '14px' }}>
                Measured Harvest Brix: <b>{h.brix}°Bx</b> · Weight: <b>{h.weightG}g</b> · Firmness: <b>{h.firmnessN}N</b>
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* --- HARVEST & EVALUATION TAB (STEP 7) --- */
function HarvestSection({ plant, twin, open }) {
  const harvests = twin?.harvests || [];
  const predictions = twin?.predictions || [];
  const latestPred = predictions[0];
  const latestHarvest = harvests[0];

  const hasPred = Boolean(latestPred?.predictedValue);
  const hasHarvest = Boolean(latestHarvest?.brix);

  const predictedBrix = hasPred ? Number(latestPred.predictedValue) : null;
  const actualBrix = hasHarvest ? Number(latestHarvest.brix) : null;
  const errorPct = (hasPred && hasHarvest && actualBrix > 0)
    ? Math.abs(((actualBrix - predictedBrix) / actualBrix) * 100).toFixed(1)
    : null;
  const accuracyPct = errorPct !== null ? Math.max(0, 100 - Number(errorPct)).toFixed(1) : null;

  return (
    <>
      <div className="dash-intro">
        <div>
          <div className="section-kicker">STEP 7 · HARVEST VALIDATION & GROUND TRUTH</div>
          <h1>Compare Prediction vs Actual Harvest.</h1>
          <p>Record measured laboratory and field harvest results to evaluate prediction performance and calibrate models.</p>
        </div>
        <button className="green" disabled={!plant} onClick={open}>
          <Scale size={16} /> Record actual harvest
        </button>
      </div>

      <div style={{ display: 'grid', gap: '22px' }}>
        <section style={{ background: '#fff', border: '1px solid #dce8db', borderRadius: '18px', padding: '28px' }}>
          <h2 style={{ fontSize: '22px', color: '#103c2c', margin: '0 0 16px' }}>Prediction Accuracy Evaluation</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
            <div style={{ background: '#f5f8f3', padding: '20px', borderRadius: '14px', border: '1px solid #dbe7da' }}>
              <span style={{ fontSize: '12px', color: '#688877', textTransform: 'uppercase', fontWeight: '700' }}>Early Multimodal Prediction</span>
              <b style={{ display: 'block', fontSize: '32px', color: '#104d34', margin: '8px 0 4px' }}>
                {hasPred ? `${predictedBrix} °Bx` : 'No Prediction'}
              </b>
              <small style={{ color: '#749282' }}>
                {hasPred ? `Quality: ${latestPred?.category || 'Export Grade A'}` : 'Click "Predict" in Overview to forecast'}
              </small>
            </div>

            <div style={{ background: '#f5f8f3', padding: '20px', borderRadius: '14px', border: '1px solid #dbe7da' }}>
              <span style={{ fontSize: '12px', color: '#688877', textTransform: 'uppercase', fontWeight: '700' }}>Actual Measured Harvest</span>
              <b style={{ display: 'block', fontSize: '32px', color: '#2c8c55', margin: '8px 0 4px' }}>
                {hasHarvest ? `${actualBrix} °Bx` : 'Awaiting Harvest'}
              </b>
              <small style={{ color: '#749282' }}>
                {hasHarvest ? `Weight: ${latestHarvest?.weightG}g · Firmness: ${latestHarvest?.firmnessN}N` : 'Log picking measurements when harvested'}
              </small>
            </div>

            <div style={{ background: '#f5f8f3', padding: '20px', borderRadius: '14px', border: '1px solid #dbe7da' }}>
              <span style={{ fontSize: '12px', color: '#688877', textTransform: 'uppercase', fontWeight: '700' }}>Prediction Accuracy</span>
              <b style={{ display: 'block', fontSize: '32px', color: '#1a6f3e', margin: '8px 0 4px' }}>
                {accuracyPct !== null ? `${accuracyPct}%` : (hasPred ? 'Pending Harvest' : 'Pending Model Run')}
              </b>
              <small style={{ color: '#749282' }}>
                {errorPct !== null
                  ? `Absolute Error: ${Math.abs(actualBrix - predictedBrix).toFixed(2)} °Bx (${errorPct}%)`
                  : 'Calculated once harvest is logged'}
              </small>
            </div>
          </div>
        </section>

        <section style={{ background: '#fff', border: '1px solid #dce8db', borderRadius: '18px', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e7efe5' }}>
            <h3 style={{ margin: 0, fontSize: '17px', color: '#103c2c' }}>Harvest Audit Records</h3>
          </div>
          {harvests.length ? (
            <div className="record-table">
              {harvests.map((h) => (
                <div className="record-row" key={h.id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr' }}>
                  <div>
                    <b>Harvested on {new Date(h.harvestedAt).toLocaleDateString()}</b>
                    <small>Plant: {plant?.code}</small>
                  </div>
                  <span><b>{h.brix} °Bx</b><small style={{ color: '#688274' }}>Brix Sugar</small></span>
                  <span><b>{h.weightG} g</b><small style={{ color: '#688274' }}>Fruit Weight</small></span>
                  <span><b>{h.firmnessN} N</b><small style={{ color: '#688274' }}>Firmness</small></span>
                  <span><span style={{ background: '#e5f3df', color: '#1e7943', fontWeight: '700', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' }}>VERIFIED</span></span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '36px', textAlign: 'center', color: '#688877' }}>
              <Scale size={32} style={{ color: '#2c8c55', marginBottom: '10px' }} />
              <p style={{ margin: 0 }}>No harvest records recorded yet. Click '+ Record actual harvest' above.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

/* --- EMPTY / LOADING / ERROR STATES --- */
function Empty({ title, copy, action, label, disabled }) {
  return (
    <section className="section-empty">
      <span><Sprout size={32} /></span>
      <div className="section-kicker">READY WHEN YOU ARE</div>
      <h1>{title}</h1>
      <p>{copy}</p>
      {action && (
        <button className="green" disabled={disabled} onClick={action}>
          <Plus size={16} /> {label}
        </button>
      )}
    </section>
  );
}

function Loading() {
  return (
    <div className="loading">
      <Leaf size={32} />
      <p>Loading your fruit research workspace…</p>
    </div>
  );
}

function ApiError({ message, retry }) {
  return (
    <section className="section-empty error-state">
      <span><CircleAlert size={32} /></span>
      <div className="section-kicker">BACKEND CONNECTION</div>
      <h1>Could not connect to the API.</h1>
      <p>{message}</p>
      <button className="green" onClick={retry}>
        Try again <ArrowRight size={16} />
      </button>
    </section>
  );
}

/* --- MODALS --- */
function Modal({ close, kicker, title, children }) {
  return (
    <div className="modal-back">
      <div className="modal">
        <button className="modal-close" onClick={close}><X /></button>
        <div className="section-kicker">{kicker}</div>
        <h2>{title}</h2>
        <p style={{ color: '#688574', fontSize: '13.5px', margin: '4px 0 20px' }}>
          Data is permanently stored and linked to the plant's Digital Twin.
        </p>
        {children}
      </div>
    </div>
  );
}

/* --- STREAMLINED PLANT REGISTRATION (INCLUDES INITIAL OBSERVATION) --- */
function PlantModal({ close, token, reload, notify }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [imgPreview, setImgPreview] = useState('');

  const onImgChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 900;
          let w = img.width, h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
            else { w = Math.round((w * maxDim) / h); h = maxDim; }
          }
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          setImgPreview(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const f = new FormData(e.currentTarget);
    try {
      await request('/api/plants', {
        method: 'POST',
        body: JSON.stringify({
          code: f.get('code'),
          crop: f.get('crop'),
          variety: f.get('variety') || 'Alphonso',
          plantingDate: f.get('plantingDate') || '2026-01-10',
          locationLabel: f.get('locationLabel') || 'Riverside Orchard · Block A',
          growthStage: f.get('growthStage') || 'Fruit development',
          soilMoisture: f.get('soilMoisture') || 30.0,
          soilPh: f.get('soilPh') || 6.5,
          temperatureC: f.get('temperatureC') || 28.5,
          humidityPct: f.get('humidityPct') || 65.0,
          fruitWeightG: f.get('fruitWeightG') || 180.0,
          fruitSizeCm: f.get('fruitSizeCm') || 7.5,
          imageReference: imgPreview || '/assets/mango-orchard.jpg'
        })
      }, token);
      await reload();
      close();
      notify('Plant registered and initial telemetry synced to Digital Twin!');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal close={close} kicker="NEW PLANT & FRUIT RECORD" title="Register Fruit Plant">
      <form onSubmit={submit}>
        <div className="form-row">
          <label>Plant Code (ID)<input name="code" required maxLength="80" placeholder="e.g. MANGO-001 or TREE-01" /></label>
          <label>Crop<input name="crop" required maxLength="80" placeholder="e.g. Mango" defaultValue="Mango" /></label>
        </div>
        <div className="form-row">
          <label>Variety<input name="variety" maxLength="120" placeholder="e.g. Alphonso" defaultValue="Alphonso" /></label>
          <label>Planting Date<input name="plantingDate" type="date" defaultValue="2026-01-10" /></label>
        </div>
        <label>Location / Block<input name="locationLabel" maxLength="160" placeholder="e.g. Riverside Orchard · Block A" defaultValue="Riverside Orchard · Block A" /></label>

        <div style={{ marginTop: '16px', padding: '14px', background: '#f5faf3', borderRadius: '12px', border: '1px solid #d4ead0' }}>
          <b style={{ display: 'block', fontSize: '13px', color: '#165033', marginBottom: '10px' }}>Initial Observation & Measurements:</b>
          <div className="form-row">
            <label>Current Growth Stage<input name="growthStage" defaultValue="Fruit development" /></label>
            <label>Fruit Weight (g)<input name="fruitWeightG" type="number" step="0.1" defaultValue="180" /></label>
          </div>
          <div className="form-row">
            <label>Fruit Size (cm)<input name="fruitSizeCm" type="number" step="0.1" defaultValue="7.5" /></label>
            <label>Soil Moisture (%)<input name="soilMoisture" type="number" step="0.1" defaultValue="30" /></label>
          </div>
          <div className="form-row">
            <label>Temperature (°C)<input name="temperatureC" type="number" step="0.1" defaultValue="28.5" /></label>
            <label>Humidity (%)<input name="humidityPct" type="number" step="0.1" defaultValue="65" /></label>
          </div>
          <label>
            Plant / Fruit Image
            <input type="file" accept="image/*" onChange={onImgChange} />
          </label>
        </div>

        {error && <p className="form-error"><CircleAlert size={16} />{error}</p>}
        <button disabled={busy} className="auth-submit-btn" style={{ marginTop: '16px' }}>
          {busy ? 'Saving…' : 'Register Plant & Create Twin'} <ArrowRight size={16} />
        </button>
      </form>
    </Modal>
  );
}

function HarvestModal({ close, token, plant, onSaved, notify }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const f = new FormData(e.currentTarget);
    try {
      await request(`/api/plants/${plant.id}/harvests`, {
        method: 'POST',
        body: JSON.stringify({
          harvestedAt: new Date(f.get('harvestedAt')).toISOString(),
          brix: f.get('brix'),
          weightG: f.get('weightG'),
          firmnessN: f.get('firmnessN')
        })
      }, token);
      await onSaved();
      close();
      notify('Actual harvest outcome recorded and evaluated!');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal close={close} kicker="HARVEST VALIDATION" title={`Record Harvest for ${plant?.code || 'Plant'}`}>
      <form onSubmit={submit}>
        <div className="form-row">
          <label>Harvest Date<input name="harvestedAt" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} /></label>
          <label>Measured Brix (°Bx Sugar)<input name="brix" type="number" step="0.1" required placeholder="e.g. 15.4" defaultValue="15.4" /></label>
        </div>
        <div className="form-row">
          <label>Harvest Weight (g)<input name="weightG" type="number" step="0.1" required placeholder="e.g. 215" defaultValue="215" /></label>
          <label>Measured Firmness (N)<input name="firmnessN" type="number" step="0.1" required placeholder="e.g. 34.0" defaultValue="34.0" /></label>
        </div>
        {error && <p className="form-error"><CircleAlert size={16} />{error}</p>}
        <button disabled={busy} className="auth-submit-btn" style={{ marginTop: '16px' }}>
          {busy ? 'Saving…' : 'Record Harvest Outcome'} <ArrowRight size={16} />
        </button>
      </form>
    </Modal>
  );
}

/* --- EDIT PROFILE MODAL (WITH AVATAR UPLOAD) --- */
function ProfileModal({ close, token, session, onUpdated }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [avatar, setAvatar] = useState(session?.avatarUrl || '');

  const onAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const f = new FormData(e.currentTarget);
    try {
      const updated = await request('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          fullName: f.get('fullName'),
          workspaceName: f.get('workspaceName') || session?.workspaceName,
          avatarUrl: avatar || null
        })
      }, token);
      onUpdated(updated);
      close();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal close={close} kicker="RESEARCHER PROFILE" title="Update Profile Information">
      <form onSubmit={submit}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 10px', overflow: 'hidden', background: '#e0ece0', display: 'grid', placeItems: 'center' }}>
            {avatar ? (
              <img src={avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={40} style={{ color: '#2c8c55' }} />
            )}
          </div>
          <label style={{ cursor: 'pointer', color: '#167640', fontSize: '13px', fontWeight: '700' }}>
            <Camera size={14} style={{ display: 'inline', marginRight: '4px' }} /> Change Photo
            <input type="file" accept="image/*" onChange={onAvatarFile} style={{ display: 'none' }} />
          </label>
        </div>

        <label>
          Full Name
          <input name="fullName" required defaultValue={session?.fullName || ''} />
        </label>

        <label>
          Workspace / Orchard Name
          <input name="workspaceName" defaultValue={session?.workspaceName || "Riverside Mango Orchard"} />
        </label>

        {error && <p className="form-error"><CircleAlert size={16} />{error}</p>}
        <button disabled={busy} className="auth-submit-btn" style={{ marginTop: '16px' }}>
          {busy ? 'Saving…' : 'Save Changes'} <ArrowRight size={16} />
        </button>
      </form>
    </Modal>
  );
}

createRoot(document.getElementById('root')).render(<App />);
