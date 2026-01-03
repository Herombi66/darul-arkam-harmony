import React from 'react'

type State = { hasError: boolean; error?: Error }

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State { return { hasError: true, error } }
  componentDidCatch(error: Error, info: React.ErrorInfo) { console.error('Render error', error, info) }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground" role="alert" aria-live="assertive" data-testid="error-boundary">
          <div className="max-w-md text-center space-y-3 p-6 border rounded-md">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">Please try again. If the problem persists, contact support.</p>
            <div className="flex items-center justify-center gap-2">
              <button className="px-4 py-2 rounded-md border" onClick={() => this.setState({ hasError: false, error: undefined })}>Try Again</button>
              <button className="px-4 py-2 rounded-md border" onClick={() => window.location.assign('/')}>Go Home</button>
              <button className="px-4 py-2 rounded-md border" onClick={() => window.location.reload()}>Reload</button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children as React.ReactNode
  }
}
