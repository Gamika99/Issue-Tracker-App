import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import IssueForm from './components/IssueForm';
import IssueDetail from './components/IssueDetail';
import { issueService } from './services/api';
import { User, Issue } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleCreateIssue = async (issueData: Partial<Issue>) => {
    try {
      await issueService.createIssue(issueData);
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to create issue', error);
    }
  };

  const handleUpdateIssue = async (id: string, issueData: Partial<Issue>) => {
    try {
      await issueService.updateIssue(id, issueData);
      window.location.href = `/issues/${id}`;
    } catch (error) {
      console.error('Failed to update issue', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/issues/new"
            element={
              <PrivateRoute>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <h1 className="text-2xl font-bold mb-6">Create New Issue</h1>
                  <IssueForm
                    onSubmit={handleCreateIssue}
                    onCancel={() => window.location.href = '/'}
                  />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/issues/:id"
            element={
              <PrivateRoute>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <IssueDetailWrapper />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/issues/:id/edit"
            element={
              <PrivateRoute>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <h1 className="text-2xl font-bold mb-6">Edit Issue</h1>
                  <IssueEditWrapper onUpdate={handleUpdateIssue} />
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

// Wrapper components for loading issue data
const IssueDetailWrapper: React.FC = () => {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const id = window.location.pathname.split('/')[2];

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const data = await issueService.getIssue(id);
        setIssue(data);
      } catch (error) {
        console.error('Failed to fetch issue', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  const handleDelete = async (issueId: string) => {
    try {
      await issueService.deleteIssue(issueId);
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to delete issue', error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!issue) {
    return <div className="text-center">Issue not found</div>;
  }

  return <IssueDetail issue={issue} onDelete={handleDelete} />;
};

const IssueEditWrapper: React.FC<{ onUpdate: (id: string, data: Partial<Issue>) => void }> = ({ onUpdate }) => {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const id = window.location.pathname.split('/')[2];

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const data = await issueService.getIssue(id);
        setIssue(data);
      } catch (error) {
        console.error('Failed to fetch issue', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!issue) {
    return <div className="text-center">Issue not found</div>;
  }

  return (
    <IssueForm
      initialData={issue}
      onSubmit={(data) => onUpdate(id, data)}
      onCancel={() => window.location.href = `/issues/${id}`}
    />
  );
};

export default App;
