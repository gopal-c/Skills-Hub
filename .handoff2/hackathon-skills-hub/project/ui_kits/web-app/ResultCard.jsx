// ResultCard.jsx — one candidate result with score + reasoning
function ResultCard({ person, query, selected, onSelect }) {
  const weak = person.score < 0.75;
  return (
    <div className={'result-card ' + (selected ? 'selected' : '')}
         onClick={() => onSelect(person)}>
      <div className="rc-head">
        <div className="rc-av" style={{background: person.gradient}}>{person.initials}</div>
        <div>
          <div className="rc-name">{person.name}</div>
          <div className="rc-role">{person.role}</div>
        </div>
        <div className={'rc-score ' + (weak ? 'weak' : '')}>
          {person.score.toFixed(2)} <b>match</b>
        </div>
      </div>
      <div className="rc-reason">
        <b>Why this match</b> · {person.reason}
      </div>
      <div className="rc-skills">
        {person.skills.map(sk => (
          <span key={sk.name} className={'rc-skill ' + (sk.match ? 'match' : '')}>
            {sk.name} · {sk.yrs}y
          </span>
        ))}
        {person.moreSkills > 0 && <span className="rc-skill">+ {person.moreSkills} more</span>}
      </div>
    </div>
  );
}

window.ResultCard = ResultCard;
