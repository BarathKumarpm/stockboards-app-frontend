"use client"

import { useEffect, useState } from "react"

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetch("http://127.0.0.1:5000/dashboard") // Flask backend
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then((data) => setData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>
  }

  if (error) {
    return <p className="text-red-500 font-medium">Failed to fetch dashboard data: {error}</p>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Example: render API response */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2">Raw Data</h2>
        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  )
}
