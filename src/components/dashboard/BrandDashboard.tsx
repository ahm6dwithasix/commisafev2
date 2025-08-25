import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PlusCircle,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Wallet,
} from "lucide-react";
import ContractTable from "../contracts/ContractTable";
import ContractForm from "../contracts/ContractForm";

interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  className?: string;
}

const StatsCard = ({
  title,
  value,
  description,
  icon,
  className = "",
}: StatsCardProps) => (
  <Card className={`bg-white ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

interface BrandDashboardProps {
  brandName?: string;
  stripeConnected?: boolean;
}

const BrandDashboard = ({
  brandName = "Your Company",
  stripeConnected = false,
}: BrandDashboardProps) => {
  const [isContractFormOpen, setIsContractFormOpen] = useState(false);

  // Empty data for stats cards
  const statsData = {
    pendingPayouts: "$0.00",
    completedPayouts: "$0.00",
    failedPayouts: "$0.00",
    totalPaid: "$0.00",
  };

  // Empty contracts array
  const contracts: any[] = [];

  const handleCreateContract = (data: any) => {
    // Here you would typically make an API call to create a contract
    console.log("Creating contract with data:", data);
    setIsContractFormOpen(false);
    // You would then refresh the contracts list or add the new contract to the existing list
  };

  return (
    <div className="flex flex-col space-y-6 bg-background p-6">
      {/* Welcome section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {brandName}
          </h1>
          <p className="text-muted-foreground">
            Stripe Status:{" "}
            {stripeConnected ? (
              <span className="text-green-600 font-medium">✅ Connected</span>
            ) : (
              <span className="text-red-600 font-medium">❌ Not Connected</span>
            )}
          </p>
        </div>
        <Button
          onClick={() => setIsContractFormOpen(true)}
          className="mt-4 md:mt-0 bg-primary hover:bg-primary/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Contract
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pending Payouts"
          value={statsData.pendingPayouts}
          icon={<DollarSign className="h-4 w-4 text-amber-500" />}
          className="border-l-4 border-amber-500"
        />
        <StatsCard
          title="Completed Payouts"
          value={statsData.completedPayouts}
          icon={<CheckCircle className="h-4 w-4 text-green-500" />}
          className="border-l-4 border-green-500"
        />
        <StatsCard
          title="Failed Payouts"
          value={statsData.failedPayouts}
          icon={<AlertCircle className="h-4 w-4 text-red-500" />}
          className="border-l-4 border-red-500"
        />
        <StatsCard
          title="Total Paid"
          value={statsData.totalPaid}
          icon={<Wallet className="h-4 w-4 text-blue-500" />}
          className="border-l-4 border-blue-500"
        />
      </div>

      {/* Contracts table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Active Campaigns & Contracts
          </h2>
          <ContractTable contracts={contracts} />
        </div>
      </div>

      {/* Contract form dialog */}
      <Dialog open={isContractFormOpen} onOpenChange={setIsContractFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Contract</DialogTitle>
          </DialogHeader>
          <ContractForm
            onSubmit={handleCreateContract}
            onCancel={() => setIsContractFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrandDashboard;
