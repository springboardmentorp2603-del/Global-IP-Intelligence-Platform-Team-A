const ipDetailMock = {
  id: "US20230123456A1",
  title: "Artificial Intelligence-Based Network Optimization System",
  publicationNumber: "US20230123456A1",
  applicationNumber: "US17/123,456",
  jurisdiction: "United States",
  filingDate: "2021-03-12",
  publicationDate: "2023-06-01",
  priorityDate: "2020-02-15",
  status: "Granted",

  assignee: {
    name: "TechNova Corporation",
    country: "US",
  },

  inventors: ["John Smith", "Emily Carter", "Rahul Mehta"],

  classifications: {
    ipc: ["G06F 9/50", "H04L 12/24"],
    cpc: ["G06F9/455", "H04L67/10"],
    technologyDomain: "Artificial Intelligence & Networking"
  },

  intelligence: {
    forwardCitations: 32,
    familySize: 6,
    remainingTermYears: 14,
    riskLevel: "Medium",
  },

  abstract: "A system and method for optimizing network performance using artificial intelligence models that dynamically adjust bandwidth allocation and routing paths based on real-time traffic analysis.",

  claims: [
    "A system comprising a machine learning model configured to predict network congestion.",
    "The system of claim 1, wherein the model dynamically adjusts routing paths based on latency metrics.",
    "A method for optimizing network bandwidth using predictive analytics and automated switching."
  ],

  legalTimeline: [
    { date: "2020-02-15", event: "Priority Filed" },
    { date: "2021-03-12", event: "Application Filed" },
    { date: "2023-06-01", event: "Published" },
    { date: "2024-01-10", event: "Granted" }
  ],

  // TECHNICAL DRAWINGS DATA
  images: [
    { id: "fig1", title: "Figure 1: System Architecture", url: "https://patentimages.storage.googleapis.com/61/89/63/0677465355a153/US20230123456A1-20230601-D00000.png" },
    { id: "fig2", title: "Figure 2: Flowchart of AI Logic", url: "https://patentimages.storage.googleapis.com/e8/86/7d/55a15306774653/US20230123456A1-20230601-D00001.png" }
  ],

  familyMembers: [
    { country: "US", publicationNumber: "US20230123456A1", status: "Granted" },
    { country: "EP", publicationNumber: "EP3456789A1", status: "Pending" },
    { country: "CN", publicationNumber: "CN11223344A", status: "Filed" }
  ]
};

export default ipDetailMock;