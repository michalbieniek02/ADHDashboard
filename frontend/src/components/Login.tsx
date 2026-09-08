import { GoogleLogin } from "@react-oauth/google";
function Login() {
  const handleSuccess = async (credentialResponse: any) => {
  console.log("GOOGLE LOGIN:", credentialResponse);
  const API_URL = import.meta.env.VITE_API_URL;

  if (!credentialResponse.credential) {
    console.log("Brak credential");
    return;
  }

  try {
    const response = await fetch(
  `${API_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        credential: credentialResponse.credential,
      }),
    });

    const data = await response.json();

    console.log("BACKEND RESPONSE:", data);

    if (!response.ok) {
      console.log("Logowanie nieudane:", data);
      return;
    }

    localStorage.setItem("jwt", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    window.location.reload();
  } catch (error) {
    console.error("Błąd logowania:", error);
  }
};

  const handleError = () => {
    console.log("Google login failed");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <span className="login-label">ADHDASHBOARD</span>

        <h1>Welcome back.</h1>

        <p>Sign in to continue to your dashboard.</p>

        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  );
}

export default Login;