import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// WebSocket connection reference that will persist at module level
let webSocketConnection: WebSocket | null = null;
let initializationInProgress = false;

export const initializeWebSocket = createAsyncThunk(
  'chat/initializeWebSocket',
  async (_, { dispatch, getState }) => {
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

      const url = process.env.NEXT_PUBLIC_CHAT_BOT_URL || 'wss://api.travelmultiverse.com/ws/chat/';

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

        let parsedMessage = botMessage;
        let messageType = 'text';

        // Handle different message structures
        if (botMessage?.data?.bot_reply && Array.isArray(botMessage.data.bot_reply)) {
          console.log('Found data.bot_reply:', botMessage.data.bot_reply);
          const firstReply = botMessage.data[0];
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

          // Check if it starts with a text message
          let textMessage = '';
          const flightData: any[] = [];
          const hotelData: any[] = [];
          let hasErrors: string[] = [];

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
                if (flight.error) {
                  // Parse and display user-friendly error messages
                  console.log('Flight error:', flight.error);
                  let userFriendlyError = "We couldn't find flights for your search.";

                  if (flight.error.includes('status: 400')) {
                    userFriendlyError = "Please check your flight details and try again with valid dates and locations.";
                  } else if (flight.error.includes('status: 500')) {
                    userFriendlyError = "Our flight service is temporarily unavailable. Please try again later.";
                  } else if (flight.error.includes('timeout')) {
                    userFriendlyError = "The flight search is taking too long. Please try again.";
                  }

                  hasErrors.push(` ${userFriendlyError}`);
                } else {
                  flightData.push(flight);
                }
              });
            }
            // Handle get_hotels with result array (original format)
            else if (item.get_hotels?.status === 'success') {
              if (Array.isArray(item.get_hotels.result)) {
                // Check if the result contains hotel objects or error strings
                const firstItem = item.get_hotels.result[0];
                if (typeof firstItem === 'string' && firstItem.includes('Error')) {
                  hasErrors.push(firstItem);
                } else if (typeof firstItem === 'object' && firstItem.hotel_name) {
                  // It's actual hotel data
                  hotelData.push(...item.get_hotels.result);
                }
              } else if (item.get_hotels.result?.hotels) {
                hotelData.push(...item.get_hotels.result.hotels);
              }
            }
            // Handle get_hotels error response
            else if (item.get_hotels?.success === false && item.get_hotels?.message) {
              console.log('Hotel error:', item.get_hotels.message);
              let userFriendlyError = "We couldn't find hotels for your search.";

              if (item.get_hotels.message.includes('time data') || item.get_hotels.message.includes('does not match format')) {
                userFriendlyError = "Please provide valid check-in and check-out dates in your search.";
              } else if (item.get_hotels.message.includes('status: 400')) {
                userFriendlyError = "Please check your hotel search details and try again.";
              } else if (item.get_hotels.message.includes('status: 500')) {
                userFriendlyError = "Our hotel service is temporarily unavailable. Please try again later.";
              } else if (item.get_hotels.message.includes('timeout')) {
                userFriendlyError = "The hotel search is taking too long. Please try again.";
              }

              hasErrors.push(`🏨 ${userFriendlyError}`);
            }
            // Handle get_hotels as direct array (new format)
            else if (item.get_hotels && Array.isArray(item.get_hotels)) {
              item.get_hotels.forEach((hotel: any) => {
                if (typeof hotel === 'string' && hotel.includes('Error')) {
                  console.log('Hotel error:', hotel);
                  hasErrors.push('🏨 Please verify your hotel search details and try again.');
                } else if (hotel.details && hotel.details[0] && hotel.details[0].data) {
                  // Handle hotel with details structure
                  hotelData.push(hotel.details[0].data);
                } else if (hotel.hotel_name) {
                  // Handle direct hotel data
                  hotelData.push(hotel);
                }
              });
            }
          });

          // Create combined message
          if (flightData.length > 0 || hotelData.length > 0 || textMessage || hasErrors.length > 0) {
            let displayMessage = '';

            if (textMessage) {
              displayMessage = textMessage;
            }

            // Display errors first if any
            if (hasErrors.length > 0) {
              displayMessage += displayMessage ? '\n\n' : '';
              displayMessage += hasErrors.join('\n');
            }

            if (flightData.length > 0) {
              displayMessage += displayMessage ? '\n\n' : '';
              displayMessage += ` Found ${flightData.length} flight option${flightData.length > 1 ? 's' : ''}:`;
            }

            if (hotelData.length > 0) {
              displayMessage += displayMessage ? '\n\n' : '';
              displayMessage += `🏨 Found ${hotelData.length} hotel option${hotelData.length > 1 ? 's' : ''}:`;
            }

            parsedMessage = {
              text: displayMessage,
              flights: flightData,
              hotels: hotelData,
              hasErrors: hasErrors.length > 0
            };
            messageType = 'travel';
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
  type?: 'text' | 'hotels' | 'flights' | 'travel';
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
    }
  },
});

export const {
  setIsChatOpen,
  setMessages,
  addMessage,
  clearMessages,
  setSocketConnected,
  setTyping
} = chatSlice.actions;

export default chatSlice.reducer;