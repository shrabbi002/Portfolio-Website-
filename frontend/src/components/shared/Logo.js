export default function Logo({ size = 40 }) {
    return (
        <div className="relative group" style={{ width: size, height: size }}>
            {/* Outer glow on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500 via-violet-500 to-accent-cyan opacity-60 blur-md group-hover:opacity-80 transition-opacity duration-500" />

            {/* Main container */}
            <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-primary-500 via-violet-500 to-accent-cyan p-[1.5px] overflow-hidden">
                {/* Inner background */}
                <div className="w-full h-full rounded-[14px] bg-dark-900 flex items-center justify-center relative overflow-hidden">
                    {/* Subtle inner gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-cyan/10" />
                    {/* Diagonal accent line */}
                    <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-bl from-accent-cyan/20 to-transparent rounded-bl-full" />
                    {/* Letter */}
                    <span className="relative font-heading font-black bg-gradient-to-br from-white via-white to-primary-200 bg-clip-text text-transparent"
                        style={{ fontSize: size * 0.48 }}>
                        R
                    </span>
                </div>
            </div>
        </div>
    );
}
