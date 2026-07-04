import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [score, setScore] = useState(null);
  const [summary, setSummary] = useState(null);
  const [relationships, setRelationships] = useState(null);
  const [riskReport, setRiskReport] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadDashboard = () => {

    setLoading(true);
    setError(null);

    Promise.all([
      fetch('http://localhost:3000/org/summary').then(r => r.json()),
      fetch('http://localhost:3000/org/architecture-score').then(r => r.json()),
      fetch('http://localhost:3000/org/relationships').then(r => r.json()),
      fetch('http://localhost:3000/org/risk-report').then(r => r.json())
    ])
      .then(([summaryData, scoreData, relationshipData, riskData]) => {

        setSummary(summaryData);
        setScore(scoreData);
        setRelationships(relationshipData);
        setRiskReport(riskData);

        setLastUpdated(new Date());

      })
      .catch(err => {

        console.error(err);
        setError('Failed to load dashboard data.');

      })
      .finally(() => {

        setLoading(false);

      });

  };

  useEffect(() => {

    loadDashboard();

  }, []);

  if (loading) {

    return (

      <div className="container">

        <h1 className="title">
          OmniSphereAI Dashboard
        </h1>

        <div className="cards">

          <div className="card skeleton">
            Loading Architecture...
          </div>

          <div className="card skeleton">
            Loading Relationships...
          </div>

          <div className="card skeleton">
            Loading Summary...
          </div>

          <div className="card skeleton">
            Loading Risk Report...
          </div>

        </div>

      </div>

    );

  }

  if (error) {

    return (

      <div className="container">

        <h1 className="title">
          OmniSphereAI Dashboard
        </h1>

        <p>{error}</p>

        <button
          className="refresh-button"
          onClick={loadDashboard}
        >
          Retry
        </button>

      </div>

    );

  }

  return (

    <div className="container">

      <div className="dashboard-header">

        <div>

          <h1 className="title">
            OmniSphereAI Dashboard
          </h1>

          {lastUpdated && (

            <p className="last-updated">
              Last Updated: {lastUpdated.toLocaleTimeString()}
            </p>

          )}

        </div>

        <button
          className="refresh-button"
          onClick={loadDashboard}
        >
          Refresh
        </button>

      </div>

      <div className="cards">

        {score && (

          <div className="card">

            <h2>Architecture Score</h2>

            <p>
              <strong>Score:</strong> {score.architectureScore}
            </p>

            <p>
              <strong>Grade:</strong> {score.grade}
            </p>

            <p>
              <strong>High Risk Objects:</strong> {score.riskSummary.highRiskCount}
            </p>

            <p>
              <strong>Medium Risk Objects:</strong> {score.riskSummary.mediumRiskCount}
            </p>

          </div>

        )}

        {relationships && (

          <div className="card">

            <h2>Relationship Analysis</h2>

            <p>
              <strong>Most Connected:</strong> {relationships.mostConnectedObject.name}
            </p>

            <p>
              <strong>Relationships:</strong> {relationships.mostConnectedObject.relationshipCount}
            </p>

            <p>
              <strong>Risk Level:</strong> {relationships.mostConnectedObject.riskLevel}
            </p>

          </div>

        )}

        {summary && (

          <div className="card">

            <h2>Org Summary</h2>

            <p>
              <strong>Total Objects:</strong> {summary.totalObjects}
            </p>

            <p>
              <strong>Average Fields:</strong> {summary.averageFieldsPerObject}
            </p>

            <p>
              <strong>Largest Object:</strong> {summary.largestObject.name}
            </p>

            <p>
              <strong>Field Count:</strong> {summary.largestObject.fieldCount}
            </p>

          </div>

        )}

        {riskReport && (

          <div className="card">

            <h2>Risk Report</h2>

            <h3>🔴 High Risk</h3>

            {riskReport.highRiskObjects.map(obj => (

              <p key={obj.name}>
                {obj.name} ({obj.relationshipCount})
              </p>

            ))}

            <h3>🟡 Medium Risk</h3>

            {riskReport.mediumRiskObjects.map(obj => (

              <p key={obj.name}>
                {obj.name} ({obj.relationshipCount})
              </p>

            ))}

            <h3>🟢 Low Risk</h3>

            {riskReport.lowRiskObjects.map(obj => (

              <p key={obj.name}>
                {obj.name} ({obj.relationshipCount})
              </p>

            ))}

          </div>

        )}

      </div>

    </div>

  );

}

export default App;