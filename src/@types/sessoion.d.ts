declare module 'express-session' {
    interface SessionData {
        state?: string;
      
    }
}

  // Add any other custom session properties you might use
        // For example:
        // userId?: string;
        // isAuthenticated?: boolean;