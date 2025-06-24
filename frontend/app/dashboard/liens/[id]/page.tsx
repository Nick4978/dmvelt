'use client';
import { useParams } from 'next/navigation';

export default function LienDetailPage() {
  const params = useParams();
  const lienId = params?.id;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Lien Details</h1>
      <p className="text-sm text-gray-700">Showing details for Lien ID: <strong>{lienId}</strong></p>

      {/* Replace this with real data fetch based on lienId */}
      <div className="mt-6 bg-white shadow p-4 rounded">
        <p className="text-gray-600">More detailed info for Lien #{lienId} will go here.</p>
      </div>
    </div>
  );
}
