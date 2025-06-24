"use client";
import LienTable from "../../components/LienTable";
import LienCard from "../../components/LienCard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">
            Welcome! Here’s a summary of your liens.
          </p>
        </header>

        <div className="w-full table-auto border-collapse md:table hidden">
          {/* Full Screen Content area */}
          <section className="bg-white rounded-lg shadow p-4">
            <LienTable readFlag={false} />
          </section>
          <section className="bg-white rounded-lg shadow p-4 mt-6">
            <LienTable readFlag={true} />
          </section>
        </div>

        {/* Mobile Screen Content area */}
        <div className="md:hidden space-y-4">
          <section className="bg-white rounded-lg shadow p-4">
            <LienCard readFlag={false} />
          </section>
          <section className="bg-white rounded-lg shadow p-4 mt-6">
            <LienCard readFlag={true} />
          </section>
        </div>
      </main>
    </div>
  );
}
