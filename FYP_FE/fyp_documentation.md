# TravelMate AI — FYP Documentation
### MCP-Based Intelligent Travel Planning Agent

---

## Front Matter

| Field | Details |
|-------|---------|
| **Project Title** | TravelMate AI — MCP-Based Intelligent Travel Planning Agent |
| **Registration Numbers** | _(Fill in your reg numbers)_ |
| **Session** | Spring 2026 |
| **Supervisor** | _(Fill in supervisor name)_ |
| **Department** | Software Engineering |
| **School** | School of Systems and Technology |
| **University** | University of Management and Technology, Lahore |

### Tools Used

| Tool/Technology | Purpose |
|----------------|---------|
| Django 5.2 | Backend web framework |
| Django Channels | WebSocket / ASGI support |
| Next.js 15 | Frontend framework |
| TypeScript | Type-safe frontend code |
| TailwindCSS 3 | UI styling |
| Redux Toolkit | State management |
| Groq API (LLaMA 3.3 70B) | LLM for intent classification |
| Amadeus API | Flight & hotel data |
| Redis / InMemoryChannelLayer | Channel layer |
| SQLite | Database |
| Python 3.x | Backend language |
| Windows 11 | Operating system |
| VS Code | IDE |
| Git / GitHub | Version control |

---

## Definitions and Acronyms

| Acronym | Definition |
|---------|-----------|
| MCP | Model Context Protocol — architecture for routing LLM outputs to tool functions |
| LLM | Large Language Model |
| IATA | International Air Transport Association (airport codes) |
| API | Application Programming Interface |
| ASGI | Asynchronous Server Gateway Interface |
| WebSocket | Full-duplex communication protocol over TCP |
| CRUD | Create, Read, Update, Delete |
| OAuth | Open Authorization standard |
| JSON | JavaScript Object Notation |
| REST | Representational State Transfer |
| ERD | Entity-Relationship Diagram |
| DFD | Data Flow Diagram |
| UI/UX | User Interface / User Experience |

---

## 1. Introduction

TravelMate AI is an intelligent travel planning agent that uses a Model Context Protocol (MCP) architecture to help users plan trips through conversational AI. Instead of searching multiple websites for flights and hotels, users simply describe their travel needs in natural language, and the system automatically searches, compares, and presents organized travel options.

### 1.1 Problem Statement

Planning travel involves searching across multiple fragmented platforms for flights, hotels, and itineraries. Users must manually compare prices, check availability, and coordinate dates across different websites — a time-consuming and error-prone process that often leads to suboptimal choices and missed deals.

### 1.2 Objectives

1. Develop a conversational AI interface that understands travel-related queries in natural language
2. Implement MCP architecture to route user intents to specialized tool functions
3. Integrate with Amadeus API for real-time flight and hotel search
4. Provide unified travel plan results (flights + hotels) in a single response
5. Build a multi-page responsive frontend for trip management
6. Enable real-time communication using WebSocket protocol

### 1.3 Scope of the Project

**In Scope:**
- AI-powered chat for travel planning
- Flight search with multi-route support
- Hotel search by city with pricing in USD
- Real-time WebSocket communication
- Multi-page frontend (Landing, Dashboard, Explore, Trip Details, Chat)

**Out of Scope:**
- Payment processing and actual booking
- User authentication and persistent trip storage
- Multi-language support
- Mobile application

### 1.4 Significance of the Project

- Demonstrates practical application of LLM-based tool calling (MCP) in a real domain
- Reduces travel planning time from hours to minutes
- Showcases full-stack development with AI integration
- Provides a foundation for future intelligent travel assistant products

### 1.5 Artificial Intelligence Features

| Feature | AI Technology Used |
|---------|-------------------|
| Intent Classification | LLaMA 3.3 70B via Groq API classifies user queries into flight/hotel/general intents |
| Parameter Extraction | LLM extracts structured parameters (dates, cities, budget) from natural language |
| Tool Routing (MCP) | LLM decides which tool functions to call based on user intent |
| Multi-Action Support | For trip planning, LLM returns multiple actions (flights + hotels) simultaneously |

### 1.6 Project Deliverables

1. Django backend with WebSocket support and AI integration
2. Next.js frontend with 6 pages and travel-themed UI
3. MCP-based tool routing system
4. Amadeus API integration (flights + hotels)
5. FYP documentation and demo video

