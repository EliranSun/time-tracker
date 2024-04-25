import {useEffect, useState, createContext} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {auth, setUserDoc, signInWithGoogle} from "../utils/db";
import {Spinner} from "@phosphor-icons/react";

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(auth, async (user) => {
            setUser(user);

            try {
                if (user) {
                    await setUserDoc(user);
                }
            } catch (e) {
                console.error(e);
            }

            setLoading(false);
        });
    }, []);

    return {user, loading};
};

const Login = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <button
                className="bg-black text-white p-4 rounded"
                onClick={() => signInWithGoogle()}>
                Sign in with Google
            </button>
        </div>
    );
};

export const AuthContext = createContext({
    user: null,
    loading: true,
});

export const AuthProvider = ({children}) => {
    const {user, loading} = useAuth();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Spinner className="animate-spin h-12 w-12 text-black"/>
            </div>
        )
    }

    if (!user) {
        return <Login/>;
    }

    return (
        <AuthContext.Provider value={{user, loading}}>
            {children}
        </AuthContext.Provider>
    );
}