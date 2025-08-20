export default function RegisterForm({ username, password, setUsername, setPassword, handleSubmit, error, success }) {
  return (
    <form onSubmit={handleSubmit} className="form">
      <h2 className="heading">Register</h2>
      <input
        className="input"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="input"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="button">
        Register
      </button>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </form>
  );
}