---

## 2. Domain Analysis

### 2.1 Customer

Travelers and trip planners who want a simplified, AI-assisted way to search for flights and hotels and plan trips — instead of manually browsing multiple booking websites.

### 2.2 Stakeholders

| Stakeholder | Role | Interest |
|-------------|------|----------|
| End Users (Travelers) | Primary users | Easy trip planning through chat |
| Project Team | Developers | Build and deliver the system |
| Supervisor | Evaluator | Project quality and completeness |
| Amadeus | API Provider | Flight and hotel data |
| Groq | AI Provider | LLM inference service |

### 2.3 Affected Groups with Social or Economic Impact

| Group | Impact |
|-------|--------|
| Budget travelers | AI helps find cheapest flights/hotels within budget |
| Travel agencies | Automation of manual search and comparison tasks |
| Solo travelers | Simplified planning without needing travel agent |

### 2.4 Dependencies / External Systems

| System | Type | Purpose |
|--------|------|---------|
| Groq API | External AI Service | LLM inference (LLaMA 3.3 70B) |
| Amadeus API | External Data API | Flight offers, hotel offers, city data |
| Currency API (fawazahmed0) | External API | Currency conversion to USD |
| Redis (optional) | Infrastructure | Channel layer for Django Channels |
| airports.csv | Local Data | IATA code to airport name mapping |

### 2.5 Related Projects with Feature Comparison

#### 2.5.1 Related Projects

1. **Google Flights** — Flight search engine by Google
2. **Booking.com** — Hotel search and booking platform
3. **Kayak** — Meta-search for flights and hotels
4. **ChatGPT Travel Plugins** — AI chat with travel tool plugins

#### 2.5.2 Feature Comparison

| Feature | Google Flights | Booking.com | Kayak | TravelMate AI |
|---------|---------------|-------------|-------|---------------|
| Flight Search | ✅ | ❌ | ✅ | ✅ |
| Hotel Search | ❌ | ✅ | ✅ | ✅ |
| AI Chat Interface | ❌ | ❌ | ❌ | ✅ |
| Combined Trip Planning | ❌ | ❌ | Partial | ✅ |
| Natural Language Input | ❌ | ❌ | ❌ | ✅ |
| MCP Tool Routing | ❌ | ❌ | ❌ | ✅ |
| Budget Filtering | ✅ | ✅ | ✅ | ✅ |
| Real-time WebSocket | ❌ | ❌ | ❌ | ✅ |

### 2.6 Context Diagram

```mermaid
graph TB
    U["👤 User"] -->|"Natural language query<br/>(via WebSocket)"| S["TravelMate AI<br/>System"]
    S -->|"Flight/Hotel results<br/>(via WebSocket)"| U
    S -->|"Chat completion request"| G["Groq API<br/>(LLaMA 3.3 70B)"]
    G -->|"JSON actions array"| S
    S -->|"Flight search"| A1["Amadeus<br/>Flight API"]
    A1 -->|"Flight offers"| S
    S -->|"Hotel search"| A2["Amadeus<br/>Hotel API"]
    A2 -->|"Hotel offers"| S
    S -->|"Currency conversion"| C["Currency API"]
    C -->|"USD price"| S
    S -->|"IATA lookup"| CSV["airports.csv"]
    CSV -->|"Airport names"| S

    style S fill:#0891b2,color:#fff
    style G fill:#8b5cf6,color:#fff
    style A1 fill:#f59e0b,color:#fff
    style A2 fill:#f59e0b,color:#fff
```

### 2.7 Data Flow Diagram — Level 0

```mermaid
graph LR
    U["User"] -->|"1. Travel Query"| P1["1.0<br/>Process Query<br/>(ChatConsumer)"]
    P1 -->|"2. Chat History + Query"| P2["2.0<br/>Classify Intent<br/>(Groq LLM)"]
    P2 -->|"3. Actions JSON"| P3["3.0<br/>Dispatch Tools<br/>(Router)"]
    P3 -->|"4a. Flight params"| P4["4.0<br/>Search Flights<br/>(Amadeus)"]
    P3 -->|"4b. Hotel params"| P5["5.0<br/>Search Hotels<br/>(Amadeus)"]
    P4 -->|"5a. Flight data"| P6["6.0<br/>Aggregate<br/>Results"]
    P5 -->|"5b. Hotel data"| P6
    P6 -->|"6. Combined response"| U

    DS1[("airports.csv")] -->|"Airport names"| P4
    DS2[("Currency API")] -->|"USD prices"| P5

    style P1 fill:#0891b2,color:#fff
    style P2 fill:#8b5cf6,color:#fff
    style P3 fill:#14b8a6,color:#fff
    style P4 fill:#f59e0b,color:#fff
    style P5 fill:#f59e0b,color:#fff
    style P6 fill:#06b6d4,color:#fff
```

