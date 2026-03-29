import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, CreditCard, Truck, ShieldCheck, MapPin, Phone, User, ChevronRight, Plus, Minus, Trash2, Info, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { API_URL } from '../config';

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
        fontFamily: "'Outfit', sans-serif",
        paddingTop: '120px',
        paddingBottom: '100px',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)',
        gap: '48px',
    },
    section: {
        background: 'var(--color-surface)',
        borderRadius: '32px',
        border: '1px solid var(--color-border)',
        padding: '40px',
        marginBottom: '32px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
    },
    sectionTitle: {
        fontSize: '24px',
        fontWeight: 800,
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontFamily: "'Playfair Display', serif",
        color: 'var(--color-primary)',
    },
    inputGroup: {
        marginBottom: '24px',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: 600,
        color: 'var(--color-text-dim)',
        marginBottom: '8px',
    },
    input: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.02)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        padding: '16px',
        color: 'var(--color-text)',
        fontSize: '16px',
        outline: 'none',
        transition: 'all 0.3s ease',
    },
    summaryItem: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '16px',
        fontSize: '16px',
        color: 'var(--color-text-dim)',
    },
    total: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '24px',
        paddingTop: '24px',
        borderTop: '1px solid var(--color-border)',
        fontSize: '24px',
        fontWeight: 900,
        color: 'var(--color-text)',
    },
    orderBtn: {
        width: '100%',
        background: 'var(--color-primary)',
        color: 'var(--color-text)',
        border: 'none',
        borderRadius: '100px',
        padding: '20px',
        fontSize: '18px',
        fontWeight: 800,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginTop: '32px',
        boxShadow: '0 20px 40px rgba(92, 141, 55, 0.2)',
    }
};

