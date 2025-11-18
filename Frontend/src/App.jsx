import UiProvider from './providers/UiProvider';
import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <UiProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </UiProvider>
  );
}

export default App;
