import Link from "next/link";

const navItems = [{ label: "Home", href: "/" }];

export default function Footer() {
  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">ProductivityApp</h3>
            <p className="text-muted-foreground">
              Empowering you to make the most of your time.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Connect With Us</h3>
            <div className="flex space-x-4">
              {/* Add social media icons/links here */}
            </div>
          </div>
        </div>
        <div className="border-muted-foreground/10 text-muted-foreground mt-8 border-t pt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} ProductivityApp. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
