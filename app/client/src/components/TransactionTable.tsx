import type { Transaction } from '@/types/Transaction';
import React from 'react'

const transactions: Transaction[] = [
  {
    id: "tx001",
    amount: 1200,
    category: "Income",
    date: "2026-02-01",
    from: "Tech Corp Inc.",
    to: "Huy Truong",
    description: "Monthly salary payment"
  },
  {
    id: "tx002",
    amount: -75.5,
    category: "Expenses",
    date: "2026-02-02",
    from: "Huy Truong",
    to: "Walmart",
    description: "Weekly grocery shopping"
  },
  {
    id: "tx003",
    amount: -45,
    category: "Expenses",
    date: "2026-02-03",
    from: "Huy Truong",
    to: "City Bus Service",
    description: "Monthly bus pass"
  },
  {
    id: "tx004",
    amount: -120,
    category: "Expenses",
    date: "2026-02-04",
    from: "Huy Truong",
    to: "Hydro Company",
    description: "Electricity bill"
  },
  {
    id: "tx005",
    amount: -60,
    category: "Expenses",
    date: "2026-02-05",
    from: "Huy Truong",
    to: "Rogers",
    description: "Home internet bill"
  },
  {
    id: "tx006",
    amount: -35.75,
    category: "Expenses",
    date: "2026-02-06",
    from: "Huy Truong",
    to: "Tim Hortons",
    description: "Lunch with friends"
  },
  {
    id: "tx007",
    amount: -15.99,
    category: "Expenses",
    date: "2026-02-07",
    from: "Huy Truong",
    to: "Netflix",
    description: "Monthly subscription"
  },
  {
    id: "tx008",
    amount: -200,
    category: "Expenses",
    date: "2026-02-08",
    from: "Huy Truong",
    to: "Amazon",
    description: "Electronics purchase"
  },
  {
    id: "tx009",
    amount: 150,
    category: "Expenses",
    date: "2026-02-09",
    from: "Client ABC",
    to: "Huy Truong",
    description: "Website development payment"
  },
  {
    id: "tx010",
    amount: -500,
    category: "Expenses",
    date: "2026-02-01",
    from: "Huy Truong",
    to: "Landlord",
    description: "Monthly rent"
  }
];
function TransactionTable() {
  return (
    <div className="grid grid-cols-6 gap-4 my-8">
      <React.Fragment>
        <div className="font-bold">Date</div>
        <div className="font-bold">Description</div>
        <div className="font-bold">Category</div>
        <div className="font-bold">Amount</div>
        <div className="font-bold">From</div>
        <div className="font-bold">To</div>
      </React.Fragment>
      {transactions.map((tx) => (
        <React.Fragment key={tx.id}>
          <div>{new Date(tx.date).toLocaleDateString()}</div>
          <div>{tx.description || "N/A"}</div>
          <div>{tx.category}</div>
          <div className={tx.amount < 0 ? "text-red-500" : "text-green-500"}>
            {tx.amount < 0 ? `-$${Math.abs(tx.amount).toFixed(2)}` : `$${tx.amount.toFixed(2)}`}
          </div>
          <div>{tx.from}</div>
          <div>{tx.to}</div>
        </React.Fragment>
      ))}
    </div>
  )
}

export default TransactionTable