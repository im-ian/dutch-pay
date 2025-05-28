import { createFileRoute } from '@tanstack/react-router'
import logo from '../logo.svg'
import { DutchPayTable } from "../components/DutchPayTable";

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dutch Pay Calculator</h1>
      <DutchPayTable />
    </div>
  )
}
