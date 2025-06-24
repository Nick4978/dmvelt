"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import DealersTable from "@/components/DealersTable";

export default function DealersPage() {
  const { user } = useAuth();
  const [dealers, setDealers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/dealers/getall`, {
      method: "GET",
      credentials: "include", // ✅ Send cookies
    })
      .then((res) => res.json())
      .then((data) => {
        setDealers(data.dealers);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading dealers...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dealers</h1>
      <DealersTable />
    </div>
  );
}
