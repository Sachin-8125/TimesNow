import { useState, useMemo } from 'react'

export default function Signup() {
    const [tier, setTier] = useState("free"); // 'free' | 'paid'
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [searchActive, setSearchActive] = useState(false);

    // Dynamic Password Strength Meter logic
    const strengthInfo = useMemo(() => {
        if (!password) {
            return {
                score: 0,
                text: "Password Strength: Inactive",
                colorClass: "text-slate-gray",
                barColors: [
                    "bg-surface-container-highest",
                    "bg-surface-container-highest",
                    "bg-surface-container-highest",
                    "bg-surface-container-highest",
                ],
            };
        }

        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        switch (score) {
            case 1:
                return {
                    score,
                    text: "Password Strength: Weak",
                    colorClass: "text-breaking-red",
                    barColors: [
                        "bg-breaking-red",
                        "bg-surface-container-highest",
                        "bg-surface-container-highest",
                        "bg-surface-container-highest",
                    ],
                };
            case 2:
                return {
                    score,
                    text: "Password Strength: Moderate",
                    colorClass: "text-breaking-red",
                    barColors: [
                        "bg-breaking-red",
                        "bg-breaking-red",
                        "bg-surface-container-highest",
                        "bg-surface-container-highest",
                    ],
                };
            case 3:
                return {
                    score,
                    text: "Password Strength: Strong",
                    colorClass: "text-secondary",
                    barColors: [
                        "bg-cyber-blue",
                        "bg-cyber-blue",
                        "bg-cyber-blue",
                        "bg-surface-container-highest",
                    ],
                };
            case 4:
            default:
                return {
                    score,
                    text: "Password Strength: Fortified",
                    colorClass: "text-ink-black font-bold",
                    barColors: [
                        "bg-ink-black",
                        "bg-ink-black",
                        "bg-ink-black",
                        "bg-ink-black",
                    ],
                };
        }
    }, [password]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted:", { tier, fullName, email, password });
    };

    return (
        <div className="bg-background text-on-background font-body text-[17px] leading-7 overflow-x-hidden min-h-screen">
            {/* Top Breaking Ticker */}
            <div className="w-full bg-breaking-red py-2 px-4 sm:px-margin-desktop flex items-center overflow-hidden whitespace-nowrap z-100 relative">
                <span className="font-label text-[12px] leading-4 tracking-[0.08em] font-bold text-paper-white mr-4 shrink-0 uppercase">
                    Breaking News
                </span>
                <div className="flex animate-marquee space-x-12 shrink-0">
                    <span className="text-paper-white font-label text-[14px] leading-5 font-medium">
                        Global Markets hit record highs as inflation cools...
                    </span>
                    <span className="text-paper-white font-label text-[14px] leading-5 font-medium">
                        Major Tech Merger: Silicon Valley awaits antitrust ruling...
                    </span>
                    <span className="text-paper-white font-label text-[14px] leading-5 font-medium">
                        Climate Summit: 150 nations agree on new carbon offsets...
                    </span>
                    <span className="text-paper-white font-label text-[14px] leading-5 font-medium">
                        Historic Mars Landing: First visuals from the Jezero Crater...
                    </span>
                </div>
            </div>

            {/* Top Navigation Bar */}
            <nav className="bg-paper-white dark:bg-ink-black border-b border-outline-variant dark:border-outline sticky top-0 z-50">
                <div className="flex flex-col w-full max-w-max-width mx-auto px-4 sm:px-margin-desktop py-4">
                    <div className="flex justify-between items-center mb-4">
                        <a
                            href="/"
                            className="font-headline text-[32px] sm:text-[64px] font-extrabold tracking-[-0.02em] text-ink-black dark:text-paper-white"
                        >
                            Design News Times
                        </a>
                        <div className="flex items-center gap-6">
                            <button
                                type="button"
                                aria-label="Search"
                                onClick={() => setSearchActive((prev) => !prev)}
                                className={`material-symbols-outlined transition-colors ${searchActive
                                        ? "text-cyber-blue"
                                        : "text-ink-black dark:text-paper-white"
                                    }`}
                            >
                                search
                            </button>
                            <a
                                href="/login"
                                className="font-label text-[12px] font-bold uppercase text-slate-gray dark:text-surface-dim hover:text-ink-black dark:hover:text-paper-white transition-colors duration-200 tracking-wider"
                            >
                                Sign In
                            </a>
                            <a
                                href="/signup"
                                aria-current="page"
                                className="bg-primary font-label text-[12px] px-6 py-2 uppercase tracking-widest hover:opacity-90 transition-opacity text-paper-white border-b-2 border-primary dark:border-paper-white"
                            >
                                Sign Up
                            </a>
                        </div>
                    </div>

                    <div className="flex gap-8 overflow-x-auto pb-1 no-scrollbar">
                        {[
                            { label: "Latest", href: "/" },
                            { label: "Live Updates", href: "/live" },
                            { label: "Politics", href: "#" },
                            { label: "Technology", href: "#" },
                            { label: "Design", href: "#" },
                            { label: "Business", href: "#" },
                            { label: "Culture", href: "#" },
                            { label: "Opinion", href: "#" },
                        ].map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="font-label text-[12px] font-bold uppercase text-slate-gray dark:text-surface-dim hover:text-cyber-blue transition-colors duration-200 whitespace-nowrap pb-1"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="max-w-max-width mx-auto px-4 sm:px-margin-desktop mt-8 min-h-[calc(100vh-380px)]">
                <div className="flex flex-col w-full pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        {/* Left Column: Form & Registration Experience (7 Cols) */}
                        <div className="lg:col-span-7 flex flex-col">
                            {/* Overline & Main Title */}
                            <div className="flex items-center gap-3 mb-2">
                                <span className="inline-block w-2.5 h-2.5 bg-breaking-red"></span>
                                <span className="font-label text-[12px] font-bold text-breaking-red uppercase tracking-widest">
                                    Reader Membership
                                </span>
                                <span className="text-outline-variant font-label text-[14px]">/</span>
                                <span className="font-label text-[12px] font-bold text-slate-gray uppercase tracking-wider">
                                    Vol. CXIV • Edition 2024
                                </span>
                            </div>
                            <h1 className="font-headline text-[36px] sm:text-[40px] font-bold text-ink-black tracking-[-0.01em] mb-2 leading-12">
                                Join News Times
                            </h1>
                            <p className="font-body text-[17px] text-slate-gray max-w-xl mb-8 leading-7">
                                Select a membership to start reading, or create a free reader account.
                                Unbiased, architectural journalism delivered at digital speed.
                            </p>

                            {/* Tier Selection Bento Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                {/* Free Reader Card */}
                                <div
                                    onClick={() => setTier("free")}
                                    className={`cursor-pointer group relative p-6 transition-all duration-200 ${tier === "free"
                                            ? "bg-surface-container-low ring-2 ring-ink-black"
                                            : "bg-surface-container-low"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="membership_tier"
                                        value="free"
                                        checked={tier === "free"}
                                        onChange={() => setTier("free")}
                                        className="sr-only"
                                    />
                                    <div className="flex items-start justify-between mb-4">
                                        <span className="font-label text-[12px] font-bold uppercase text-slate-gray tracking-wider">
                                            Standard Access
                                        </span>
                                        <div
                                            className={`w-5 h-5 flex items-center justify-center transition-colors ${tier === "free"
                                                    ? "bg-ink-black text-paper-white"
                                                    : "bg-transparent text-transparent"
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-[14px]">check</span>
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <span className="font-headline text-[24px] font-bold text-ink-black">$0</span>
                                        <span className="font-label text-[14px] text-slate-gray ml-1">/ forever</span>
                                    </div>
                                    <div className="font-headline text-[18px] font-bold text-ink-black mb-1">
                                        Free Reader
                                    </div>
                                    <p className="font-body text-[15px] leading-relaxed text-on-surface-variant mb-4">
                                        Basic monthly articles and curated morning briefing newsletters.
                                    </p>
                                    <div className="flex items-center gap-2 text-slate-gray">
                                        <span className="material-symbols-outlined text-[16px] text-cyber-blue">
                                            mark_email_read
                                        </span>
                                        <span className="font-label text-[13px] font-medium">
                                            Daily Morning Briefing
                                        </span>
                                    </div>
                                </div>

                                {/* All-Access Digital Card */}
                                <div
                                    onClick={() => setTier("paid")}
                                    className={`cursor-pointer group relative p-6 transition-all duration-200 ${tier === "paid"
                                            ? "bg-surface-container-lowest shadow-sm ring-2 ring-breaking-red"
                                            : "bg-surface-container-highest"
                                        }`}
                                >
                                    <div className="absolute -top-3 right-4 bg-breaking-red text-paper-white px-2.5 py-0.5 font-label text-[12px] font-bold uppercase tracking-wider">
                                        Limited Promo
                                    </div>
                                    <input
                                        type="radio"
                                        name="membership_tier"
                                        value="all-access"
                                        checked={tier === "paid"}
                                        onChange={() => setTier("paid")}
                                        className="sr-only"
                                    />
                                    <div className="flex items-start justify-between mb-4">
                                        <span className="font-label text-[12px] uppercase text-secondary tracking-wider font-bold">
                                            Recommended
                                        </span>
                                        <div
                                            className={`w-5 h-5 flex items-center justify-center transition-colors ${tier === "paid"
                                                    ? "bg-breaking-red text-paper-white"
                                                    : "bg-transparent text-transparent"
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-[14px]">check</span>
                                        </div>
                                    </div>
                                    <div className="mb-2 flex items-baseline gap-2">
                                        <span className="font-headline text-[24px] font-bold text-ink-black">$4</span>
                                        <span className="font-label text-[14px] text-slate-gray">/ month</span>
                                        <span className="font-label text-[11px] text-slate-gray line-through decoration-breaking-red">
                                            $16/mo
                                        </span>
                                    </div>
                                    <div className="font-headline text-[18px] font-bold text-ink-black mb-1">
                                        All-Access Digital
                                    </div>
                                    <p className="font-body text-[15px] leading-relaxed text-on-surface-variant mb-4">
                                        Unlimited investigative reporting, 140-year historic archive &amp; live dispatch tickers.
                                    </p>
                                    <div className="flex items-center gap-2 text-slate-gray">
                                        <span className="material-symbols-outlined text-[16px] text-breaking-red">
                                            bolt
                                        </span>
                                        <span className="font-label text-[13px] font-medium">
                                            Live Room &amp; Priority Audio
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Social Registration Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 mb-8">
                                <button
                                    type="button"
                                    className="flex-1 flex items-center justify-center gap-3 py-3.5 px-4 bg-surface-container hover:bg-surface-dim transition-colors group cursor-pointer"
                                >
                                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                                        <path
                                            d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                                            fill="#EA4335"
                                        />
                                        <path
                                            d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"
                                            fill="#34A853"
                                        />
                                    </svg>
                                    <span className="font-label text-[12px] font-bold uppercase text-ink-black tracking-wider">
                                        Sign up with Google
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    className="flex-1 flex items-center justify-center gap-3 py-3.5 px-4 bg-surface-container hover:bg-surface-dim transition-colors group cursor-pointer"
                                >
                                    <svg className="w-4 h-4 shrink-0 fill-ink-black" viewBox="0 0 24 24">
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.92.04-2.02.62-2.66 1.37-.56.65-1.06 1.71-.93 2.72 1.03.08 2.06-.5 2.67-1.24z" />
                                    </svg>
                                    <span className="font-label text-[12px] font-bold uppercase text-ink-black tracking-wider">
                                        Sign up with Apple
                                    </span>
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="relative flex items-center justify-center mb-8">
                                <div className="w-full h-px bg-surface-container-highest"></div>
                                <span className="absolute bg-background px-4 font-label text-[11px] font-bold text-slate-gray uppercase tracking-widest">
                                    Or with email dispatch
                                </span>
                            </div>

                            {/* Registration Form */}
                            <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                                {/* Full Name */}
                                <div className="flex flex-col space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label
                                            htmlFor="fullName"
                                            className="font-label text-[12px] font-bold uppercase text-ink-black tracking-wider"
                                        >
                                            Full Name
                                        </label>
                                        <span className="font-label text-[12px] font-medium text-slate-gray">
                                            For editorial accreditation
                                        </span>
                                    </div>
                                    <input
                                        id="fullName"
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="e.g. Alistair Vance"
                                        className="w-full bg-paper-white text-ink-black font-body text-[17px] px-4 py-3.5 rounded-none outline-none transition-colors border border-transparent shadow-xs focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                {/* Email Address */}
                                <div className="flex flex-col space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label
                                            htmlFor="email"
                                            className="font-label text-[12px] font-bold uppercase text-ink-black tracking-wider"
                                        >
                                            Work or Personal Email
                                        </label>
                                        <span className="font-label text-[12px] font-medium text-slate-gray">
                                            Primary dispatch address
                                        </span>
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@organization.com"
                                        className="w-full bg-paper-white text-ink-black font-body text-[17px] px-4 py-3.5 rounded-none outline-none transition-colors border border-transparent shadow-xs focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                {/* Password with Strength Meter */}
                                <div className="flex flex-col space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label
                                            htmlFor="password"
                                            className="font-label text-[12px] font-bold uppercase text-ink-black tracking-wider"
                                        >
                                            Create Password
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="font-label text-[12px] font-bold uppercase text-secondary hover:text-ink-black transition-colors cursor-pointer"
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="At least 8 characters, numbers & symbols"
                                        className="w-full bg-paper-white text-ink-black font-body text-[17px] px-4 py-3.5 rounded-none outline-none transition-colors border border-transparent shadow-xs focus:ring-2 focus:ring-primary"
                                    />

                                    {/* Segmented Strength Indicator */}
                                    <div className="pt-2">
                                        <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-surface-container">
                                            {strengthInfo.barColors.map((color, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`h-full transition-all duration-300 ${color}`}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span
                                                className={`font-label text-[11px] uppercase tracking-wider ${strengthInfo.colorClass}`}
                                            >
                                                {strengthInfo.text}
                                            </span>
                                            <span className="font-label text-[11px] font-bold text-slate-gray tracking-wider">
                                                Min. 8 chars
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Terms Agreement Notice */}
                                <div className="p-4 bg-surface-container-low flex items-start gap-3 mt-2">
                                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                                        verified_user
                                    </span>
                                    <p className="font-body text-[14px] leading-relaxed text-on-surface-variant">
                                        By continuing, you agree to the News Times Terms of Service and Privacy Policy.
                                        You can cancel recurring subscriptions at any time with one click.
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-ink-black hover:bg-primary-container active:scale-[0.99] text-paper-white font-label text-[12px] font-bold uppercase tracking-widest py-4 transition-all duration-150 flex items-center justify-center gap-3 shadow-md group cursor-pointer"
                                >
                                    <span>
                                        {tier === "free"
                                            ? "Create Free Account"
                                            : "Activate All-Access ($4/mo)"}
                                    </span>
                                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                                        arrow_forward
                                    </span>
                                </button>

                                {/* Sign-in Switch */}
                                <div className="text-center pt-2 pb-6">
                                    <p className="font-body text-[17px] text-slate-gray">
                                        Already have an account?{" "}
                                        <a
                                            href="/login"
                                            className="font-headline text-[16px] text-ink-black underline decoration-breaking-red decoration-2 underline-offset-4 hover:text-breaking-red transition-colors ml-1 font-bold"
                                        >
                                            Sign in
                                        </a>
                                    </p>
                                </div>
                            </form>
                        </div>

                        {/* Right Column: High-Prestige Editorial Credibility Panel (5 Cols) */}
                        <div className="lg:col-span-5 flex flex-col space-y-6 lg:pl-6">
                            {/* Leading Quote Card */}
                            <div className="bg-surface-container-lowest p-8 relative shadow-xs">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-breaking-red"></div>
                                <span className="font-label text-[12px] font-bold text-breaking-red uppercase tracking-widest block mb-4">
                                    Independent Dispatch
                                </span>
                                <blockquote className="font-headline text-[24px] font-bold text-ink-black leading-tight mb-6">
                                    “Over 2.4 million readers rely on News Times for unbiased, real-time global reporting.”
                                </blockquote>
                                <p className="font-body text-[17px] text-slate-gray leading-relaxed mb-6">
                                    Founded on unyielding editorial independence and rigorous data verification,
                                    News Times cuts through algorithmic noise with architectural clarity and decisive reporting.
                                </p>

                                {/* Stat Callouts */}
                                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-surface-container-high my-6">
                                    <div>
                                        <div className="font-headline text-[32px] text-ink-black font-extrabold tracking-tight">
                                            140<span className="text-breaking-red">+</span>
                                        </div>
                                        <div className="font-label text-[11px] font-bold uppercase tracking-wider text-slate-gray">
                                            Years of Integrity
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-headline text-[32px] text-ink-black font-extrabold tracking-tight">
                                            62
                                        </div>
                                        <div className="font-label text-[11px] font-bold uppercase tracking-wider text-slate-gray">
                                            Global Bureaus
                                        </div>
                                    </div>
                                </div>

                                {/* Editor Byline */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high shrink-0">
                                        <img
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1vA47OB9FSi2fyrTg1omFOCDAohTdFFaHZPVZxHFkDJ79cQv-V9B2yKRMM-pPNO4NCT4fGnLtHtZZTQWz_b-EXc0o9Qd6FuKFWJszGjz8h_oCRzYVzhLNfhhwdgLPy1WzcJZYLamL3tv0Lycj9RHBarAGRvAwquI9d7w5jT3iG5EJxxN2ddP1CiyvrI9xKw9_khjU6bXwu8ACzHBJqehJ_wSQ6yuyKZ9ufS3ky7QV4SO5pxWcc4EQ"
                                            alt="Elena Rostova, Executive Editor"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-headline text-[16px] font-bold text-ink-black">
                                            Elena Rostova
                                        </span>
                                        <span className="font-label text-[11px] font-bold uppercase tracking-wider text-slate-gray">
                                            Executive Editor, News Times
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Newsroom Photo & Live Pulse Feature */}
                            <div className="bg-surface-container-lowest p-6 shadow-xs">
                                <div className="relative w-full h-44 mb-4 overflow-hidden bg-surface-container">
                                    <img
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY403KHU2F17P-pbagZhwDXXtOyu8jMcGEOYIqfVur9MtvdZMX0lKbkdScvtvlFTS-QwWd7bvFHr4DYPY8iNC-DiOtt8HnL25JQpBW0ffNL5KNGWWh2NcamQViI1H7JGtZ09kf0sl-B9IR7tQUUCzAJHxoTTjCaAHnNOmSFCjB59sdGOwb3zOhaFNmti64Io73zkWy2VzBDDMR9cG4N2R82NPMrOZokjaPInleOL7TMFRhanDzLaM4"
                                        alt="Newsroom Floor"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-ink-black/80 via-transparent to-transparent flex items-end p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-breaking-red animate-live-pulse"></span>
                                            <span className="font-label text-[12px] font-bold text-paper-white uppercase tracking-wider">
                                                Newsroom Live Dispatch Active
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="font-headline text-[18px] font-bold text-ink-black mb-2">
                                    Member Privileges
                                </h3>
                                <ul className="space-y-3 font-body text-[15px] text-slate-gray">
                                    <li className="flex items-start gap-2.5">
                                        <span className="material-symbols-outlined text-[18px] text-cyber-blue shrink-0 mt-0.5">
                                            check_circle
                                        </span>
                                        <span>Zero algorithmic feeds or sponsored advertorial noise.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <span className="material-symbols-outlined text-[18px] text-cyber-blue shrink-0 mt-0.5">
                                            check_circle
                                        </span>
                                        <span>Offline sync &amp; morning audio narration briefs.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <span className="material-symbols-outlined text-[18px] text-cyber-blue shrink-0 mt-0.5">
                                            check_circle
                                        </span>
                                        <span>Unrestricted access to the 1884–Present Digital Archives.</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Editorial Guarantee Stamp */}
                            <div className="p-4 bg-surface-container-high flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-ink-black text-[22px]">
                                        policy
                                    </span>
                                    <span className="font-label text-[12px] font-bold uppercase text-ink-black tracking-wider">
                                        News Times Reader Compact
                                    </span>
                                </div>
                                <span className="font-label text-[11px] font-bold text-slate-gray tracking-wider uppercase">
                                    SSL Protected
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-ink-black dark:bg-primary-container w-full mt-20 border-t border-outline dark:border-outline-variant">
                <div className="flex flex-col items-center py-margin-desktop px-4 sm:px-margin-desktop max-w-max-width mx-auto">
                    <h2 className="font-headline text-[36px] sm:text-[64px] font-extrabold text-paper-white mb-12">
                        Design News Times
                    </h2>
                    <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-12">
                        {[
                            { label: "About Us", href: "#" },
                            { label: "Contact", href: "#" },
                            { label: "Sign In", href: "/login" },
                            { label: "Sign Up", href: "/signup" },
                            { label: "Privacy Policy", href: "#" },
                            { label: "Terms of Service", href: "#" },
                            { label: "Archive", href: "#" },
                            { label: "Advertising", href: "#" },
                        ].map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="font-body text-[17px] text-surface-variant dark:text-surface-dim hover:text-breaking-red transition-colors active:underline"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                    <p className="font-body text-[17px] text-surface-variant dark:text-surface-dim opacity-60">
                        © 2024 Design News Times. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