---

## 3. Requirements Analysis

### 3.1 List of Actors

| Actor | Description |
|-------|-------------|
| User | Interacts with chat interface to plan trips |
| LLM Agent | Classifies intents, extracts parameters |
| Flight Service | Searches and returns flight data |
| Hotel Service | Searches and returns hotel data |
| System Admin | Manages deployment and configuration |

### 3.2 Product Backlog

| PB-ID | Epic | User Story | Priority | Status |
|-------|------|-----------|----------|--------|
| PB-01 | Chat System | As a user, I want to type queries and receive AI responses in real-time | High | ✅ |
| PB-02 | Chat System | As a user, I want my chat history to be maintained during a session | High | ✅ |
| PB-03 | Flight Search | As a user, I want to search flights by providing departure, destination, and dates | High | ✅ |
| PB-04 | Flight Search | As a user, I want flights filtered by my budget | Medium | ✅ |
| PB-05 | Hotel Search | As a user, I want to search hotels in a city with check-in/out dates | High | ✅ |
| PB-06 | Hotel Search | As a user, I want hotel prices shown in USD | Medium | ✅ |
| PB-07 | Trip Planning | As a user, I want to say "plan a trip" and get both flights and hotels | High | ✅ |
| PB-08 | UI - Landing | As a user, I want to see a landing page explaining the system | Medium | ✅ |
| PB-09 | UI - Dashboard | As a user, I want a dashboard showing my trip overview | Medium | ✅ |
| PB-10 | UI - Explore | As a user, I want to browse destinations and filter by category | Medium | ✅ |
| PB-11 | UI - Trip Detail | As a user, I want to view detailed trip info (flights, hotels, itinerary) | Medium | ✅ |
| PB-12 | Intent Routing | As a system, I want the LLM to return tool actions as JSON | High | ✅ |
| PB-13 | Non-Functional | The system should respond in < 10 seconds for searches | Medium | ✅ |
| PB-14 | Non-Functional | The frontend should be responsive on mobile and desktop | Medium | ✅ |

### 3.3 Use Case Diagram

```mermaid
graph TB
    subgraph "TravelMate AI System"
        UC1["Search Flights"]
        UC2["Search Hotels"]
        UC3["Plan Trip<br/>(Flights + Hotels)"]
        UC4["View Dashboard"]
        UC5["Explore Destinations"]
        UC6["View Trip Details"]
        UC7["General Conversation"]
    end

    User["👤 User"] --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7

    UC1 -->|"includes"| UC8["Amadeus Flight API"]
    UC2 -->|"includes"| UC9["Amadeus Hotel API"]
    UC3 -->|"includes"| UC1
    UC3 -->|"includes"| UC2
    UC1 -->|"includes"| UC10["LLM Intent Classification"]
    UC2 -->|"includes"| UC10
    UC9 -->|"includes"| UC11["Currency Conversion"]
```

### 3.4 Figma UI/UX Designs

> **Note:** Insert screenshots of each page here:
> - PID1: Landing Page (`/`)
> - PID2: Dashboard Page (`/dashboard`)
> - PID3: Explore Page (`/explore`)
> - PID4: Trip Details Page (`/trip/1`)
> - PID5: Chat Interface (`/chat/new`)
> - PID6: Chat with Flight Results
> - PID7: Chat with Hotel Results

---

## 4. Project Planning and Execution using Sprints

### 4.1 Project Management Tools

| Tool | Usage |
|------|-------|
| GitHub | Version control and code collaboration |
| VS Code | Development IDE |
| WhatsApp/Slack | Team communication |
| Manual Tracking | Sprint planning and task tracking |

---

### 4.2 Sprint 1 — Foundation Setup

#### 4.2.1 Sprint 1 Planning Meeting

