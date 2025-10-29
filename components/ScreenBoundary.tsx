import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface ScreenErrorBoundaryProps {
  children: ReactNode;
  resetKeys?: ReadonlyArray<unknown>;
  onReset?: () => void;
}

interface ScreenErrorBoundaryState {
  hasError: boolean;
  message?: string;
}

const areArraysEqual = (left?: ReadonlyArray<unknown>, right?: ReadonlyArray<unknown>) => {
  if (left === right) return true;
  if (!left || !right || left.length !== right.length) return false;
  return left.every((value, index) => Object.is(value, right[index]));
};

export class ScreenErrorBoundary extends Component<ScreenErrorBoundaryProps, ScreenErrorBoundaryState> {
  state: ScreenErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ScreenErrorBoundaryState {
    return { hasError: true, message: error?.message || 'Unknown screen error' };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('A lazy-loaded screen failed', error, errorInfo);
  }

  componentDidUpdate(prevProps: ScreenErrorBoundaryProps) {
    if (this.state.hasError && !areArraysEqual(this.props.resetKeys, prevProps.resetKeys)) {
      this.reset();
    }
  }

  private reset = () => {
    this.setState({ hasError: false, message: undefined });
  };

  private handleRetry = () => {
    this.reset();
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-secondary/80 border border-gray-700/60 rounded-3xl px-6 py-8 space-y-4 text-center shadow-card">
            <div className="flex justify-center">
              <div className="h-3 w-3 rounded-full bg-red-400 animate-ping" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary">We hit turbulence</h2>
            <p className="text-sm text-text-secondary">
              {this.state.message ?? 'The module failed to load. Refresh or try again in a moment.'}
            </p>
            <button
              onClick={this.handleRetry}
              className="px-5 py-3 rounded-lg bg-accent text-primary text-sm font-semibold hover:bg-accent/90 transition-colors"
            >
              Retry loading
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface ScreenLoaderProps {
  title?: string;
  description?: string;
}

export const ScreenLoader: React.FC<ScreenLoaderProps> = ({
  title = 'Loading module…',
  description = 'Dialing in the experience. Please hold tight.',
}) => (
  <div className="min-h-[50vh] flex items-center justify-center px-4">
    <div className="w-full max-w-md bg-secondary/80 border border-gray-700/60 rounded-3xl px-6 py-8 space-y-4 text-center shadow-card animate-fade-in">
      <div className="flex justify-center">
        <div className="h-3 w-3 rounded-full bg-accent animate-ping" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      <p className="text-sm text-text-secondary">{description}</p>
    </div>
  </div>
);
