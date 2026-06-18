import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [score, setScore] = useState(null);
  const [summary, setSummary] = useState(null);
  const [relationships, setRelationships] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    setLoading(true);

    Promise.all([
      fetch('http://localhost:3000/org/summary').then(res => res.json()),
      fetch('http://localhost:3000/org/architecture-score').then(res => res.json()),
      fetch('http://localhost:3000/org/relationships').then(res => res.json())
    ])
    .then(([summaryData, scoreData, relationshipData]) => {

      setSummary(summaryData);
      setScore(scoreData);
      setRelationships(relationshipData);

    })
    .catch(error => {
      console.error('Dashboard error:', error);
    })
    .finally(() => {
      setLoading(false);
    });

  }, []);

  return (
    <div className="container">

      <h1 className="title">
        OmniSphereAI Dashboard
      </h1>

      {loading && (
        <div className="loading">
          Loading dashboard data...
        </div>
      )}

      {!loading && (
        <div className="cards">

          {score && (
            <div className="card">
              <h2>Architecture Score</h2>
              <p>Score: {score.architectureScore}</p>
              <p>Grade: {score.grade}</p>
              <p>High Risk Objects: {score.riskSummary.highRiskCount}</p>
              <p>Medium Risk Objects: {score.riskSummary.mediumRiskCount}</p>
            </div>
          )}

          {relationships && (
            <div className="card">
              <h2>Relationship Analysis</h2>
              <p>Most Connected: {relationships.mostConnectedObject.name}</p>
              <p>Relationships: {relationships.mostConnectedObject.relationshipCount}</p>
              <p>Risk Level: {relationships.mostConnectedObject.riskLevel}</p>
            </div>
          )}

          {summary && (
            <div className="card">
              <h2>Org Summary</h2>
              <p>Total Objects: {summary.totalObjects}</p>
              <p>Average Fields: {summary.averageFieldsPerObject}</p>
              <p>Largest Object: {summary.largestObject.name}</p>
              <p>Field Count: {summary.largestObject.fieldCount}</p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default App;