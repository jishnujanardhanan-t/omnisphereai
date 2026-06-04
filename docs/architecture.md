# OmniSphereAI Architecture

## Overview

OmniSphereAI is a Salesforce intelligence platform that connects to a Salesforce organization, retrieves metadata information, analyzes it, and presents recommendations through a web dashboard.

---

## Version 1 Architecture

```text
Salesforce Org
      |
      v
Node.js Backend API
      |
      v
Analysis Engine
      |
      v
React Dashboard
```

---

## Components

### Salesforce Layer

Responsible for:

* Authentication
* Metadata retrieval
* Object discovery
* Field discovery

Examples:

* Account Object
* Contact Object
* Opportunity Object
* Custom Objects

---

### Backend API

Technology:

* Node.js
* Express

Responsibilities:

* Connect to Salesforce
* Retrieve metadata
* Process responses
* Expose REST APIs

Endpoints:

* /health
* /objects
* /fields
* /analysis

---

### Analysis Engine

Responsibilities:

* Count objects
* Count custom fields
* Detect unused metadata
* Generate recommendations

Example Recommendations:

* Too many custom fields
* Missing descriptions
* Excessive object complexity

---

### Frontend Dashboard

Technology:

* React

Responsibilities:

* Display metadata
* Show recommendations
* Present dashboards
* User interaction

---

## Folder Structure

```text
omnisphereai
│
├── docs
│   ├── architecture.md
│   └── project-vision.md
│
├── salesforce
│
├── backend
│
├── frontend
│
├── README.md
└── .gitignore
```

---

## Future Enhancements

* AI Assistant
* Metadata Documentation Generator
* Org Health Scoring
* Multi-Org Support
* Predictive Recommendations

---

## Version 1 Goal

Connect to Salesforce, retrieve metadata, analyze it, and display insights through a modern web dashboard.
