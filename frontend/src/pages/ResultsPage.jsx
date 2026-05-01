import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialData = location.state?.result ? JSON.parse(location.state.result) : null;

  const [data, setData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!initialData) {
      navigate('/');
    }
  }, [initialData, navigate]);

  if (!data) return null;

  const updateScore = (field, value) => {
    setData((prev) => ({
      ...prev,
      score: { ...prev.score, [field]: value },
    }));
  };

  const updateEvidence = (index, field, value) => {
    setData((prev) => {
      const newEvidence = [...prev.evidence];
      newEvidence[index] = { ...newEvidence[index], [field]: value };
      return { ...prev, evidence: newEvidence };
    });
  };

  const updateKpi = (index, field, value) => {
    setData((prev) => {
      const newKpis = [...prev.kpiMapping];
      newKpis[index] = { ...newKpis[index], [field]: value };
      return { ...prev, kpiMapping: newKpis };
    });
  };

  const updateGap = (index, field, value) => {
    setData((prev) => {
      const newGaps = [...prev.gaps];
      newGaps[index] = { ...newGaps[index], [field]: value };
      return { ...prev, gaps: newGaps };
    });
  };

  const updateQuestion = (index, field, value) => {
    setData((prev) => {
      const newQuestions = [...prev.followUpQuestions];
      newQuestions[index] = { ...newQuestions[index], [field]: value };
      return { ...prev, followUpQuestions: newQuestions };
    });
  };

  return (
    <div className="results-page">
      <div className="results-header">
        <h1>Fellow Assessment Results</h1>
        <div className="header-actions">
          <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Lock' : 'Edit'}
          </button>
          <button className="back-btn" onClick={() => navigate('/')}>New Analysis</button>
        </div>
      </div>

      <div className="results-content">
        <section className="section score-section">
          <h2>Score</h2>
          <div className="score-grid">
            <div className="field">
              <label>Value (1-10)</label>
              {isEditing ? (
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={data.score.value}
                  onChange={(e) => updateScore('value', parseInt(e.target.value))}
                />
              ) : (
                <span className="value-display">{data.score.value}</span>
              )}
            </div>
            <div className="field">
              <label>Label</label>
              {isEditing ? (
                <input
                  type="text"
                  value={data.score.label}
                  onChange={(e) => updateScore('label', e.target.value)}
                />
              ) : (
                <span className="value-display">{data.score.label}</span>
              )}
            </div>
            <div className="field">
              <label>Band</label>
              {isEditing ? (
                <input
                  type="text"
                  value={data.score.band}
                  onChange={(e) => updateScore('band', e.target.value)}
                />
              ) : (
                <span className="value-display">{data.score.band}</span>
              )}
            </div>
            <div className="field">
              <label>Confidence</label>
              {isEditing ? (
                <select
                  value={data.score.confidence}
                  onChange={(e) => updateScore('confidence', e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              ) : (
                <span className="value-display">{data.score.confidence}</span>
              )}
            </div>
          </div>
          <div className="field full-width">
            <label>Justification</label>
            {isEditing ? (
              <textarea
                value={data.score.justification}
                onChange={(e) => updateScore('justification', e.target.value)}
              />
            ) : (
              <p className="value-display">{data.score.justification}</p>
            )}
          </div>
        </section>

        <section className="section">
          <h2>Evidence ({data.evidence?.length || 0})</h2>
          {data.evidence?.map((item, index) => (
            <div key={index} className="evidence-card">
              <div className="evidence-header">
                <span className={`signal-badge ${item.signal}`}>{item.signal}</span>
                <span className="dimension-tag">{item.dimension}</span>
              </div>
              <div className="field">
                <label>Quote</label>
                {isEditing ? (
                  <textarea
                    value={item.quote}
                    onChange={(e) => updateEvidence(index, 'quote', e.target.value)}
                  />
                ) : (
                  <p className="quote-text">"{item.quote}"</p>
                )}
              </div>
              <div className="field">
                <label>Interpretation</label>
                {isEditing ? (
                  <textarea
                    value={item.interpretation}
                    onChange={(e) => updateEvidence(index, 'interpretation', e.target.value)}
                  />
                ) : (
                  <p className="value-display">{item.interpretation}</p>
                )}
              </div>
            </div>
          ))}
        </section>

        <section className="section">
          <h2>KPI Mapping ({data.kpiMapping?.length || 0})</h2>
          {data.kpiMapping?.map((item, index) => (
            <div key={index} className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-name">{item.kpi}</span>
                <span className={`system-badge ${item.systemOrPersonal}`}>{item.systemOrPersonal}</span>
              </div>
              {isEditing ? (
                <>
                  <div className="field">
                    <label>KPI</label>
                    <input
                      type="text"
                      value={item.kpi}
                      onChange={(e) => updateKpi(index, 'kpi', e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Evidence</label>
                    <textarea
                      value={item.evidence}
                      onChange={(e) => updateKpi(index, 'evidence', e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <p className="value-display">{item.evidence}</p>
              )}
            </div>
          ))}
        </section>

        <section className="section">
          <h2>Gaps ({data.gaps?.length || 0})</h2>
          {data.gaps?.map((item, index) => (
            <div key={index} className="gap-card">
              <span className="dimension-tag">{item.dimension}</span>
              {isEditing ? (
                <div className="field">
                  <label>Detail</label>
                  <textarea
                    value={item.detail}
                    onChange={(e) => updateGap(index, 'detail', e.target.value)}
                  />
                </div>
              ) : (
                <p className="value-display">{item.detail}</p>
              )}
            </div>
          ))}
        </section>

        <section className="section">
          <h2>Follow-up Questions ({data.followUpQuestions?.length || 0})</h2>
          {data.followUpQuestions?.map((item, index) => (
            <div key={index} className="question-card">
              <span className="dimension-tag">{item.targetGap}</span>
              <div className="field">
                <label>Question</label>
                {isEditing ? (
                  <textarea
                    value={item.question}
                    onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                  />
                ) : (
                  <p className="value-display">{item.question}</p>
                )}
              </div>
              <div className="field">
                <label>Looking For</label>
                {isEditing ? (
                  <textarea
                    value={item.lookingFor}
                    onChange={(e) => updateQuestion(index, 'lookingFor', e.target.value)}
                  />
                ) : (
                  <p className="value-display">{item.lookingFor}</p>
                )}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}