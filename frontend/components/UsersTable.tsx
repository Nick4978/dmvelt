"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Users } from "../../shared/types";

export default function UsersTable() {
  const [users, setUsers] = useState<Users[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [address, setAddress] = useState("");
  const [filterName, setFilterName] = useState("");
  const [rawFilterName, setRawFilterName] = useState("");

  type SortField =
    | keyof Users
    | "user.name"
    | "user.address"
    | "user.city"
    | "user.state"
    | "user.zipCode"
    | "user.phone"
    | "user.email";

  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: String(currentPage),
          limit: String(limit),
          search: filterName,
        });

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/get?${query.toString()}`,
          {
            method: "GET",
            credentials: "include", // ✅ Send cookies
          }
        );
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.users);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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
      setSelectedIds(users.map((user) => user.id));
    }
  };

  const allSelected =
    selectedIds.length > 0 && selectedIds.length === users.length;

  const multipleSelected = selectedIds.length > 1;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        selectedIds.length > 0 && !allSelected;
    }
  }, [selectedIds, allSelected]);

  const router = useRouter();

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortField) return 0;

    const getField = (user: Users, field: SortField) => {
      switch (field) {
        case "user.name":
          return user.name;
        case "user.address":
          return user.address;
        case "user.city":
          return user.city;
        case "user.state":
          return user.state;
        case "user.zipCode":
          return user.zipCode;
        default:
          return user[field as keyof Users];
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

  //if (loading) return <p>Loading users...</p>;
  //if (users.length === 0) return <p>No recent users found.</p>;

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      {/*Create a dropdown box with a selection of how many items per page they
      want displayed */}

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
                if (sortField === "user.name") setSortAsc(!sortAsc);
                else {
                  setSortField("user.name");
                  setSortAsc(true);
                }
              }}
              className="p-2 cursor-pointer select-none"
            >
              Name {sortField === "user.name" && (sortAsc ? "▲" : "▼")}
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
                if (sortField === "user.address") setSortAsc(!sortAsc);
                else {
                  setSortField("user.address");
                  setSortAsc(true);
                }
              }}
              className="p-2 cursor-pointer select-none text-center"
            >
              Address {sortField === "user.address" && (sortAsc ? "▲" : "▼")}
            </th>
            <th
              onClick={() => {
                if (sortField === "user.city") setSortAsc(!sortAsc);
                else {
                  setSortField("user.city");
                  setSortAsc(true);
                }
              }}
              className="p-2 cursor-pointer select-none"
            >
              City {sortField === "user.city" && (sortAsc ? "▲" : "▼")}
            </th>
            <th
              onClick={() => {
                if (sortField === "user.state") setSortAsc(!sortAsc);
                else {
                  setSortField("user.state");
                  setSortAsc(true);
                }
              }}
              className="p-2 cursor-pointer select-none"
            >
              State {sortField === "user.state" && (sortAsc ? "▲" : "▼")}
            </th>
            <th
              onClick={() => {
                if (sortField === "user.zipCode") setSortAsc(!sortAsc);
                else {
                  setSortField("user.zipCode");
                  setSortAsc(true);
                }
              }}
              className="p-2 cursor-pointer select-none"
            >
              Zip Code {sortField === "user.zipCode" && (sortAsc ? "▲" : "▼")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr
              key={user.id}
              onClick={() => router.push(`${pathname}/user/${user.id}`)}
              className="border-b hover:bg-blue-100 transition-colors"
            >
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(user.id)}
                  onChange={() => toggleSelect(user.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
              <td className="p-2">
                <Link
                  href={`${pathname}/users/${user.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {user.name}
                </Link>
              </td>
              <td className="p-2">{user.address}</td>
              <td className="p-2">{user.city}</td>
              <td className="p-2 text-center">{user.state}</td>
              <td className="p-2">{user.zipCode}</td>
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
    </div>
  );
}
