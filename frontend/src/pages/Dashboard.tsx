import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import IssueList from '../components/IssueList';
import IssueFilters from '../components/IssueFilters';
import Pagination from '../components/Pagination';
import { issueService } from '../services/api';
import { Issue } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [counts, setCounts] = useState({
    Open: 0,
    'In Progress': 0,
    Resolved: 0,
    Closed: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
  });

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await issueService.getIssues({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      setIssues(response.data);
      setPagination(response.pagination);
      setCounts(response.counts);
    } catch (error) {
      toast.error('Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [pagination.page, filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
    setPagination({ ...pagination, page: 1 });
  };

  const handleSearch = (searchTerm: string) => {
    setFilters({ ...filters, search: searchTerm });
    setPagination({ ...pagination, page: 1 });
  };

  const handleDelete = async (id: string) => {
    try {
      await issueService.deleteIssue(id);
      toast.success('Issue deleted successfully');
      fetchIssues();
    } catch (error) {
      toast.error('Failed to delete issue');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Issues</h1>
        <button
          onClick={() => navigate('/issues/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Create New Issue
        </button>
      </div>

      <IssueFilters onFilterChange={handleFilterChange} onSearch={handleSearch} />

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <IssueList issues={issues} onDelete={handleDelete} counts={counts} />
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={(page) => setPagination({ ...pagination, page })}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;