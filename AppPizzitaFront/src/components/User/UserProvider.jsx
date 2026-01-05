import React, { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../../contexts/UserContext';

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem('usuarios');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const saveUser = (usuarios) => {
    setUser(usuarios);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  };

  const clearUser = () => {
    setUser({});
    localStorage.removeItem('usuarios');
  };
  const decodeToken = () => {
    if (user && Object.keys(user).length > 0) {
      const decodedToken = jwtDecode(user);
      return decodedToken;
    } else {
      return {};
    }
  };

  //requiredRoles=['Administrador','Usuario']
  const autorize = ({ requiredRoles }) => {
    const userData = decodeToken();
    if (userData && requiredRoles) {
      console.log(
        userData && userData.rol && requiredRoles.includes(userData.rol.nombre),
      );
      return (
        userData && userData.rol && requiredRoles.includes(userData.rol.nombre)
      );
    }
    return false;
  };

  UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  return (
    <UserContext.Provider
      value={{
        user,
        saveUser,
        clearUser,
        autorize,
        decodeToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
