"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import LienTable from "@/components/LienTable";

export default function LiensPage() {
  const { user } = useAuth();
  const [liens, setLiens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dealerId = localStorage.getItem("dealerId");
    if (!dealerId) return;

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/liens/getall?dealerId=${dealerId}`,
      {
        method: "GET",
        credentials: "include", // ✅ Send cookies
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setLiens(data.liens);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading liens...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Liens</h1>
      <LienTable />
    </div>
  );
}
