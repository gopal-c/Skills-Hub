// Sidebar.jsx — left nav for the SkillsHub web app
function Sidebar({ active, onNav, queueCount }) {
  const items = [
    { id: 'search',    label: 'Search',           icon: 'search' },
    { id: 'people',    label: 'People',           icon: 'users' },
    { id: 'queue',     label: 'Review queue',     icon: 'inbox',  count: queueCount },
    { id: 'skills',    label: 'Skills taxonomy',  icon: 'tags' },
    { id: 'reports',   label: 'Reports',          icon: 'bar-chart-3' },
  ];
  const settings = [
    { id: 'team',      label: 'Team & access',    icon: 'shield-check' },
    { id: 'settings',  label: 'Settings',         icon: 'settings-2' },
  ];

  React.useEffect(() => { window.lucide?.createIcons(); });

  return (
    <aside className="sidebar">
      <div className="brand">
        <img src="../../assets/logo-wordmark-dark.svg" alt="SkillsHub" />
      </div>

      <div>
        <div className="section-label">Workspace</div>
        <nav>
          {items.map(it => (
            <button key={it.id}
                    className={'nav-item ' + (active === it.id ? 'active' : '')}
                    onClick={() => onNav(it.id)}>
              <i data-lucide={it.icon}></i>
              <span>{it.label}</span>
              {it.count != null && <span className="count">{it.count}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div>
        <div className="section-label">Admin</div>
        <nav>
          {settings.map(it => (
            <button key={it.id}
                    className={'nav-item ' + (active === it.id ? 'active' : '')}
                    onClick={() => onNav(it.id)}>
              <i data-lucide={it.icon}></i>
              <span>{it.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="me">
        <div className="av">JM</div>
        <div>
          <div className="name">Jess Morgan</div>
          <div className="role">HR lead · Acme Co.</div>
        </div>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
