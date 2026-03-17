import './assets/styles/index.css';

import { Outlet } from 'react-router';

function App() {
  return (
    <div className="mx-auto flex max-w-200 flex-col items-center justify-center px-6 text-5xl">
      {/* 可放header */}
      <Outlet />
      {/* 可放footer */}
    </div>
  );
}

export default App;
