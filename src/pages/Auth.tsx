// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// // import { supabase } from '@/integrations/supabase/client';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { useToast } from '@/hooks/use-toast';
// import { z } from 'zod';
// import { Shield } from 'lucide-react';

// const authSchema = z.object({
//   email: z.string().trim().email({ message: "Invalid email address" }).max(255, { message: "Email must be less than 255 characters" }),
//   password: z.string().min(6, { message: "Password must be at least 6 characters" }),
// });

// const Auth = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   // useEffect(() => {
//   //   // Check if user is already logged in
//   //   supabase.auth.getSession().then(({ data: { session } }) => {
//   //     if (session) {
//   //       navigate('/');
//   //     }
//   //   });

//   //   // Listen for auth changes
//   //   const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
//   //     if (session && event === 'SIGNED_IN') {
//   //       navigate('/');
//   //     }
//   //   });

//   //   return () => subscription.unsubscribe();
//   // }, [navigate]);

//   const validateForm = () => {
//     try {
//       authSchema.parse({ email, password });
//       setErrors({});
//       return true;
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         const formattedErrors: { email?: string; password?: string } = {};
//         error.errors.forEach((err) => {
//           if (err.path[0]) {
//             formattedErrors[err.path[0] as 'email' | 'password'] = err.message;
//           }
//         });
//         setErrors(formattedErrors);
//       }
//       return false;
//     }
//   };

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
    
//   //   if (!validateForm()) {
//   //     return;
//   //   }

//   //   setLoading(true);

//   //   try {
//   //     if (isLogin) {
//   //       const { error } = await supabase.auth.signInWithPassword({
//   //         email,
//   //         password,
//   //       });

//   //       if (error) {
//   //         if (error.message.includes('Invalid login credentials')) {
//   //           toast({
//   //             variant: "destructive",
//   //             title: "Login failed",
//   //             description: "Invalid email or password. Please try again.",
//   //           });
//   //         } else {
//   //           toast({
//   //             variant: "destructive",
//   //             title: "Login failed",
//   //             description: error.message,
//   //           });
//   //         }
//   //       } else {
//   //         toast({
//   //           title: "Welcome back!",
//   //           description: "You've successfully logged in.",
//   //         });
//   //       }
//   //     } else {
//   //       const { error } = await supabase.auth.signUp({
//   //         email,
//   //         password,
//   //         options: {
//   //           emailRedirectTo: `${window.location.origin}/`,
//   //         },
//   //       });

//   //       if (error) {
//   //         if (error.message.includes('already registered')) {
//   //           toast({
//   //             variant: "destructive",
//   //             title: "Sign up failed",
//   //             description: "This email is already registered. Please log in instead.",
//   //           });
//   //         } else {
//   //           toast({
//   //             variant: "destructive",
//   //             title: "Sign up failed",
//   //             description: error.message,
//   //           });
//   //         }
//   //       } else {
//   //         toast({
//   //           title: "Account created!",
//   //           description: "Please check your email to confirm your account.",
//   //         });
//   //         setIsLogin(true);
//   //       }
//   //     }
//   //   } catch (error: any) {
//   //     toast({
//   //       variant: "destructive",
//   //       title: "Error",
//   //       description: "An unexpected error occurred. Please try again.",
//   //     });
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-1 flex flex-col items-center">
//           <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
//             <Shield className="w-6 h-6 text-primary" />
//           </div>
//           <CardTitle className="text-2xl font-bold">
//             {isLogin ? 'Welcome back' : 'Create an account'}
//           </CardTitle>
//           <CardDescription>
//             {isLogin
//               ? 'Enter your credentials to access your dashboard'
//               : 'Enter your details to create your account'}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form  className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="name@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 disabled={loading}
//                 className={errors.email ? 'border-destructive' : ''}
//               />
//               {errors.email && (
//                 <p className="text-sm text-destructive">{errors.email}</p>
//               )}
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 disabled={loading}
//                 className={errors.password ? 'border-destructive' : ''}
//               />
//               {errors.password && (
//                 <p className="text-sm text-destructive">{errors.password}</p>
//               )}
//             </div>
//             <Button type="submit" className="w-full" disabled={loading}>
//               {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
//             </Button>
//           </form>
//           {/* <div className="mt-4 text-center text-sm">
//             <button
//               type="button"
//               onClick={() => {
//                 setIsLogin(!isLogin);
//                 setErrors({});
//               }}
//               className="text-primary hover:underline"
//               disabled={loading}
//             >
//               {isLogin
//                 ? "Don't have an account? Sign up"
//                 : 'Already have an account? Sign in'}
//             </button>
//           </div> */}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Auth;

// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { useToast } from '@/hooks/use-toast';
// import { z } from 'zod';
// import { Shield } from 'lucide-react';

// // URL API diambil dari variabel lingkungan (Ganti dengan URL sebenarnya jika perlu)
//  const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.33.91:8080/api';
// // const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080/api';

// const authSchema = z.object({
//   email: z.string().trim().email({ message: "Invalid email address" }).max(255, { message: "Email must be less than 255 characters" }),
//   password: z.string().min(6, { message: "Password must be at least 6 characters" }),
// });

// const Auth = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   // ℹ️ PENTING: Cek dan Redirect jika token sudah ada (diaktifkan kembali)
//   useEffect(() => {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       // Jika token ada, langsung arahkan ke dashboard
//       navigate('/dashboard', { replace: true });
//     }
//   }, [navigate]);

