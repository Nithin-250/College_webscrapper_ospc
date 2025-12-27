import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_EMAIL = "admin@gmail.com";
const DEFAULT_PASSWORD = "admin@123";

export default function Auth() {
  const navigate = useNavigate();
  const { isAdmin, signIn, loading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginData, setLoginData] = useState({ email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD });

  useEffect(() => {
    if (!loading && isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await signIn(loginData.email, loginData.password);
    if (error) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Calendar className="h-6 w-6" />
          </div>
          <CardTitle className="font-heading text-2xl">Admin Portal</CardTitle>
          <CardDescription>Use the issued credentials to manage VIT Chennai events.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Authorizing..." : "Sign In"}
            </Button>
          </form>

          <div className="rounded-xl border border-dashed border-muted-foreground/40 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
            <p className="font-semibold uppercase tracking-[0.3em] text-muted-foreground/70 mb-2">Admin Access</p>
            <p>
              Default credentials: <span className="font-medium text-foreground">{DEFAULT_EMAIL}</span> / <span className="font-medium text-foreground">{DEFAULT_PASSWORD}</span>.
              Update <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code> in the backend environment variables to change them.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}