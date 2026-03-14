"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { HiOutlineCheck } from "react-icons/hi";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Great for trying out AI Assist Pro",
    features: [
      "Business Analysis tool",
      "AI Assistant chat",
      "10 AI requests per day",
      "Basic analysis reports",
      "Community support",
    ],
    cta: "Get Started Free",
    popular: false,
    gradient: "from-muted to-slate-400",
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    desc: "Best for professionals and power users",
    features: [
      "Full Business Analysis",
      "Unlimited AI Assistant",
      "Unlimited AI requests",
      "Detailed growth roadmaps",
      "Competition analysis",
      "Download & export reports",
      "Priority support",
      "API access",
    ],
    cta: "Start Pro Plan",
    popular: true,
    gradient: "from-primary to-primary-light",
  },
  {
    name: "Business",
    price: "$39",
    period: "per month",
    desc: "For teams and businesses",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Team analytics dashboard",
      "Custom AI training",
      "Bulk business analysis",
      "Dedicated support",
      "SLA guarantee",
      "White-label option",
    ],
    cta: "Contact Sales",
    popular: false,
    gradient: "from-primary to-primary-light",
  },
];

export default function PricingPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground dark:text-white mb-4">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-base text-muted dark:text-slate-400 max-w-xl mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white dark:bg-[#1E293B] rounded-2xl border ${
                plan.popular
                  ? "border-primary dark:border-primary shadow-xl shadow-primary/10"
                  : "border-edge dark:border-[#334155]"
              } p-8 card-hover`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary to-primary-light text-white text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-foreground dark:text-white mb-1">
                  {plan.name}
                </h3>
                <p className="text-xs text-muted dark:text-slate-400 mb-4">
                  {plan.desc}
                </p>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-4xl font-extrabold text-foreground dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted dark:text-slate-400 mb-1">
                    /{plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <div
                      className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}
                    >
                      <HiOutlineCheck className="text-white text-xs" />
                    </div>
                    <span className="text-sm text-muted dark:text-slate-300">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-full font-semibold text-sm transition-all ${
                  plan.popular
                    ? "btn-primary"
                    : "border-2 border-edge dark:border-[#334155] text-foreground dark:text-slate-300 hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary-light"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
