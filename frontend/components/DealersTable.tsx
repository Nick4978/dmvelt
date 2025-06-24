"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { number } from "framer-motion";
import DealerTableBody from "./DealerTableBody";
import { Dealers } from "../../shared/types";

interface DealersTableProps {
  size?: string; // optional, defaults to empty string
  headerTitle?: string; // optional, defaults to "Dealers"
  defaultItemsPerPage?: number; // optional, defaults to 25
}

export default function DealersTable({
  size,
  headerTitle,
  defaultItemsPerPage = 25,
}: DealersTableProps) {
  const [dealers, setDealers] = useState<Dealers[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(defaultItemsPerPage);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [address, setAddress] = useState("");
  const [filterName, setFilterName] = useState("");
  const [rawFilterName, setRawFilterName] = useState("");

  type SortField =
    | keyof Dealers
    | "dealer.name"
    | "dealer.address"
    | "dealer.city"
    | "dealer.state"
    | "dealer.zipCode"
    | "dealer.phone"
    | "dealer.email"
    | "dealer.contactName";

  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDealers = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: String(currentPage),
          limit: String(limit),
          search: filterName,
        });

        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/dealers/getall?${query.toString()}`,
          {
            method: "GET",
            credentials: "include", // ✅ Send cookies
          }
        );
        if (!res.ok) throw new Error("Failed to fetch dealers");
        const data = await res.json();
        setDealers(data.dealers);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Error fetching dealers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDealers();
  }, [currentPage, limit, filterName]);

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
      setSelectedIds(dealers.map((dealer) => dealer.id));
    }
  };

  const allSelected =
    selectedIds.length > 0 && selectedIds.length === dealers.length;

  const multipleSelected = selectedIds.length > 1;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        selectedIds.length > 0 && !allSelected;
    }
  }, [selectedIds, allSelected]);

  const router = useRouter();

  const filteredDealers = dealers.filter((dealer) =>
    dealer.name.toLowerCase().includes(filterName.toLowerCase())
  );

  const sortedDealers = [...filteredDealers].sort((a, b) => {
    if (!sortField) return 0;

    const getField = (dealer: Dealers, field: SortField) => {
      switch (field) {
        case "dealer.name":
          return dealer.name;
        case "dealer.address":
          return dealer.address;
        case "dealer.city":
          return dealer.city;
        case "dealer.state":
          return dealer.state;
        case "dealer.zipCode":
          return dealer.zipCode;
        default:
          return dealer[field as keyof Dealers];
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

  //if (loading) return <p>Loading dealers...</p>;
  //if (dealers.length === 0) return <p>No recent dealers found.</p>;

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      <h2 className="text-lg font-bold mb-4">{headerTitle}</h2>
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
          <option value={5}>5</option>
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
                if (sortField === "dealer.name") setSortAsc(!sortAsc);
                else {
                  setSortField("dealer.name");
                  setSortAsc(true);
                }
              }}
              className="p-2 cursor-pointer select-none"
            >
              Name {sortField === "dealer.name" && (sortAsc ? "▲" : "▼")}
              <input
                type="text"
                placeholder="[...]"
                value={rawFilterName}
                onChange={(e) => {
                  e.stopPropagation();
                  setRawFilterName(e.target.value); // not immediately triggering fetch
                }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-100 rounded px-2 py-1 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </th>
            <th
              onClick={() => {
                if (sortField === "dealer.address") setSortAsc(!sortAsc);
                else {
                  setSortField("dealer.address");
                  setSortAsc(true);
                }
              }}
              className="p-2 cursor-pointer select-none text-center"
            >
              Address {sortField === "dealer.address" && (sortAsc ? "▲" : "▼")}
            </th>
            {size !== "small" && (
              <th
                onClick={() => {
                  if (sortField === "dealer.city") setSortAsc(!sortAsc);
                  else {
                    setSortField("dealer.city");
                    setSortAsc(true);
                  }
                }}
                className="p-2 cursor-pointer select-none"
              >
                City {sortField === "dealer.city" && (sortAsc ? "▲" : "▼")}
              </th>
            )}

            <th
              onClick={() => {
                if (sortField === "dealer.state") setSortAsc(!sortAsc);
                else {
                  setSortField("dealer.state");
                  setSortAsc(true);
                }
              }}
              className="p-2 cursor-pointer select-none"
            >
              State {sortField === "dealer.state" && (sortAsc ? "▲" : "▼")}
            </th>

            {size !== "small" && (
              <th
                onClick={() => {
                  if (sortField === "dealer.zipCode") setSortAsc(!sortAsc);
                  else {
                    setSortField("dealer.zipCode");
                    setSortAsc(true);
                  }
                }}
                className="p-2 cursor-pointer select-none"
              >
                Zip Code{" "}
                {sortField === "dealer.zipCode" && (sortAsc ? "▲" : "▼")}
              </th>
            )}
          </tr>
        </thead>
        <DealerTableBody
          sortedDealers={sortedDealers}
          selectedIds={selectedIds}
          toggleSelect={toggleSelect}
          pathname={pathname}
          size={size}
        />
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
    </div>
  );
}
