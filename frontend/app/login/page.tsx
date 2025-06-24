"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [dealerOptions, setDealerOptions] = useState<any[]>([]);
  const [selectedDealerId, setSelectedDealerId] = useState<number | null>(null);
  const [awaitingDealerSelection, setAwaitingDealerSelection] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to dashboard if already logged in
    const checkLogin = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/check`
      );
      if (response.ok) {
        const data = await response.json();
        if (typeof data.dealerId === "object" && data.dealerId?.id) {
          router.push(`/dashboard?dealerId=${data.dealerId.id}`);
        } else if (
          typeof data.dealerId === "number" ||
          typeof data.dealerId === "string"
        ) {
          router.push(`/dashboard?dealerId=${data.dealerId}`);
        }
      }
    };
    checkLogin();
  }, [router]);

  const handleLogin = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || "Login failed");
        return;
      }

      const data = await res.json();

      console.log("CLIENT RECEIVED:", data);

      if (data.dealers.length > 1 && data.role !== "admin") {
        setDealerOptions(data.dealers); // ← dynamic dropdown
        setSelectedToken(data.token);
        setAwaitingDealerSelection(true);
      } else if (data.role === "admin") {
        // Admins can log in without dealer selection
        await finalizeLogin(data.token, null);
      } else {
        await finalizeLogin(data.token, data.dealers[0].id);
      }
    } catch (err) {
      console.error(err);
      alert(`Unexpected login error: ${err}`);
    }
  };

  const finalizeLogin = async (token: string, dealerId?: number) => {
    //localStorage.setItem("token", token);
    //localStorage.setItem("dealerId", dealerId?.toString());

    if (dealerId != null) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/select-dealer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealerId }),
        credentials: "include",
      });
    }
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        {!awaitingDealerSelection && (
          <button
            onClick={handleLogin}
            className="w-full bg-black text-white font-semibold py-2 rounded hover:bg-gray-800 transition"
          >
            Log in
          </button>
        )}

        {awaitingDealerSelection && (
          <div className="mt-4">
            <label className="block mb-1 font-medium">
              Select your dealership
            </label>
            <select
              value={selectedDealerId || ""}
              onChange={(e) => {
                setSelectedDealerId(Number(e.target.value));
                setSelectedToken(localStorage.getItem("token"));
              }}
              className="w-full p-2 border rounded"
            >
              <option value="" disabled>
                Select dealer
              </option>
              {dealerOptions.map((dealer) => (
                <option key={dealer.id} value={dealer.id}>
                  {dealer.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                if (selectedToken && selectedDealerId) {
                  finalizeLogin(selectedToken, selectedDealerId);
                } else {
                  alert("Please select a dealer");
                }
              }}
              className="w-full bg-black text-white font-semibold py-2 rounded hover:bg-gray-800 transition"
            >
              Continue
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
