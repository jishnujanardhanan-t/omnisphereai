import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [score, setScore] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {

  console.log('Starting fetch...');

fetch('http://localhost:3000/org/summary')
  .then(response => response.json())
  .then(data => {
    console.log('Summary received:', data);
    setSummary(data);
  })
  .catch(error => {
    console.error('Summary error:', error);
  });

  fetch('http://localhost:3000/org/architecture-score')
    .then(response => {
      console.log('Response received:', response);
      return response.json();
    })
    .then(data => {
      console.log('Data received:', data);
      setScore(data);
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });

}, []);

  return (
  <div className="container">

    <h1 className="title">
      OmniSphereAI Dashboard
    </h1>

    <div className="cards">

      {score && (
        <div className="card">

          <h2>Architecture Score</h2>

          <p>
            Score: {score.architectureScore}
          </p>

          <p>
            Grade: {score.grade}
          </p>

          <p>
            High Risk Objects:
            {score.riskSummary.highRiskCount}
          </p>

          <p>
            Medium Risk Objects:
            {score.riskSummary.mediumRiskCount}
          </p>

        </div>
      )}

      {summary && (
        <div className="card">

          <h2>Org Summary</h2>

          <p>
            Total Objects:
            {summary.totalObjects}
          </p>

          <p>
            Average Fields:
            {summary.averageFieldsPerObject}
          </p>

          <p>
            Largest Object:
            {summary.largestObject.name}
          </p>

          <p>
            Field Count:
            {summary.largestObject.fieldCount}
          </p>

        </div>
      )}

    </div>

  </div>
);
}

export default App;