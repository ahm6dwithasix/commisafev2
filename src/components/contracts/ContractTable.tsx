import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
} from "lucide-react";
import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Contract {
  id: string;
  campaignName: string;
  influencerName: string;
  influencerEmail: string;
  commission: number;
  startDate: Date;
  endDate: Date;
  status: "pending" | "active" | "completed" | "failed";
  totalSales?: number;
  totalCommission?: number;
  lastPayout?: Date;
  maxBudget?: number;
}

interface ContractTableProps {
  contracts?: Contract[];
  userRole?: "brand" | "influencer";
  onViewContract?: (contract: Contract) => void;
  onEditContract?: (contract: Contract) => void;
  onDeleteContract?: (contractId: string) => void;
}

const ContractTable: React.FC<ContractTableProps> = ({
  contracts = defaultContracts,
  userRole = "brand",
  onViewContract,
  onEditContract,
  onDeleteContract,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof Contract>("startDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null,
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const itemsPerPage = 5;

  // Filter contracts based on search term and status
  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.influencerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contract.influencerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || contract.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort contracts
  const sortedContracts = [...filteredContracts].sort((a, b) => {
    if (
      sortField === "startDate" ||
      sortField === "endDate" ||
      sortField === "lastPayout"
    ) {
      const dateA = a[sortField] ? new Date(a[sortField] as Date).getTime() : 0;
      const dateB = b[sortField] ? new Date(b[sortField] as Date).getTime() : 0;
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (
      sortField === "commission" ||
      sortField === "totalSales" ||
      sortField === "totalCommission" ||
      sortField === "maxBudget"
    ) {
      const numA = a[sortField] || 0;
      const numB = b[sortField] || 0;
      return sortDirection === "asc"
        ? Number(numA) - Number(numB)
        : Number(numB) - Number(numA);
    }

    const valueA = String(a[sortField] || "");
    const valueB = String(b[sortField] || "");
    return sortDirection === "asc"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  // Paginate contracts
  const paginatedContracts = sortedContracts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);

  const handleSort = (field: keyof Contract) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleRowExpand = (contractId: string) => {
    setExpandedRow(expandedRow === contractId ? null : contractId);
  };

  const handleViewDetails = (contract: Contract) => {
    setSelectedContract(contract);
    setIsDetailModalOpen(true);
    if (onViewContract) onViewContract(contract);
  };

  const handleEditContract = (contract: Contract) => {
    if (onEditContract) onEditContract(contract);
  };

  const handleDeleteContract = (contractId: string) => {
    if (onDeleteContract) onDeleteContract(contractId);
  };

  const renderSortIcon = (field: keyof Contract) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">
          {userRole === "brand"
            ? "Your Campaigns & Contracts"
            : "Your Active Contracts"}
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search contracts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("campaignName")}
              >
                <div className="flex items-center gap-1">
                  Campaign {renderSortIcon("campaignName")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("influencerName")}
              >
                <div className="flex items-center gap-1">
                  {userRole === "brand" ? "Influencer" : "Brand"}{" "}
                  {renderSortIcon("influencerName")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("commission")}
              >
                <div className="flex items-center gap-1">
                  Commission % {renderSortIcon("commission")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("startDate")}
              >
                <div className="flex items-center gap-1">
                  Start Date {renderSortIcon("startDate")}
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedContracts.length > 0 ? (
              paginatedContracts.map((contract) => (
                <React.Fragment key={contract.id}>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRowExpand(contract.id)}
                        className="p-0 h-6 w-6"
                      >
                        {expandedRow === contract.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">
                      {contract.campaignName}
                    </TableCell>
                    <TableCell>{contract.influencerName}</TableCell>
                    <TableCell>{contract.commission}%</TableCell>
                    <TableCell>
                      {format(contract.startDate, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getStatusBadgeColor(contract.status)}`}
                      >
                        {contract.status.charAt(0).toUpperCase() +
                          contract.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(contract)}
                          >
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          {userRole === "brand" &&
                            contract.status !== "completed" && (
                              <DropdownMenuItem
                                onClick={() => handleEditContract(contract)}
                              >
                                <Edit className="mr-2 h-4 w-4" /> Edit Contract
                              </DropdownMenuItem>
                            )}
                          {userRole === "brand" &&
                            contract.status === "pending" && (
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  handleDeleteContract(contract.id)
                                }
                              >
                                <Trash className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  {expandedRow === contract.id && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-gray-50 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <h4 className="text-sm font-medium text-gray-500 mb-1">
                                Campaign Details
                              </h4>
                              <p className="text-sm mb-2">
                                <span className="font-medium">Duration:</span>{" "}
                                {format(contract.startDate, "MMM dd, yyyy")} -{" "}
                                {format(contract.endDate, "MMM dd, yyyy")}
                              </p>
                              {contract.maxBudget && (
                                <p className="text-sm">
                                  <span className="font-medium">
                                    Max Budget:
                                  </span>{" "}
                                  ${contract.maxBudget.toLocaleString()}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <h4 className="text-sm font-medium text-gray-500 mb-1">
                                Commission Details
                              </h4>
                              <p className="text-sm mb-2">
                                <span className="font-medium">Rate:</span>{" "}
                                {contract.commission}%
                              </p>
                              {contract.totalSales !== undefined && (
                                <p className="text-sm">
                                  <span className="font-medium">
                                    Total Sales:
                                  </span>{" "}
                                  ${contract.totalSales.toLocaleString()}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <h4 className="text-sm font-medium text-gray-500 mb-1">
                                Payout Information
                              </h4>
                              {contract.totalCommission !== undefined ? (
                                <p className="text-sm mb-2">
                                  <span className="font-medium">
                                    Total Commission:
                                  </span>{" "}
                                  ${contract.totalCommission.toLocaleString()}
                                </p>
                              ) : (
                                <p className="text-sm mb-2">
                                  No payouts processed yet
                                </p>
                              )}
                              {contract.lastPayout && (
                                <p className="text-sm">
                                  <span className="font-medium">
                                    Last Payout:
                                  </span>{" "}
                                  {format(contract.lastPayout, "MMM dd, yyyy")}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  No contracts found matching your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
            <DialogDescription>
              Complete information about this contract and its performance.
            </DialogDescription>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Campaign
                  </h4>
                  <p className="text-sm font-medium">
                    {selectedContract.campaignName}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <Badge
                    className={`${getStatusBadgeColor(selectedContract.status)} mt-1`}
                  >
                    {selectedContract.status.charAt(0).toUpperCase() +
                      selectedContract.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Influencer
                  </h4>
                  <p className="text-sm">{selectedContract.influencerName}</p>
                  <p className="text-xs text-gray-500">
                    {selectedContract.influencerEmail}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Commission Rate
                  </h4>
                  <p className="text-sm">{selectedContract.commission}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Start Date
                  </h4>
                  <p className="text-sm">
                    {format(selectedContract.startDate, "MMMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    End Date
                  </h4>
                  <p className="text-sm">
                    {format(selectedContract.endDate, "MMMM dd, yyyy")}
                  </p>
                </div>
              </div>

              {selectedContract.maxBudget && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Maximum Budget
                  </h4>
                  <p className="text-sm">
                    ${selectedContract.maxBudget.toLocaleString()}
                  </p>
                </div>
              )}

              {selectedContract.totalSales !== undefined && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Total Sales
                    </h4>
                    <p className="text-sm">
                      ${selectedContract.totalSales.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Total Commission
                    </h4>
                    <p className="text-sm">
                      $
                      {selectedContract.totalCommission?.toLocaleString() ||
                        "0"}
                    </p>
                  </div>
                </div>
              )}

              {selectedContract.lastPayout && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Last Payout Date
                  </h4>
                  <p className="text-sm">
                    {format(selectedContract.lastPayout, "MMMM dd, yyyy")}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                {userRole === "brand" &&
                  selectedContract.status !== "completed" && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        handleEditContract(selectedContract);
                      }}
                    >
                      Edit Contract
                    </Button>
                  )}
                <Button onClick={() => setIsDetailModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Sample data for default display
const defaultContracts: Contract[] = [
  {
    id: "1",
    campaignName: "Summer Collection Promotion",
    influencerName: "Alex Johnson",
    influencerEmail: "alex@influencer.com",
    commission: 15,
    startDate: new Date("2023-06-01"),
    endDate: new Date("2023-08-31"),
    status: "active",
    totalSales: 24500,
    totalCommission: 3675,
    lastPayout: new Date("2023-07-15"),
    maxBudget: 10000,
  },
  {
    id: "2",
    campaignName: "Fall Fashion Launch",
    influencerName: "Samantha Lee",
    influencerEmail: "samantha@influencer.com",
    commission: 12,
    startDate: new Date("2023-09-01"),
    endDate: new Date("2023-11-30"),
    status: "pending",
    maxBudget: 8000,
  },
  {
    id: "3",
    campaignName: "Holiday Special",
    influencerName: "Mike Williams",
    influencerEmail: "mike@influencer.com",
    commission: 20,
    startDate: new Date("2023-11-15"),
    endDate: new Date("2023-12-31"),
    status: "pending",
    maxBudget: 15000,
  },
  {
    id: "4",
    campaignName: "Spring Collection",
    influencerName: "Emma Davis",
    influencerEmail: "emma@influencer.com",
    commission: 18,
    startDate: new Date("2023-03-01"),
    endDate: new Date("2023-05-31"),
    status: "completed",
    totalSales: 35000,
    totalCommission: 6300,
    lastPayout: new Date("2023-06-05"),
    maxBudget: 12000,
  },
  {
    id: "5",
    campaignName: "Tech Gadget Promotion",
    influencerName: "Ryan Cooper",
    influencerEmail: "ryan@influencer.com",
    commission: 25,
    startDate: new Date("2023-07-15"),
    endDate: new Date("2023-09-15"),
    status: "failed",
    totalSales: 2000,
    totalCommission: 500,
    maxBudget: 20000,
  },
  {
    id: "6",
    campaignName: "Fitness Challenge",
    influencerName: "Jessica Kim",
    influencerEmail: "jessica@influencer.com",
    commission: 15,
    startDate: new Date("2023-01-01"),
    endDate: new Date("2023-03-31"),
    status: "completed",
    totalSales: 42000,
    totalCommission: 6300,
    lastPayout: new Date("2023-04-05"),
    maxBudget: 10000,
  },
];

export default ContractTable;
