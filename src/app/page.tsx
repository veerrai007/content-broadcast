
'use client';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;

  return (
    <nav>
      <p>Welcome, {user?.name}</p>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}
