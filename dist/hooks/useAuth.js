"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = exports.AuthProvider = void 0;
const react_1 = require("react");
const authService_1 = require("../services/authService");
const router_1 = require("next/router");
const antd_1 = require("antd");
const AuthContext = (0, react_1.createContext)(undefined);
const AuthProvider = ({ children }) => {
    const [user, setUser] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const router = (0, router_1.useRouter)();
    (0, react_1.useEffect)(() => {
        checkAuth();
    }, []);
    const checkAuth = async () => {
        try {
            const currentUser = await authService_1.authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                await checkSubscription();
            }
        }
        catch (error) {
            console.error('Erreur de vérification d\'authentification:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const login = async (email, password) => {
        try {
            setError(null);
            const user = await authService_1.authService.login({ email, password });
            setUser(user);
            await checkSubscription();
            antd_1.message.success('Connexion réussie !');
            router.push('/dashboard');
        }
        catch (error) {
            const errorMessage = error.message || 'Erreur lors de la connexion';
            setError(errorMessage);
            antd_1.message.error(errorMessage);
            throw error;
        }
    };
    const register = async (userData) => {
        try {
            setError(null);
            const user = await authService_1.authService.register(userData);
            setUser(user);
            antd_1.message.success('Inscription réussie !');
            router.push('/dashboard');
        }
        catch (error) {
            const errorMessage = error.message || 'Erreur lors de l\'inscription';
            setError(errorMessage);
            antd_1.message.error(errorMessage);
            throw error;
        }
    };
    const logout = async () => {
        try {
            await authService_1.authService.logout();
            setUser(null);
            antd_1.message.success('Déconnexion réussie');
            router.push('/login');
        }
        catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            antd_1.message.error('Erreur lors de la déconnexion');
        }
    };
    const resetPassword = async (email) => {
        try {
            setError(null);
            await authService_1.authService.request('reset-password', {
                method: 'POST',
                data: { email }
            });
            antd_1.message.success('Instructions envoyées par email');
        }
        catch (error) {
            const errorMessage = error.message || 'Erreur lors de la réinitialisation du mot de passe';
            setError(errorMessage);
            antd_1.message.error(errorMessage);
            throw error;
        }
    };
    const updateProfile = async (userData) => {
        try {
            setError(null);
            if (!(user === null || user === void 0 ? void 0 : user.id))
                throw new Error('Utilisateur non connecté');
            const updatedUser = await authService_1.authService.updateUserProfile(user.id, userData);
            setUser(updatedUser);
            antd_1.message.success('Profil mis à jour avec succès');
        }
        catch (error) {
            const errorMessage = error.message || 'Erreur lors de la mise à jour du profil';
            setError(errorMessage);
            antd_1.message.error(errorMessage);
            throw error;
        }
    };
    const checkSubscription = async () => {
        if (!user)
            return false;
        try {
            const response = await authService_1.authService.request('subscriptions/status');
            const { hasActiveSubscription, subscriptionType, subscriptionEndDate } = response;
            setUser(prev => prev ? {
                ...prev,
                hasActiveSubscription,
                subscriptionType,
                subscriptionEndDate: subscriptionEndDate ? new Date(subscriptionEndDate) : undefined
            } : null);
            return hasActiveSubscription;
        }
        catch (error) {
            console.error('Erreur lors de la vérification de l\'abonnement:', error);
            return false;
        }
    };
    return value = {};
    {
        user,
            loading,
            error,
            isAuthenticated;
        !!user,
            login,
            register,
            logout,
            resetPassword,
            updateProfile,
            checkSubscription;
    }
};
exports.AuthProvider = AuthProvider;
    >
        { children }
    < /AuthContext.Provider>;
;
;
const useAuth = () => {
    const context = (0, react_1.useContext)(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
    }
    return context;
};
exports.useAuth = useAuth;
//# sourceMappingURL=useAuth.js.map