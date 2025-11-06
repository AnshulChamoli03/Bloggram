import UiProvider from './providers/UiProvider';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <UiProvider>
      <AppRouter />
    </UiProvider>
  );
}

export default App;
