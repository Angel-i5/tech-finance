/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ArticleDetail } from './pages/ArticleDetail';
import { About } from './pages/About';
import { Privacy } from './pages/Privacy';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminEditor } from './pages/AdminEditor';
import { AdminSettings } from './pages/AdminSettings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="article/:slug" element={<ArticleDetail />} />
          <Route path="sobre-nosotros" element={<About />} />
          <Route path="privacidad" element={<Privacy />} />
          <Route path="admin/login" element={<AdminLogin />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/new" element={<AdminEditor />} />
          <Route path="admin/edit/:id" element={<AdminEditor />} />
          <Route path="admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
