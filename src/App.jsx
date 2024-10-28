import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/Chat";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/Chat" element={<ChatPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