const CheckoutPage = () => {
    const { cartItems, cartTotal, clearCart, formatPrice, currency, locationData, updateQuantity, removeFromCart } = useCart();
    const { user, isLoggedIn, loading: authLoading, openAuthModal } = useAuth();
    const navigate = useNavigate();

    const totalWeight = cartItems.reduce((acc, item: any) => {
        const weightStr = item.attributes?.weight || '0';
        const weightVal = parseFloat(weightStr.replace(/[^\d.]/g, '')) || 0;
        return acc + (weightVal * item.quantity);
    }, 0);

    const isBulkOrder = totalWeight >= 5000; // 5kg = 5000g assumed

    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState<any>({
        full_name: '',
        phone: '',
        street_address: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        country: locationData?.country_name || 'United States'
    });

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

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [couponError, setCouponError] = useState('');
    const [validatingCoupon, setValidatingCoupon] = useState(false);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    // Enforce Login
    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            openAuthModal();
        }
    }, [isLoggedIn, authLoading, openAuthModal]);

    if (authLoading || !isLoggedIn) return <div style={styles.page}><div style={styles.container}>Loading Account...</div></div>;

    const addresses = user?.profile?.addresses || [];

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setValidatingCoupon(true);
        setCouponError('');
        try {
            const token = localStorage.getItem('access_token');
            const { data } = await axios.post(`${API_URL}/coupons/validate/`, {
                code: couponCode,
                total_amount: cartTotal
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppliedCoupon(data);
            setDiscountAmount(data.discount);
            setCouponError('');
        } catch (err: any) {
            setCouponError(err.response?.data?.message || 'Invalid coupon code');
            setAppliedCoupon(null);
            setDiscountAmount(0);
        } finally {
            setValidatingCoupon(false);
        }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const combinedAddress = newAddress.landmark ? `${newAddress.street_address}\nLandmark: ${newAddress.landmark}` : newAddress.street_address;
            const addressPayload = { ...newAddress };
            delete addressPayload.landmark;

            await axios.post(`${API_URL}/accounts/addresses/`, {
                ...addressPayload,
                street_address: combinedAddress,
                address_type: 'shipping'
            });
            alert('Address added!');
            setIsAddingAddress(false);
            window.location.reload(); 
        } catch (err) {
            alert('Failed to add address');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedAddressId && !isAddingAddress) {
            alert('Please select or add a shipping address');
            return;
        }

        try {
            const token = localStorage.getItem('access_token');
            let finalAddress = null;

            // 1. If adding a new address, sync it to the profile first
            if (isAddingAddress) {
                const combinedAddress = newAddress.landmark ? `${newAddress.street_address}\nLandmark: ${newAddress.landmark}` : newAddress.street_address;
                const addressPayload = { ...newAddress };
                delete addressPayload.landmark;
                
                // Keep the created address data
                await axios.post(`${API_URL}/accounts/addresses/`, {
                    ...addressPayload,
                    street_address: combinedAddress,
                    address_type: 'shipping'
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                finalAddress = { ...newAddress, street_address: combinedAddress, address_type: 'shipping' };
            } else {
                finalAddress = addresses.find((a: any) => a.id === selectedAddressId || a._id === selectedAddressId);
            }

            if (!finalAddress) {
                alert('Invalid shipping address selected.');
                return;
            }

            const data = {
                items: cartItems.map(item => ({
                    product_id: item._id || (item as any).id,
                    product_name: item.name,
                    quantity: item.quantity,
                    price_at_purchase: item.price
                })),
                total_amount: cartTotal - discountAmount,
                currency: currency || 'USD',
                device_location: locationData || {},
                shipping_address: finalAddress
            };

            setIsSubmitting(true);
            await axios.post(`${API_URL}/orders/`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setOrderSuccess(true);
            clearCart();
            
            // Redirect after 2.5 seconds
            setTimeout(() => {
                navigate('/account?tab=orders');
            }, 2500);

        } catch (err: any) {
            alert('Failed to place order:\n' + JSON.stringify(err.response?.data || err.message, null, 2));
            console.error('Order Error:', err.response?.data || err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={styles.container}>
                    <ShoppingBag size={80} color="var(--color-primary)" style={{ marginBottom: '24px' }} />
                    <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '24px' }}>Your Basket is Empty</h1>
                    <p style={{ color: 'var(--color-text)', opacity: 0.6, marginBottom: '32px' }}>Add some village goodness before checking out.</p>
                    <Link to="/products" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 800, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                        <ArrowLeft size={18} /> Browse Market
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <Header />
            <div className="max-w-[1200px] mx-auto px-4 md:px-6">
                <header style={{ marginBottom: '48px' }}>
                    <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)', opacity: 0.6, textDecoration: 'none', fontWeight: 600, marginBottom: '24px' }}>
                        <ArrowLeft size={18} /> Back to Market
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h1 className="text-4xl md:text-[48px] font-black font-serif text-[var(--color-text)]">Finalize Your Harvest</h1>
                        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--color-panel)] text-[var(--color-text)] rounded-full border border-[var(--color-border)] text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all">
                            <Plus size={16} /> Shop More
                        </Link>
                    </div>
                </header>

                <div className="flex flex-col lg:grid lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12">
                    <div className="lg:pr-5">
                        <form onSubmit={handleSubmit}>
                            <div style={styles.section} className="p-6 md:p-10">
                                <h2 style={styles.sectionTitle} className="text-xl md:text-2xl"><User size={24} color="var(--color-primary)" /> Account Info</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Email (Verified)</label>
                                        <input
                                            type="text"
                                            style={{ ...styles.input, opacity: 0.5 }}
                                            disabled
                                            value={user?.email || ''}
                                        />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Customer ID</label>
                                        <input
                                            type="text"
                                            style={{ ...styles.input, opacity: 0.5 }}
                                            disabled
                                            value={user?.profile?.customer_id || ''}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={styles.section} className="p-6 md:p-10">
                                <h2 style={styles.sectionTitle} className="text-xl md:text-2xl"><MapPin size={24} color="var(--color-primary)" /> Shipping Address</h2>

                                <div style={{ marginBottom: '24px' }}>
                                    {addresses.length > 0 ? (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                                            {addresses.map((addr: any) => (
                                                <div
                                                    key={addr.id}
                                                    onClick={() => {
                                                        setSelectedAddressId(addr.id);
                                                        setIsAddingAddress(false);
                                                    }}
                                                    style={{
                                                        padding: '20px',
                                                        borderRadius: '20px',
                                                        border: selectedAddressId === addr.id ? '2px solid var(--color-primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                                                        background: selectedAddressId === addr.id ? 'rgba(92, 141, 55, 0.05)' : 'transparent',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    <div style={{ fontWeight: 800, marginBottom: '8px' }}>{addr.full_name}</div>
                                                    <div style={{ fontSize: '13px', color: 'var(--color-text)', opacity: 0.6, lineHeight: '1.6' }}>
                                                        {addr.street_address}<br />
                                                        {addr.city}, {addr.state} {addr.pincode}<br />
                                                        {addr.phone}
                                                    </div>
                                                </div>
                                            ))}
                                            <div
                                                onClick={() => {
                                                    setIsAddingAddress(true);
                                                    setSelectedAddressId(null);
                                                }}
                                                style={{
                                                    padding: '20px',
                                                    borderRadius: '20px',
                                                    border: isAddingAddress ? '2px solid var(--color-primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                                                    background: isAddingAddress ? 'rgba(92, 141, 55, 0.05)' : 'transparent',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    color: isAddingAddress ? 'var(--color-primary)' : '#94a3b8'
                                                }}
                                            >
                                                <Plus size={24} />
                                                <span style={{ fontWeight: 700, fontSize: '14px' }}>Add New Address</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', paddingTop: '10px', paddingBottom: '10px' }}>
                                            <p style={{ color: 'var(--color-text)', opacity: 0.6, fontSize: '14px', marginBottom: '16px' }}>No saved addresses found.</p>
                                            <button
                                                type="button"
                                                onClick={() => setIsAddingAddress(true)}
                                                style={{ color: 'var(--color-primary)', background: 'none', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                                            >
                                                + Add Your First Address
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {isAddingAddress && (
                                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '32px', marginTop: '32px' }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px' }}>New Shipping Address</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div style={styles.inputGroup}>
                                                <label style={styles.label}>Full Name</label>
                                                <input
                                                    type="text"
                                                    style={styles.input}
                                                    required={isAddingAddress}
                                                    value={newAddress.full_name}
                                                    onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
                                                />
                                            </div>
                                            <div style={styles.inputGroup}>
                                                <label style={styles.label}>Phone Number</label>
                                                <input
                                                    type="tel"
                                                    style={styles.input}
                                                    required={isAddingAddress}
                                                    value={newAddress.phone}
                                                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div style={styles.inputGroup}>
                                            <label style={styles.label}>Street Address</label>
                                            <textarea
                                                style={{ ...styles.input, height: '80px', resize: 'none' }}
                                                required={isAddingAddress}
                                                value={newAddress.street_address}
                                                onChange={(e) => setNewAddress({ ...newAddress, street_address: e.target.value })}
                                            />
                                        </div>
                                        <div style={styles.inputGroup}>
                                            <label style={styles.label}>Landmark (Optional)</label>
                                            <input
                                                type="text"
                                                style={styles.input}
                                                value={newAddress.landmark || ''}
                                                onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                                                placeholder="e.g. Near White Church"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                            <div style={styles.inputGroup}>
                                                <label style={styles.label}>City</label>
                                                <input
                                                    type="text"
                                                    style={styles.input}
                                                    required={isAddingAddress}
                                                    value={newAddress.city}
                                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                />
                                            </div>
                                            <div style={styles.inputGroup}>
                                                <label style={styles.label}>State</label>
                                                <input
                                                    type="text"
                                                    style={styles.input}
                                                    required={isAddingAddress}
                                                    value={newAddress.state}
                                                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                                />
                                            </div>
                                            <div style={styles.inputGroup}>
                                                <label style={styles.label}>Pincode</label>
                                                <input
                                                    type="text"
                                                    style={styles.input}
                                                    required={isAddingAddress}
                                                    value={newAddress.pincode}
                                                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddAddress}
                                            style={{ ...styles.orderBtn, marginTop: '16px', paddingTop: '12px', paddingBottom: '12px', fontSize: '14px' }}
                                        >
                                            Save Address
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div style={styles.section} className="p-6 md:p-10">
                                <h2 style={styles.sectionTitle} className="text-xl md:text-2xl"><CreditCard size={24} color="var(--color-primary)" /> Payment Method</h2>
                                <div style={{ padding: '24px', borderRadius: '20px', border: '1px solid var(--color-primary)', background: 'rgba(92, 141, 55, 0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '6px solid var(--color-primary)' }} />
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '18px' }}>Offline Payment</div>
                                        <div style={{ color: 'var(--color-text)', opacity: 0.6, fontSize: '14px' }}>Our manager will contact you for order confirmation and payment-related things.</div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div>
                        <div style={{ position: 'sticky', top: '140px' }}>
                            <div style={styles.section} className="p-6 md:p-10">
                                <h2 style={styles.sectionTitle} className="text-xl md:text-2xl">Order Summary</h2>
                                <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '32px' }}>
                                    {cartItems.map(item => (
                                        <div key={item._id} style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
                                            <img src={item.image} style={{ width: '70px', height: '70px', borderRadius: '16px', objectFit: 'cover', background: '#f5f5f5' }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--color-text)', marginBottom: '4px' }}>{item.name}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', padding: '2px 8px' }}>
                                                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', padding: '4px' }}><Minus size={14} /></button>
                                                        <span style={{ fontWeight: 800, fontSize: '13px', minWidth: '15px', textAlign: 'center' }}>{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', padding: '4px' }}><Plus size={14} /></button>
                                                    </div>
                                                    <button 
                                                        onClick={() => removeFromCart(item._id)}
                                                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', opacity: 0.6 }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: 900, color: 'var(--color-primary)' }}>{formatPrice(item.price * item.quantity)}</div>
                                        </div>
                                    ))}
                                </div>

                                <div style={styles.summaryItem}>
                                    <span>Subtotal</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div style={{ ...styles.summaryItem, color: 'var(--color-primary)' }}>
                                        <span>Discount ({appliedCoupon?.code})</span>
                                        <span>-{formatPrice(discountAmount)}</span>
                                    </div>
                                )}
                                <div style={styles.summaryItem}>
                                    <span>Delivery Fee</span>
                                    <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>FREE</span>
                                </div>
                                <div style={styles.total}>
                                    <span>Grand Total</span>
                                    <span>{formatPrice(cartTotal - discountAmount)}</span>
                                </div>

                                {isBulkOrder && (
                                    <div style={{ 
                                        marginTop: '24px', 
                                        padding: '16px', 
                                        background: 'rgba(239, 68, 68, 0.05)', 
                                        border: '1px solid #ef4444', 
                                        borderRadius: '16px',
                                        display: 'flex',
                                        gap: '12px',
                                        alignItems: 'start'
                                    }}>
                                        <Info size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <div>
                                            <p style={{ color: '#ef4444', fontWeight: 800, fontSize: '13px', margin: 0 }}>Bulk Shipping Rule Active</p>
                                            <p style={{ color: '#ef4444', fontSize: '12px', opacity: 0.8, margin: '4px 0 0' }}>Your order exceeds 5kg. Please contact manager for bulk shipping arrangements.</p>
                                        </div>
                                    </div>
                                )}

                                {/* Coupon Input */}
                                <div style={{ marginTop: '32px', position: 'relative' }}>
                                    <label style={{ ...styles.label, marginBottom: '12px' }}>Promo Code</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type="text"
                                            placeholder="Enter code..."
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            style={{ ...styles.input, flex: 1, textTransform: 'uppercase' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            disabled={validatingCoupon}
                                            style={{
                                                padding: '0 24px',
                                                borderRadius: '16px',
                                                backgroundColor: 'var(--color-primary)',
                                                color: 'white',
                                                fontWeight: 800,
                                                fontSize: '12px',
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {validatingCoupon ? '...' : 'APPLY'}
                                        </button>
                                    </div>
                                    {couponError && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '8px', position: 'absolute' }}>{couponError}</p>}
                                    {appliedCoupon && !couponError && <p style={{ color: 'var(--color-primary)', fontSize: '11px', marginTop: '8px', position: 'absolute' }}>Coupon applied!</p>}
                                </div>

                                <motion.button
                                    whileHover={{ scale: (isBulkOrder || isSubmitting || orderSuccess) ? 1 : 1.02 }}
                                    whileTap={{ scale: (isBulkOrder || isSubmitting || orderSuccess) ? 1 : 0.98 }}
                                    disabled={isBulkOrder || isSubmitting || orderSuccess}
                                    style={{
                                        ...styles.orderBtn,
                                        opacity: (isBulkOrder || isSubmitting || orderSuccess) ? 0.6 : 1,
                                        cursor: (isBulkOrder || isSubmitting || orderSuccess) ? 'not-allowed' : 'pointer'
                                    }}
                                    onClick={handleSubmit}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Processing Order...
                                        </>
                                    ) : orderSuccess ? (
                                        <>
                                            <ShieldCheck size={20} />
                                            Order Placed Successfully!
                                        </>
                                    ) : (
                                        <>
                                            Confirm Order <ChevronRight size={20} />
                                        </>
                                    )}
                                </motion.button>

                                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                    <div style={{ fontSize: '11px', color: 'var(--color-text)', opacity: 0.6 }}>
                                        <ShieldCheck size={20} color="var(--color-primary)" style={{ margin: '0 auto 8px' }} />
                                        Secure Ordering
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--color-text)', opacity: 0.6 }}>
                                        <Truck size={20} color="var(--color-primary)" style={{ margin: '0 auto 8px' }} />
                                        Fast Delivery
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--color-text)', opacity: 0.6 }}>
                                        <Phone size={20} color="var(--color-primary)" style={{ margin: '0 auto 8px' }} />
                                        24/7 Support
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