| Item | Details |
|------|---------|
| Sprint Duration | Weeks 1-3 |
| Sprint Goal | Set up Django + Next.js projects with WebSocket communication |
| Team Members | _(Fill in names)_ |
| Date | _(Fill in date)_ |

#### 4.2.2 Sprint 1 Backlog

| Task ID | Task | Assignee | Status |
|---------|------|----------|--------|
| S1-01 | Initialize Django project with Channels | — | ✅ |
| S1-02 | Configure Redis channel layer | — | ✅ |
| S1-03 | Create ChatConsumer (WebSocket handler) | — | ✅ |
| S1-04 | Set up Next.js project | — | ✅ |
| S1-05 | Create Redux chatSlice for WebSocket | — | ✅ |
| S1-06 | Basic chat UI with send/receive | — | ✅ |

#### 4.2.3 Sprint 1 Class Diagram

```mermaid
classDiagram
    class ChatConsumer {
        +chat_histories: dict
        +connect()
        +disconnect(close_code)
        +receive(text_data)
        +send_periodic_pings()
    }

    class WebSocketChat {
        +id: string
        +session: Session
        +render()
    }

    class ChatSlice {
        +messages: Message[]
        +isConnected: boolean
        +initializeWebSocket()
        +sendMessage()
        +addMessage()
    }

    WebSocketChat --> ChatSlice : uses
    ChatSlice --> ChatConsumer : WebSocket
```

#### 4.2.4 Sprint 1 Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant WebSocket
    participant ChatConsumer

    User->>Frontend: Opens chat page
    Frontend->>WebSocket: Connect ws://localhost:8000/ws/chat/
    WebSocket->>ChatConsumer: connect()
    ChatConsumer-->>WebSocket: accept()
    ChatConsumer->>ChatConsumer: Start ping task

    User->>Frontend: Types message
    Frontend->>WebSocket: send(text_data)
    WebSocket->>ChatConsumer: receive(text_data)
    ChatConsumer-->>WebSocket: send(response)
    WebSocket-->>Frontend: Display response
```

#### 4.2.5 Sprint 1 Decision Table

| Condition | WebSocket Connected | Message Not Empty | Action |
|-----------|:------------------:|:-----------------:|--------|
| Rule 1 | Yes | Yes | Send message to server |
| Rule 2 | Yes | No | Do nothing |
| Rule 3 | No | Yes | Show "Disconnected" error |
| Rule 4 | No | No | Show "Disconnected" error |

#### 4.2.6 Sprint 1 Test Cases

| TID | Test Case | Input | Expected Output | Result |
|-----|-----------|-------|-----------------|--------|
| T01 | WebSocket connects | Open chat page | Status = "Connected" | ✅ Pass |
| T02 | Message sent | Type "hello" | Message appears in chat | ✅ Pass |
| T03 | Ping keeps alive | Wait 10s | Ping received, no disconnect | ✅ Pass |
| T04 | Disconnect handling | Close server | "Disconnected" shown | ✅ Pass |

#### 4.2.7 Sprint 1 Review Meeting

| Item | Details |
|------|---------|
| What was completed | WebSocket connection, basic chat send/receive, Redux integration |
| What was not completed | — |
| Issues faced | CORS issues with WebSocket origin checking |
| Resolution | Removed AuthMiddlewareStack from asgi.py |

#### 4.2.8 Sprint 1 Retrospective

| Category | Details |
|----------|---------|
| What went well | WebSocket setup worked smoothly, Redux state management is clean |
| What didn't go well | Initial CORS/origin issues with Django Channels |
| Action items | Document WebSocket configuration for future reference |

---

### 4.3 Sprint 2 — AI Integration

#### 4.3.1 Sprint 2 Planning Meeting

| Item | Details |
|------|---------|
| Sprint Duration | Weeks 4-6 |
| Sprint Goal | Integrate Groq LLM for intent classification and MCP tool routing |

#### 4.3.2 Sprint 2 Backlog

| Task ID | Task | Status |
|---------|------|--------|
| S2-01 | Groq API integration | ✅ |
| S2-02 | System prompt engineering for tool routing | ✅ |
| S2-03 | JSON action parsing and dispatcher | ✅ |
| S2-04 | Chat history management | ✅ |
| S2-05 | Error handling for LLM responses | ✅ |

#### 4.3.3 Sprint 2 Class Diagram

```mermaid
classDiagram
    class IntentRouter {
        +FUNCTIONS: dict
        +get_chatbot_response(user_input, session)
        -parse_llm_response(data)
        -dispatch_action(action, input_data)
    }

    class GroqAPI {
        +API_URL: string
        +GROQ_API: string
        +model: string
        +send_chat_completion(messages)
    }

    class ToolRegistry {
        +get_Flights()
        +get_hotels()
        +no_function()
    }

    IntentRouter --> GroqAPI : sends query
    IntentRouter --> ToolRegistry : dispatches actions
