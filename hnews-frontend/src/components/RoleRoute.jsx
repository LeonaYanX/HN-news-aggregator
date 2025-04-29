import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function RoleRoute({ allowedRoles, children }) {
  const { auth } = useContext(AuthContext);
  if (!auth.user || !allowedRoles.includes(auth.user.role)) {
    return <p>Access denied</p>;
  }
  return children;
}
