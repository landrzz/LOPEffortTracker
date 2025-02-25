import { useEffect } from "react";
import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/theme-provider";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import logo from "@/assets/images/TheLOPortal.webp";
import { useAuth } from "@/lib/auth-context";

export default function DashboardHeader() {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (window.google && !user) {
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
  }, [theme, user]);

  return (
    <div className="flex justify-between items-center p-6 bg-background border-b">
      <div className="flex items-center gap-3">
        <img src={logo} alt="LO Portal Logo" className="h-14 w-auto" />
        <h1 className="text-2xl font-bold text-[hsl(270,50%,60%)] dark:text-[hsl(270,70%,40%)]">
          The LO Portal <br /> Effort Tracker
        </h1>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          {!user && <div id="g_id_signin" />}
          {user && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full p-0 h-10 w-10 overflow-hidden"
                >
                  <Avatar>
                    <AvatarImage
                      src={
                        user.user_metadata?.avatar_url ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                      }
                      alt={user.email}
                    />
                    <AvatarFallback>
                      {user.email?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sign Out</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to sign out?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      signOut();
                      window.google?.accounts.id.revoke(user.email, () => {});
                    }}
                  >
                    Sign Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <ThemeToggle className="self-center" />
      </div>
    </div>
  );
}
