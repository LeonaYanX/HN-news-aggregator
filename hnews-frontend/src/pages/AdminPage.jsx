import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    async function load() {
      const res = await axios.get('/admin/users', {
        headers: { Authorization: `Bearer ${auth.accessToken}` }
      });
      setUsers(res.data.users);
    }
    load();
  }, [auth]);

  const block = async (userId, type) => {
    await axios.post(`/admin/block/${userId}`, { blockingType: type }, {
      headers: { Authorization: `Bearer ${auth.accessToken}` }
    });
    // обновим список
    setUsers(users.map(u =>
      u.id === userId ? { ...u, isBlocked: true } : u
    ));
  };

  const unblock = async (userId) => {
    await axios.post(`/admin/unblock/${userId}`, {}, {
      headers: { Authorization: `Bearer ${auth.accessToken}` }
    });
    setUsers(users.map(u =>
      u.id === userId ? { ...u, isBlocked: false } : u
    ));
  };

  return (
    <div>
      <h2>Админка: пользователи</h2>
      <table>
        <thead>
          <tr><th>Username</th><th>Karma</th><th>Blocked</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.karma}</td>
              <td>{u.isBlocked ? 'Yes' : 'No'}</td>
              <td>
                {!u.isBlocked
                  ? <button onClick={() => block(u.id, 'temporary')}>Block 7d</button>
                  : <button onClick={() => unblock(u.id)}>Unblock</button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
