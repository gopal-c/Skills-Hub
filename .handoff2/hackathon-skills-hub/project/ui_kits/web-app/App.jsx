// App.jsx — top-level shell + state for the SkillsHub web app demo
const SAMPLE_PEOPLE = [
  {
    id: 1,
    name: 'Priya Ramanathan',
    initials: 'PR',
    gradient: 'linear-gradient(135deg, #8B7BE8, #FF9A82)',
    role: 'Staff engineer · Payments team',
    score: 0.92,
    reason: '5 yrs React in production, led Stripe + Adyen integrations at her last two roles. Most recent project: tokenized checkout for a B2B SaaS.',
    longReason: 'has shipped React at scale for 5 years and led the payment-integration workstreams at both Octopus Pay (2022–24) and Mintly (2020–22). Her most recent project was a tokenized checkout flow — the exact domain you\'re asking about. Strong on TypeScript, opinionated about testing, and her resume mentions on-call rotation for payment incidents.',
    skills: [
      { name: 'React', yrs: 5, match: true },
      { name: 'TypeScript', yrs: 5, match: true },
      { name: 'Stripe / payments', yrs: 3, match: true },
      { name: 'Node', yrs: 4 },
    ],
    moreSkills: 12,
    fullSkills: [
      { name: 'React',          yrs: 5, level: 0.95 },
      { name: 'TypeScript',     yrs: 5, level: 0.92 },
      { name: 'Stripe API',     yrs: 3, level: 0.85 },
      { name: 'Adyen',          yrs: 2, level: 0.70 },
      { name: 'Node.js',        yrs: 4, level: 0.80 },
      { name: 'GraphQL',        yrs: 2, level: 0.55 },
      { name: 'PostgreSQL',     yrs: 3, level: 0.65 },
      { name: 'Mentoring',      yrs: 4, level: 0.78 },
    ],
  },
  {
    id: 2,
    name: 'Marcus Okafor',
    initials: 'MO',
    gradient: 'linear-gradient(135deg, #7CD3C5, #8B7BE8)',
    role: 'Senior frontend engineer · Growth',
    score: 0.81,
    reason: 'Strong React (4 yrs). Built a Stripe-powered subscription flow last year, though not his primary specialty. Solid TypeScript and good docs writer.',
    longReason: 'has 4 years of React in production, currently on the Growth team. Last year he rebuilt the subscription billing flow on Stripe Billing — solid foundational payments work, though his deeper specialty is on conversion experimentation, not payments engineering. Good fit if the role is React-leaning with payments as a sub-domain.',
    skills: [
      { name: 'React', yrs: 4, match: true },
      { name: 'TypeScript', yrs: 3, match: true },
      { name: 'Stripe Billing', yrs: 1, match: true },
      { name: 'Experiments', yrs: 3 },
    ],
    moreSkills: 8,
    fullSkills: [
      { name: 'React',          yrs: 4, level: 0.85 },
      { name: 'TypeScript',     yrs: 3, level: 0.78 },
      { name: 'Stripe Billing', yrs: 1, level: 0.55 },
      { name: 'A/B testing',    yrs: 3, level: 0.82 },
      { name: 'CSS / design',   yrs: 5, level: 0.88 },
    ],
  },
  {
    id: 3,
    name: 'Sasha Lindqvist',
    initials: 'SL',
    gradient: 'linear-gradient(135deg, #FFCB6B, #FF9A82)',
    role: 'Engineer · Platform',
    score: 0.68,
    reason: 'React experience is solid (3 yrs) but no direct payments background. Reasonable adjacent skills — auth flows, third-party API integrations.',
    longReason: 'has 3 years of React, mostly platform-side. No direct payments shipping but extensive experience integrating third-party APIs (auth providers, analytics). Could ramp on payments quickly with a senior partner.',
    skills: [
      { name: 'React', yrs: 3, match: true },
      { name: 'OAuth / Auth0', yrs: 3 },
      { name: 'Python', yrs: 4 },
    ],
    moreSkills: 6,
    fullSkills: [
      { name: 'React',       yrs: 3, level: 0.72 },
      { name: 'OAuth',       yrs: 3, level: 0.80 },
      { name: 'Python',      yrs: 4, level: 0.85 },
      { name: 'Django',      yrs: 3, level: 0.75 },
    ],
  },
];

function App() {
  const [active, setActive] = React.useState('search');
  const [query, setQuery] = React.useState('Who knows React AND has worked on payment integrations?');
  const [submittedQuery, setSubmittedQuery] = React.useState(query);
  const [selected, setSelected] = React.useState(null);
  const [openPerson, setOpenPerson] = React.useState(null);

  React.useEffect(() => { window.lucide?.createIcons(); });

  const handleSubmit = () => {
    setSubmittedQuery(query);
    setSelected(null);
    setOpenPerson(null);
  };

  return (
    <div className="app">
      <Sidebar active={active} onNav={setActive} queueCount={4} />
      <main className="canvas">
        <div className="topbar">
          <div className="crumb">
            <span>Workspace</span>
            <i data-lucide="chevron-right" style={{width:14,height:14}}></i>
            <b>Search</b>
          </div>
          <div className="actions">
            <button className="btn btn--ghost">
              <i data-lucide="history" style={{width:16,height:16}}></i> Recent
            </button>
            <button className="btn btn--secondary">
              <i data-lucide="upload" style={{width:16,height:16}}></i> Upload resume
            </button>
          </div>
        </div>

        <section className="search-section">
          <div className="eyebrow-row">
            <span className="eyebrow eyebrow--coral">01 · Find someone</span>
          </div>
          <h1>Who are you looking for, <em>really</em>?</h1>
          <SearchBar value={query} onChange={setQuery} onSubmit={handleSubmit} />
        </section>

        <div className="results">
          <div className="results-meta">
            <span className="count">{SAMPLE_PEOPLE.length} matches</span>
            <span className="desc">Ranked by meaning · query: <i style={{color:'var(--fg-1)'}}>"{submittedQuery}"</i></span>
            <div className="sort">
              <i data-lucide="arrow-up-down" style={{width:14,height:14}}></i>
              <span>Best match</span>
            </div>
          </div>

          {SAMPLE_PEOPLE.map(p => (
            <ResultCard key={p.id} person={p} query={submittedQuery}
                        selected={selected === p.id}
                        onSelect={(person) => { setSelected(person.id); setOpenPerson(person); }} />
          ))}

          <div className="empty" style={{marginTop:18}}>
            <h3>That's everyone matching this query.</h3>
            <p>Loosen the constraints to see more candidates — or upload another batch of resumes to widen the pool.</p>
          </div>
        </div>
      </main>

      <ProfilePanel person={openPerson} onClose={() => setOpenPerson(null)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
