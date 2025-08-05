import './App.css';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {AgentList} from "./components/AgentList";

const queryClient = new QueryClient();
function App() {
  return (
    <div className="App">
        <QueryClientProvider client={queryClient}>
          <AgentList/>
        </QueryClientProvider>
    </div>
  );
}

export default App;
