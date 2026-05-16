// ProfilePanel.jsx — right-side slide-over profile detail
function ProfilePanel({ person, onClose }) {
  React.useEffect(() => { window.lucide?.createIcons(); });
  const open = !!person;

  return (
    <>
      <div className={'scrim ' + (open ? 'open' : '')} onClick={onClose}></div>
      <aside className={'panel ' + (open ? 'open' : '')}>
        {person && (
          <>
            <div className="panel-head">
              <button className="close" onClick={onClose} aria-label="Close">
                <i data-lucide="x" style={{width:16,height:16}}></i>
              </button>
              <div className="ph-top">
                <div className="ph-av" style={{background: person.gradient}}>{person.initials}</div>
                <div>
                  <div className="ph-name">{person.name}</div>
                  <div className="ph-role">{person.role}</div>
                </div>
              </div>
              <span className="ph-score">{person.score.toFixed(2)} <b>match</b></span>
            </div>

            <div className="panel-body">
              <section>
                <h4>Why this person</h4>
                <div className="reason-block">
                  <b>{person.name.split(' ')[0]}</b> {person.longReason}
                </div>
              </section>

              <section>
                <h4>Skill proficiency</h4>
                <div>
                  {person.fullSkills.map(sk => (
                    <div key={sk.name} className="skill-row">
                      <span className="nm">{sk.name}</span>
                      <div className="bar"><i style={{transform:`scaleX(${sk.level})`}}></i></div>
                      <span className="yrs">{sk.yrs}y</span>
                    </div>
                  ))}
                </div>
              </section>

              <section style={{display:'flex',gap:8}}>
                <button className="btn btn--primary">
                  <i data-lucide="mail" style={{width:16,height:16}}></i> Reach out
                </button>
                <button className="btn btn--secondary">
                  <i data-lucide="bookmark" style={{width:16,height:16}}></i> Shortlist
                </button>
                <button className="btn btn--ghost" style={{marginLeft:'auto'}}>
                  <i data-lucide="file-text" style={{width:16,height:16}}></i> Full resume
                </button>
              </section>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

window.ProfilePanel = ProfilePanel;