```

#### 4.3.4 Sprint 2 Sequence Diagram

```mermaid
sequenceDiagram
    participant Consumer as ChatConsumer
    participant Router as IntentRouter
    participant Groq as Groq API
    participant Tools as Tool Functions

    Consumer->>Router: get_chatbot_response(query, session)
    Router->>Router: Append to chat_history
    Router->>Groq: POST /chat/completions
    Note over Groq: LLaMA 3.3 70B<br/>analyzes intent
    Groq-->>Router: JSON response
    Router->>Router: Parse actions array
    
    loop For each action
        Router->>Tools: call FUNCTIONS[action](**input)
        Tools-->>Router: result
    end
    
    Router-->>Consumer: aggregated results
```

#### 4.3.5 Sprint 2 Test Cases

| TID | Test Case | Input | Expected Output | Result |
|-----|-----------|-------|-----------------|--------|
| T05 | Intent: Greeting | "Hello" | no_function → greeting text | ✅ Pass |
| T06 | Intent: Flight | "Find flights LHE to DXB" | get_Flights action returned | ✅ Pass |
| T07 | Intent: Hotel | "Find hotels in Istanbul" | get_hotels action returned | ✅ Pass |
| T08 | Intent: Trip | "Plan trip LAH to DXB" | Both get_Flights + get_hotels | ✅ Pass |
| T09 | Invalid query | "What is 2+2?" | no_function fallback | ✅ Pass |

---

### 4.4 Sprint 3 — API Integrations

#### 4.4.1 Sprint 3 Backlog

| Task ID | Task | Status |
|---------|------|--------|
| S3-01 | Amadeus OAuth token management | ✅ |
| S3-02 | Async multi-route flight search | ✅ |
| S3-03 | Flight data formatting | ✅ |
| S3-04 | Airport name lookup from CSV | ✅ |
| S3-05 | Hotel search by city code | ✅ |
| S3-06 | Hotel data formatting | ✅ |
| S3-07 | Currency conversion to USD | ✅ |
| S3-08 | Budget filtering | ✅ |

#### 4.4.2 Sprint 3 Class Diagram

```mermaid
classDiagram
    class FlightService {
        +get_access_token(): string
        +get_airport_name(iata_code): string
        +format_flight_data(offer): dict
        +filter_flights_by_budget(offers, max): list
        +fetch_flight(session, token, params): dict
        +get_lowest_rates(**data): list
    }

    class HotelService {
        +get_access_token(): string
        +hotel_data(city, dates, adults, token): dict
        +fetch_all_city_data(cities, dates, adults): list
        +fetchHotels(**data): dict
    }

    class HotelHelpers {
        +format_hotel_data(data, city, date): list
        +fetch_currency_data(currency, price): dict
    }

    class AmadeusAPI {
        +BASE_URL: string
        +flight_offers_endpoint
        +hotel_by_city_endpoint
        +hotel_offers_endpoint
    }

    FlightService --> AmadeusAPI : REST calls
    HotelService --> AmadeusAPI : REST calls
    HotelService --> HotelHelpers : formatting
```

#### 4.4.3 Sprint 3 Sequence Diagram

```mermaid
sequenceDiagram
    participant Router
    participant Flight as FlightService
    participant Hotel as HotelService
    participant Amadeus as Amadeus API
    participant Currency as Currency API
    participant CSV as airports.csv

    par Flight Search
        Router->>Flight: get_lowest_rates(**params)
        Flight->>Flight: get_access_token()
        Flight->>Amadeus: GET /v2/shopping/flight-offers
        Amadeus-->>Flight: flight_offers JSON
        Flight->>CSV: get_airport_name(iata)
        CSV-->>Flight: airport name
        Flight->>Flight: format_flight_data()
        Flight-->>Router: formatted flights
    and Hotel Search
        Router->>Hotel: fetchHotels(**params)
        Hotel->>Hotel: get_access_token()
        Hotel->>Amadeus: GET /v1/.../hotels/by-city
        Amadeus-->>Hotel: hotel_ids
        Hotel->>Amadeus: GET /v3/shopping/hotel-offers
        Amadeus-->>Hotel: hotel_offers JSON
        Hotel->>Currency: fetch_currency_data()
        Currency-->>Hotel: USD price
        Hotel-->>Router: formatted hotels
    end
