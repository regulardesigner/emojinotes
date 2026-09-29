import { BrowserRouter, Route, Routes } from 'react-router';

import { Home } from './pages/Home';
import { NewNote } from './pages/NewNote/NewNote';
import { NotFound } from './pages/NotFound';
import { ShareNote } from './pages/ShareNote';
import { ViewNote } from './pages/ViewNote';

export function AppRoutes() {
  return (
    <main className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewNote />} />
        <Route path="/n/:token" element={<ViewNote />} />
        <Route path="/share/:token" element={<ShareNote />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
