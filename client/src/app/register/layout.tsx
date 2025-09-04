// app/login/layout.tsx
export const metadata = {
    title: "Login",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>; // hiçbir layout render etmiyor
}