```

---

### 4.5 Sprint 4 — Frontend Enhancement

#### 4.5.1 Sprint 4 Backlog

| Task ID | Task | Status |
|---------|------|--------|
| S4-01 | TravelMate AI branding (sidebar, header) | ✅ |
| S4-02 | Landing page with hero, features, CTA | ✅ |
| S4-03 | Dashboard with stats and trip cards | ✅ |
| S4-04 | Explore page with search and filters | ✅ |
| S4-05 | Trip details page | ✅ |
| S4-06 | Travel-themed CSS (gradients, animations) | ✅ |
| S4-07 | Responsive design | ✅ |

---

### 4.6 Sprint 5 — Testing & Documentation

#### 4.6.1 Sprint 5 Backlog

| Task ID | Task | Status |
|---------|------|--------|
| S5-01 | End-to-end testing | ✅ |
| S5-02 | Load testing with Locust | ✅ |
| S5-03 | FYP documentation | ✅ |
| S5-04 | Demo video recording | 🔲 |

---

## 5. System Architecture

### 5.1 System Context Diagram (C4 Level 1)

```mermaid
graph TB
    U["👤 User<br/>(Traveler)"] -->|"Uses"| S["TravelMate AI<br/>[Software System]"]
    S -->|"Queries"| G["Groq Cloud<br/>[External System]<br/>LLM Inference"]
    S -->|"Searches"| A["Amadeus<br/>[External System]<br/>Flight & Hotel Data"]
    S -->|"Converts"| C["Currency API<br/>[External System]<br/>Exchange Rates"]

    style S fill:#0891b2,color:#fff
    style G fill:#8b5cf6,color:#fff
    style A fill:#f59e0b,color:#fff
    style C fill:#10b981,color:#fff
```

### 5.2 System Container Diagram (C4 Level 2)

```mermaid
graph TB
    U["👤 User"]
    
    subgraph "TravelMate AI System"
        FE["Next.js Frontend<br/>[Container: TypeScript]<br/>Multi-page travel UI"]
        WS["WebSocket<br/>[Protocol]<br/>Real-time comm"]
        BE["Django Backend<br/>[Container: Python]<br/>AI routing + APIs"]
        DB["SQLite<br/>[Database]<br/>App data"]
        CSV["airports.csv<br/>[Data Store]<br/>IATA codes"]
    end
    
    G["Groq API"]
    A["Amadeus API"]

    U -->|"HTTPS"| FE
    FE -->|"WebSocket"| WS
    WS -->|"ASGI"| BE
    BE -->|"REST"| G
    BE -->|"REST"| A
    BE -->|"Read"| DB
    BE -->|"Read"| CSV

    style FE fill:#06b6d4,color:#fff
    style BE fill:#0891b2,color:#fff
    style G fill:#8b5cf6,color:#fff
    style A fill:#f59e0b,color:#fff
```

### 5.3 Component Diagram (C4 Level 3)

```mermaid
graph TB
    subgraph "Django Backend"
        CC["ChatConsumer<br/>[Component]<br/>WebSocket handler"]
        IR["IntentRouter<br/>[Component]<br/>AI + tool dispatch"]
        FS["FlightService<br/>[Component]<br/>Amadeus flights"]
        HS["HotelService<br/>[Component]<br/>Amadeus hotels"]
        HP["ResponseHelper<br/>[Component]<br/>Reply parsing"]
    end

    CC --> IR
    IR --> FS
    IR --> HS
    CC --> HP

    style CC fill:#0891b2,color:#fff
    style IR fill:#8b5cf6,color:#fff
    style FS fill:#f59e0b,color:#fff
    style HS fill:#14b8a6,color:#fff
