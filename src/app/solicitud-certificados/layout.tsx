export default function RequestNewStudentLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div className="flex flex-col flex-grow">
            <header className="bg-primary text-primary-foreground">
                <div className="container mx-auto px-4">
                    <div className="h-14 flex items-center">
                        <h1 className="text-lg font-semibold">
                            SOLICITUD - CERTIFICADOS / CONSTANCIAS
                        </h1>
                    </div>
                </div>
            </header>
            <main className="p-1">
                {children}
            </main>
        </div>
    );
}