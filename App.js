import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import AppNavigator from "./src/navigation/AppNavigator";
import { loadUser } from "./src/redux/slices/authSlice";
import { store } from "./src/redux/store";

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return <AppNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
