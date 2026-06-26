"use client";

import React from "react";
import type { Case, CaseComment, CaseHistoryEvent } from "../contracts/case.schema";

interface CaseDetailProps {
  caseData: Case;
  comments: CaseComment[];
  history: CaseHistoryEvent[];
  onStatusChange: (status: string) => void;
  onAddComment: (content: string) => void;
}

export const CaseDetail: React.FC<CaseDetailProps> = ({
  caseData,
  comments,
  history,
  onStatusChange,
  onAddComment
}) => {
  const [commentText, setCommentText] = React.useState("");

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">{caseData.title}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{caseData.category} - {caseData.priority} priority</p>
          </div>
          <div className="space-x-2">
            <select
              value={caseData.status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{caseData.description || "No description provided."}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Origin</dt>
              <dd className="mt-1 text-sm text-gray-900">{caseData.origin}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Responsible</dt>
              <dd className="mt-1 text-sm text-gray-900">{caseData.assignedToName || "Unassigned"}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Comments</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <div className="flex-1 bg-gray-50 rounded-lg px-4 py-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold">{comment.authorName}</h4>
                  <span className="text-xs text-gray-500">{comment.createdAt.toLocaleString()}</span>
                </div>
                <p className="text-sm mt-1">{comment.content}</p>
              </div>
            </div>
          ))}
          <form onSubmit={handleSubmitComment} className="mt-4">
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Add a comment..."
            ></textarea>
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Post Comment
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">History</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <ul className="divide-y divide-gray-200">
            {history.map((event) => (
              <li key={event.id} className="py-4">
                <div className="flex space-x-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">{event.eventType}</h3>
                      <p className="text-sm text-gray-500">{event.occurredAt.toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {JSON.stringify(event.payload)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      </div>
    </div>
  );
};
