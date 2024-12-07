import { useState, useEffect } from 'react';
import './chatHistory.css';

const App = () => {

};

var client_id = Date.now();
var ws = new WebSocket(`ws://127.0.0.1:8000/ws/ws`);

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
};


export default App;
