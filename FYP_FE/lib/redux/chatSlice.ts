import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// WebSocket connection reference that will persist at module level
let webSocketConnection: WebSocket | null = null;
let initializationInProgress = false;

export const initializeWebSocket = createAsyncThunk(
  'chat/initializeWebSocket',
  async (chatId: string | undefined, { dispatch, getState }) => {
    // Prevent multiple initialization attempts
    if (initializationInProgress) {
      console.log('⏳ WebSocket initialization already in progress');
      return false;
    }

    // Check if we already have a healthy connection
    if (webSocketConnection &&
      (webSocketConnection.readyState === WebSocket.OPEN ||
        webSocketConnection.readyState === WebSocket.CONNECTING)) {
      console.log('✅ WebSocket already connected or connecting');
      return true;
    }

    try {
      initializationInProgress = true;

      // Close any existing connection that may be in a bad state
      if (webSocketConnection) {
        console.log('🔄 Closing existing WebSocket connection');
        webSocketConnection.close();
      }

      let url = process.env.NEXT_PUBLIC_CHAT_BOT_URL || 'ws://localhost:8000/ws/chat/';
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const params = new URLSearchParams();
      if (token) params.set('token', token);
      if (chatId) params.set('chat_id', chatId);
      const qs = params.toString();
      if (qs) url += `?${qs}`;

      console.group('🔌 WebSocket Connection Attempt');
      console.log('🎯 Target URL:', url);
      console.log('📋 Env Variable (NEXT_PUBLIC_CHAT_BOT_URL):', process.env.NEXT_PUBLIC_CHAT_BOT_URL || 'NOT SET');
      console.log('📦 All NEXT_PUBLIC vars:', Object.entries(process.env)
        .filter(([key]) => key.startsWith('NEXT_PUBLIC'))
        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {}));
      console.groupEnd();

      webSocketConnection = new WebSocket(url);

      webSocketConnection.onopen = () => {
        console.log('✅ WebSocket connected successfully!');
        console.log('📊 WebSocket state:', {
          readyState: webSocketConnection?.readyState,
          readyStateLabel: webSocketConnection?.readyState === WebSocket.OPEN ? 'OPEN' : 'OTHER',
          url: webSocketConnection?.url
        });
        dispatch(setSocketConnected(true));
        initializationInProgress = false;

        // If no messages exist, send welcome message
        const { messages } = (getState() as any).chat;
        if (messages.length === 0) {
          dispatch(setMessages([{
            sender: "bot",
            text: "Hi there! Ready to explore the skies? How can I assist you today?",
            initial: true,
          }]));
        }
      };

      webSocketConnection.onmessage = (event) => {
        let botMessage = event.data;
        console.log('Raw message:', botMessage);

        try {
          botMessage = JSON.parse(botMessage);
          console.log('Parsed message:', botMessage);
        } catch {
          console.warn(" Message is not valid JSON, using raw text.");
        }

        if (botMessage?.type === "ping") return;

        // Handle agent activity status updates
        if (botMessage?.type === "agent_status") {
          dispatch(addMessage({ sender: "bot", text: botMessage, type: "agent_status" }));
          return;
        }
        if (botMessage?.type === "agent_update") {
          dispatch(updateAgentStatus({ agentName: botMessage.agent, status: botMessage.status }));
          return;
        }

        let parsedMessage = botMessage;
        let messageType = 'text';

        // Handle different message structures
        if (botMessage?.data?.bot_reply && Array.isArray(botMessage.data.bot_reply)) {
          console.log('Found data.bot_reply:', botMessage.data.bot_reply);
          const firstReply = botMessage.data.bot_reply[0];
          console.log('First reply:', firstReply);

          if (firstReply?.no_function) {
            console.log('Found no_function:', firstReply.no_function);
            parsedMessage = firstReply.no_function;
            messageType = 'text';
          } else if (firstReply?.fetchHotels) {
            parsedMessage = firstReply.fetchHotels;
            messageType = 'hotels';
          } else if (firstReply?.get_flight) {
            parsedMessage = firstReply.get_flight;
            messageType = 'flights';
          } else {
            console.log('Unknown bot_reply structure, stringifying');
            parsedMessage = JSON.stringify(firstReply);
          }
        } else if (botMessage?.bot_reply && Array.isArray(botMessage.bot_reply)) {
          console.log('Found bot_reply:', botMessage.bot_reply);
          const firstReply = botMessage.bot_reply[0];
          console.log('First reply:', firstReply);

          if (firstReply?.no_function) {
            console.log('Found no_function:', firstReply.no_function);
            parsedMessage = firstReply.no_function;
            messageType = 'text';
          } else if (firstReply?.fetchHotels) {
            parsedMessage = firstReply.fetchHotels;
            messageType = 'hotels';
          } else if (firstReply?.get_flight) {
            parsedMessage = firstReply.get_flight;
            messageType = 'flights';
          } else {
            console.log('Unknown bot_reply structure, stringifying');
            parsedMessage = JSON.stringify(firstReply);
          }
        } else if (Array.isArray(botMessage)) {
          console.log('Found array message:', botMessage);

          let textMessage = '';
          const flightData: any[] = [];
          const hotelData: any[] = [];
          let currencyData: any = null;
          let weatherData: any = null;
          let locationData: any[] = [];

          botMessage.forEach(item => {
            if (item.no_function?.status === 'success') {
              textMessage = item.no_function.result;
            }
            // Handle get_Flights with result array (original format)
            else if (item.get_Flights?.status === 'success' && Array.isArray(item.get_Flights.result)) {
              flightData.push(...item.get_Flights.result);
            }
            // Handle get_Flights with data array (new format)
            else if (item.get_Flights?.data && Array.isArray(item.get_Flights.data)) {
              item.get_Flights.data.forEach((flight: any) => {
                if (!flight.error) flightData.push(flight);
              });
              if (item.get_Flights.message && flightData.length === 0) {
                textMessage += (textMessage ? '\n\n' : '') + item.get_Flights.message;
              }
            }
            // Handle get_Flights nested format: {get_Flights: {flights: {data: [...]}}}
            else if (item.get_Flights?.flights?.data && Array.isArray(item.get_Flights.flights.data)) {
              item.get_Flights.flights.data.forEach((flight: any) => {
                if (!flight.error) flightData.push(flight);
              });
              if (item.get_Flights.message && flightData.length === 0) {
                textMessage += (textMessage ? '\n\n' : '') + item.get_Flights.message;
              }
            }
            // Handle get_Flights error — show fallback message
            else if (item.get_Flights?.success === false || item.get_Flights?.flights?.error) {
              if (item.get_Flights?.message) {
                textMessage += (textMessage ? '\n\n' : '') + item.get_Flights.message;
              }
            }
            // Universal robust parsing for get_hotels
            else if (item.get_hotels) {
              const parseHotelItem = (hItem: any) => {
                if (!hItem) return;
                if (Array.isArray(hItem)) {
                  hItem.forEach(parseHotelItem);
                } else if (hItem.details && Array.isArray(hItem.details)) {
                  hotelData.push(...hItem.details);
                } else if (hItem.HotelName || hItem.hotel_name) {
                  hotelData.push(hItem);
                } else if (hItem.hotels) {
                  parseHotelItem(hItem.hotels);
                } else if (hItem.data) {
                  parseHotelItem(hItem.data);
                } else if (hItem.result) {
                  parseHotelItem(hItem.result);
                }
              };
              parseHotelItem(item.get_hotels);
            }
            // Handle get_currency response
            else if (item.get_currency?.currency) {
              currencyData = item.get_currency.currency;
            }
            // Handle get_currency error — skip silently
            else if (item.get_currency?.success === false || item.get_currency?.error) {
              // silent degradation
            }
            // Handle get_weather response
            else if (item.get_weather?.weather) {
              weatherData = item.get_weather.weather;
            }
            // Handle get_weather error — skip silently
            else if (item.get_weather?.success === false) {
              // silent degradation
            }
            // Handle get_locations response
            else if (item.get_locations?.locations) {
              if (Array.isArray(item.get_locations.locations)) {
                locationData = item.get_locations.locations;
              }
            }
            // Handle get_locations error — skip silently
            else if (item.get_locations?.success === false) {
              // silent degradation
            }
          });

          // Create combined message
          if (flightData.length > 0 || hotelData.length > 0 || textMessage || currencyData || weatherData || locationData.length > 0) {
            let displayMessage = '';

            if (textMessage) {
              displayMessage = textMessage;
            }

            if (flightData.length > 0) {
              displayMessage += displayMessage ? '\n\n' : '';
              displayMessage += `Found ${flightData.length} flight option${flightData.length > 1 ? 's' : ''}.`;
            }

            if (hotelData.length > 0) {
              displayMessage += displayMessage ? '\n\n' : '';
              displayMessage += `Found ${hotelData.length} hotel option${hotelData.length > 1 ? 's' : ''}.`;
              hotelData.sort((a: any, b: any) => {
                const ratingA = typeof a.Rating === 'number' ? a.Rating : 0;
                const ratingB = typeof b.Rating === 'number' ? b.Rating : 0;
                return ratingB - ratingA;
              });
            }

            parsedMessage = {
              text: displayMessage,
              flights: flightData,
              hotels: hotelData,
              currency: currencyData,
              weather: weatherData,
              locations: locationData,
            };

            if (weatherData && !flightData.length && !hotelData.length && !currencyData) {
              messageType = 'weather';
            } else if (locationData.length > 0 && !flightData.length && !hotelData.length && !currencyData && !weatherData) {
              messageType = 'locations';
            } else if (currencyData && !flightData.length && !hotelData.length) {
              messageType = 'currency';
            } else if (flightData.length || hotelData.length) {
              messageType = 'travel';
            } else {
              messageType = 'text';
            }
          } else {
            // Handle old array structure for backwards compatibility
            const combinedData: { flights: any[], hotels: any[] } = { flights: [], hotels: [] };

            botMessage.forEach((item: any) => {
              if (item.get_flight) {
                combinedData.flights.push(...item.get_flight.data);
              }
              if (item.fetchHotels) {
                combinedData.hotels.push(...item.fetchHotels.hotels);
              }
            });

            if (combinedData.flights.length > 0 || combinedData.hotels.length > 0) {
              parsedMessage = combinedData;
              messageType = 'travel';
            } else {
              parsedMessage = JSON.stringify(botMessage);
            }
          }
        } else if (botMessage?.data) {
          parsedMessage = botMessage.data;
        } else if (typeof botMessage === 'string') {
          parsedMessage = botMessage;
        } else {
          console.log('Unknown message structure, stringifying:', botMessage);
          parsedMessage = JSON.stringify(botMessage);
        }

        console.log('Final parsed message:', parsedMessage, 'Type:', messageType);

        setTimeout(() => {
          dispatch(addMessage({ sender: "bot", text: parsedMessage, type: messageType }));
          dispatch(setTyping(false));
        }, 1500);
      };

      webSocketConnection.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        console.error('❌ WebSocket readyState:', webSocketConnection?.readyState);
        console.error('❌ Error details:', {
          message: error instanceof Event ? 'Connection error' : String(error),
          type: (error as Event).type,
          timestamp: new Date().toISOString()
        });
        dispatch(setSocketConnected(false));
        dispatch(addMessage({
          sender: "bot",
          text: "We are unable to connect with the chatbot right now!",
          error: true
        }));

        // Schedule reconnection attempt
        setTimeout(() => dispatch(initializeWebSocket()), 5000);
      };

      webSocketConnection.onclose = (event) => {
        console.log('🔌 WebSocket closed. Code:', event.code, 'Reason:', event.reason);
        dispatch(setSocketConnected(false));
      };

      return true;
    } catch (error) {
      console.error("WebSocket initialization failed:", error);
      initializationInProgress = false;
      return false;
    }
  },
  {
    // Condition to prevent duplicate initialization
    condition: (_, { getState }) => {
      const { socketConnected } = (getState() as any).chat;
      // Only initialize if no connection exists and no initialization is in progress
      return !socketConnected && !initializationInProgress;
    }
  }
);