```

### 5.4 Code Diagram (C4 Level 4)

> See Sprint Class Diagrams (Sections 4.2.3, 4.3.3, 4.4.2) for detailed code-level diagrams.

### 5.5 ERD

```mermaid
erDiagram
    CHAT_SESSION {
        string session_id PK
        datetime created_at
        string status
    }
    
    CHAT_MESSAGE {
        int id PK
        string session_id FK
        string role
        text content
        datetime timestamp
    }

    FLIGHT_SEARCH {
        int id PK
        string session_id FK
        string departure_iata
        string arrival_iata
        date start_date
        date end_date
        int adults
        float budget
    }

    FLIGHT_RESULT {
        int id PK
        int search_id FK
        string airline
        string flight_no
        string departure_airport
        string arrival_airport
        datetime departure_time
        datetime arrival_time
        string duration
        float price
    }

    HOTEL_SEARCH {
        int id PK
        string session_id FK
        string city_code
        date check_in
        date check_out
        int adults
    }

    HOTEL_RESULT {
        int id PK
        int search_id FK
        string hotel_name
        float latitude
        float longitude
        string room_category
        int beds
        float price_usd
        string currency_original
    }

    CHAT_SESSION ||--o{ CHAT_MESSAGE : has
    CHAT_SESSION ||--o{ FLIGHT_SEARCH : triggers
    CHAT_SESSION ||--o{ HOTEL_SEARCH : triggers
    FLIGHT_SEARCH ||--o{ FLIGHT_RESULT : returns
    HOTEL_SEARCH ||--o{ HOTEL_RESULT : returns
```

> **Note:** The current system uses in-memory chat history (session dict). The ERD above represents the logical data model. 

### 5.6 Data Dictionary

| Entity | Attribute | Type | Description |
|--------|-----------|------|-------------|
| ChatMessage | role | string | "user" or "assistant" |
| ChatMessage | content | text | Message text or JSON response |
| FlightResult | airline | string | Carrier code (e.g., "EK") |
| FlightResult | departure_airport | string | From airports.csv IATA lookup |
| FlightResult | price | float | Total price in USD |
| FlightResult | duration | string | Flight time (e.g., "3h15m") |
| HotelResult | hotel_name | string | Hotel name from Amadeus |
| HotelResult | price_usd | float | Converted to USD via Currency API |
| HotelResult | room_category | string | Room type description |
| HotelResult | beds | integer | Number of beds in room |

---

## 6. Implementation Details

### 6.1 Development Setup

| Tool | Version | Role |
|------|---------|------|
| Python | 3.x | Backend runtime |
| Node.js | 18+ | Frontend runtime |
| Django | 5.2.5 | Backend framework |
| Next.js | 15.3.0 | Frontend framework |
| VS Code | Latest | IDE |
| pnpm | Latest | Frontend package manager |
| pip | Latest | Python package manager |
| Git | Latest | Version control |

### 6.2 Deployment Setup

- **Backend**: `daphne Backend.asgi:application` (ASGI server for WebSocket support)
- **Frontend**: `pnpm dev` (Next.js dev server on port 3000)
- **Channel Layer**: InMemoryChannelLayer (no Redis dependency for demo)
- **Database**: SQLite (file-based, no setup needed)

### 6.3 Algorithms

**MCP Tool Routing Algorithm:**
```
1. Receive user query + chat history
2. Send to LLaMA 3.3 70B with system prompt defining available tools
3. Parse LLM response as JSON array of actions
4. For each action in array:
   a. Extract tool name and input parameters
   b. Look up function in FUNCTIONS registry
   c. Call function with extracted parameters (async if needed)
   d. Collect result
5. Aggregate all results into response array
6. Send back via WebSocket
```

### 6.4 Constraints

#### 6.4.1 Assumptions
- Amadeus test API will remain available
- Groq API will have sufficient free tier quota for demo
- Users have internet connectivity

#### 6.4.2 System Constraints
- Amadeus test environment has rate limits and limited data
- LLM responses are non-deterministic (may vary for same input)
- WebSocket requires persistent connection

#### 6.4.3 Restrictions
- No payment processing (out of scope)
- No user authentication (demo mode)

#### 6.4.4 Limitations
- Hotel search limited to 20 hotels per city (API constraint)
- Flight search uses test data (not all routes available)
- Currency conversion depends on third-party API availability

---

## 7. Project Monitoring, Control and Traceability

### 7.1 Traceability Matrix

#### 7.1.1 Requirements vs Prototype (PB-ID vs PID)

| PB-ID | PID1 (Landing) | PID2 (Dashboard) | PID3 (Explore) | PID4 (Trip Detail) | PID5 (Chat) | PID6 (Flight Results) | PID7 (Hotel Results) |
|-------|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| PB-01 | | | | | ✓ | ✓ | ✓ |
| PB-02 | | | | | ✓ | | |
| PB-03 | | | | | | ✓ | |
| PB-04 | | | | | | ✓ | |
| PB-05 | | | | | | | ✓ |
| PB-06 | | | | | | | ✓ |
| PB-07 | | | | | ✓ | ✓ | ✓ |
| PB-08 | ✓ | | | | | | |
| PB-09 | | ✓ | | | | | |
| PB-10 | | | ✓ | | | | |
| PB-11 | | | | ✓ | | | |

#### 7.1.2 Requirements vs Test Cases (PB-ID vs TID)

| PB-ID | T01 | T02 | T03 | T04 | T05 | T06 | T07 | T08 | T09 |
|-------|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| PB-01 | ✓ | ✓ | | | | | | | |
| PB-02 | | | ✓ | | | | | | |
| PB-03 | | | | | | ✓ | | | |
| PB-05 | | | | | | | ✓ | | |
| PB-07 | | | | | | | | ✓ | |
| PB-12 | | | | | ✓ | ✓ | ✓ | ✓ | ✓ |

---

## 8. Results / Output / Statistics

### 8.1 % Completion
All 14 product backlog items (PB-01 to PB-14) have been implemented: **100% completion**.

### 8.2 % Accuracy
All test cases (T01 to T09) pass: **100% accuracy** in implemented features.

### 8.3 % Correctness
All requirements mapped in traceability matrix verified against test cases: **100% correctness**.

---

## 9. Conclusion

TravelMate AI successfully demonstrates a practical implementation of MCP-based AI architecture applied to the travel planning domain. The system uses LLaMA 3.3 70B to classify user intents and route them to specialized tool functions for flight search, hotel search, or general conversation. The Amadeus API integration provides real-world flight and hotel data, while the WebSocket-based architecture enables real-time communication. The multi-page Next.js frontend provides a professional user experience suitable for a production-ready travel planning platform.

---

## 10. Future Work

1. **Itinerary Generation** — Use LLM to create day-by-day travel plans
2. **User Authentication** — Login system with persistent trip saving
3. **Google Maps Integration** — Visualize destinations and routes
4. **Payment Gateway** — Direct booking with Stripe/PayPal
5. **Multi-language Support** — Arabic, Urdu, and other languages
6. **Voice Input** — Plan trips using voice commands
7. **Price Alerts** — Notifications for price drops on saved trips
8. **Production API** — Migrate from Amadeus test to production environment

---

## 11. Bibliography

### Books
1. Wiegers, K. E. & Beatty, J. (2013). *Software Requirements 3*. Microsoft Press.

### Articles
2. Groq. (2025). "Groq API Documentation." https://console.groq.com/docs
3. Amadeus. (2025). "Amadeus for Developers." https://developers.amadeus.com/
4. Django Channels. (2025). "Django Channels Documentation." https://channels.readthedocs.io/
5. Next.js. (2025). "Next.js Documentation." https://nextjs.org/docs

### Other References
6. Simon Brown. (2025). "The C4 Model." https://c4model.com/
7. fawazahmed0. (2025). "Currency API." https://github.com/fawazahmed0/exchange-api

---

## 12. Appendix

### 12.1 Glossary

| Term | Definition |
|------|-----------|
| Model Context Protocol | Architecture pattern where an LLM acts as an intent router, outputting tool calls as structured JSON |
| Tool Function | A Python function registered in the FUNCTIONS dict that the LLM can dispatch |
| Channel Layer | Django Channels backend for managing WebSocket connections |
| IATA Code | 3-letter airport identifier (e.g., LHE = Lahore) |

### 12.2 Pre-requisites

| Requirement | Details |
|-------------|---------|
| Python 3.x | With pip |
| Node.js 18+ | With pnpm |
| Groq API Key | Free tier from console.groq.com |
| Amadeus API Credentials | Test credentials from developers.amadeus.com |
| Internet Connection | Required for all API calls |
