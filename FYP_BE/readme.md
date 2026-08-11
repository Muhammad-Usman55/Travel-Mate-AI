# TravelMate AI Backend

TravelMate AI Backend is a Django 5.2 service that powers authentication, chat history, WebSocket chat, and travel search tooling for the TravelMate AI frontend.

## What It Does

- Provides custom email/password registration and login with bearer tokens.
- Persists chat sessions and messages in SQLite through Django models.
- Serves a WebSocket chat endpoint for real-time travel assistance.
- Orchestrates travel tools for flights and hotels through the MCP layer.
- Uses `airports.csv` for airport-to-city lookups and travel search support.

## Apps

- `Auth` - custom user and token models
- `ChatBot` - chat persistence, API endpoints, and WebSocket consumer
- `Flight` - flight search and pricing helpers
- `Restaurant` - hotel search helpers

## Tech Stack

- Django 5.2
- Django Channels and Daphne for ASGI/WebSocket support
- SQLite for local development storage
- Requests, aiohttp, pandas, and dotenv for integration helpers
- MCP-based travel orchestration

## Project Structure

- `Backend/` - Django project settings, ASGI, WSGI, and URL config
- `Auth/` - authentication models and views
- `ChatBot/` - chat models, views, consumers, and routing
- `Flight/` - flight lookup helpers
- `Restaurant/` - hotel lookup helpers
- `mcp_travelmate/` - MCP server and agent orchestration
- `airports.csv` - airport and IATA data used by hotel lookup helpers

## Requirements

- Python 3.11 or later is recommended
- pip or a virtual environment manager
- Local `.env` file with the required API keys

## Setup

1. Create and activate a virtual environment.
2. Install the Python dependencies.
3. Create a `.env` file in `FYP_BE/`.
4. Run database migrations.
5. Start the Django server.

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

If you want to run the ASGI app explicitly, you can also launch it with Daphne.

```bash
daphne -b 0.0.0.0 -p 8000 Backend.asgi:application
```

## Environment Variables

Create `FYP_BE/.env` and add the keys used by the backend services:

- `GROQ_API` - Groq API key used by the chat backend
- `SERPAPI_KEY` - API key used for hotel search lookups

If you add more local provider integrations, keep their keys in the same `.env` file.

## API Endpoints

### Authentication

- `POST /api/auth/register/` - create a user and return a token
- `POST /api/auth/login/` - validate credentials and return a token
- `GET /api/auth/verify/` - verify a bearer token

### Chat

- `GET /api/chat/history/` - list a user's chats
- `POST /api/chat/create/` - create a new chat
- `GET /api/chat/<uuid:chat_id>/` - fetch a chat and its messages
- `DELETE /api/chat/<uuid:chat_id>/` - delete a chat

### Admin

- `GET /admin/` - Django admin

## WebSocket Endpoint

- `ws/chat/` - real-time chat consumer handled by `ChatConsumer`

## Data Models

- `AuthUser` - email, password hash, created date
- `AuthToken` - bearer token tied to a user
- `Chat` - chat session owned by a user
- `Message` - message history stored as JSON

## Development Notes

- The backend is configured for local development with `DEBUG = True` and SQLite.
- `Backend/asgi.py` routes HTTP to Django and WebSocket traffic to `ChatBot.routing`.
- The frontend expects this backend to be available before WebSocket chat can connect.

## Troubleshooting

- If migrations fail, confirm the virtual environment is active and dependencies are installed.
- If WebSocket chat does not connect, verify the backend is running on port 8000 and that the frontend points to the correct WebSocket URL.
- If flight or hotel lookups fail, check that `GROQ_API` and `SERPAPI_KEY` are set in `.env`.