// Thunk to send messages through WebSocket
export const sendWebSocketMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message: string, { dispatch, getState }) => {
    const { socketConnected } = (getState() as any).chat;

    console.log('📤 Sending WebSocket message:', {
      message,
      socketConnected,
      connectionExists: !!webSocketConnection,
      readyState: webSocketConnection?.readyState
    });

    if (!socketConnected || !webSocketConnection) {
      console.warn('⚠️ Socket not connected, attempting initialization...');
      await dispatch(initializeWebSocket());
    }

    try {
      if (webSocketConnection && webSocketConnection.readyState === WebSocket.OPEN) {
        webSocketConnection.send(message);
        dispatch(setTyping(true));
        dispatch(addMessage({ sender: "user", text: message }));
        console.log('✅ Message sent successfully');
        return true;
      } else {
        throw new Error(`WebSocket is not connected. ReadyState: ${webSocketConnection?.readyState}`);
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
      dispatch(addMessage({
        sender: "bot",
        text: "Sorry, there was an error sending your message.",
        error: true
      }));
      return false;
    }
  }
);

interface Message {
  sender: "user" | "bot";
  text: string | any;
  type?: 'text' | 'hotels' | 'flights' | 'travel' | 'currency' | 'weather' | 'locations';
  initial?: boolean;
  error?: boolean;
}

interface ChatState {
  isChatOpen: boolean;
  messages: Message[];
  socketConnected: boolean;
  isTyping: boolean;
}

const initialState: ChatState = {
  isChatOpen: false,
  messages: [],
  socketConnected: false,
  isTyping: false,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setIsChatOpen(state, action) {
      state.isChatOpen = action.payload;
    },
    setMessages(state, action) {
      state.messages = action.payload;
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    clearMessages(state) {
      state.messages = [];
    },
    setSocketConnected(state, action) {
      state.socketConnected = action.payload;
    },
    setTyping(state, action) {
      state.isTyping = action.payload;
    },
    updateAgentStatus(state, action) {
      const { agentName, status } = action.payload;
      for (let i = state.messages.length - 1; i >= 0; i--) {
        const msg = state.messages[i];
        if (msg.type === 'agent_status' && msg.text?.agents) {
          const agent = msg.text.agents.find((a: any) => a.name === agentName);
          if (agent) {
            agent.status = status;
          }
          break;
        }
      }
    }
  },
});

export const {
  setIsChatOpen,
  setMessages,
  addMessage,
  clearMessages,
  setSocketConnected,
  setTyping,
  updateAgentStatus
} = chatSlice.actions;

export default chatSlice.reducer;