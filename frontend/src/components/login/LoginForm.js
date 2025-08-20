export default function LoginForm({ username, password, setUsername, setPassword, handleSubmit, error }) {
  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2 className="login-heading">Login</h2>
      <input
        className="login-input"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="login-input"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="login-button">Login</button>
      {error && <p className="login-error">{error}</p>}
    </form>
  );
}
