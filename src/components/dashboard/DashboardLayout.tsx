// import { Shield, Search, BarChart3, Moon, Sun } from "lucide-react";
// import { Link, useLocation } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { TimeframeSelector } from "@/components/shared/TimeframeSelector";
// import { RealtimeIndicator } from "@/components/shared/RealtimeIndicator";
// import { TimeframeType } from "@/types/security";
// import { useTheme } from "next-themes";
// import { cn } from "@/lib/utils";

// interface DashboardLayoutProps {
//   children: React.ReactNode;
//   timeframe: TimeframeType;
//   onTimeframeChange: (timeframe: TimeframeType) => void;
//   isRealtime: boolean;
//   connectionStatus?: "connecting" | "connected" | "disconnected";
//   lastUpdate?: Date | null;
// }

// export function DashboardLayout({ children, timeframe, onTimeframeChange, isRealtime, connectionStatus, lastUpdate }: DashboardLayoutProps) {
//   const location = useLocation();
//   const { theme, setTheme } = useTheme();

//   const navLinks = [
//     { to: "/dashboard", label: "Main Dashboard", icon: Shield },
//     { to: "/technical", label: "Security Operations Overview", icon: BarChart3 },
//     { to: "/search", label: "Query Field", icon: Search },
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
//         <div className="container mx-auto px-4 py-1">
//           <div className="flex items-center justify-between gap-4">
//             {/* Logo and Navigation */}
//             <div className="flex items-center gap-6">
//               <div className="flex items-center gap-2">
//                 <Shield className="h-6 w-6 text-primary" />
//                 <div className="flex flex-col">
//                   <h1 className="text-xl font-bold text-foreground leading-tight">Neotech SOC</h1>
//                   <p className="text-xs text-muted-foreground">Copyright @2025</p>
//                 </div>
//               </div>

//               <nav className="hidden md:flex gap-2">
//                 {navLinks.map((link) => (
//                   <Link key={link.to} to={link.to}>
//                     <Button variant={location.pathname === link.to ? "default" : "ghost"} size="sm" className="gap-2">
//                       <link.icon className="h-4 w-4" />
//                       {link.label}
//                     </Button>
//                   </Link>
//                 ))}
//               </nav>
//             </div>

//             {/* Controls */}
//             <div className="flex items-center gap-4">
//               <RealtimeIndicator isActive={isRealtime} connectionStatus={connectionStatus} lastUpdate={lastUpdate} className="hidden sm:flex" />

//               <TimeframeSelector value={timeframe} onChange={onTimeframeChange} className="hidden lg:flex" />

//               <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
//                 {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
//               </Button>
//             </div>
//           </div>

//           {/* Mobile Timeframe Selector */}
//           <div className="lg:hidden mt-3">
//             <TimeframeSelector value={timeframe} onChange={onTimeframeChange} />
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-2">{children}</main>
//     </div>
//   );
// }
import { Shield, Search, BarChart3, Moon, Sun, LogOut, Loader2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
// Impor komponen shared
import { TimeframeSelector } from "@/components/shared/TimeframeSelector";
import { RealtimeIndicator } from "@/components/shared/RealtimeIndicator";
import { TimeframeType } from "@/types/security";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react"; // <<< PENTING: Import useEffect
import { useToast } from '@/hooks/use-toast';

// const API_URL = 'http://127.0.0.1:8080/api';
 const API_URL = 'http://192.168.33.91:8080/api';

// --- MOCK COMPONENTS (dianggap diimpor dari file terpisah) ---
// --- END MOCK COMPONENTS ---


interface DashboardLayoutProps {
  children: React.ReactNode;
  timeframe: TimeframeType;
  onTimeframeChange: (timeframe: TimeframeType) => void;
  isRealtime: boolean;
  connectionStatus?: "connecting" | "connected" | "disconnected";
  lastUpdate?: Date | null;
}

export function DashboardLayout({ children, timeframe, onTimeframeChange, isRealtime, connectionStatus, lastUpdate }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // === IMPLEMENTASI AUTH GUARD ===
  useEffect(() => {
    // 1. Periksa apakah token akses ada di localStorage
    const accessToken = localStorage.getItem('access_token');
    
    // 2. Jika token tidak ada, segera redirect ke halaman login
    if (!accessToken) {
      // Menggunakan replace: true memastikan halaman dashboard dihapus dari riwayat browser
      navigate('/', { replace: true });
    }
    // Auth Guard dijalankan setiap kali navigate atau path berubah
  }, [navigate, location.pathname]); 
  // === END AUTH GUARD IMPLEMENTATION ===


  const navLinks = [
    { to: "/dashboard", label: "Main Dashboard", icon: Shield },
    { to: "/technical", label: "Security Operations Overview", icon: BarChart3 },
    { to: "/search", label: "Query Field", icon: Search },
  ];

  // 🔑 FUNGSI LOGOUT
  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      localStorage.clear();
      navigate('/', { replace: true }); 
      return;
    }

    setIsLoggingOut(true);

    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });
      
      if (response.ok) {
        toast({
          title: "Logout Berhasil",
          description: "Sesi Anda telah diakhiri dengan aman.",
        });
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Logout Gagal",
          description: errorData.detail || "Gagal logout dari server, sesi lokal akan dihapus.",
        });
      }

    } catch (error) {
      console.error("Logout network error:", error);
      toast({
        variant: "destructive",
        title: "Kesalahan Jaringan",
        description: "Terjadi kesalahan jaringan saat mencoba logout.",
      });
    } finally {
      // Selalu hapus token lokal
      localStorage.clear();
      // Redirect ke halaman utama.
      navigate('/', { replace: true });
      setIsLoggingOut(false);
    }
  };
  
  // Tombol Theme Toggle
  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-1">
          <div className="flex items-center justify-between gap-4">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-foreground leading-tight">Neotech SOC</h1>
                  <p className="text-xs text-muted-foreground">Copyright @2025</p>
                </div>
              </div>

              <nav className="hidden md:flex gap-2">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to}>
                    <Button variant={location.pathname === link.to ? "default" : "ghost"} size="sm" className="gap-2">
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <RealtimeIndicator isActive={isRealtime} connectionStatus={connectionStatus} lastUpdate={lastUpdate} className="hidden sm:flex" />

              <TimeframeSelector value={timeframe} onChange={onTimeframeChange} className="hidden lg:flex" />
              
              {/* Tombol Theme Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleThemeToggle}
                aria-label="Toggle theme"
              >
                 {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {/* Tombol Logout */}
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={handleLogout}
                disabled={isLoggingOut}
                aria-label="Logout"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Timeframe Selector */}
          <div className="lg:hidden mt-3">
            <TimeframeSelector value={timeframe} onChange={onTimeframeChange} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-2">{children}</main>
    </div>
  );
}