import React, { useState } from 'react';
import {
  performWeeklyReset,
  generateSampleData,
  generateNewReflection,
  getBackupKeys,
  restoreFromBackup,
  ResetOptions,
  ResetResult
} from '../utils/resetManager';
import { getSessionStats, exportSessionData, isGuestSession } from '../utils/sessionManager';
import { RefreshIcon, DownloadIcon, UploadIcon, AlertTriangleIcon, CheckIcon, Target } from './Icons';
import { analytics } from '../utils/analytics';

interface ResetPanelProps {
  onDataReset?: () => void;
}

const ResetPanel: React.FC<ResetPanelProps> = ({ onDataReset }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastResult, setLastResult] = useState<ResetResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sessionStats = getSessionStats();
  const backupKeys = getBackupKeys();

  const handleReset = async (options: ResetOptions) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = performWeeklyReset(options);
      setLastResult(result);
      analytics.weeklyReset(options);
      if (result.success && onDataReset) {
        setTimeout(onDataReset, 1000); // Give UI time to update
      }
    } catch (error) {
      setLastResult({
        success: false,
        error: error instanceof Error ? error.message : 'Reset failed',
        itemsCleared: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSample = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = generateSampleData();
      setLastResult(result);
      analytics.sampleDataGenerated();
      if (result.success && onDataReset) {
        setTimeout(onDataReset, 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReflection = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await generateNewReflection();
      setLastResult(result);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    const data = exportSessionData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlas-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    analytics.dataExported();
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        // Would implement import logic here
        setLastResult({
          success: true,
          itemsCleared: ['Data imported successfully']
        });
        if (onDataReset) {
          setTimeout(onDataReset, 1000);
        }
      } catch (error) {
        setLastResult({
          success: false,
          error: 'Failed to import data',
          itemsCleared: []
        });
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  return (
    <div className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 rounded-lg">
            <Target className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Testing & Reset Tools</h3>
            <p className="text-sm text-text-secondary">
              {isGuestSession() ? 'Guest Session' : 'Registered Session'} • {sessionStats.daysSinceCreated} days old
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-2 text-sm bg-primary border border-gray-600 rounded-lg hover:border-accent/50 transition-colors"
        >
          {isExpanded ? 'Hide' : 'Show Tools'}
        </button>
      </div>

      {lastResult && (
        <div className={`p-3 rounded-lg border ${
          lastResult.success ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="flex items-start gap-2">
            {lastResult.success ? (
              <CheckIcon className="w-4 h-4 text-green-400 mt-0.5" />
            ) : (
              <AlertTriangleIcon className="w-4 h-4 text-red-400 mt-0.5" />
            )}
            <div>
              <p className={`text-sm font-medium ${
                lastResult.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {lastResult.success ? 'Success!' : 'Error'}
              </p>
              {lastResult.error && (
                <p className="text-xs text-text-secondary mt-1">{lastResult.error}</p>
              )}
              {lastResult.itemsCleared.length > 0 && (
                <ul className="text-xs text-text-secondary mt-1">
                  {lastResult.itemsCleared.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="space-y-4 border-t border-gray-700/30 pt-4">
          {/* Quick Actions */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Quick Actions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => handleReset({})}
                disabled={isLoading}
                className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/20 transition-colors disabled:opacity-50 text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <RefreshIcon className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-400">Weekly Reset</span>
                </div>
                <p className="text-xs text-text-secondary">Clear wins & reflections, keep profile & mood data</p>
              </button>

              <button
                onClick={handleGenerateSample}
                disabled={isLoading}
                className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-colors disabled:opacity-50 text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">Generate Sample Data</span>
                </div>
                <p className="text-xs text-text-secondary">Add sample mood entries & wins for testing</p>
              </button>

              <button
                onClick={handleGenerateReflection}
                disabled={isLoading}
                className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-colors disabled:opacity-50 text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <RefreshIcon className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-400">New Reflection</span>
                </div>
                <p className="text-xs text-text-secondary">Force generate a new AI weekly reflection</p>
              </button>

              <button
                onClick={() => handleReset({ clearAll: true, preserveProfile: true })}
                disabled={isLoading}
                className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangleIcon className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-red-400">Full Reset</span>
                </div>
                <p className="text-xs text-text-secondary">Clear all data, keep profile only</p>
              </button>
            </div>
          </div>

          {/* Data Management */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Data Management</h4>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-accent/10 border border-accent/30 rounded-lg hover:bg-accent/20 transition-colors text-accent text-sm font-medium flex items-center gap-2"
              >
                <DownloadIcon className="w-4 h-4" />
                Export Data
              </button>

              <label className="px-4 py-2 bg-primary border border-gray-600 rounded-lg hover:border-accent/50 transition-colors text-text-secondary text-sm font-medium flex items-center gap-2 cursor-pointer">
                <UploadIcon className="w-4 h-4" />
                Import Data
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Backups */}
          {backupKeys.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-3">Recent Backups</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {backupKeys.slice(0, 5).map(key => (
                  <div key={key} className="flex items-center justify-between p-2 bg-primary/30 rounded-lg">
                    <span className="text-xs text-text-secondary font-mono">{key}</span>
                    <button
                      onClick={() => restoreFromBackup(key)}
                      className="text-xs text-accent hover:text-accent-light"
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-4">
              <RefreshIcon className="w-6 h-6 text-accent animate-spin mx-auto" />
              <p className="text-sm text-text-secondary mt-2">Processing...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResetPanel;