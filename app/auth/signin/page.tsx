export default function SignInPage() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form className="bg-stone-100 rounded p-4 flex flex-col gap-4" method="post" onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const email = form.email.value;
        const password = form.password.value;
        // Usa NextAuth signIn
        const res = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        if (res.ok) {
          window.location.href = "/";
        } else {
          alert("Login fallito");
        }
      }}>
        <label className="block">
          Email
          <input type="email" name="email" className="border rounded px-2 py-1 w-full" required />
        </label>
        <label className="block">
          Password
          <input type="password" name="password" className="border rounded px-2 py-1 w-full" required />
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Accedi</button>
      </form>
      <div className="mt-4">
        <form action="/api/auth/signin/google" method="post">
          <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">Accedi con Google</button>
        </form>
      </div>
    </main>
  );
}
