import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { cn } from '../utils/cn';
import { API_URL } from '../config';
import {
    User, Mail, Phone, Shield, LogOut, X,
    KeyRound, Camera, Loader2, CheckCircle2, AlertCircle,
    Package, MapPin, Trash2, ShoppingBag,
    XCircle, HeadphonesIcon, LayoutDashboard, ChevronRight,
    Navigation, Home, FileVideo, MessageSquare, Paperclip, Send,
    Inbox, Clock, RefreshCcw, Plus, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';

const API_ACCOUNTS = `${API_URL}/accounts`;
const API_BASE = `${API_URL}`;


const USER_TYPE_BADGE: Record<string, { label: string; color: string }> = {
    super_admin: { label: 'Super Admin', color: 'text-[var(--color-primary)] bg-[var(--color-primary)]/10 border-[var(--color-primary)]/30' },
    assistant_admin: { label: 'Assistant Admin', color: 'text-violet-400 bg-violet-400/10 border-violet-400/30' },
    product_manager: { label: 'Product Manager', color: 'text-sky-400 bg-sky-400/10 border-sky-400/30' },
    customer: { label: 'Customer', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' },
};

type TabId = 'overview' | 'orders' | 'cancelled' | 'addresses' | 'profile' | 'support' | 'favorites';

// ── Premium UI Components ──────────────────────────────────────────────────
const PremiumInput = ({ label, ...props }: any) => (
    <div className="space-y-1.5 flex-1">
        {label && <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-primary)]/60 ml-1">{label}</label>}
        <input
            {...props}
            className={cn(
                "w-full px-5 py-3.5 bg-[var(--color-surface)] border-2 border-[var(--color-primary)]/5 rounded-2xl text-sm focus:border-[var(--color-primary)]/40 focus:bg-[var(--color-surface)] focus:shadow-[0_0_20px_rgba(245,158,11,0.08)] outline-none transition-all duration-300",
                props.className
            )}
        />
    </div>
);

const PremiumTextArea = ({ label, ...props }: any) => (
    <div className="space-y-1.5 flex-1">
        {label && <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-primary)]/60 ml-1">{label}</label>}
        <textarea
            {...props}
            className={cn(
                "w-full px-5 py-3.5 bg-[var(--color-surface)] border-2 border-[var(--color-primary)]/5 rounded-2xl text-sm focus:border-[var(--color-primary)]/40 focus:bg-[var(--color-surface)] focus:shadow-[0_0_20px_rgba(245,158,11,0.08)] outline-none transition-all duration-300 min-h-[120px] resize-none",
                props.className
            )}
        />
    </div>
);

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data?: any) => void;
    title: string;
    description: string;
    confirmText?: string;
    type?: 'danger' | 'info';
    showInput?: boolean;
    inputPlaceholder?: string;
    loading?: boolean;
}

