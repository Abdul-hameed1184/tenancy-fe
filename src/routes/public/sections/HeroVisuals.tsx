import { ShieldCheck } from "lucide-react";

const HeroVisual = () => {
    return (
        <div className="relative mx-auto h-[520px] w-full max-w-[650px]">
            {/* Main Property Image */}
            <div
                className="
          absolute
          left-[7%]
          top-[7%]
          h-[78%]
          w-[82%]
          overflow-hidden
          rounded-[24px]
          bg-slate-800
          shadow-2xl
          -rotate-[1.5deg]
        "
            >
                <img
                    src="https://images.unsplash.com/photo-1762811054947-605b20298615?q=80&w=1200&auto=format&fit=crop"
                    alt="Luxury property"
                    className="h-full w-full object-cover"
                />

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>

            {/* Verified Agent Card */}
            <div
                className="
          absolute
          right-[1%]
          top-[12%]
          z-20
          w-[192px]
          rounded-[16px]
          border
          border-white/15
          bg-slate-900/50
          p-5
          shadow-xl
          backdrop-blur-xl
        "
            >
                <div className="flex items-center gap-3">
                    {/* Shield */}
                    <div
                        className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-emerald-400/15
              text-emerald-400
            "
                    >
                        <ShieldCheck size={19} strokeWidth={1.8} />
                    </div>

                    <div>
                        <p className="text-[9px] font-medium uppercase tracking-wide text-white/50">
                            VERIFIED
                        </p>

                        <p className="text-[12px] font-semibold text-white">
                            Premium Agent
                        </p>
                    </div>
                </div>

                {/* Fake skeleton lines */}
                <div className="mt-5 space-y-2">
                    <div className="h-1.5 w-full rounded-full bg-white/15" />
                    <div className="h-1.5 w-[78%] rounded-full bg-white/10" />
                </div>
            </div>

            {/* Maintenance Hub */}
            <div
                className="
          absolute
          bottom-[7%]
          left-[1%]
          z-30
          w-[256px]
          rounded-[17px]
          border
          border-white/15
          bg-[#13221f]/85
          p-6
          shadow-2xl
          backdrop-blur-xl
        "
            >
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-[14px] font-bold tracking-tight text-white">
                            Maintenance Hub
                        </h3>

                        <p className="mt-1 text-[10px] text-white/45">
                            3 Active Requests
                        </p>
                    </div>

                    <span
                        className="
              rounded-full
              bg-emerald-500/15
              px-3
              py-1
              text-[9px]
              font-semibold
              uppercase
              tracking-wide
              text-emerald-400
            "
                    >
                        Latest
                    </span>
                </div>

                {/* Request 1 */}
                <div
                    className="
            mt-6
            flex
            h-[50px]
            items-center
            gap-3
            rounded-[9px]
            border
            border-white/[0.06]
            bg-white/[0.025]
            px-2
          "
                >
                    <div className="h-8 w-8 rounded-md bg-white/[0.06]" />

                    <div className="space-y-2">
                        <div className="h-1.5 w-16 rounded-full bg-white/20" />
                        <div className="h-1.5 w-12 rounded-full bg-white/10" />
                    </div>
                </div>

                {/* Request 2 */}
                <div
                    className="
            mt-3
            flex
            h-[50px]
            items-center
            gap-3
            rounded-[9px]
            border
            border-white/[0.06]
            bg-white/[0.025]
            px-2
          "
                >
                    <div className="h-8 w-8 rounded-md bg-white/[0.06]" />

                    <div className="space-y-2">
                        <div className="h-1.5 w-16 rounded-full bg-white/20" />
                        <div className="h-1.5 w-12 rounded-full bg-white/10" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroVisual;