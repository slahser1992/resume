import React from 'react';
import Background from "./components/Background";
import Profile from "./pages/instapaper/Profile";
import "./styles/fonts.scss";

const App: React.FC = () => {
  return (
    <div className="App">
      <Profile/>
      <Background/>
    </div>
  );
};

export default App;
