import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Menu,
  Search,
  X,
  ChevronDown,
  LogOut,
  Settings,
  LayoutDashboard,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

import BrandDashboard from "./dashboard/BrandDashboard";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<"brand" | "influencer">("brand"); // Default to brand for now
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Contract",
      message: "TechGadgets has sent you a new contract",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: "2",
      title: "Payout Completed",
      message: "Commission payout of $450.00 has been processed",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "3",
      title: "Stripe Connected",
      message: "Your Stripe account has been successfully connected",
      time: "Yesterday",
      read: true,
    },
  ]);

  useEffect(() => {
    // Check if user is authenticated
    // If not, redirect to login
    // const isAuthenticated = checkAuth();
    // if (!isAuthenticated) navigate('/login');

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Check screen size for responsive design
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    // Fetch user data and determine role
    // This would be replaced with actual API call
    // fetchUserData().then(data => setUserRole(data.role));

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium text-muted-foreground">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background md:relative ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"}`}
        initial={false}
        animate={{ width: sidebarOpen && !isMobile ? 256 : isMobile ? 0 : 64 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            {sidebarOpen ? (
              <h1 className="text-xl font-bold text-primary">Commisafe</h1>
            ) : (
              <span className="text-xl font-bold text-primary">C</span>
            )}
          </div>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        <nav className="flex flex-col space-y-1 px-2 py-4">
          <TooltipProvider>
            <div
              className={`flex items-center ${sidebarOpen ? "justify-start px-2" : "justify-center"} rounded-md py-2 hover:bg-accent`}
            >
              {!sidebarOpen ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <LayoutDashboard className="h-5 w-5 text-primary" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Dashboard</TooltipContent>
                </Tooltip>
              ) : (
                <Button variant="ghost" className="w-full justify-start">
                  <LayoutDashboard className="mr-2 h-5 w-5 text-primary" />
                  Dashboard
                </Button>
              )}
            </div>

            <div
              className={`flex items-center ${sidebarOpen ? "justify-start px-2" : "justify-center"} rounded-md py-2 hover:bg-accent`}
            >
              {!sidebarOpen ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <FileText className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Contracts</TooltipContent>
                </Tooltip>
              ) : (
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="mr-2 h-5 w-5" />
                  Contracts
                </Button>
              )}
            </div>

            <div
              className={`flex items-center ${sidebarOpen ? "justify-start px-2" : "justify-center"} rounded-md py-2 hover:bg-accent`}
            >
              {!sidebarOpen ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
              ) : (
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-5 w-5" />
                  Settings
                </Button>
              )}
            </div>

            <div
              className={`flex items-center ${sidebarOpen ? "justify-start px-2" : "justify-center"} rounded-md py-2 hover:bg-accent mt-auto`}
            >
              {!sidebarOpen ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <LogOut className="h-5 w-5 text-destructive" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Logout</TooltipContent>
                </Tooltip>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </Button>
              )}
            </div>
          </TooltipProvider>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
          <div className="flex items-center">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="mr-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="mr-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-8" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-2">
                  <p className="text-sm font-medium">Notifications</p>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Mark all as read
                  </Button>
                </div>
                <Separator />
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  <div className="max-h-96 overflow-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex cursor-pointer flex-col p-3 hover:bg-accent ${!notification.read ? "bg-accent/50" : ""}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{notification.title}</p>
                          {!notification.read && (
                            <Badge
                              variant="default"
                              className="h-1.5 w-1.5 rounded-full p-0"
                            />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {notification.time}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                      alt="User"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  {!isMobile && (
                    <>
                      <div className="flex flex-col items-start text-sm">
                        <span className="font-medium">
                          {userRole === "brand"
                            ? "TechGadgets Inc."
                            : "Jane Cooper"}
                        </span>
                        <span className="text-xs capitalize text-muted-foreground">
                          {userRole}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold md:text-3xl">
                {userRole === "brand"
                  ? "Brand Dashboard"
                  : "Influencer Dashboard"}
              </h1>
              <p className="text-muted-foreground">
                {userRole === "brand"
                  ? "Manage your influencer contracts and commission payouts"
                  : "Track your brand partnerships and commission earnings"}
              </p>
            </div>

            {/* Render the appropriate dashboard based on user role */}
            {userRole === "brand" ? (
              <BrandDashboard />
            ) : (
              <InfluencerDashboard />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// Placeholder for the Influencer Dashboard
const InfluencerDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Incoming Commissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,240.50</div>
            <p className="text-xs text-muted-foreground">
              From 5 active contracts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$850.00</div>
            <p className="text-xs text-muted-foreground">
              Processing within 24 hours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Payouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,450.75</div>
            <p className="text-xs text-muted-foreground">
              Last payout 2 days ago
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,840.30</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Stripe Connect Status */}
      <Card className="border-dashed border-primary/50">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h3 className="text-lg font-medium">Stripe Connect Status</h3>
            <p className="text-sm text-muted-foreground">
              Connect your Stripe account to receive commission payouts
            </p>
          </div>
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 px-3 py-1"
          >
            ✅ Connected
          </Badge>
        </CardContent>
      </Card>

      {/* Contracts Table Placeholder */}
      <div className="rounded-lg border">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-medium">Your Contracts</h2>
          <div className="flex items-center space-x-2">
            <Input placeholder="Search contracts..." className="w-[250px]" />
            <Button variant="outline" size="sm">
              Filter
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Brand
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Campaign
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Commission
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Earned
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-muted/50">
                <td className="px-4 py-3 text-sm">TechGadgets Inc.</td>
                <td className="px-4 py-3 text-sm">Summer Tech Sale</td>
                <td className="px-4 py-3 text-sm">15%</td>
                <td className="px-4 py-3 text-sm">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Active
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm">$450.75</td>
                <td className="px-4 py-3 text-sm">
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="px-4 py-3 text-sm">FashionForward</td>
                <td className="px-4 py-3 text-sm">Fall Collection</td>
                <td className="px-4 py-3 text-sm">12%</td>
                <td className="px-4 py-3 text-sm">
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                    Pending
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm">$0.00</td>
                <td className="px-4 py-3 text-sm">
                  <Button variant="ghost" size="sm">
                    Accept
                  </Button>
                </td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="px-4 py-3 text-sm">HomeEssentials</td>
                <td className="px-4 py-3 text-sm">Kitchen Gadgets</td>
                <td className="px-4 py-3 text-sm">10%</td>
                <td className="px-4 py-3 text-sm">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    Completed
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm">$320.50</td>
                <td className="px-4 py-3 text-sm">
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-4">
          <p className="text-sm text-muted-foreground">
            Showing 3 of 12 contracts
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
