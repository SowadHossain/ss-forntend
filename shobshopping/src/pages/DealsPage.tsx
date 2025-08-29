import React, { useEffect, useState } from "react";

const DealsPage: React.FC = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await fetch("/api/deals");
        if (!res.ok) throw new Error("Failed to fetch deals");
        const data = await res.json();
        setDeals(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Deals</h1>
      <p className="mb-4">Check out the latest deals and offers!</p>
      {loading && <div>Loading deals...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deals.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500">No deals available.</div>
          ) : (
            deals.map((deal) => (
              <div key={deal.id} className="bg-white shadow rounded p-4">
                <h2 className="text-xl font-semibold mb-2">{deal.title}</h2>
                <p className="mb-2">{deal.description}</p>
                {deal.image && (
                  <img src={deal.image} alt={deal.title} className="mb-2 w-full h-40 object-cover rounded" />
                )}
                <button className="bg-blue-500 text-white px-4 py-2 rounded">View Deal</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DealsPage;
