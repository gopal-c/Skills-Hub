// SearchBar.jsx — the natural-language query input
function SearchBar({ value, onChange, onSubmit }) {
  React.useEffect(() => { window.lucide?.createIcons(); });

  const suggestions = [
    'React + payments experience',
    'Python ML, 3+ years',
    'Led a frontend rewrite',
    'Speaks Spanish + Stripe API',
  ];

  return (
    <div>
      <div className="search-box">
        <i className="ic" data-lucide="search"></i>
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSubmit()}
          placeholder="Ask in plain English — who knows React AND has worked on payments?"
        />
        <button className="go" onClick={onSubmit}>
          <span>Search</span>
          <i data-lucide="arrow-right" style={{width:16,height:16}}></i>
        </button>
      </div>
      <div className="suggested">
        <span className="lbl">Try</span>
        {suggestions.map(s => (
          <button key={s} className="pill" onClick={() => { onChange(s); setTimeout(onSubmit, 50); }}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

window.SearchBar = SearchBar;
