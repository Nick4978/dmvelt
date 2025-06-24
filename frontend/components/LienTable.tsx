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

export default function LienTable({ readFlag }: LienTableRecentProps) {
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

  //if (loading) return <p>Loading liens...</p>;
  //if (liens.length === 0) return <p>No recent liens found.</p>;

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      <h2 className="text-lg font-bold mb-4">
        {readFlag ? "Viewed Liens" : "New Liens"}
      </h2>

      {/*Create a dropdown box with a selection of how many items per page they
      want displayed */}

      {statusFilter !== null && (
        <div className="flex justify-start mb-1">
          <button
            onClick={() => setStatusFilter(null)}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear status filter
          </button>
        </div>
      )}

      <div className="flex justify-end mb-4">
        <label className="text-sm mr-2 self-center">Items per page</label>
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setCurrentPage(1); // Reset to first page on change
          }}
          className="border rounded px-2 py-1 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr className="bg-gray-100 text-xs uppercase text-gray-600">
            <th className="p-2">
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                onClick={(e) => e.stopPropagation()}
              />
            </th>
            <th
              onClick={() => {
                if (sortField === "lien.createdAt") setSortAsc(!sortAsc);
                else {
                  setSortField("lien.createdAt");
                  setSortAsc(true);
                }
              }}
              className="p-2 cursor-pointer select-none"
            >
              Created At{" "}
              {sortField === "lien.createdAt" && (sortAsc ? "▲" : "▼")}
            </th>
            <th
              onClick={() => {
                if (sortField === "lien.rank") setSortAsc(!sortAsc);
                else {
                  setSortField("lien.rank");
                  setSortAsc(true);
                }
              }}
              className="p-2 cursor-pointer select-none text-center"
            >
              Lien Rank {sortField === "lien.rank" && (sortAsc ? "▲" : "▼")}
            </th>
            <th
              onClick={() => {
                if (sortField === "vehicle.vin") setSortAsc(!sortAsc);
                else {
                  setSortField("vehicle.vin");
                  setSortAsc(true);
                }
              }}
              className="p-2 cursor-pointer select-none"
            >
              <div className="flex items-center gap-2">
                <span>
                  VIN {sortField === "vehicle.vin" && (sortAsc ? "▲" : "▼")}
                </span>
                <input
                  type="text"
                  placeholder="[...]"
                  value={rawFilterName}
                  onChange={(e) => {
                    e.stopPropagation();
                    setRawFilterName(e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gray-100 rounded px-2 py-0.5 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </th>
            <th
              onClick={() => {
                if (sortField === "vehicle.year") setSortAsc(!sortAsc);
                else {
                  setSortField("vehicle.year");
                  setSortAsc(true);
                }
              }}
              className="p-2 cursor-pointer select-none"
            >
              Year {sortField === "vehicle.year" && (sortAsc ? "▲" : "▼")}
            </th>
            <th
              onClick={() => {
                if (sortField === "vehicle.make") setSortAsc(!sortAsc);
                else {
                  setSortField("vehicle.make");
                  setSortAsc(true);
                }
              }}
              className="p-2 cursor-pointer select-none"
            >
              Make {sortField === "vehicle.make" && (sortAsc ? "▲" : "▼")}
            </th>
            <th
              onClick={() => {
                if (sortField === "vehicle.model") setSortAsc(!sortAsc);
                else {
                  setSortField("vehicle.model");
                  setSortAsc(true);
                }
              }}
              className="p-2 cursor-pointer select-none"
            >
              Model {sortField === "vehicle.model" && (sortAsc ? "▲" : "▼")}
            </th>
            <th
              onClick={() => {
                if (sortField === "lien.status") setSortAsc(!sortAsc);
                else {
                  setSortField("lien.status");
                  setSortAsc(true);
                }
              }}
              className="p-2 cursor-pointer select-none"
            >
              Status {sortField === "lien.status" && (sortAsc ? "▲" : "▼")}
            </th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedLiens.map((lien) => (
            <tr
              key={lien.id}
              onClick={() => router.push(`${pathname}/liens/${lien.id}`)}
              className="border-b hover:bg-blue-100 transition-colors"
            >
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(lien.id)}
                  onChange={() => toggleSelect(lien.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
              <td className="p-2">
                {format(new Date(lien.createdAt), "M/d/yyyy p")}
              </td>
              <td className="p-2 text-center">{lien.rank.toString()}</td>
              <td className="p-2">
                <Link
                  href={`${pathname}/liens/${lien.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {lien.vehicle.vin}
                </Link>
              </td>
              <td className="p-2 text-center">{lien.vehicle.year}</td>
              <td className="p-2">{lien.vehicle.make}</td>
              <td className="p-2">{lien.vehicle.model}</td>
              <td className="p-2">
                <button
                  className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 cursor-pointer hover:opacity-90 transition ${
                    lienStatusMap[lien.status]?.color ||
                    "bg-red-200 text-red-800"
                  }`}
                  title={
                    lienStatusMap[lien.status]?.tooltip || "Unknown status"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatusFilter(
                      (prev) => (prev === lien.status ? null : lien.status) // toggle
                    );
                    console.log("Filter by status:", lien.status);
                  }}
                >
                  <span>{lienStatusMap[lien.status]?.jsx}</span>
                  {/* <span>{lienStatusMap[lien.status]?.icon}</span> */}
                  <span>{lienStatusMap[lien.status]?.label}</span>
                </button>
              </td>
              <td className="p-2">
                {!multipleSelected && (
                  <div className="space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDialogId(lien.id);
                      }}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Request
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDialogId(lien.id);
                      }}
                      className="text-green-600 hover:underline text-xs"
                    >
                      Satisfy
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDialogId(lien.id);
                      }}
                      className="text-red-600 hover:underline text-xs"
                    >
                      Report
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      {/* Bulk actions */}
      {multipleSelected && (
        <div className="flex justify-end gap-3 mt-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
            Satisfy Selected
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
            Request Selected
          </button>
        </div>
      )}
      {/* Dialog for mailing address */}
      {showDialogId !== null && (
        <div className="mt-4 p-4 bg-gray-50 rounded border">
          <h3 className="text-sm font-semibold mb-2">Enter Mailing Address</h3>
          <textarea
            className="w-full text-sm p-2 border rounded"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St, Orlando, FL 32801"
          />
          <div className="flex items-center mt-2">
            <input id="useDealer" type="checkbox" className="mr-2" />
            <label htmlFor="useDealer" className="text-sm text-gray-600">
              Use dealer mailing address
            </label>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700">
              Submit
            </button>
            <button
              onClick={() => setShowDialogId(null)}
              className="text-sm text-gray-500 hover:text-black"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
