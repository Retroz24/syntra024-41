
// Mock data for general tech topics
const techTopicsData = [
  { name: "Git & GitHub", icon: "Gt", status: "active" as const, members: 187, description: "Version control & collaboration" },
  { name: "CI/CD", icon: "CI", status: "idle" as const, members: 124, description: "Continuous integration & delivery" },
  { name: "Docker", icon: "Do", status: "active" as const, members: 156, description: "Containerization" },
  { name: "Kubernetes", icon: "K8", status: "busy" as const, members: 98, description: "Container orchestration" },
  { name: "Cloud", icon: "Cl", status: "active" as const, members: 211, description: "AWS, Azure, GCP" },
  { name: "DevOps", icon: "Dv", status: "active" as const, members: 164, description: "Development operations" },
];

// Mock data for database topics
const databaseData = [
  { name: "MongoDB", icon: "Mo", status: "active" as const, members: 187, description: "NoSQL database" },
  { name: "PostgreSQL", icon: "Pg", status: "busy" as const, members: 173, description: "SQL database" },
  { name: "MySQL", icon: "My", status: "active" as const, members: 159, description: "SQL database" },
  { name: "Redis", icon: "Re", status: "idle" as const, members: 112, description: "In-memory data store" },
  { name: "Firebase", icon: "Fb", status: "active" as const, members: 142, description: "Backend-as-a-service" },
];

// Mock data for AI integration
const aiData = [
  { name: "LangChain", icon: "Lc", status: "active" as const, members: 124, description: "LLM framework" },
  { name: "OpenAI", icon: "OA", status: "busy" as const, members: 194, description: "AI APIs & services" },
  { name: "TensorFlow", icon: "Tf", status: "idle" as const, members: 107, description: "ML framework" },
  { name: "PyTorch", icon: "Pt", status: "active" as const, members: 118, description: "ML framework" },
  { name: "Hugging Face", icon: "HF", status: "busy" as const, members: 89, description: "ML models & tools" },
];

// Mock data for notifications
const notificationsData = [
  {
    id: "1",
    type: "invite" as const,
    title: "Room Invitation",
    message: "Alex invited you to join 'React Hooks Mastery'",
    time: "5m ago",
    read: false,
    actionable: true
  },
  {
    id: "2",
    type: "activity" as const,
    title: "Room Activity",
    message: "New message in 'TypeScript Types & Utilities'",
    time: "15m ago",
    read: false,
    actionable: false
  },
  {
    id: "3",
    type: "admin" as const,
    title: "Join Request",
    message: "Sarah wants to join your 'Python Algorithms' room",
    time: "30m ago",
    read: false,
    actionable: true
  },
  {
    id: "4",
    type: "message" as const,
    title: "New Message",
    message: "Mike: Can anyone help with a React Router issue?",
    time: "1h ago",
    read: true,
    actionable: false
  }
];
