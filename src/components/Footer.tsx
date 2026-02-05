export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-border py-12 text-center text-sm text-muted-foreground bg-background/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
            <div>
                <h3 className="font-bold mb-4 text-foreground">TestiSpace</h3>
                <p>Collecting testimonials made beautiful.</p>
            </div>
            <div>
                <h4 className="font-semibold mb-4 text-foreground">Product</h4>
                <ul className="space-y-2">
                    <li><a href="/features" className="hover:text-primary">Features</a></li>
                    <li><a href="/pricing" className="hover:text-primary">Pricing</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-semibold mb-4 text-foreground">Company</h4>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:text-primary">About</a></li>
                    <li><a href="#" className="hover:text-primary">Blog</a></li>
                </ul>
            </div>
             <div>
                <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:text-primary">Privacy</a></li>
                    <li><a href="#" className="hover:text-primary">Terms</a></li>
                </ul>
            </div>
        </div>
        <p>© 2026 TestiSpace. Built for Hackathon.</p>
    </footer>
  );
}
