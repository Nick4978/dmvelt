"use client";
import Link from "next/link";
import { Dealers } from "../../shared/types";
import React from "react";
import { useRouter } from "next/navigation";

interface DealerTableBodyProps {
  sortedDealers: Dealers[];
  selectedIds: number[];
  toggleSelect: (id: number) => void;
  pathname: string;
  size?: string;
}

const DealerTableBody: React.FC<DealerTableBodyProps> = React.memo(
  ({ sortedDealers, selectedIds, toggleSelect, pathname, size }) => {
    const router = useRouter();

    return (
      <tbody>
        {sortedDealers.map((dealer) => (
          <tr
            key={dealer.id}
            onClick={() => router.push(`${pathname}/dealer/${dealer.id}`)}
            className="border-b hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <td className="p-2">
              <input
                type="checkbox"
                checked={selectedIds.includes(dealer.id)}
                onChange={() => toggleSelect(dealer.id)}
                onClick={(e) => e.stopPropagation()}
              />
            </td>
            <td className="p-2">
              <Link
                href={`${pathname}/dealers/${dealer.id}`}
                className="text-blue-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {dealer.name}
              </Link>
            </td>
            <td className="p-2">{dealer.address}</td>
            {size !== "small" && <td className="p-2">{dealer.city}</td>}
            <td className="p-2 text-center">{dealer.state}</td>
            {size !== "small" && <td className="p-2">{dealer.zipCode}</td>}
          </tr>
        ))}
      </tbody>
    );
  }
);

DealerTableBody.displayName = "DealerTableBody";

export default DealerTableBody;
