import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useEffect, useState } from 'react';

function Calander() {
  const [events, setEvents] = useState([]);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token') || '');

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    onSuccess: async (tokenResponse) => {
      const token = tokenResponse.access_token;
      setAccessToken(token);
      localStorage.setItem('access_token', token); // Save token locally
      fetchEvents(token); // Fetch calendar events
    },
    onError: () => console.log('Login Failed'),
    flow: 'implicit', // Client-side flow, no refresh token
  });

  const fetchEvents = async (token) => {
    const { data } = await axios.get(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log('====================================');
    console.log(data);
    console.log('====================================');
    setEvents(data.items);
  };

  useEffect(() => {
    if (accessToken) fetchEvents(accessToken); // Load events if token exists
  }, [accessToken]);

  return (
      <div>
        <h1>Your Dashboard</h1>
        {!accessToken && <button onClick={() => login()}>Connect to Google Calendar</button>}
        {accessToken && (
          <ul>
            {events.map((event) => (
              <li key={event.id}>{event.summary} - {event.start.dateTime}</li>
            ))}
          </ul>
        )}
      </div>
    
  );
}

export default Calander;