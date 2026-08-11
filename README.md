# TravelMate AI

TravelMate AI is a travel planning platform with a Next.js frontend and a Django backend. The project combines AI chat, destination browsing, trip planning, flight and hotel lookups, authentication, and real-time WebSocket messaging.

## Repository Structure

- [FYP_FE/README.md](FYP_FE/README.md) - frontend documentation for the Next.js app
- [FYP_BE/readme.md](FYP_BE/readme.md) - backend documentation for the Django service
- [Travel Mate AI.pdf](Travel%20Mate%20AI.pdf) - project report
- [TravelMate_AI_Standee_2x5.pdf](TravelMate_AI_Standee_2x5.pdf) - presentation material

## High-Level Architecture

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS, Redux Toolkit
- Backend: Django 5.2, Django Channels, Daphne, SQLite, and MCP orchestration
- Integrations: Groq, xAI, Amadeus, SerpAPI, Vercel services, and WebSocket chat

## How the Project Is Organized

The frontend and backend are separated into their own folders so each side can be developed and run independently. The frontend handles the user interface, AI chat experiences, and browser-facing API routes. The backend provides authentication, chat history, WebSocket chat, and travel data orchestration.

## Getting Started

1. Read the frontend setup guide in [FYP_FE/README.md](FYP_FE/README.md).
2. Read the backend setup guide in [FYP_BE/readme.md](FYP_BE/readme.md).
3. Start the backend first, then run the frontend.
4. Configure the environment variables described in each subproject README.

## Notes

- The frontend expects the backend WebSocket service to be available for chat features.
- Both projects rely on external API keys for full functionality.
- The root folder also contains project documentation PDFs and supporting assets for the FYP submission.
