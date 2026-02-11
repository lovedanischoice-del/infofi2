
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

type Role = 'admin' | 'editor' | 'guest';

interface AuthState {
  user: User | null;
  role: Role;
  loading: boolean;
}

const useAuthWithRole = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>('guest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setRole('guest');
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribeRole = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists() && docSnap.data().role) {
          setRole(docSnap.data().role);
        } else {
          setRole('guest'); // A logged in user without a role is still a guest in terms of permissions
        }
        setLoading(false);
      });
       return () => unsubscribeRole();
    }
  }, [user]);

  return { user, role, loading };
};

export default useAuthWithRole;
