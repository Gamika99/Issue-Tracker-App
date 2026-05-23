import React from 'react';
import { Issue } from '../types';
import { useNavigate } from 'react-router-dom';

interface IssueDetailProps {
  issue: Issue;
  onDelete: (id: string) => void;
}

const IssueDetail: React.FC<IssueDetailProps> = ({ issue, onDelete }) => {
  const navigate = useNavigate();

  const getPriorityColor = (priority: string) => {
    const colors = {
      Low: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      High: 'bg-orange-100 text-orange-800',
      Critical: 'bg-red-100 text-red-800',
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Open: 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-purple-100 text-purple-800',
      Resolved: 'bg-green-100 text-green-800',
      Closed: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-2xl font-bold text-gray-900">{issue.title}</h1>
        <div className="space-x-2">
          <button
            onClick={() => navigate(`/issues/${issue._id}/edit`)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Edit
          </button>
          <button
            onClick={() => {
              onDelete(issue._id);
              navigate('/');
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <div>
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(issue.status)}`}>
              {issue.status}
            </span>
          </div>
          <div>
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(issue.priority)}`}>
              {issue.priority} Priority
            </span>
          </div>
          {issue.severity && (
            <div>
              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                {issue.severity} Severity
              </span>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{issue.description}</p>
        </div>

        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-500">Created:</span>{' '}
              <span className="text-gray-900">{new Date(issue.createdAt).toLocaleString()}</span>
            </div>
            <div>
              <span className="font-medium text-gray-500">Last Updated:</span>{' '}
              <span className="text-gray-900">{new Date(issue.updatedAt).toLocaleString()}</span>
            </div>
            {issue.assignedTo && (
              <div>
                <span className="font-medium text-gray-500">Assigned To:</span>{' '}
                <span className="text-gray-900">{issue.assignedTo.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;