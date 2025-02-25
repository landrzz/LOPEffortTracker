import { useEffect } from "react";
import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/theme-provider";
import logo from "@/assets/images/TheLOPortal.webp";
import { useAuth } from "@/lib/auth-context";

export default function DashboardHeader() {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (!user && window.google) {
      window.google.accounts.id.initialize({
        client_id:
          "290146856004-tb62kev5scqmino8npgha74q08p5mqto.apps.googleusercontent.com",
        callback: window.handleSignInWithGoogle,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("g_id_signin"),
        {
          theme: theme === "dark" ? "filled_black" : "outline",
          size: "large",
          text: "signin_with",
          shape: "pill",
        },
      );
    }
  }, [user, theme]);

  return (
    <div className="flex justify-between items-center p-6 bg-background border-b">
      <div className="flex items-center gap-3">
        <img src={logo} alt="LO Portal Logo" className="h-14 w-auto" />
        <h1 className="text-2xl font-bold text-[hsl(270,50%,60%)] dark:text-[hsl(270,70%,40%)]">
          The LO Portal <br /> Effort Tracker
        </h1>
      </div>
      <div className="flex flex-col items-center gap-3">
        {user ? (
          <Button variant="ghost" className="gap-2" onClick={signOut}>
            <UserCircle className="h-5 w-5" />
            <span>{user.email}</span>
          </Button>
        ) : (
          <div id="g_id_signin" />
        )}
        <ThemeToggle className="self-center" />
      </div>
    </div>
  );
}
