import { useEffect, useState } from 'react';

function App() {

  const [score, setScore] = useState(null);

  useEffect(() => {

  console.log('Starting fetch...');

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
    <div>
      <h1>OmniSphereAI Dashboard</h1>

      {score ? (
        <div>
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
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;