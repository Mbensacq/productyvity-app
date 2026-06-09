import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logError } from '@/lib/logger';
import { t } from '@/lib/i18n';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    logError(error, { componentStack: info.componentStack });
  }

  private readonly handleReset = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }
    if (this.props.fallback !== undefined) {
      return this.props.fallback;
    }
    return (
      <div role="alert" style={{ padding: '2rem', maxWidth: '40rem', margin: '0 auto' }}>
        <h1>{t('error.title')}</h1>
        <button type="button" onClick={this.handleReset}>
          {t('error.retry')}
        </button>
      </div>
    );
  }
}
