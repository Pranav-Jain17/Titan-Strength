import { useState } from 'react';
import { toast } from 'react-toastify';

const Plans = ({ plans, user }) => {
    const [processingId, setProcessingId] = useState(null);

    const getToken = () => JSON.parse(localStorage.getItem('titanUser'))?.token;

    const handleSubscribe = async (planId) => {
        const token = getToken();
        if (!token) {
            toast.error("Please login to subscribe");
            return;
        }

        setProcessingId(planId);

        try {
            const orderRes = await fetch('https://titan-strength.me/api/v1/payments/razorpay/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ planId })
            });

            const orderData = await orderRes.json();

            if (!orderRes.ok) {
                throw new Error(orderData.message || "Failed to create order");
            }

            const { order, keyId, plan } = orderData.data;

            const options = {
                key: keyId,
                amount: order.amount,
                currency: "INR",
                name: "Titan Strength Gym",
                description: `Subscription for ${plan.name}`,
                order_id: order.id,
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                    contact: user?.phone || ""
                },
                handler: async function (response) {
                    try {
                        const verifyRes = await fetch('https://titan-strength.me/api/v1/payments/razorpay/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                planId: plan.id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyRes.ok && verifyData.success) {
                            toast.success("Welcome to the Titan Family! Subscription Active.");

                            const currentUser = JSON.parse(localStorage.getItem('titanUser'));
                            if (currentUser) {
                                currentUser.role = 'member';
                                localStorage.setItem('titanUser', JSON.stringify(currentUser));
                            }

                            // setTimeout(() => {
                            //     window.location.reload();
                            // }, 2000);
                            setTimeout(() => {
                                window.location.href = '/member/dashboard';
                            }, 2000);
                        } else {
                            toast.error(verifyData.message || "Payment verification failed");
                        }
                    } catch (err) {
                        toast.error("Verification error");
                    }
                },
                theme: {
                    color: "#f25f29"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                toast.error(response.error.description);
            });
            rzp.open();

        } catch (err) {
            console.error("Payment Error:", err);
            toast.error(err.message);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <section className="onboarding-section">
            <h2>2. Choose your Membership</h2>
            <div className="plans-grid">
                {plans.length > 0 ? plans.map((plan) => {
                    const isStandard = plan.name === 'Standard';
                    const isProcessing = processingId === plan._id;

                    return (
                        <div
                            key={plan._id}
                            className={`plan-card ${isStandard ? 'highlighted' : ''}`}
                        >
                            {isStandard && (
                                <div className="best-offer-badge">Best Offer</div>
                            )}

                            <div className="plan-header">
                                <h3>{plan.name}</h3>
                                <div className="price">
                                    ₹{plan.price}<span className="duration">/mo</span>
                                </div>
                            </div>

                            <div className="plan-divider"></div>

                            <ul className="plan-features">
                                <li>Access to Gym Equipment</li>
                                <li>Locker Access</li>
                                <li>Free Wifi</li>

                                {plan.features?.includesPersonalTraining && (
                                    <li>Personal Trainer</li>
                                )}

                                {plan.features?.canBookClasses && (
                                    <li>Up to {plan.features.maxClassesPerWeek} Classes/Week</li>
                                )}

                                {plan.features?.accessAllBranches && (
                                    <li>Access All Branches</li>
                                )}

                                {plan.description && plan.description.split(/,|\n/).map((feature, i) => (
                                    feature.trim() && !feature.toLowerCase().includes('trainer') && !feature.toLowerCase().includes('classes') && (
                                        <li key={i}>{feature.trim()}</li>
                                    )
                                ))}
                            </ul>

                            <button
                                className="btn-choose-plan"
                                onClick={() => handleSubscribe(plan._id)}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'PROCESSING...' : 'CHOOSE PLAN'}
                            </button>
                        </div>
                    );
                }) : (
                    <p className="no-plans">No plans available at the moment.</p>
                )}
            </div>
        </section>
    );
};

export default Plans;