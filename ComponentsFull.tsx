import React, {Component, useEffect, useState} from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid' ;
import ApiCalendar from 'react-google-calendar-api';

//Scope so that 
const SCOPES =
  "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar";

  
const [events, setEvents] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = "https://apis.google.com/js/api.js";

    document.body.appendChild(script);

    script.addEventListener("load", () => {
      if (window.gapi) handleClientLoad();
    });
  }, []);

  const handleClientLoad = () => {
    window.gapi.load("client:auth2", initClient);
  };

  const openSignInPopup = () => {
    window.gapi.auth2.authorize(
               { client_id: CLIENT_ID, scope: SCOPES },
               (res) => {
                 if (res) {
                   if (res.access_token)
                     localStorage.setItem("access_token", res.access_token);
 
                   // Load calendar events after authentication
                   window.gapi.client.load("calendar", "v3", listUpcomingEvents);
                 }
               }
             );
 }  
 
 const initClient = () => {
     if (!localStorage.getItem("access_token")) {
       openSignInPopup();
     } else {
       // Get events if access token is found without sign in popup
       fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?key=${API_KEY}&orderBy=startTime&singleEvents=true`,
         {
           headers: {
             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
           },
         }
       )
         .then((res) => {
           // Check if unauthorized status code is return open sign in popup
           if (res.status !== 401) {
             return res.json();
           } else {
             localStorage.removeItem("access_token");
 
             openSignInPopup();
           }
         })
         .then((data) => {
           if (data?.items) {
             setEvents(formatEvents(data.items));
           }
         });
     }
   };
   