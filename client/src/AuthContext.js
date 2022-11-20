import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({
  auth: null,
  setAuth: () => {},
  user: null,
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const isAuth = async () => {
      // try {
      //   const res await axios.get(
      //     'http://localhost:8080/api/logged-user/',
      //     { withCredentials: true }
      //   );
      //
      //   setUser(res.data);
      // } catch(error) {
      //   setUser(null);
      // };
      const loggedInUser = localStorage.getItem("user");
      if (loggedInUser) {
          setUser(loggedInUser);
      }
    };

    isAuth();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
