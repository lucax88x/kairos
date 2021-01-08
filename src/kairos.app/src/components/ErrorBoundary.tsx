import React from 'react';
import { PropsWithChildren } from 'react';

export interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<PropsWithChildren<unknown>, ErrorBoundaryState> {
  constructor(props: PropsWithChildren<unknown>) {
    super(props);
    this.state = { hasError: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentDidCatch(error: any, info: any) {
    this.setState({ hasError: true });
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'grid',
            width: '100vw',
            fontSize: '35px',
            height: '100vh',
            justifyContent: 'center',
          }}
        >
          <h1 style={{ color: 'white' }}>Something went wrong. Please refresh the page.</h1>
        </div>
      );
    }
    return this.props.children;
  }
}
