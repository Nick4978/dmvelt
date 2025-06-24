"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Lien, Vehicle } from "../../shared/types";
import { format } from "date-fns";
import { MailCheck, FileText, Send, CheckCircle } from "lucide-react";

type LienWithVehicle = Lien & { vehicle: Vehicle };

interface LienTableRecentProps {
  readFlag?: boolean; // optional, defaults to false
}

export default function LienCard({ readFlag }: LienTableRecentProps) {
  const [liens, setLiens] = useState<LienWithVehicle[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showDialogId, setShowDialogId] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [filterName, setFilterName] = useState("");
  const [rawFilterName, setRawFilterName] = useState("");

  const lienStatusMap: Record<
    number,
    {
      label: string;
      color: string;
      icon: string;
      tooltip: string;
      jsx?: React.JSX.Element;
    }
  > = {
    0: {
      label: "Lien Received",
      color: "bg-gray-200 text-gray-800",
      icon: "📥",
      tooltip: "The lien has been received but not processed.",
      jsx: <MailCheck size={12} />,
    },
    1: {
      label: "Satisfy Submitted",
      color: "bg-yellow-200 text-yellow-800",
      icon: "📝",
      tooltip: "Satisfy paperwork submitted but not sent yet.",
      jsx: <FileText size={12} />,
    },
    2: {
      label: "Satisfy Sent",
      color: "bg-blue-200 text-blue-800",
      icon: "📤",
      tooltip: "Satisfy documents sent to lienholder.",
      jsx: <Send size={12} />,
    },
    3: {
      label: "Satisfy Confirmed",
      color: "bg-green-200 text-green-800",
      icon: "✅",
      tooltip: "Lien has been satisfied and confirmed.",
      jsx: <CheckCircle size={12} />,
    },
  };

  type SortField =
    | keyof Lien
    | "lien.rank"
    | "lien.createdAt"
    | "lien.status"
    | "vehicle.vin"
    | "vehicle.make"
    | "vehicle.model"
    | "vehicle.year";

  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchLiens = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: String(currentPage),
          limit: String(limit),
          search: filterName,
        });
        if (statusFilter !== null)
          query.append("status", statusFilter.toString());

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/liens/getall?readFlag=${
            readFlag ?? false
          }&${query.toString()}`,
          {
            method: "GET",
            credentials: "include", // ✅ Send cookies
          }
        );
        if (!res.ok) throw new Error("Failed to fetch liens");
        const data = await res.json();
        setLiens(data.liens);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Error fetching liens:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiens();
  }, [readFlag, currentPage, limit, statusFilter, filterName]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setFilterName(rawFilterName); // triggers actual data fetch
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [rawFilterName]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(liens.map((lien) => lien.id));
    }
  };

  const allSelected =
    selectedIds.length > 0 && selectedIds.length === liens.length;

  const multipleSelected = selectedIds.length > 1;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        selectedIds.length > 0 && !allSelected;
    }
  }, [selectedIds, allSelected]);

  const router = useRouter();

  const sortedLiens = [...liens].sort((a, b) => {
    if (!sortField) return 0;

    const getField = (lien: LienWithVehicle, field: SortField) => {
      switch (field) {
        case "vehicle.vin":
          return lien.vehicle.vin;
        case "vehicle.make":
          return lien.vehicle.make;
        case "vehicle.model":
          return lien.vehicle.model;
        case "vehicle.year":
          return lien.vehicle.year;
        default:
          return lien[field as keyof Lien];
      }
    };

    const valA = getField(a, sortField);
    const valB = getField(b, sortField);

    if (typeof valA === "number" && typeof valB === "number") {
      return sortAsc ? valA - valB : valB - valA;
    }

    return sortAsc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const pathname = usePathname();

  const handleSortClick = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true); // default to ascending on new field
    }
  };

  return (
    <div className="md:hidden space-y-4 mt-4">
      {sortedLiens.map((lien) => (
        <div
          key={lien.id}
          className="border rounded-lg p-4 bg-white shadow-sm"
          onClick={() => router.push(`${pathname}/liens/${lien.id}`)}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs text-gray-500">
              {format(new Date(lien.createdAt), "M/d/yyyy p")}
            </div>
            <div
              className={`text-xs font-semibold ${
                lienStatusMap[lien.status]?.color
              }`}
            >
              {lienStatusMap[lien.status]?.label}
            </div>
          </div>
          <div className="text-sm font-bold">{lien.vehicle.vin}</div>
          <div className="text-sm text-gray-700">
            {lien.vehicle.year} {lien.vehicle.make} {lien.vehicle.model}
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <button className="text-blue-600 hover:underline">Request</button>
            <button className="text-green-600 hover:underline">Satisfy</button>
            <button className="text-red-600 hover:underline">Report</button>
          </div>
        </div>
      ))}
    </div>
  );
}
