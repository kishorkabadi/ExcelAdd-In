import React from 'react'
import { Stack, Text, PrimaryButton } from '@fluentui/react'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Stack styles={{ root: { padding: 20 } }} tokens={{ childrenGap: 16 }}>
          <Text variant="xxLarge" styles={{ root: { color: 'red' } }}>
            Something went wrong
          </Text>
          <Text>{this.state.error?.message}</Text>
          <PrimaryButton
            text="Reload"
            onClick={() => window.location.reload()}
          />
        </Stack>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
