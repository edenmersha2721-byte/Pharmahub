import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/Context";
import { router } from "@/router";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster richColors closeButton position="bottom-right" />
    </AuthProvider>
  );
}

export default App;
