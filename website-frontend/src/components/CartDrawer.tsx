import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const styles = {
    overlay: {
        position: 'fixed' as const,
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
    },
    drawer: {
        position: 'fixed' as const,
        top: 0,
        right: 0,
        bottom: 0,
        width: 'min(450px, 100%)',
        backgroundColor: '#0a0d08',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 1001,
        display: 'flex',
        flexDirection: 'column' as const,
        color: '#ffffff',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
    },
    header: {
        padding: '24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemsContainer: {
        flex: 1,
        overflowY: 'auto' as const,
        padding: '24px',
    },
    cartItem: {
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '20px',
        padding: '12px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
    },
    itemImage: {
        width: '80px',
        height: '80px',
        borderRadius: '12px',
        objectFit: 'cover' as const,
    },
    footer: {
        padding: '32px 24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    checkoutBtn: {
        width: '100%',
        background: 'var(--color-primary)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '100px',
        padding: '18px',
        fontSize: '18px',
        fontWeight: 800,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        boxShadow: '0 20px 40px rgba(92, 141, 55, 0.2)',
    }
};

const CartDrawer = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen, formatPrice } = useCart();
    const navigate = useNavigate();

    if (!isCartOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={styles.overlay}
                onClick={() => setIsCartOpen(false)}
            />
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={styles.drawer}
            >
                <div style={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ShoppingBag size={24} color="var(--color-primary)" />
                        <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Your Basket</h2>
                        <span style={{
                            background: 'var(--color-primary)',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 900,
                            padding: '2px 8px',
                            borderRadius: '50px'
                        }}>
                            {cartItems.length}
                        </span>
                    </div>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div style={styles.itemsContainer}>
                    {cartItems.length === 0 ? (
                        <div style={{ textAlign: 'center', paddingTop: '100px', opacity: 0.5 }}>
                            <ShoppingBag size={64} style={{ marginBottom: '24px' }} />
                            <p style={{ fontSize: '18px', fontWeight: 600 }}>Your basket is empty</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                style={{ color: 'var(--color-primary)', background: 'transparent', border: 'none', marginTop: '16px', fontWeight: 800, cursor: 'pointer' }}
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item._id} style={styles.cartItem}>
                                <img src={item.image} alt={item.name} style={styles.itemImage} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: 800 }}>{item.name}</h3>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: '18px', marginBottom: '12px' }}>
                                        {formatPrice(item.price * item.quantity)}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '50px', padding: '4px' }}>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '4px' }}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span style={{ width: '24px', textAlign: 'center', fontWeight: 700, fontSize: '14px' }}>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '4px' }}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div style={styles.footer}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <span style={{ color: '#94a3b8', fontSize: '18px', fontWeight: 600 }}>Total Harvest</span>
                            <span style={{ color: '#ffffff', fontSize: '24px', fontWeight: 900 }}>{formatPrice(cartTotal)}</span>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={styles.checkoutBtn}
                            onClick={() => {
                                setIsCartOpen(false);
                                navigate('/checkout');
                            }}
                        >
                            Proceed to Checkout <ArrowRight size={20} />
                        </motion.button>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default CartDrawer;