const ActionModal = ({ isOpen, onClose, onConfirm, title, description, confirmText = 'Confirm', type = 'info', showInput = false, inputPlaceholder = '', loading = false }: ActionModalProps) => {
    const [inputValue, setInputValue] = useState('');
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-[var(--color-surface)] border-2 border-[var(--color-primary)]/20 rounded-[2.5rem] p-8 max-w-md w-full shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
                <div className="text-center relative z-10">
                    <div className={`w-16 h-16 ${type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                        {type === 'danger' ? <AlertCircle size={32} /> : <Shield size={32} />}
                    </div>
                    <h3 className={`text-2xl font-bold font-serif mb-2 ${type === 'danger' ? 'text-red-400' : 'text-amber-400'}`}>{title}</h3>
                    <p className="text-xs text-[var(--color-text)] opacity-70 leading-relaxed mb-6 whitespace-pre-line">{description}</p>
                    
                    {showInput && (
                        <div className="mb-8">
                            <PremiumTextArea
                                placeholder={inputPlaceholder}
                                value={inputValue}
                                onChange={(e: any) => setInputValue(e.target.value)}
                                autoFocus
                            />
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 border-2 border-[var(--color-primary)]/10 text-[var(--color-text)]/40 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-[var(--color-primary)]/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onConfirm(showInput ? inputValue : undefined)}
                            disabled={loading}
                            className={`flex-1 py-4 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                                type === 'danger' 
                                ? 'bg-red-500 text-white shadow-red-500/20 hover:bg-red-600' 
                                : 'bg-[var(--color-primary)] text-black shadow-[var(--color-primary)]/20 hover:scale-[1.02]'
                            }`}
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : confirmText}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const ChangePasswordModal = ({ isOpen, onClose, onVerified }: { isOpen: boolean, onClose: () => void, onVerified: (token: string) => void }) => {
    const [verifyMode, setVerifyMode] = useState<'password' | 'otp'>('password');
    const [oldPassword, setOldPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleVerifyPassword = async () => {
        setLoading(true); setError('');
        try {
            const token = localStorage.getItem('access_token');
            const { data } = await axios.post(`${API_BASE}/accounts/me/change-password/verify/`, { mode: 'password', old_password: oldPassword }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onVerified(data.verification_token);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid current password');
        } finally { setLoading(false); }
    };

    const handleRequestOtp = async () => {
        setLoading(true); setError('');
        try {
            const token = localStorage.getItem('access_token');
            await axios.post(`${API_BASE}/accounts/me/change-password/verify/`, { mode: 'otp_request' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVerifyMode('otp');
            setSuccess('Verification code sent to your email.');
        } catch (err: any) {
            setError('Failed to send verification code');
        } finally { setLoading(false); }
    };

    const handleVerifyOtp = async () => {
        setLoading(true); setError('');
        try {
            const token = localStorage.getItem('access_token');
            const { data } = await axios.post(`${API_BASE}/accounts/me/change-password/verify/`, { mode: 'otp_verify', otp }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onVerified(data.verification_token);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid verification code');
        } finally { setLoading(false); }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
             <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-[var(--color-surface)] border-2 border-[var(--color-primary)]/20 rounded-[3rem] p-10 max-w-sm w-full shadow-[0_0_150px_rgba(245,158,11,0.1)] relative"
            >
                <button onClick={onClose} className="absolute top-8 right-8 text-[var(--color-text)] opacity-40 hover:opacity-100 transition-all"><X size={20} /></button>
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-amber-400/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <KeyRound size={32} />
                    </div>
                    <h3 className="text-2xl font-bold font-serif mb-2">Verification</h3>
                    <p className="text-[10px] text-[var(--color-text)] opacity-60 leading-relaxed uppercase tracking-[0.2em] font-black">Step 1: Confirm Identity</p>
                </div>

                <div className="space-y-6">
                    {verifyMode === 'password' ? (
                        <>
                            <PremiumInput
                                label="Current Password"
                                type="password"
                                placeholder="••••••••"
                                value={oldPassword}
                                onChange={(e: any) => setOldPassword(e.target.value)}
                                autoFocus
                            />
                            <div className="flex flex-col gap-3 pt-4">
                                <button onClick={handleVerifyPassword} disabled={loading || !oldPassword} className="w-full py-4 bg-[var(--color-primary)] text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-95 transition-all">
                                    {loading ? <Loader2 className="animate-spin" size={16} /> : 'Verify Password'}
                                </button>
                                <button onClick={handleRequestOtp} className="text-[10px] font-black uppercase tracking-widest text-amber-400/60 hover:text-amber-400 transition-all text-center">
                                    Use Email Verification Code instead
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {success && <p className="text-[10px] text-emerald-400 text-center font-black uppercase tracking-widest bg-emerald-400/5 py-2 rounded-xl">{success}</p>}
                                <PremiumInput
                                    label="Security Code"
                                    type="text"
                                    placeholder="6-digit code"
                                    value={otp}
                                    onChange={(e: any) => setOtp(e.target.value)}
                                    autoFocus
                                />
                                <div className="flex flex-col gap-3 pt-4">
                                    <button onClick={handleVerifyOtp} disabled={loading || otp.length < 6} className="w-full py-4 bg-[var(--color-primary)] text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-95 transition-all">
                                        {loading ? <Loader2 className="animate-spin" size={16} /> : 'Verify Code'}
                                    </button>
                                    <button onClick={() => { setVerifyMode('password'); setError(''); setSuccess(''); }} className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text)] opacity-40 hover:opacity-100 transition-all text-center">
                                        Back to Password
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {error && <p className="text-[10px] text-red-400 text-center font-black uppercase tracking-widest px-4 bg-red-400/5 py-3 rounded-2xl border border-red-400/10">{error}</p>}
                </div>
            </motion.div>
        </div>
    );
};

const FinalizePasswordModal = ({ isOpen, onClose, token, onComplete }: { isOpen: boolean, onClose: () => void, token: string, onComplete: () => void }) => {
    const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFinalize = async () => {
        if (form.newPassword !== form.confirmPassword) { setError('Passwords do not match'); return; }
        if (form.newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }

        setLoading(true); setError('');
        try {
            const accessToken = localStorage.getItem('access_token');
            await axios.post(`${API_BASE}/accounts/me/change-password/finalize/`, { verification_token: token, new_password: form.newPassword }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            onComplete();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update password');
        } finally { setLoading(false); }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-[var(--color-surface)] border-2 border-[var(--color-primary)]/20 rounded-[3rem] p-10 max-w-sm w-full shadow-[0_0_150px_rgba(245,158,11,0.1)] relative"
            >
                <button onClick={onClose} className="absolute top-8 right-8 text-[var(--color-text)] opacity-40 hover:opacity-100 transition-all"><X size={20} /></button>
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-emerald-400/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-2xl font-bold font-serif mb-2">Verified!</h3>
                    <p className="text-[10px] text-[var(--color-text)] opacity-60 leading-relaxed uppercase tracking-[0.2em] font-black">Step 2: Create New Password</p>
                </div>

                <div className="space-y-6">
                    <PremiumInput
                        label="New Password"
                        type="password"
                        placeholder="••••••••"
                        value={form.newPassword}
                        onChange={(e: any) => setForm({ ...form, newPassword: e.target.value })}
                        autoFocus
                    />
                    <PremiumInput
                        label="Confirm New Password"
                        type="password"
                        placeholder="••••••••"
                        value={form.confirmPassword}
                        onChange={(e: any) => setForm({ ...form, confirmPassword: e.target.value })}
                    />

                    <button onClick={handleFinalize} disabled={loading || !form.newPassword || !form.confirmPassword} className="w-full py-4 bg-emerald-400 text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-emerald-400/20 hover:scale-[1.02] active:scale-95 transition-all mt-4">
                        {loading ? <Loader2 className="animate-spin" size={16} /> : 'Update Password'}
                    </button>

                    {error && <p className="text-[10px] text-red-400 text-center font-black uppercase tracking-widest px-4 bg-red-400/5 py-3 rounded-2xl border border-red-400/10 mt-4">{error}</p>}
                </div>
            </motion.div>
        </div>
    );
};

export default function Account() {
    const { user, loading: authLoading, logout } = useAuth();
    const { formatPrice, locationData } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState<TabId>('overview');
    const [profile, setProfile] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [favProducts, setFavProducts] = useState<any[]>([]);
    const [favsLoading, setFavsLoading] = useState(false);

    const [editForm, setEditForm] = useState({ full_name: '', phone: '', avatar_url: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [msgType, setMsgType] = useState<'success' | 'error'>('success');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const supportFileRef = React.useRef<HTMLInputElement>(null);

    // Support State
    const [tickets, setTickets] = useState<any[]>([]);
    const [ticketsLoading, setTicketsLoading] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [newTicket, setNewTicket] = useState({
        issue_type: '',
        description: '',
        other_description: '',
        media_urls: [] as string[]
    });
    const [chatMessage, setChatMessage] = useState('');

    // Address Management State
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddressDeleteId, setShowAddressDeleteId] = useState<string | null>(null);
    const [newAddress, setNewAddress] = useState<any>({
        full_name: '', phone: '', street_address: '', city: '', state: '', pincode: '', country: locationData?.country_name || 'United States', is_default: false
    });
    const [areaSearch, setAreaSearch] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [placeSuggestions, setPlaceSuggestions] = useState<any[]>([]);
    const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showFinalizeModal, setShowFinalizeModal] = useState(false);
    const [verificationToken, setVerificationToken] = useState('');
    const [showFavRemoveId, setShowFavRemoveId] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab') as TabId;
        if (tab && tabs.some(t => t.id === tab)) {
            setActiveTab(tab);
        }
    }, [location.search]);
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (areaSearch.length < 3) {
                setPlaceSuggestions([]);
                return;
            }
            setIsSearchingPlaces(true);
            try {
                const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(areaSearch)}&limit=5`);
                const data = await res.json();
                setPlaceSuggestions(data.features || []);
            } catch (err) {
                console.error('Photon API error:', err);
            } finally {
                setIsSearchingPlaces(false);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 500);
        return () => clearTimeout(debounce);
    }, [areaSearch]);

    useEffect(() => {
        if (locationData && !newAddress.city && !newAddress.state) {
            setNewAddress((prev: any) => ({
                ...prev,
                country: locationData.country_name || prev.country,
                city: locationData.city || prev.city,
                state: locationData.region || prev.state
            }));
        }
    }, [locationData]);

    if (authLoading) {
        return (
            <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
                <Loader2 className="animate-spin text-amber-400" size={40} />
            </div>
        );
    }

    useEffect(() => {
        if (user) {
            fetchProfile();
            fetchOrders();
            fetchTickets();
        } else {
            // navigate('/login'); // Removed automatic redirect to login page
        }
    }, [user]);

    useEffect(() => {
        if (activeTab === 'orders' || activeTab === 'cancelled' || activeTab === 'overview') {
            fetchOrders();
        }
        if (activeTab === 'support') {
            fetchTickets();
        }
        if (activeTab === 'favorites') {
            fetchFavorites();
        }
    }, [activeTab]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const { data } = await axios.get(`${API_ACCOUNTS}/me/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(data.profile);
            setEditForm({
                full_name: data.profile?.full_name || '',
                phone: data.profile?.phone || '',
                avatar_url: data.profile?.avatar_url || '',
            });
        } catch {
            setMessage('Failed to load profile');
            setMsgType('error');
        } finally { setLoading(false); }
    };

    const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const { data } = await axios.get(`${API_BASE}/orders/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(data || []);
        } catch (err) {
            console.error('Failed to fetch orders', err);
        } finally {
            setOrdersLoading(false);
        }
    };

    const fetchTickets = async () => {
        setTicketsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const { data } = await axios.get(`${API_BASE}/support-tickets/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(data || []);
        } catch (err) {
            console.error('Failed to fetch tickets', err);
        } finally {
            setTicketsLoading(false);
        }
    };

    const fetchFavorites = async () => {
        setFavsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const { data } = await axios.get(`${API_BASE}/favorites/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // data is list of IDs, we need to fetch details or the backend returns details?
            // Existing Backend FavoriteListView returns full products if we use a serializer.
            // Let's assume it returns product objects or we fetch them.
            // Actually my FavoriteListView in api/views.py returns product IDs.
            // I should update it to return full objects or fetch them here.
            // Let's fetch details for each.
            const productPromises = data.map((id: string) => axios.get(`${API_BASE}/products/${id}/`));
            const products = await Promise.all(productPromises);
            setFavProducts(products.map(p => p.data));
        } catch (err) {
            console.error('Failed to fetch favorites', err);
        } finally {
            setFavsLoading(false);
        }
    };

    const handleDeleteAccount = async (reason: string = 'No reason provided') => {
        setSaving(true);
        try {
            const token = localStorage.getItem('access_token');
            await axios.post(`${API_ACCOUNTS}/me/delete/`, { reason }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await logout();
            navigate('/');
        } catch (err: any) {
            setMessage(err.response?.data?.error || "Failed to delete account");
            setMsgType('error');
        } finally {
            setSaving(false);
            setShowDeleteModal(false);
        }
    };

    const handleTicketFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const newUrls = [...newTicket.media_urls];

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append('file', files[i]);
            try {
                const { data } = await axios.post(`${API_BASE}/upload/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                newUrls.push(data.url);
            } catch (err) {
                console.error('File upload failed', err);
                setMessage('Some files failed to upload');
                setMsgType('error');
            }
        }

        setNewTicket({ ...newTicket, media_urls: newUrls });
        setUploading(false);
    };

    const handleSubmitTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTicket.issue_type || !newTicket.description) {
            setMessage('Please fill in all required fields');
            setMsgType('error');
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem('access_token');
            await axios.post(`${API_BASE}/support-tickets/`, newTicket, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Support request submitted successfully');
            setMsgType('success');
            setNewTicket({ issue_type: '', description: '', other_description: '', media_urls: [] });
            fetchTickets();
        } catch (err) {
            console.error('Failed to submit ticket', err);
            setMessage('Submission failed');
            setMsgType('error');
        } finally {
            setSaving(false);
        }
    };

    const handleAddChatMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatMessage.trim() || !selectedTicket) return;

        try {
            const token = localStorage.getItem('access_token');
            const { data } = await axios.patch(`${API_BASE}/support-tickets/${selectedTicket.id}/`, {
                message: chatMessage
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedTicket(data);
            setChatMessage('');
            // Update in list too
            setTickets(tickets.map(t => t.id === data.id ? data : t));
        } catch (err) {
            console.error('Failed to send message', err);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            const token = localStorage.getItem('access_token');
            // Backend now handles both formats, but let's be flat to be simple
            await axios.patch(`${API_ACCOUNTS}/me/`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchProfile();
            setMessage('Profile updated successfully');
            setMsgType('success');
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to update profile');
            setMsgType('error');
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const { data } = await axios.post(`${API_BASE}/upload/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setEditForm({ ...editForm, avatar_url: data.url });
            // Auto save
            const token = localStorage.getItem('access_token');
            await axios.patch(`${API_ACCOUNTS}/me/`, { avatar_url: data.url }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchProfile();
            setMessage('Photo updated');
            setMsgType('success');
        } catch (err) {
            console.error('Upload failed', err);
            setMessage('Upload failed');
            setMsgType('error');
        } finally {
            setUploading(false);
        }
    };

    const handleReadLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation not supported');
            return;
        }
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
                // Reverse geocode using a free API (optional but nice)
                // For now, let's just show we got the data or fill defaults
                setNewAddress({
                    ...newAddress,
                    street_address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
                });
                setMessage('Location detected. Please fill in the details.');
                setMsgType('success');
            } catch (err) {
                console.error('Geocoding failed', err);
            }
        }, (err) => {
            alert('Failed to get location: ' + err.message);
        });
    };

    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('access_token');
            await axios.post(`${API_ACCOUNTS}/addresses/`, newAddress, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchProfile();
            setIsAddingAddress(false);
            setAreaSearch('');
        } catch (err) {
            console.error('Failed to save address', err);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAddress = async (id: string) => {
        setSaving(true);
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`${API_ACCOUNTS}/addresses/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchProfile();
        } catch (err) {
            console.error('Failed to delete address', err);
        } finally {
            setSaving(false);
            setShowAddressDeleteId(null);
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.post(`${API_ACCOUNTS}/addresses/${id}/set_default/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchProfile();
        } catch (err) {
            console.error('Failed to set default address', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
                <Loader2 className="animate-spin text-[var(--color-primary)]" size={32} />
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'orders', label: 'My Orders', icon: ShoppingBag },
        { id: 'cancelled', label: 'Cancelled', icon: XCircle },
        { id: 'addresses', label: 'Addresses', icon: MapPin },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'favorites', label: 'Favorites', icon: Heart },
        { id: 'support', label: 'Support', icon: HeadphonesIcon },
    ];

    const cancelledOrders = orders.filter(o => o.status === 'cancelled');
    const activeOrders = orders.filter(o => o.status !== 'cancelled');

    return (
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] relative overflow-hidden flex flex-col">
            <Header />

            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-900/5 blur-[120px] rounded-full pointer-events-none" />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 pt-24 md:pt-32 pb-8 md:pb-12 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar Navigation */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="bg-[var(--color-surface)] border border-[var(--color-primary)]/10 shadow-sm border border-[var(--color-primary)]/10 rounded-3xl p-2 sticky top-24">
                            <div className="p-4 mb-2 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name || user?.email}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-bold truncate">{profile?.full_name || 'My Account'}</h3>
                                    <p className="text-[10px] text-[var(--color-text)] opacity-60 truncate">{user?.email}</p>
                                </div>
                            </div>

                            <nav className="space-y-1">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as TabId)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                            ? 'bg-[var(--color-primary)] text-black shadow-lg shadow-[var(--color-primary)]/20'
                                            : 'text-[var(--color-text)] opacity-60 hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] border border-[var(--color-primary)]/10'
                                            }`}
                                    >
                                        <tab.icon size={16} />
                                        {tab.label}
                                    </button>
                                ))}
                                <div className="pt-4 mt-4 border-t border-[var(--color-primary)]/10 space-y-1">
                                    <Link
                                        to="/"
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all font-sans"
                                    >
                                        <Home size={16} />
                                        Back to Home
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-400/10 transition-all font-sans"
                                    >
                                        <LogOut size={16} />
                                        Sign Out
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'overview' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-2xl font-bold font-serif">Account Overview</h2>
                                            <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-tighter ${USER_TYPE_BADGE[profile?.user_type || 'customer'].color}`}>
                                                {USER_TYPE_BADGE[profile?.user_type || 'customer'].label}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="bg-[var(--color-surface)] border border-[var(--color-primary)]/10 shadow-sm border border-[var(--color-primary)]/10 rounded-3xl p-5">
                                                <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-4">
                                                    <ShoppingBag size={20} />
                                                </div>
                                                <div className="text-2xl font-bold">{(orders || []).length}</div>
                                                <div className="text-[10px] text-[var(--color-text)] opacity-60 uppercase tracking-widest font-black">Total Orders</div>
                                            </div>
                                            <div className="bg-[var(--color-surface)] border border-[var(--color-primary)]/10 shadow-sm border border-[var(--color-primary)]/10 rounded-3xl p-5">
                                                <div className="w-10 h-10 rounded-2xl bg-blue-400/10 flex items-center justify-center text-blue-400 mb-4">
                                                    <Package size={20} />
                                                </div>
                                                <div className="text-2xl font-bold">{activeOrders.length}</div>
                                                <div className="text-[10px] text-[var(--color-text)] opacity-60 uppercase tracking-widest font-black">Active Orders</div>
                                            </div>
                                            <div className="bg-[var(--color-surface)] border border-[var(--color-primary)]/10 shadow-sm border border-[var(--color-primary)]/10 rounded-3xl p-5">
                                                <div className="w-10 h-10 rounded-2xl bg-red-400/10 flex items-center justify-center text-red-400 mb-4">
                                                    <XCircle size={20} />
                                                </div>
                                                <div className="text-2xl font-bold">{cancelledOrders.length}</div>
                                                <div className="text-[10px] text-[var(--color-text)] opacity-60 uppercase tracking-widest font-black">Cancelled</div>
                                            </div>
                                        </div>

                                        <div className="bg-[var(--color-surface)] border border-[var(--color-primary)]/10 shadow-sm border border-[var(--color-primary)]/10 rounded-3xl p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="font-bold font-serif">Recent Orders</h3>
                                                <button onClick={() => setActiveTab('orders')} className="text-xs text-[var(--color-primary)] font-bold hover:underline">View All</button>
                                            </div>

                                            {ordersLoading ? (
                                                <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-[var(--color-primary)]" /></div>
                                            ) : activeOrders.length > 0 ? (
                                                <div className="space-y-4">
                                                    {activeOrders.slice(0, 3).map(order => (
                                                        <div key={order.id} className="flex items-center justify-between p-4 bg-[var(--color-surface)] border border-[var(--color-primary)]/10 rounded-2xl border border-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/20 transition-all cursor-pointer group">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-xl bg-[var(--color-surface)] border border-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-text)] opacity-40">
                                                                    <Package size={24} />
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-bold">#{order.order_number}</div>
                                                                    <div className="text-[10px] text-[var(--color-text)] opacity-60 uppercase tracking-widest font-black">{new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm font-bold">${order.total_amount}</div>
                                                                <div className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block ${order.status === 'delivered' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                                                                    }`}>{order.status}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="py-12 text-center text-[var(--color-text)] opacity-40 text-sm">No recent orders</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'orders' && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold font-serif">Order History</h2>
                                        {ordersLoading ? (
                                            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[var(--color-primary)]" size={32} /></div>
                                        ) : activeOrders.length > 0 ? (
                                            <div className="space-y-4">
                                                {activeOrders.map(order => (
                                                    <div key={order.id} className="bg-[var(--color-surface)] border border-[var(--color-primary)]/10 shadow-sm border border-[var(--color-primary)]/10 rounded-3xl p-6">
                                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                                            <div className="space-y-1">
                                                                <div className="text-lg font-bold">Order #{order.order_number}</div>
                                                                <div className="text-xs text-[var(--color-text)] opacity-60">Placed on {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className={`px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${order.status === 'delivered' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20'
                                                                    }`}>
                                                                    {order.status}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4 border-y border-[var(--color-primary)]/10 py-6">
                                                            {order.items?.map((item: any, idx: number) => (
                                                                <div key={idx} className="flex items-center justify-between gap-4">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-primary)]/10 border border-[var(--color-primary)]/10 overflow-hidden">
                                                                            <img src="/assets/placeholder-product.png" className="w-full h-full object-cover opacity-50" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-sm font-bold">{item.product_name}</div>
                                                                            <div className="text-xs text-[var(--color-text)] opacity-50">Qty: {item.quantity}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-sm font-bold">${item.subtotal}</div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="flex items-center justify-between pt-6">
                                                            <div className="text-xs text-[var(--color-text)] opacity-60">Total Amount</div>
                                                            <div className="text-xl font-bold text-[var(--color-primary)]">${order.total_amount} {order.currency}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="bg-[var(--color-surface)] border border-[var(--color-primary)]/10 shadow-sm border border-[var(--color-primary)]/10 rounded-3xl p-20 text-center">
                                                <div className="w-16 h-16 rounded-full bg-[var(--color-surface)] border border-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4 text-[var(--color-text)] opacity-30">
                                                    <ShoppingBag size={32} />
                                                </div>
                                                <h3 className="text-lg font-bold mb-2">No orders yet</h3>
                                                <p className="text-xs text-[var(--color-text)] opacity-60 mb-6">Looks like you haven't placed any orders yet.</p>
                                                <Link to="/products" className="inline-flex px-6 py-3 bg-[var(--color-primary)] text-black font-black uppercase tracking-widest text-[10px] rounded-2xl">Start Shopping</Link>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'cancelled' && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold font-serif">Cancelled Orders</h2>
                                        {ordersLoading ? (
                                            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[var(--color-primary)]" size={32} /></div>
                                        ) : cancelledOrders.length > 0 ? (
                                            <div className="space-y-4">
                                                {cancelledOrders.map(order => (
                                                    <div key={order.id} className="bg-[var(--color-surface)] border border-[var(--color-primary)]/10 shadow-sm border border-[var(--color-primary)]/10 rounded-3xl p-6 opacity-60 grayscale-[0.5]">
                                                        {/* Similar order card but for cancelled */}
                                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                                            <div className="space-y-1">
                                                                <div className="text-lg font-bold underline decoration-red-500/30">Order #{order.order_number}</div>
                                                                <div className="text-xs text-[var(--color-text)] opacity-60">Cancelled on {new Date(order.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                                                            </div>
                                                            <div className="px-4 py-1.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest">
                                                                Cancelled
                                                            </div>
                                                        </div>
                                                        <div className="text-sm font-bold text-[var(--color-primary)]/50">Refund Amount: ${order.total_amount}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="bg-[var(--color-surface)] border border-[var(--color-primary)]/10 shadow-sm border border-[var(--color-primary)]/10 rounded-3xl p-20 text-center text-[var(--color-text)] opacity-40">
                                                No cancelled orders found.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'addresses' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-2xl font-bold font-serif">Saved Addresses</h2>
                                            <button
                                                onClick={() => {
                                                    setIsAddingAddress(true);
                                                    setNewAddress({
                                                        full_name: profile?.full_name || '',
                                                        phone: profile?.phone || '',
                                                        street_address: '', city: '', state: '', pincode: '',
                                                        country: locationData?.country_name || 'United States', is_default: false
                                                    });
                                                }}
                                                className="px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-primary)]/20 transition-all"
                                            >
                                                Add New Address
                                            </button>
                                        </div>

                                        <AnimatePresence>
                                            {isAddingAddress && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="bg-[var(--color-surface)] border border-[var(--color-primary)]/10 shadow-sm border border-[var(--color-primary)]/20 rounded-3xl p-6 overflow-hidden"
                                                >
                                                    <h3 className="text-lg font-bold font-serif mb-6 flex items-center justify-between">
                                                        New Delivery Address
                                                        <button onClick={() => setIsAddingAddress(false)} className="text-[var(--color-text)] opacity-60 hover:text-[var(--color-text)]"><X size={18} /></button>
                                                    </h3>

                                                    <form onSubmit={handleSaveAddress} className="space-y-4">
                                                        <div className="flex justify-end">
                                                            <button
                                                                type="button"
                                                                onClick={handleReadLocation}
                                                                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-primary)]/20 transition-all"
                                                            >
                                                                <Navigation size={14} />
                                                                Get Current Location
                                                            </button>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <PremiumInput
                                                                label="Recipient Name *"
                                                                required
                                                                placeholder="e.g. John Doe"
                                                                value={newAddress.full_name}
                                                                onChange={(e: any) => setNewAddress({ ...newAddress, full_name: e.target.value })}
                                                            />
                                                            <PremiumInput
                                                                label="Contact Number *"
                                                                required
                                                                placeholder="e.g. +91XXXXXXXXXX"
                                                                value={newAddress.phone}
                                                                onChange={(e: any) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                                            />
                                                        </div>

                                                        <div className="relative">
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-primary)]/60">Search Area / Landmark</label>
                                                                <div className="relative group">
                                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 w-4 h-4 group-focus-within:text-[var(--color-primary)] transition-all" />
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Search for your area..."
                                                                        className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-2xl text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all"
                                                                        value={areaSearch}
                                                                        onChange={e => {
                                                                            setAreaSearch(e.target.value);
                                                                            setShowSuggestions(true);
                                                                        }}
                                                                        onFocus={() => setShowSuggestions(true)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {showSuggestions && (areaSearch.length > 2 || placeSuggestions.length > 0) && (
                                                                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-surface)] border border-[var(--color-primary)]/20 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-3xl">
                                                                    {isSearchingPlaces ? (
                                                                        <div className="p-4 text-center">
                                                                            <Loader2 className="animate-spin text-amber-400 mx-auto" size={16} />
                                                                        </div>
                                                                    ) : placeSuggestions.length > 0 ? (
                                                                        <>
                                                                            {placeSuggestions.map((feat, idx) => {
                                                                                const { name, city, state, country, postcode } = feat.properties;
                                                                                const label = [name, city, state, country].filter(Boolean).join(', ');
                                                                                return (
                                                                                    <button
                                                                                        key={idx}
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            setNewAddress({
                                                                                                ...newAddress,
                                                                                                city: city || name || '',
                                                                                                state: state || '',
                                                                                                country: country || locationData?.country_name || 'United States',
                                                                                                pincode: postcode || '',
                                                                                                street_address: label
                                                                                            });
                                                                                            setAreaSearch(label);
                                                                                            setShowSuggestions(false);
                                                                                        }}
                                                                                         className="w-full text-left px-6 py-3 hover:bg-[var(--color-primary)]/10 border-b border-[var(--color-border)]/10 last:border-0 text-xs text-[var(--color-text)] opacity-80 hover:text-[var(--color-text)] transition-all flex items-center gap-3"
                                                                                    >
                                                                                        <MapPin size={14} className="text-[var(--color-primary)] shrink-0" />
                                                                                        <span className="truncate">{label}</span>
                                                                                    </button>
                                                                                );
                                                                            })}
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setShowSuggestions(false)}
                                                                                className="w-full text-center py-2 text-[10px] text-[var(--color-text)] opacity-40 hover:text-[var(--color-text)] opacity-60 uppercase tracking-widest bg-white/[0.02]"
                                                                            >
                                                                                Place not found? Enter manually below
                                                                            </button>
                                                                        </>
                                                                    ) : areaSearch.length > 2 && (
                                                                        <div className="p-4 text-center text-[10px] text-[var(--color-text)] opacity-60 italic">
                                                                            No matches found. Try entering details manually.
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="space-y-1">
                                                            <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-primary)]/60">Street Address *</label>
                                                            <textarea
                                                                required
                                                                rows={2}
                                                                placeholder="House No., Building, Street Name"
                                                                className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-2xl text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all h-20 resize-none"
                                                                value={newAddress.street_address}
                                                                onChange={e => setNewAddress({ ...newAddress, street_address: e.target.value })}
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                            <PremiumInput
                                                                label="City *"
                                                                required
                                                                value={newAddress.city}
                                                                onChange={(e: any) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                            />
                                                            <PremiumInput
                                                                label="State *"
                                                                required
                                                                value={newAddress.state}
                                                                onChange={(e: any) => setNewAddress({ ...newAddress, state: e.target.value })}
                                                            />
                                                            <PremiumInput
                                                                label="Pincode *"
                                                                required
                                                                value={newAddress.pincode}
                                                                onChange={(e: any) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                                            />
                                                        </div>

                                                        <div className="flex items-center gap-4 pt-4">
                                                            <button
                                                                type="submit"
                                                                disabled={saving}
                                                                className="flex-1 py-4 bg-[var(--color-primary)] text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-95 transition-all"
                                                            >
                                                                {saving ? 'Saving...' : 'Save delivery Address'}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setIsAddingAddress(false)}
                                                                className="px-8 py-4 bg-[var(--color-surface)] border border-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-text)] opacity-60 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-[var(--color-surface)] border border-[var(--color-primary)]/20 transition-all font-sans"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </form>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {profile?.addresses?.map((addr: any) => (
                                                <div key={addr.id} className="bg-[var(--color-surface)] border border-[var(--color-primary)]/10 shadow-sm border border-[var(--color-primary)]/10 rounded-3xl p-6 relative group hover:border-[var(--color-primary)]/20 transition-all">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                                                            <MapPin size={20} />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {addr.is_default && (
                                                                <span className="text-[9px] font-black uppercase bg-emerald-400/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-400/20">Default</span>
                                                            )}
                                                            <button
                                                                onClick={() => setShowAddressDeleteId(addr.id)}
                                                                className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <h3 className="font-bold text-sm mb-1">{addr.full_name}</h3>
                                                    <p className="text-[11px] text-[var(--color-text)] opacity-60 mb-1 font-bold">{addr.phone}</p>
                                                    <p className="text-xs text-[var(--color-text)] opacity-60 leading-relaxed mb-4">
                                                        {addr.street_address}, {addr.city}<br />
                                                        {addr.state}, {addr.pincode}<br />
                                                        {addr.country}
                                                    </p>
                                                    <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-primary)]/10">
                                                        {!addr.is_default && (
                                                            <button
                                                                onClick={() => handleSetDefault(addr.id)}
                                                                className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]/60 hover:text-[var(--color-primary)] transition-all"
                                                            >
                                                                Set as Default
                                                            </button>
                                                        )}
                                                        <button className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text)] opacity-60 hover:text-[var(--color-text)] transition-all ml-auto">Edit</button>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!profile?.addresses || profile.addresses.length === 0) && !isAddingAddress && (
                                                <div className="sm:col-span-2 bg-[var(--color-surface)] border border-[var(--color-primary)]/10 shadow-sm border border-[var(--color-primary)]/10 rounded-3xl p-12 text-center text-[var(--color-text)] opacity-40">
                                                    No addresses saved yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'profile' && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold font-serif">Profile Settings</h2>

                                        <div className="bg-[var(--color-surface)] border border-[var(--color-primary)]/10 shadow-sm border border-[var(--color-primary)]/10 rounded-3xl p-8">
                                            <div className="flex items-center gap-8 mb-10">
                                                <div className="relative">
                                                    <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-[var(--color-primary)]/20 bg-black/40">
                                                        {uploading ? (
                                                            <div className="w-full h-full flex items-center justify-center bg-black/60">
                                                                <Loader2 className="animate-spin text-[var(--color-primary)]" size={24} />
                                                            </div>
                                                        ) : (
                                                            <img
                                                                src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name || user?.email}`}
                                                                alt="Avatar"
                                                                className="w-full h-full object-cover"
                                                                onError={(e: any) => e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name || user?.email}`}
                                                            />
                                                        )}
                                                    </div>
                                                    <input
                                                        type="file"
                                                        hidden
                                                        ref={fileInputRef}
                                                        onChange={handleAvatarUpload}
                                                        accept="image/*"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="absolute -bottom-2 -right-2 p-2 bg-[var(--color-primary)] text-black rounded-xl hover:bg-amber-300 transition-all shadow-lg active:scale-90"
                                                    >
                                                        <Camera size={14} />
                                                    </button>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold font-serif">{profile?.full_name || 'User'}</h3>
                                                    <p className="text-sm text-[var(--color-text)] opacity-60 mb-3">{user?.email}</p>
                                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${USER_TYPE_BADGE[profile?.user_type || 'customer'].color}`}>
                                                        {USER_TYPE_BADGE[profile?.user_type || 'customer'].label}
                                                    </div>
                                                </div>
                                            </div>

                                            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <PremiumInput
                                                        label="Full Name"
                                                        type="text"
                                                        value={editForm.full_name}
                                                        onChange={(e: any) => setEditForm({ ...editForm, full_name: e.target.value })}
                                                    />
                                                    <PremiumInput
                                                        label="Phone Number"
                                                        type="tel"
                                                        value={editForm.phone}
                                                        onChange={(e: any) => setEditForm({ ...editForm, phone: e.target.value })}
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={saving}
                                                    className="w-full py-4 bg-amber-400 text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg shadow-amber-400/20 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
                                                >
                                                    {saving ? 'Updating...' : 'Update Profile'}
                                                </button>

                                                <AnimatePresence>
                                                    {message && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0 }}
                                                            className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 ${msgType === 'success' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-red-400/10 text-red-400 border border-red-400/20'}`}
                                                        >
                                                            {msgType === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                                            {message}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </form>

                                            <div className="mt-12 pt-12 border-t border-[var(--color-primary)]/10">
                                                <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                                                    <Shield size={16} className="text-amber-400" />
                                                    Security & Privacy
                                                </h4>
                                                <div className="space-y-3">
                                                    <button 
                                                        onClick={() => setShowVerifyModal(true)}
                                                        className="w-full flex items-center justify-between p-4 bg-[var(--color-surface)] border border-[var(--color-primary)]/10 border border-[var(--color-primary)]/10 rounded-2xl hover:border-[var(--color-primary)]/20 transition-all text-xs font-bold text-white/60 hover:text-[var(--color-text)]"
                                                    >
                                                        <span className="flex items-center gap-3"><KeyRound size={16} /> Change Password</span>
                                                        <ChevronRight size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-12 bg-red-500/5 border border-red-500/10 rounded-[2.5rem] p-10">
                                                <div className="flex items-center gap-5 mb-6">
                                                    <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 shadow-inner">
                                                        <AlertCircle size={28} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-red-400 font-serif">Danger Zone</h3>
                                                        <p className="text-[10px] text-red-500/40 uppercase tracking-[0.2em] font-black">Account Deletion</p>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-[var(--color-text)] opacity-60 mb-8 leading-relaxed max-w-md">
                                                    Permanent deletion deactivates your access and removes your personal history. You can restore your data during the grace period by signing in again.
                                                </p>
                                                <button
                                                    onClick={() => setShowDeleteModal(true)}
                                                    disabled={saving}
                                                    className="px-8 py-4 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-full shadow-lg shadow-red-500/20 hover:bg-red-600 active:scale-95 transition-all w-full sm:w-auto"
                                                >
                                                    {saving ? 'Processing...' : 'Delete My Account'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'support' && (
                                    <div className="space-y-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <h2 className="text-2xl font-bold font-serif">Support Center</h2>
                                                <p className="text-sm text-[var(--color-text)] opacity-60">Track your requests and chat with us</p>
                                            </div>
                                            <button
                                                onClick={() => { setSelectedTicket(null); setNewTicket({ issue_type: '', description: '', other_description: '', media_urls: [] }); }}
                                                className="px-6 py-3 bg-amber-400 text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-amber-400/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                            >
                                                <Plus size={14} /> New Request
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                            {/* Left: Tickets List */}
                                            <div className="lg:col-span-4 space-y-4">
                                                <div className="bg-[var(--color-surface)] border border-[var(--color-primary)]/10 shadow-sm border border-[var(--color-primary)]/10 rounded-3xl p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                                                    <div className="flex items-center justify-between mb-4 px-2">
                                                        <h3 className="text-xs font-black uppercase tracking-widest text-[var(--color-text)] opacity-60">Your Tickets</h3>
                                                        <button
                                                            onClick={fetchTickets}
                                                            disabled={ticketsLoading}
                                                            className="p-1.5 rounded-lg hover:bg-[var(--color-surface)] border border-[var(--color-primary)]/10 text-[var(--color-text)] opacity-40 hover:text-amber-400 transition-all"
                                                            title="Refresh Tickets"
                                                        >
                                                            <RefreshCcw size={12} className={cn(ticketsLoading && "animate-spin")} />
                                                        </button>
                                                    </div>
                                                    {ticketsLoading && tickets.length === 0 ? (
                                                        <div className="space-y-3 p-2">
                                                            {[1, 2, 3].map(i => (
                                                                <div key={i} className="h-16 bg-white/[0.02] rounded-2xl animate-pulse" />
                                                            ))}
                                                        </div>
                                                    ) : tickets.length === 0 ? (
                                                        <div className="text-center py-12 px-4 italic text-[var(--color-text)] opacity-40 text-xs">
                                                            No support requests found.
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {tickets.map(t => (
                                                                <button
                                                                    key={t.id}
                                                                    onClick={() => setSelectedTicket(t)}
                                                                    className={cn(
                                                                        "w-full text-left p-4 rounded-2xl border transition-all hover:bg-[var(--color-surface)] border border-[var(--color-primary)]/10",
                                                                        selectedTicket?.id === t.id ? "bg-[var(--color-surface)] border border-[var(--color-primary)]/10 border-amber-400/30" : "bg-transparent border-[var(--color-primary)]/10"
                                                                    )}
                                                                >
                                                                    <div className="flex justify-between items-start mb-1">
                                                                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">{t.issue_type}</span>
                                                                        <span className={cn(
                                                                            "text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full",
                                                                            t.status === 'open' ? "bg-blue-400/10 text-blue-400" :
                                                                                t.status === 'in_progress' ? "bg-amber-400/10 text-amber-400" : "bg-emerald-400/10 text-emerald-400"
                                                                        )}>
                                                                            {t.status}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm font-bold truncate mb-1">{t.description}</p>
                                                                    <div className="flex items-center gap-2 text-[10px] text-[var(--color-text)] opacity-50">
                                                                        <Clock size={10} />
                                                                        {new Date(t.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Static Contact Info */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <a href="tel:+91XXXXXXXXXX" className="bg-[var(--color-surface)] border border-[var(--color-primary)]/10 shadow-sm border border-[var(--color-primary)]/10 rounded-2xl p-4 flex flex-col items-center text-center gap-2 hover:bg-[var(--color-surface)] border border-[var(--color-primary)]/10 transition-all">
                                                        <Phone size={18} className="text-emerald-400" />
                                                        <span className="text-[10px] font-black uppercase text-[var(--color-text)] opacity-60">Call</span>
                                                    </a>
                                                    <a href="mailto:support@videepthafoods.com" className="bg-[var(--color-surface)] border border-[var(--color-primary)]/10 shadow-sm border border-[var(--color-primary)]/10 rounded-2xl p-4 flex flex-col items-center text-center gap-2 hover:bg-[var(--color-surface)] border border-[var(--color-primary)]/10 transition-all">
                                                        <Mail size={18} className="text-blue-400" />
                                                        <span className="text-[10px] font-black uppercase text-[var(--color-text)] opacity-60">Email</span>
                                                    </a>
                                                </div>
                                            </div>

                                            {/* Right: Ticket Detail / New Form */}
                                            <div className="lg:col-span-8">
                                                {selectedTicket ? (
                                                    /* Ticket Detail & Chat */
                                                    <div className="bg-[var(--color-surface)] border border-[var(--color-primary)]/10 shadow-sm border border-[var(--color-primary)]/10 rounded-3xl overflow-hidden flex flex-col h-[600px]">
                                                        {/* Chat Header */}
                                                        <div className="p-6 border-b border-[var(--color-primary)]/10 bg-white/[0.02]">
                                                            <div className="flex justify-between items-center mb-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400">
                                                                        <HeadphonesIcon size={20} />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-bold">Ticket #{selectedTicket.id.slice(-6)}</h3>
                                                                        <p className="text-[10px] text-[var(--color-text)] opacity-60 uppercase tracking-widest font-black">{selectedTicket.issue_type}</p>
                                                                    </div>
                                                                </div>
                                                                <span className={cn(
                                                                    "text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-xl",
                                                                    selectedTicket.status === 'open' ? "bg-blue-400/10 text-blue-400 border border-blue-400/20" :
                                                                        selectedTicket.status === 'in_progress' ? "bg-amber-400/10 text-amber-400 border border-amber-400/20" : "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                                                                )}>
                                                                    {selectedTicket.status}
                                                                </span>
                                                            </div>
                                                            <div className="p-4 bg-black/20 rounded-2xl border border-[var(--color-primary)]/10">
                                                                <p className="text-sm text-white/60 mb-2 italic">"{selectedTicket.description}"</p>
                                                                {selectedTicket.other_description && <p className="text-xs text-[var(--color-text)] opacity-60 mb-3 ml-2 border-l-2 border-[var(--color-primary)]/20 pl-3">{selectedTicket.other_description}</p>}
                                                                {selectedTicket.media_urls?.length > 0 && (
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {selectedTicket.media_urls.map((url: string, idx: number) => (
                                                                            <a key={idx} href={url} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-lg border border-[var(--color-primary)]/20 overflow-hidden hover:scale-110 transition-all">
                                                                                {url.match(/\.(mp4|webm|mov)$/) ? (
                                                                                    <div className="w-full h-full flex items-center justify-center bg-[var(--color-surface)] border border-[var(--color-primary)]/10"><FileVideo size={16} /></div>
                                                                                ) : (
                                                                                    <img src={url} alt="Attach" className="w-full h-full object-cover" />
                                                                                )}
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Chat Messages */}
                                                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                                            {selectedTicket.conversations?.length === 0 ? (
                                                                <div className="h-full flex flex-col items-center justify-center text-[var(--color-text)] opacity-30 gap-3">
                                                                    <MessageSquare size={48} />
                                                                    <p className="text-xs italic">No messages yet. Support will respond soon.</p>
                                                                </div>
                                                            ) : (
                                                                selectedTicket.conversations.map((msg: any, idx: number) => (
                                                                    <div key={idx} className={cn(
                                                                        "flex flex-col max-w-[80%]",
                                                                        msg.role === 'user' ? "ml-auto items-end" : "items-start"
                                                                    )}>
                                                                        <div className={cn(
                                                                            "p-4 rounded-2xl text-sm",
                                                                            msg.role === 'user' ? "bg-amber-400 text-black font-medium rounded-tr-none" : "bg-[var(--color-surface)] border border-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-tl-none"
                                                                        )}>
                                                                            {msg.content}
                                                                        </div>
                                                                        <span className="text-[8px] text-[var(--color-text)] opacity-40 mt-1 uppercase tracking-widest font-black">
                                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                        </span>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>

                                                        {/* Chat Input */}
                                                        {selectedTicket.status !== 'resolved' ? (
                                                            <form onSubmit={handleAddChatMessage} className="p-4 border-t border-[var(--color-primary)]/10 bg-white/[0.02] flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={chatMessage}
                                                                    onChange={(e) => setChatMessage(e.target.value)}
                                                                    placeholder="Type your message..."
                                                                    className="flex-1 px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-2xl text-sm focus:border-amber-400/50 outline-none transition-all"
                                                                />
                                                                <button type="submit" className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center hover:scale-105 transition-all">
                                                                    <Send size={18} />
                                                                </button>
                                                            </form>
                                                        ) : (
                                                            <div className="p-6 text-center bg-emerald-400/5 border-t border-emerald-400/10 text-emerald-400 text-xs font-black uppercase tracking-widest py-4">
                                                                This ticket has been resolved
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    /* New Ticket Form */
                                                    <div className="bg-[var(--color-surface)] border border-[var(--color-primary)]/10 shadow-sm border border-[var(--color-primary)]/10 rounded-3xl p-8">
                                                        <div className="flex items-center gap-3 mb-8">
                                                            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center text-amber-400">
                                                                <Inbox size={24} />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-xl font-bold font-serif">Submit a Request</h3>
                                                                <p className="text-sm text-[var(--color-text)] opacity-60">Our team will get back to you within 24 hours</p>
                                                            </div>
                                                        </div>
                                                        <form onSubmit={handleSubmitTicket} className="space-y-6">
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text)] opacity-60 ml-2">Issue Type</label>
                                                                <select
                                                                    value={newTicket.issue_type}
                                                                    onChange={(e) => setNewTicket({ ...newTicket, issue_type: e.target.value })}
                                                                    className="w-full px-4 py-4 bg-[var(--color-surface)] border border-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-2xl text-sm focus:border-amber-400/50 outline-none transition-all appearance-none"
                                                                >
                                                                    <option value="">Select an issue type</option>
                                                                    <option value="order">Order Related issue</option>
                                                                    <option value="payment">Payment Problem</option>
                                                                    <option value="delivery">Delivery Status</option>
                                                                    <option value="other">Other Inquiry</option>
                                                                </select>
                                                            </div>

                                                            <AnimatePresence>
                                                                {newTicket.issue_type === 'other' && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, height: 0 }}
                                                                        animate={{ opacity: 1, height: 'auto' }}
                                                                        exit={{ opacity: 0, height: 0 }}
                                                                        className="space-y-2"
                                                                    >
                                                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text)] opacity-60 ml-2">Specify Other Detail</label>
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Briefly specify the topic..."
                                                                            value={newTicket.other_description}
                                                                            onChange={(e) => setNewTicket({ ...newTicket, other_description: e.target.value })}
                                                                            className="w-full px-4 py-4 bg-[var(--color-surface)] border border-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-2xl text-sm focus:border-amber-400/50 outline-none transition-all"
                                                                        />
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>

                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text)] opacity-60 ml-2">Description</label>
                                                                <textarea
                                                                    placeholder="Explain the problem in detail..."
                                                                    value={newTicket.description}
                                                                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                                                    className="w-full px-4 py-4 bg-[var(--color-surface)] border border-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-2xl text-sm focus:border-amber-400/50 outline-none transition-all h-32 resize-none"
                                                                ></textarea>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text)] opacity-60 ml-2">Attachments (Images/Videos)</label>
                                                                <div className="flex flex-col gap-4">
                                                                    <div className="flex flex-wrap gap-3">
                                                                        {newTicket.media_urls.map((url, idx) => (
                                                                            <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-[var(--color-primary)]/20 shadow-lg">
                                                                                {url.match(/\.(mp4|webm|mov)$/) ? (
                                                                                    <div className="w-full h-full flex items-center justify-center bg-[var(--color-surface)] border border-[var(--color-primary)]/10"><FileVideo size={24} /></div>
                                                                                ) : (
                                                                                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                                                                )}
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => setNewTicket({ ...newTicket, media_urls: newTicket.media_urls.filter((_, i) => i !== idx) })}
                                                                                    className="absolute top-1 right-1 w-6 h-6 rounded-lg bg-black/60 text-[var(--color-text)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                                                                >
                                                                                    <Trash2 size={12} />
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => supportFileRef.current?.click()}
                                                                            className="w-20 h-20 rounded-xl bg-[var(--color-surface)] border border-[var(--color-primary)]/10 border-2 border-dashed border-[var(--color-primary)]/20 flex flex-col items-center justify-center text-[var(--color-text)] opacity-40 hover:text-amber-400 hover:border-amber-400/30 transition-all gap-1"
                                                                        >
                                                                            <Paperclip size={20} />
                                                                            <span className="text-[8px] font-black uppercase">Attach</span>
                                                                        </button>
                                                                    </div>
                                                                    <p className="text-[9px] text-[var(--color-text)] opacity-50 italic px-2">* Max 2 minutes for video uploads.</p>
                                                                </div>
                                                                <input
                                                                    type="file"
                                                                    ref={supportFileRef}
                                                                    className="hidden"
                                                                    multiple
                                                                    accept="image/*,video/*"
                                                                    onChange={handleTicketFileUpload}
                                                                />
                                                            </div>

                                                            <button
                                                                type="submit"
                                                                disabled={saving || uploading}
                                                                className="w-full py-5 bg-amber-400 text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-amber-400/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-3"
                                                            >
                                                                {saving ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                                                                Submit Request
                                                            </button>
                                                        </form>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'favorites' && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold font-serif">My Favorites</h2>
                                        {favsLoading ? (
                                            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[var(--color-primary)]" size={32} /></div>
                                        ) : favProducts.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {favProducts.map(product => (
                                                    <div key={product._id} className="bg-[var(--color-surface)] border border-[var(--color-primary)]/10 shadow-sm border border-[var(--color-primary)]/10 rounded-3xl overflow-hidden group hover:border-[var(--color-primary)]/30 transition-all">
                                                        <div className="aspect-square relative overflow-hidden">
                                                            <img
                                                                src={product.images?.[0] || '/assets/placeholder-product.png'}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                            />
                                                            <button
                                                                onClick={() => setShowFavRemoveId(product._id)}
                                                                className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-red-400 hover:bg-red-400 hover:text-[var(--color-text)] transition-all"
                                                            >
                                                                <Heart size={16} fill="currentColor" />
                                                            </button>
                                                        </div>
                                                        <div className="p-5">
                                                            <h3 className="font-bold text-sm mb-1">{product.name}</h3>
                                                            <p className="text-[var(--color-primary)] font-bold text-xs mb-4">{formatPrice(product.price)}</p>
                                                            <button
                                                                onClick={() => navigate(`/products/${product._id}`)}
                                                                className="w-full py-3 bg-[var(--color-surface)] border border-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-surface)] border border-[var(--color-primary)]/20 transition-all"
                                                            >
                                                                View Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="bg-[var(--color-surface)] border border-[var(--color-primary)]/10 shadow-sm border border-[var(--color-primary)]/10 rounded-3xl p-20 text-center">
                                                <div className="w-16 h-16 rounded-full bg-[var(--color-surface)] border border-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4 text-[var(--color-text)] opacity-30">
                                                    <Heart size={32} />
                                                </div>
                                                <h3 className="text-lg font-bold mb-2">No favorites yet</h3>
                                                <p className="text-xs text-[var(--color-text)] opacity-60 mb-6">Start marking products you love to see them here.</p>
                                                <Link to="/products" className="inline-flex px-6 py-3 bg-[var(--color-primary)] text-black font-black uppercase tracking-widest text-[10px] rounded-2xl">Browse Products</Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Account Deletion Modal */}
            <ActionModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={(reason) => handleDeleteAccount(reason)}
                title="Account Deletion"
                description={`You are about to delete your account. This will:
                ✦ Anonymize your name and email.
                ✦ Delete all saved addresses and favorites.
                ✦ Revoke all active login sessions.
                
                You can restore your account details within the grace period by signing in again.`}
                confirmText="Proceed with Deletion"
                type="danger"
                showInput={true}
                inputPlaceholder="Please tell us why you are leaving (optional)..."
                loading={saving}
            />

            {/* Address Deletion Modal */}
            <ActionModal
                isOpen={!!showAddressDeleteId}
                onClose={() => setShowAddressDeleteId(null)}
                onConfirm={() => showAddressDeleteId && handleDeleteAddress(showAddressDeleteId)}
                title="Delete Address?"
                description="Are you sure you want to remove this delivery address? This action cannot be undone."
                confirmText="Delete Address"
                type="danger"
                loading={saving}
            />

            {/* Password Change Verification Modal */}
            <ChangePasswordModal
                isOpen={showVerifyModal}
                onClose={() => setShowVerifyModal(false)}
                onVerified={(token) => {
                    setVerificationToken(token);
                    setShowVerifyModal(false);
                    setShowFinalizeModal(true);
                }}
            />

            {/* Password Change Finalize Modal */}
            <FinalizePasswordModal
                isOpen={showFinalizeModal}
                onClose={() => setShowFinalizeModal(false)}
                token={verificationToken}
                onComplete={() => {
                    setShowFinalizeModal(false);
                    setMessage('Password changed successfully. Please login again if required.');
                    setMsgType('success');
                }}
            />

            {/* Favorite Removal Modal */}
            <ActionModal
                isOpen={!!showFavRemoveId}
                onClose={() => setShowFavRemoveId(null)}
                onConfirm={async () => {
                    if (!showFavRemoveId) return;
                    setSaving(true);
                    try {
                        const token = localStorage.getItem('access_token');
                        await axios.delete(`${API_BASE}/favorites/${showFavRemoveId}/`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        fetchFavorites();
                        setShowFavRemoveId(null);
                    } catch (err) {
                        console.error('Failed to remove favorite:', err);
                    } finally {
                        setSaving(false);
                    }
                }}
                title="Remove Favorite?"
                description="Are you sure you want to remove this item from your favorites?"
                confirmText="Remove"
                type="danger"
                loading={saving}
            />

        </div>
    );
}
