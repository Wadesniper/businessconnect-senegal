import PublishJobPage from './pages/jobs/PublishJobPage';

<Route
  path="/jobs/publish"
  element={
    <ProtectedRoute element={<PublishJobPage />} />
  }
/> 