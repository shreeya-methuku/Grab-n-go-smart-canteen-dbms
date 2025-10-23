
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { Card } from './Card';
import { Spinner } from './Spinner';
import { ClipboardIcon, CheckIcon } from './Icon';

export const QueryGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateQuery = async () => {
    if (!prompt) {
      setError('Please enter a request.');
      return;
    }
    setLoading(true);
    setError('');
    setQuery('');
    try {
      const result = await geminiService.generateSQLQuery(prompt);
      if (result.startsWith('ERROR:')) {
        setError(result);
      } else {
        setQuery(result);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-secondary">AI SQL Query Generator</h1>
        <p className="mt-2 text-text-secondary">
          Describe the data you need in plain English. Our AI will translate it into a precise SQL query based on the Grab 'n Go schema.
        </p>
      </div>

      <Card title="Your Request">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Show me the names of all students who ordered a Veggie Burger'"
          className="w-full h-24 p-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
          disabled={loading}
        />
        <button
          onClick={handleGenerateQuery}
          disabled={loading}
          className="mt-4 w-full flex justify-center items-center bg-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-blue-800 disabled:cursor-not-allowed"
        >
          {loading ? <Spinner /> : 'Generate SQL Query'}
        </button>
      </Card>

      {(query || error || loading) && (
        <div className="mt-8">
          <Card title="Generated SQL">
            {loading && <div className="flex justify-center p-8"><Spinner /></div>}
            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
            {query && (
              <div className="relative">
                <pre className="bg-background p-4 rounded-md overflow-x-auto">
                  <code className="text-secondary font-mono text-sm">{query}</code>
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-2 bg-border hover:bg-background rounded-md transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <CheckIcon /> : <ClipboardIcon />}
                </button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};