//   const validateForm = () => {
//     try {
//       authSchema.parse({ email, password });
//       setErrors({});
//       return true;
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         const formattedErrors: { email?: string; password?: string } = {};
//         error.errors.forEach((err) => {
//           if (err.path[0]) {
//             formattedErrors[err.path[0] as 'email' | 'password'] = err.message;
//           }
//         });
//         setErrors(formattedErrors);
//       }
//       return false;
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       if (isLogin) {
//         // --- 🔒 LOGIC LOGIN KE FASTAPI ---
//         const response = await fetch(`${API_URL}/auth/login`, {
//           method: 'POST',
//           headers: {
//             // Perhatikan: Fast API menggunakan form data (x-www-form-urlencoded) untuk login standar!
//             // Kita bisa menggunakan FormData atau mengirim JSON jika server dikonfigurasi untuk JSON.
//             // Asumsi: Server Fast API menerima application/json untuk login.
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             email: email,
//             password: password,
//           }),
//         });

//         const data = await response.json();

//         if (response.ok) {
//           // 1. Simpan token ke localStorage
//           localStorage.setItem('access_token', data.access_token);
//           // 2. Tampilkan Toast Sukses
//           toast({
//             title: "Welcome back!",
//             description: "You've successfully logged in.",
//           });
//           // 3. Redirect ke dashboard
//           navigate('/dashboard', { replace: true }); 
//         } else {
//           // 4. Tampilkan Toast Error
//           const errorMessage = data.detail || "Invalid email or password. Please try again.";
//           toast({
//             variant: "destructive",
//             title: "Login failed",
//             description: errorMessage,
//           });
//         }
//       } else {
//         // --- 📝 LOGIC SIGN UP (DAPAT DISESUAIKAN DENGAN ENDPOINT SIGNUP ANDA) ---
//         // Karena Anda hanya menyebutkan endpoint /login, saya akan menggunakan placeholder
//         // Jika Anda memiliki endpoint /auth/register:
//         /*
//         const response = await fetch(`${API_URL}/auth/register`, { ... });
//         // ... (handle response seperti di atas)
//         */
//         toast({
//           title: "Sign Up is disabled",
//           description: "Sign up is not yet configured for the new API. Please use existing credentials.",
//         });
//       }
//     } catch (error: any) {
//       console.error("Auth Error:", error);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "An unexpected network error occurred. Please check the server status.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-1 flex flex-col items-center">
//           <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
//             <Shield className="w-6 h-6 text-primary" />
//           </div>
//           <CardTitle className="text-2xl font-bold">
//             {isLogin ? 'Welcome back' : 'Create an account'}
//           </CardTitle>
//           <CardDescription>
//             {isLogin
//               ? 'Enter your credentials to access your dashboard'
//               : 'Enter your details to create your account'}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {/* MENGHUBUNGKAN FORM KE HANDLER */}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="name@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 disabled={loading}
//                 className={errors.email ? 'border-destructive' : ''}
//               />
//               {errors.email && (
//                 <p className="text-sm text-destructive">{errors.email}</p>
//               )}
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 autoComplete="current-password"
//                 disabled={loading}
//                 className={errors.password ? 'border-destructive' : ''}
//               />
//               {errors.password && (
//                 <p className="text-sm text-destructive">{errors.password}</p>
//               )}
//             </div>
//             <Button type="submit" className="w-full" disabled={loading}>
//               {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
//             </Button>
//           </form>
          
//           {/* MENGAKTIFKAN KEMBALI TOMBOL SWITCH LOGIN/SIGNUP */}
//           {/* <div className="mt-4 text-center text-sm">
//             <button
//               type="button"
//               onClick={() => {
//                 setIsLogin(!isLogin);
//                 setErrors({});
//                 setEmail(''); // Kosongkan form saat switch mode
//                 setPassword('');
//               }}
//               className="text-primary hover:underline"
//               disabled={loading}
//             >
//               {isLogin
//                 ? "Don't have an account? Sign up"
//                 : 'Already have an account? Sign in'}
//             </button>
//           </div> */}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Auth;

import { useState, useEffect, useRef } from 'react'; // Tambah useRef
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Shield } from 'lucide-react';

// URL API diambil dari variabel lingkungan
const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.33.91:8080/api';
// const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080/api';

const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).max(255, { message: "Email must be less than 255 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  // Password tidak lagi menggunakan state untuk menghindari kebocoran di atribut value DOM
  const passwordRef = useRef<HTMLInputElement>(null); 
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  // Update validateForm untuk menerima nilai password secara langsung
  const validateForm = (passwordValue: string) => {
    try {
      authSchema.parse({ email, password: passwordValue });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: { email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as 'email' | 'password'] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ambil nilai password dari ref
    const currentPassword = passwordRef.current?.value || '';

    if (!validateForm(currentPassword)) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: currentPassword, // Gunakan nilai dari ref
          }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          toast({
            title: "Welcome back!",
            description: "You've successfully logged in.",
          });
          navigate('/dashboard', { replace: true }); 
        } else {
          const errorMessage = data.detail || "Invalid email or password. Please try again.";
          toast({
            variant: "destructive",
            title: "Login failed",
            description: errorMessage,
          });
        }
      } else {
        toast({
          title: "Sign Up is disabled",
          description: "Sign up is not yet configured.",
        });
      }
    } catch (error: any) {
      // Keamanan: Jangan console.log(data) jika data berisi password
      console.error("Auth Error occurred"); 
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected network error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? 'Enter your credentials to access your dashboard'
              : 'Enter your details to create your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                ref={passwordRef} // MENGGUNAKAN REF
                type="password"
                placeholder="••••••••"
                // Hapus value={password} dan onChange
                autoComplete="current-password"
                disabled={loading}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;